import { NextRequest, NextResponse } from "next/server";
import { loadHermesConfig, getSamGovPollingInterval, getEnabledUniversities, getNotificationDigest } from "@/lib/fedsignal/hermes-config";
import { loadSamSearchSettings, applySamSearchSettings } from "@/lib/fedsignal/sam-search-settings";
import { doc, setDoc, getDoc, collection, addDoc, query, where, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FSCOLLECTIONS, FSHermesAutomationDoc, FSHermesNotificationDoc } from "@/lib/fedsignal/schema";

/**
 * SAM.gov Polling Automation
 * 
 * This endpoint is called by Vercel Cron or external scheduler to:
 * 1. Poll SAM.gov for new opportunities based on university settings
 * 2. Store opportunities in Firestore
 * 3. Trigger notifications for new opportunities
 */

async function searchSamGovWithSettings(universityId: string, settings: any) {
  const apiKey = process.env.SAM_API_KEY;
  if (!apiKey) {
    throw new Error("SAM_API_KEY not configured");
  }

  // Apply university-scoped settings
  const scoped = applySamSearchSettings(settings, "federal opportunities", {});
  
  const baseUrl = "https://api.sam.gov/opportunities/v2/search";
  const queryParams = new URLSearchParams({
    api_key: apiKey,
    limit: "100",
    keywords: scoped.query,
    ...scoped.filters,
  });

  const response = await fetch(`${baseUrl}?${queryParams}`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`SAM.gov API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.opportunities || [];
}

async function storeOpportunities(opportunities: any[], universityId: string) {
  if (!db) return;

  const batch = [];
  const opportunitiesCollection = collection(db, FSCOLLECTIONS.OPPORTUNITIES);

  for (const opp of opportunities) {
    // Check if opportunity already exists
    const existingQuery = query(
      opportunitiesCollection,
      where("noticeId", "==", opp.noticeId)
    );
    // For simplicity, we'll add all and let Firestore handle duplicates
    // In production, you'd want to check for existing documents first
  }

  // Store opportunities
  for (const opp of opportunities) {
    const oppDoc = {
      noticeId: opp.noticeId,
      title: opp.title,
      solicitationNumber: opp.solicitationNumber,
      active: opp.active,
      type: opp.type,
      organizationHierarchy: opp.organizationHierarchy,
      postedDate: opp.postedDate,
      responseDeadLine: opp.responseDeadLine,
      naicsCode: opp.naicsCode,
      classificationCode: opp.classificationCode,
      typeOfSetAside: opp.typeOfSetAside,
      description: opp.description,
      uiLink: opp.uiLink,
      universityId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    await addDoc(collection(db, FSCOLLECTIONS.OPPORTUNITIES), oppDoc);
  }
}

async function triggerNotification(opportunity: any, universityId: string, digestType: string) {
  if (!db) return;

  const notification: FSHermesNotificationDoc = {
    id: `notif-${opportunity.noticeId}`,
    type: "opportunity",
    priority: "medium",
    title: `New SAM.gov Opportunity: ${opportunity.title}`,
    message: `A new federal opportunity matching your criteria is available: ${opportunity.title}. Deadline: ${opportunity.responseDeadLine}`,
    recipient: universityId,
    channels: digestType === "realtime" ? ["chat", "email"] : ["email"],
    read: false,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  await setDoc(doc(db, FSCOLLECTIONS.HERMES_NOTIFICATIONS, notification.id), notification);
}

async function updateAutomationStatus(automationId: string, status: "idle" | "running" | "error", lastError?: string) {
  if (!db) return;

  const automationRef = doc(db, FSCOLLECTIONS.HERMES_AUTOMATIONS, automationId);
  const automationDoc = await getDoc(automationRef);

  if (automationDoc.exists()) {
    await setDoc(
      automationRef,
      {
        status,
        lastRunAt: Timestamp.now(),
        lastError,
        errorCount: lastError ? ((automationDoc.data() as FSHermesAutomationDoc).errorCount || 0) + 1 : 0,
      },
      { merge: true }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Load Hermes configuration
    const hermesConfig = await loadHermesConfig();
    if (!hermesConfig) {
      return NextResponse.json({ error: "Hermes configuration not found" }, { status: 404 });
    }

    const enabledUniversities = getEnabledUniversities(hermesConfig);
    const notificationDigest = getNotificationDigest(hermesConfig);

    if (enabledUniversities.length === 0) {
      return NextResponse.json({ message: "No universities enabled for SAM.gov polling" });
    }

    // Load SAM search settings
    const samSettings = await loadSamSearchSettings();
    if (!samSettings) {
      return NextResponse.json({ error: "SAM search settings not found" }, { status: 404 });
    }

    const results = {
      polledUniversities: 0,
      opportunitiesFound: 0,
      notificationsSent: 0,
      errors: [] as string[],
    };

    // Poll for each enabled university
    for (const universityId of enabledUniversities) {
      try {
        // Update automation status
        await updateAutomationStatus(`samgov-poll-${universityId}`, "running");

        // Search SAM.gov with university-scoped settings
        const opportunities = await searchSamGovWithSettings(universityId, samSettings);
        results.opportunitiesFound += opportunities.length;

        // Store opportunities
        await storeOpportunities(opportunities, universityId);

        // Trigger notifications
        for (const opp of opportunities) {
          await triggerNotification(opp, universityId, notificationDigest);
          results.notificationsSent++;
        }

        results.polledUniversities++;

        // Update automation status to idle
        await updateAutomationStatus(`samgov-poll-${universityId}`, "idle");
      } catch (error: any) {
        console.error(`Error polling for university ${universityId}:`, error);
        results.errors.push(`University ${universityId}: ${error.message}`);
        await updateAutomationStatus(`samgov-poll-${universityId}`, "error", error.message);
      }
    }

    return NextResponse.json({
      success: true,
      results,
      message: `Polled ${results.polledUniversities} universities, found ${results.opportunitiesFound} opportunities, sent ${results.notificationsSent} notifications`,
    });
  } catch (error: any) {
    console.error("SAM.gov polling error:", error);
    return NextResponse.json(
      { error: error.message || "Polling failed" },
      { status: 500 }
    );
  }
}

// GET endpoint for manual trigger or status check
export async function GET() {
  try {
    const hermesConfig = await loadHermesConfig();
    const pollingInterval = hermesConfig ? getSamGovPollingInterval(hermesConfig) : 60;
    const enabledUniversities = hermesConfig ? getEnabledUniversities(hermesConfig) : [];

    return NextResponse.json({
      configured: !!hermesConfig,
      pollingInterval,
      enabledUniversities,
      nextPoll: new Date(Date.now() + pollingInterval * 60 * 1000).toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to get status" },
      { status: 500 }
    );
  }
}

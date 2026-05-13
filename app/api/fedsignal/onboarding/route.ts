/**
 * FedSignal Onboarding API
 * 
 * Main onboarding flow endpoints for user registration and setup
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { 
  onboardingProgressSchema,
  updateOnboardingStepSchema,
  organizationProfileCreateSchema,
  validateStepData,
} from "@/lib/fedsignal/onboarding-validators";
import {
  ONBOARDING_FLOW,
  SUBSCRIPTION_PLANS,
  DEFAULT_DISCOUNTS,
  getPlanPrice,
  calculateDiscountedPrice,
  getNextStep,
  OnboardingStep,
  OrganizationType,
  SubscriptionTier,
} from "@/lib/fedsignal/onboarding-types";

const FSCOLLECTIONS = {
  ONBOARDING: "fs_onboarding",
  ORGANIZATIONS: "fs_organizations",
  SUBSCRIPTIONS: "fs_subscriptions",
  USERS: "fs_users",
};

// ============================================================================
// GET /api/fedsignal/onboarding - Get onboarding progress
// ============================================================================

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    if (!db) {
      return NextResponse.json(
        { error: "Database not available" },
        { status: 503 }
      );
    }

    // Get onboarding progress
    const onboardingRef = doc(db, FSCOLLECTIONS.ONBOARDING, userId);
    const onboardingSnap = await getDoc(onboardingRef);

    if (!onboardingSnap.exists()) {
      return NextResponse.json(
        { 
          success: true, 
          data: null,
          message: "Onboarding not started" 
        }
      );
    }

    const progress = onboardingSnap.data();

    // Get organization profile if exists
    let organization = null;
    if (progress.organizationId) {
      const orgRef = doc(db, FSCOLLECTIONS.ORGANIZATIONS, progress.organizationId);
      const orgSnap = await getDoc(orgRef);
      if (orgSnap.exists()) {
        organization = orgSnap.data();
      }
    }

    // Get subscription if exists
    let subscription = null;
    if (progress.organizationId) {
      const subQuery = collection(db, FSCOLLECTIONS.SUBSCRIPTIONS);
      // In a real implementation, query by organizationId
      // For now, we'll just return the progress
    }

    return NextResponse.json({
      success: true,
      data: {
        progress,
        organization,
        subscription,
        availablePlans: SUBSCRIPTION_PLANS,
        defaultDiscounts: DEFAULT_DISCOUNTS,
      },
    });
  } catch (error) {
    console.error("Error fetching onboarding progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch onboarding progress" },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST /api/fedsignal/onboarding - Start or update onboarding
// ============================================================================

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, action, data, marketingAttribution } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    if (!db) {
      return NextResponse.json(
        { error: "Database not available" },
        { status: 503 }
      );
    }

    switch (action) {
      case "start":
        return await startOnboarding(userId, marketingAttribution);
      
      case "update_step":
        return await updateOnboardingStep(userId, data);
      
      case "complete":
        return await completeOnboarding(userId);
      
      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error in onboarding:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

async function startOnboarding(userId: string, marketingAttribution?: any) {
  try {
    const onboardingRef = doc(db!, FSCOLLECTIONS.ONBOARDING, userId);
    
    // Check if already exists
    const existing = await getDoc(onboardingRef);
    if (existing.exists()) {
      return NextResponse.json(
        { 
          success: true, 
          data: existing.data(),
          message: "Onboarding already started" 
        }
      );
    }

    const now = Timestamp.now();
    const onboardingData = {
      id: userId,
      userId,
      currentStep: "welcome",
      completedSteps: [],
      status: "in_progress",
      startedAt: now,
      lastActivityAt: now,
      stepData: {},
      marketingAttribution: marketingAttribution || null,
    };

    await setDoc(onboardingRef, onboardingData);

    return NextResponse.json({
      success: true,
      data: onboardingData,
      message: "Onboarding started successfully",
    });
  } catch (error) {
    console.error("Error starting onboarding:", error);
    return NextResponse.json(
      { error: "Failed to start onboarding" },
      { status: 500 }
    );
  }
}

async function updateOnboardingStep(userId: string, data: any) {
  try {
    // Validate input
    const validation = updateOnboardingStepSchema.safeParse(data);
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: "Invalid data", 
          details: validation.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`) 
        },
        { status: 400 }
      );
    }

    const { step, data: stepData, isComplete } = validation.data;

    // Get current onboarding progress
    const onboardingRef = doc(db!, FSCOLLECTIONS.ONBOARDING, userId);
    const onboardingSnap = await getDoc(onboardingRef);

    if (!onboardingSnap.exists()) {
      return NextResponse.json(
        { error: "Onboarding not found" },
        { status: 404 }
      );
    }

    const progress = onboardingSnap.data();
    const orgType = progress.stepData?.organization_type?.type as OrganizationType || "other";

    // Validate step data
    const stepValidation = validateStepData(step, stepData);
    if (!stepValidation.success) {
      return NextResponse.json(
        { error: "Step validation failed", details: stepValidation.errors },
        { status: 400 }
      );
    }

    // Update step data
    const updatedStepData = {
      ...progress.stepData,
      [step]: stepData,
    };

    // Update completed steps if marked complete
    let updatedCompletedSteps = progress.completedSteps || [];
    if (isComplete && !updatedCompletedSteps.includes(step as OnboardingStep)) {
      updatedCompletedSteps = [...updatedCompletedSteps, step as OnboardingStep];
    }

    // Determine next step
    let nextStep = progress.currentStep;
    if (isComplete) {
      const flow = ONBOARDING_FLOW[orgType] || ONBOARDING_FLOW.other;
      const currentIndex = flow.indexOf(step as OnboardingStep);
      if (currentIndex < flow.length - 1) {
        nextStep = flow[currentIndex + 1];
      }
    }

    // Handle special steps
    if (step === "organization_details" && isComplete) {
      // Create organization profile
      await createOrganizationProfile(userId, stepData, orgType);
    }

    if (step === "billing" && isComplete) {
      // Create subscription
      await createSubscription(userId, stepData, orgType);
    }

    // Update onboarding document
    await updateDoc(onboardingRef, {
      currentStep: nextStep,
      completedSteps: updatedCompletedSteps,
      stepData: updatedStepData,
      lastActivityAt: serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      data: {
        currentStep: nextStep,
        completedSteps: updatedCompletedSteps,
        isComplete: nextStep === "complete" || step === "complete",
      },
    });
  } catch (error) {
    console.error("Error updating onboarding step:", error);
    return NextResponse.json(
      { error: "Failed to update step" },
      { status: 500 }
    );
  }
}

async function createOrganizationProfile(
  userId: string, 
  data: any, 
  orgType: OrganizationType
) {
  try {
    const orgId = `org_${userId}`;
    const orgRef = doc(db!, FSCOLLECTIONS.ORGANIZATIONS, orgId);

    const orgData = {
      id: orgId,
      name: data.name,
      type: orgType,
      isHbcu: orgType === "hbcu",
      isMinorityOwned: orgType === "minority_owned_business",
      website: data.website || "",
      phone: data.phone || "",
      address: data.address,
      certifications: [],
      naicsCodes: [],
      pscCodes: [],
      capabilities: [],
      pastPerformance: [],
      timezone: "America/New_York",
      notificationPreferences: {
        email: {
          dailyDigest: true,
          opportunityAlerts: true,
          deadlineReminders: true,
          grantAlerts: true,
          marketingEmails: false,
        },
        sms: {
          urgentDeadlines: false,
          opportunityAlerts: false,
        },
        inApp: {
          opportunityRecommendations: true,
          teamingSuggestions: true,
          systemUpdates: true,
        },
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(orgRef, orgData);

    // Update onboarding with organizationId
    const onboardingRef = doc(db!, FSCOLLECTIONS.ONBOARDING, userId);
    await updateDoc(onboardingRef, {
      organizationId: orgId,
    });

    return orgId;
  } catch (error) {
    console.error("Error creating organization profile:", error);
    throw error;
  }
}

async function createSubscription(
  userId: string, 
  data: any, 
  orgType: OrganizationType
) {
  try {
    const { tier, billingInterval, discountCode } = data;
    
    // Calculate pricing
    let basePrice = getPlanPrice(tier as SubscriptionTier, billingInterval);
    let discountPercent = 0;

    // Apply discount if applicable
    if (discountCode) {
      const discount = DEFAULT_DISCOUNTS.find(d => d.code === discountCode.toUpperCase());
      if (discount && discount.appliesTo.tiers.includes(tier)) {
        discountPercent = discount.percentOff;
      }
    }

    // Apply HBCU/MOB automatic discounts if no code provided
    if (!discountCode) {
      if (orgType === "hbcu") {
        discountPercent = 50;
      } else if (orgType === "minority_owned_business") {
        discountPercent = 25;
      }
    }

    const finalPrice = calculateDiscountedPrice(basePrice, discountPercent);

    const subId = `sub_${userId}`;
    const subRef = doc(db!, FSCOLLECTIONS.SUBSCRIPTIONS, subId);

    const now = Timestamp.now();
    const periodEnd = new Date();
    if (billingInterval === "monthly") {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    } else {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    }

    const subData = {
      id: subId,
      userId,
      organizationId: `org_${userId}`,
      tier,
      status: tier === "starter" ? "active" : "trialing",
      billingInterval,
      currentPeriodStart: now,
      currentPeriodEnd: Timestamp.fromDate(periodEnd),
      trialEnd: tier !== "starter" ? Timestamp.fromDate(periodEnd) : null,
      cancelAtPeriodEnd: false,
      discountCode: discountCode || null,
      discountPercent,
      amountPaid: tier === "starter" ? 0 : finalPrice,
      currency: "USD",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(subRef, subData);

    return subId;
  } catch (error) {
    console.error("Error creating subscription:", error);
    throw error;
  }
}

async function completeOnboarding(userId: string) {
  try {
    const onboardingRef = doc(db!, FSCOLLECTIONS.ONBOARDING, userId);
    
    await updateDoc(onboardingRef, {
      status: "completed",
      currentStep: "complete",
      completedAt: serverTimestamp(),
      lastActivityAt: serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      message: "Onboarding completed successfully",
    });
  } catch (error) {
    console.error("Error completing onboarding:", error);
    return NextResponse.json(
      { error: "Failed to complete onboarding" },
      { status: 500 }
    );
  }
}

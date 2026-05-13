import { NextRequest, NextResponse } from "next/server";
import { searchOpportunities } from "@/lib/sam/samApiClient";
import {
  createDocument,
  updateDocument,
  getDocument,
  buildFilterConstraints,
} from "@/lib/fedsignal/db-helpers";
import { FSCOLLECTIONS } from "@/lib/fedsignal/schema";
import { transformSamOpportunityToFirestore, createSyncSummary, type SyncSummary } from "@/lib/fedsignal/transformers";
import { where, query, getDocs, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * POST /api/fedsignal/sync/opportunities
 * Sync opportunities from SAM.gov to Firestore
 */
export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: "Firebase not initialized" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const {
      universityId,
      state,
      naicsCode,
      setAside,
      limit = 50,
    } = body;

    const summary = createSyncSummary();

    // Search SAM.gov for opportunities
    const samSearchParams: any = {
      limit,
    };

    if (naicsCode) samSearchParams.naics_code = naicsCode;
    if (setAside) samSearchParams.set_aside = setAside;
    if (state) samSearchParams.pop_state = state;
    if (universityId) {
      // If universityId is provided, we could filter by university's state
      // For now, just use the provided state if available
    }

    const samResponse = await searchOpportunities(samSearchParams);

    if (!samResponse.opportunities || samResponse.opportunities.length === 0) {
      return NextResponse.json({
        success: true,
        summary,
        message: "No opportunities found in SAM.gov",
      });
    }

    // Process each opportunity
    for (const samOpp of samResponse.opportunities) {
      try {
        // Check if opportunity already exists by solicitationNumber or noticeId
        const solicitationNumber = samOpp.solicitationNumber || samOpp.noticeId;
        
        const existingQuery = query(
          collection(db, FSCOLLECTIONS.OPPORTUNITIES),
          where("solicitationNumber", "==", solicitationNumber)
        );
        const existingSnapshot = await getDocs(existingQuery);
        const existingDoc = existingSnapshot.docs[0];

        const transformedData = transformSamOpportunityToFirestore(samOpp, universityId);

        if (existingDoc) {
          // Update existing
          await updateDocument(FSCOLLECTIONS.OPPORTUNITIES, existingDoc.id, transformedData);
          summary.updated++;
          summary.details.push({
            id: existingDoc.id,
            action: "updated",
            message: `Updated opportunity: ${samOpp.title}`,
          });
        } else {
          // Create new
          const newOpp = await createDocument(FSCOLLECTIONS.OPPORTUNITIES, {
            ...transformedData,
            universityId: universityId || undefined,
          }) as { id: string };
          summary.created++;
          summary.details.push({
            id: newOpp.id,
            action: "created",
            message: `Created opportunity: ${samOpp.title}`,
          });
        }
      } catch (error) {
        summary.errors++;
        summary.details.push({
          id: samOpp.noticeId || "unknown",
          action: "error",
          message: error instanceof Error ? error.message : "Unknown error",
        });
        console.error("[Sync Opportunity] Error processing:", samOpp.noticeId, error);
      }
    }

    return NextResponse.json({
      success: true,
      summary,
      message: `Sync complete: ${summary.created} created, ${summary.updated} updated, ${summary.errors} errors`,
    });
  } catch (error) {
    console.error("[Sync Opportunities] Error:", error);
    return NextResponse.json(
      { error: "Failed to sync opportunities", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

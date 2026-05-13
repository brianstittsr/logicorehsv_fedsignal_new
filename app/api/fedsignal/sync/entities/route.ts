import { NextRequest, NextResponse } from "next/server";
import {
  createDocument,
  updateDocument,
} from "@/lib/fedsignal/db-helpers";
import { FSCOLLECTIONS } from "@/lib/fedsignal/schema";
import { transformSamEntityToFirestore, createSyncSummary } from "@/lib/fedsignal/transformers";
import { db } from "@/lib/firebase";

/**
 * POST /api/fedsignal/sync/entities
 * Sync SAM.gov entities to Firestore as contacts
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
      entityName,
      ueiSAM,
      cageCode,
      state,
      universityId,
      limit = 50,
    } = body;

    const summary = createSyncSummary();

    // Call SAM.gov Entity API
    const apiKey = process.env.SAM_GOV_API_KEY || "";
    if (!apiKey) {
      return NextResponse.json(
        { error: "SAM.gov API key required" },
        { status: 400 }
      );
    }

    // Build query params for SAM.gov Entity API
    const params = new URLSearchParams();
    if (entityName) params.set("entityName", entityName);
    if (ueiSAM) params.set("ueiSAM", ueiSAM);
    if (cageCode) params.set("cageCode", cageCode);
    if (state) params.set("stateOfIncorporationCode", state);
    params.set("size", String(limit));
    params.set("page", "0");
    params.set("includeSections", "entityRegistration,coreData");

    const url = `https://api.sam.gov/entity-information/v3/entities?${params.toString()}`;

    const response = await fetch(url, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "SAM.gov API error", status: response.status },
        { status: 500 }
      );
    }

    const data = await response.json();
    const entities = data.entityData || [];

    if (entities.length === 0) {
      return NextResponse.json({
        success: true,
        summary,
        message: "No entities found in SAM.gov",
      });
    }

    // Process each entity
    for (const samEntity of entities) {
      try {
        const entityData = samEntity.entityRegistration || samEntity.coreData || samEntity;
        
        const transformedData = transformSamEntityToFirestore({
          legalBusinessName: entityData.legalBusinessName || entityData.businessName || "",
          ueiSAM: entityData.ueiSAM || entityData.uei || "",
          cageCode: entityData.cageCode,
          physicalAddress: entityData.physicalAddress || entityData.address,
          pointOfContact: entityData.pointOfContact || entityData.poc || [],
        }, universityId);

        // Check if contact already exists by UEI
        // For simplicity, we'll just create new contacts or update by email
        // In production, you'd want to check for existing by UEI or email
        
        // Create new contact
        const newContact = await createDocument(FSCOLLECTIONS.CONTACTS, {
          ...transformedData,
        }) as { id: string };

        summary.created++;
        summary.details.push({
          id: newContact.id,
          action: "created",
          message: `Created contact: ${entityData.legalBusinessName}`,
        });
      } catch (error) {
        summary.errors++;
        summary.details.push({
          id: "unknown",
          action: "error",
          message: error instanceof Error ? error.message : "Unknown error",
        });
        console.error("[Sync Entity] Error processing:", error);
      }
    }

    return NextResponse.json({
      success: true,
      summary,
      message: `Sync complete: ${summary.created} created, ${summary.updated} updated, ${summary.errors} errors`,
    });
  } catch (error) {
    console.error("[Sync Entities] Error:", error);
    return NextResponse.json(
      { error: "Failed to sync entities", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

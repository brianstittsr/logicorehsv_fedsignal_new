import { NextRequest, NextResponse } from "next/server";
import {
  getDocument,
  updateDocument,
  deleteDocument,
} from "@/lib/fedsignal/db-helpers";
import { FSCOLLECTIONS } from "@/lib/fedsignal/schema";
import { opportunityUpdateSchema } from "@/lib/fedsignal/validators";

/**
 * GET /api/fedsignal/opportunities/[id]
 * Get a single opportunity by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const opportunity = await getDocument(FSCOLLECTIONS.OPPORTUNITIES, params.id);

    if (!opportunity) {
      return NextResponse.json(
        { error: "Opportunity not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: opportunity,
    });
  } catch (error) {
    console.error("[Opportunity GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch opportunity", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/fedsignal/opportunities/[id]
 * Update an opportunity
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = opportunityUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const opportunity = await updateDocument(FSCOLLECTIONS.OPPORTUNITIES, params.id, validationResult.data);

    return NextResponse.json({
      success: true,
      data: opportunity,
    });
  } catch (error) {
    console.error("[Opportunity PUT] Error:", error);
    return NextResponse.json(
      { error: "Failed to update opportunity", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/fedsignal/opportunities/[id]
 * Delete an opportunity (soft delete)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteDocument(FSCOLLECTIONS.OPPORTUNITIES, params.id, true);

    return NextResponse.json({
      success: true,
      message: "Opportunity deleted successfully",
    });
  } catch (error) {
    console.error("[Opportunity DELETE] Error:", error);
    return NextResponse.json(
      { error: "Failed to delete opportunity", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import {
  getDocument,
  updateDocument,
  deleteDocument,
} from "@/lib/fedsignal/db-helpers";
import { FSCOLLECTIONS } from "@/lib/fedsignal/schema";
import { grantUpdateSchema } from "@/lib/fedsignal/validators";

/**
 * GET /api/fedsignal/grants/[id]
 * Get a single grant by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const grant = await getDocument(FSCOLLECTIONS.GRANTS, params.id);

    if (!grant) {
      return NextResponse.json(
        { error: "Grant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: grant,
    });
  } catch (error) {
    console.error("[Grant GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch grant", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/fedsignal/grants/[id]
 * Update a grant
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = grantUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const grant = await updateDocument(FSCOLLECTIONS.GRANTS, params.id, validationResult.data);

    return NextResponse.json({
      success: true,
      data: grant,
    });
  } catch (error) {
    console.error("[Grant PUT] Error:", error);
    return NextResponse.json(
      { error: "Failed to update grant", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/fedsignal/grants/[id]
 * Delete a grant (soft delete)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteDocument(FSCOLLECTIONS.GRANTS, params.id, true);

    return NextResponse.json({
      success: true,
      message: "Grant deleted successfully",
    });
  } catch (error) {
    console.error("[Grant DELETE] Error:", error);
    return NextResponse.json(
      { error: "Failed to delete grant", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import {
  getDocument,
  updateDocument,
  deleteDocument,
} from "@/lib/fedsignal/db-helpers";
import { FSCOLLECTIONS } from "@/lib/fedsignal/schema";
import { universityUpdateSchema } from "@/lib/fedsignal/validators";

/**
 * GET /api/fedsignal/universities/[id]
 * Get a single university by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const university = await getDocument(FSCOLLECTIONS.UNIVERSITIES, params.id);

    if (!university) {
      return NextResponse.json(
        { error: "University not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: university,
    });
  } catch (error) {
    console.error("[University GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch university", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/fedsignal/universities/[id]
 * Update a university
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = universityUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const university = await updateDocument(FSCOLLECTIONS.UNIVERSITIES, params.id, validationResult.data);

    return NextResponse.json({
      success: true,
      data: university,
    });
  } catch (error) {
    console.error("[University PUT] Error:", error);
    return NextResponse.json(
      { error: "Failed to update university", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/fedsignal/universities/[id]
 * Delete a university (soft delete)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteDocument(FSCOLLECTIONS.UNIVERSITIES, params.id, true);

    return NextResponse.json({
      success: true,
      message: "University deleted successfully",
    });
  } catch (error) {
    console.error("[University DELETE] Error:", error);
    return NextResponse.json(
      { error: "Failed to delete university", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

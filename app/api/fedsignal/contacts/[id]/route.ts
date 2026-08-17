import { NextRequest, NextResponse } from "next/server";
import {
  getDocument,
  updateDocument,
  deleteDocument,
} from "@/lib/fedsignal/db-helpers";
import { FSCOLLECTIONS } from "@/lib/fedsignal/schema";
import { contactUpdateSchema } from "@/lib/fedsignal/validators";

/**
 * GET /api/fedsignal/contacts/[id]
 * Get a single contact by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const contact = await getDocument(FSCOLLECTIONS.CONTACTS, id);

    if (!contact) {
      return NextResponse.json(
        { error: "Contact not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error("[Contact GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/fedsignal/contacts/[id]
 * Update a contact
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate request body
    const validationResult = contactUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const contact = await updateDocument(FSCOLLECTIONS.CONTACTS, id, validationResult.data);

    return NextResponse.json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error("[Contact PUT] Error:", error);
    return NextResponse.json(
      { error: "Failed to update contact", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/fedsignal/contacts/[id]
 * Delete a contact (soft delete)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteDocument(FSCOLLECTIONS.CONTACTS, id, true);

    return NextResponse.json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    console.error("[Contact DELETE] Error:", error);
    return NextResponse.json(
      { error: "Failed to delete contact", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

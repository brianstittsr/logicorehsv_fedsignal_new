import { NextRequest, NextResponse } from "next/server";
import {
  createDocument,
  updateDocument,
  deleteDocument,
  getDocument,
  fetchPaginated,
  buildFilterConstraints,
} from "@/lib/fedsignal/db-helpers";
import { FSCOLLECTIONS } from "@/lib/fedsignal/schema";
import { contactCreateSchema, contactUpdateSchema } from "@/lib/fedsignal/validators";
import { where } from "firebase/firestore";

/**
 * GET /api/fedsignal/contacts
 * List contacts with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Build filter constraints
    const constraints = buildFilterConstraints(FSCOLLECTIONS.CONTACTS, {
      universityId: searchParams.get("universityId") || undefined,
    });

    // Add specific filters
    if (searchParams.get("type")) {
      constraints.push(where("type", "==", searchParams.get("type")));
    }
    if (searchParams.get("isFavorite") === "true") {
      constraints.push(where("isFavorite", "==", true));
    }

    // Handle pagination
    const page = parseInt(searchParams.get("page") || "0");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");

    const result = await fetchPaginated(FSCOLLECTIONS.CONTACTS, { page, pageSize }, constraints);

    return NextResponse.json({
      success: true,
      data: result.data,
      hasMore: result.hasMore,
      nextPageCursor: result.nextPageCursor,
    });
  } catch (error) {
    console.error("[Contacts GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch contacts", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/fedsignal/contacts
 * Create a new contact
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = contactCreateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const contact = await createDocument(FSCOLLECTIONS.CONTACTS, validationResult.data);

    return NextResponse.json({
      success: true,
      data: contact,
    }, { status: 201 });
  } catch (error) {
    console.error("[Contacts POST] Error:", error);
    return NextResponse.json(
      { error: "Failed to create contact", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

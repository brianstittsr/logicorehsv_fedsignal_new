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
import { grantCreateSchema, grantUpdateSchema } from "@/lib/fedsignal/validators";
import { where } from "firebase/firestore";

/**
 * GET /api/fedsignal/grants
 * List grants with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Build filter constraints
    const constraints = buildFilterConstraints(FSCOLLECTIONS.GRANTS, {
      universityId: searchParams.get("universityId") || undefined,
      status: searchParams.get("status") || undefined,
    });

    // Add specific filters
    if (searchParams.get("agency")) {
      constraints.push(where("agency", "==", searchParams.get("agency")));
    }
    if (searchParams.get("consortiumId")) {
      constraints.push(where("consortiumId", "==", searchParams.get("consortiumId")));
    }

    // Handle pagination
    const page = parseInt(searchParams.get("page") || "0");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");

    const result = await fetchPaginated(FSCOLLECTIONS.GRANTS, { page, pageSize }, constraints);

    return NextResponse.json({
      success: true,
      data: result.data,
      hasMore: result.hasMore,
      nextPageCursor: result.nextPageCursor,
    });
  } catch (error) {
    console.error("[Grants GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch grants", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/fedsignal/grants
 * Create a new grant
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = grantCreateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const grant = await createDocument(FSCOLLECTIONS.GRANTS, validationResult.data);

    return NextResponse.json({
      success: true,
      data: grant,
    }, { status: 201 });
  } catch (error) {
    console.error("[Grants POST] Error:", error);
    return NextResponse.json(
      { error: "Failed to create grant", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

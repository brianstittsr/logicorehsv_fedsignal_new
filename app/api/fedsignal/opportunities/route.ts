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
import { opportunityCreateSchema, opportunityUpdateSchema } from "@/lib/fedsignal/validators";
import { where } from "firebase/firestore";

/**
 * GET /api/fedsignal/opportunities
 * List opportunities with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Build filter constraints
    const constraints = buildFilterConstraints(FSCOLLECTIONS.OPPORTUNITIES, {
      universityId: searchParams.get("universityId") || undefined,
      status: searchParams.get("status") || undefined,
    });

    // Add specific filters
    if (searchParams.get("agency")) {
      constraints.push(where("agency", "==", searchParams.get("agency")));
    }
    if (searchParams.get("type")) {
      constraints.push(where("type", "==", searchParams.get("type")));
    }
    if (searchParams.get("isHbcuSetAside") === "true") {
      constraints.push(where("isHbcuSetAside", "==", true));
    }
    if (searchParams.get("hbcuPreferred") === "true") {
      constraints.push(where("hbcuPreferred", "==", true));
    }

    // Handle pagination
    const page = parseInt(searchParams.get("page") || "0");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");

    const result = await fetchPaginated(FSCOLLECTIONS.OPPORTUNITIES, { page, pageSize }, constraints);

    return NextResponse.json({
      success: true,
      data: result.data,
      hasMore: result.hasMore,
      nextPageCursor: result.nextPageCursor,
    });
  } catch (error) {
    console.error("[Opportunities GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch opportunities", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/fedsignal/opportunities
 * Create a new opportunity
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = opportunityCreateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const opportunity = await createDocument(FSCOLLECTIONS.OPPORTUNITIES, validationResult.data);

    return NextResponse.json({
      success: true,
      data: opportunity,
    }, { status: 201 });
  } catch (error) {
    console.error("[Opportunities POST] Error:", error);
    return NextResponse.json(
      { error: "Failed to create opportunity", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

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
import { universityCreateSchema, universityUpdateSchema } from "@/lib/fedsignal/validators";
import { where } from "firebase/firestore";

/**
 * GET /api/fedsignal/universities
 * List universities with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Build filter constraints
    const constraints = buildFilterConstraints(FSCOLLECTIONS.UNIVERSITIES, {
      universityId: searchParams.get("universityId") || undefined,
      status: searchParams.get("status") || undefined,
      state: searchParams.get("state") || undefined,
      type: searchParams.get("type") || undefined,
    });

    // Add specific filters
    if (searchParams.get("isActive") === "true") {
      constraints.push(where("isActive", "==", true));
    }
    if (searchParams.get("isRegistered") === "true") {
      constraints.push(where("isRegistered", "==", true));
    }

    // Handle pagination
    const page = parseInt(searchParams.get("page") || "0");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");

    const result = await fetchPaginated(FSCOLLECTIONS.UNIVERSITIES, { page, pageSize }, constraints);

    return NextResponse.json({
      success: true,
      data: result.data,
      hasMore: result.hasMore,
      nextPageCursor: result.nextPageCursor,
    });
  } catch (error) {
    console.error("[Universities GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch universities", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/fedsignal/universities
 * Create a new university
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = universityCreateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const university = await createDocument(FSCOLLECTIONS.UNIVERSITIES, validationResult.data);

    return NextResponse.json({
      success: true,
      data: university,
    }, { status: 201 });
  } catch (error) {
    console.error("[Universities POST] Error:", error);
    return NextResponse.json(
      { error: "Failed to create university", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

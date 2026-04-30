import { NextRequest, NextResponse } from "next/server";
import { createSamApiClient } from "@/lib/sam-api-client";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const noticeId = params.id;

    if (!noticeId) {
      return NextResponse.json(
        { success: false, error: "Notice ID is required" },
        { status: 400 }
      );
    }

    const client = createSamApiClient();
    
    const [opportunity, resourceLinks] = await Promise.all([
      client.fetchOpportunityDetails(noticeId),
      client.fetchResourceLinks(noticeId),
    ]);

    if (!opportunity) {
      return NextResponse.json(
        { success: false, error: "Opportunity not found" },
        { status: 404 }
      );
    }

    const transformedOpportunity = client.transformSamResponse(opportunity);
    transformedOpportunity.resourceLinks = resourceLinks;

    return NextResponse.json({
      success: true,
      data: transformedOpportunity,
    });
  } catch (error) {
    console.error("SAM.gov opportunity details error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch opportunity details",
      },
      { status: 500 }
    );
  }
}

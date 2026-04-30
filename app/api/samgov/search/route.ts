import { NextRequest, NextResponse } from "next/server";
import { createSamApiClient } from "@/lib/sam-api-client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filters = {}, limit = 10, offset = 0 } = body;

    const client = createSamApiClient();
    
    const searchParams = {
      limit,
      offset,
      postedFrom: filters.postedFrom,
      postedTo: filters.postedTo,
      responseDeadlineFrom: filters.responseDeadlineFrom,
      responseDeadlineTo: filters.responseDeadlineTo,
      naics: filters.naics,
      psc: filters.psc,
      typeOfSetAside: filters.typeOfSetAside,
      noticeType: filters.noticeType,
      state: filters.state,
      active: filters.active,
      keyword: filters.keyword,
    };

    const results = await client.searchOpportunities(searchParams);

    const transformedResults = results.opportunitiesData.map((opp: any) =>
      client.transformSamResponse(opp)
    );

    return NextResponse.json({
      success: true,
      data: transformedResults,
      totalRecords: results.totalRecords,
      limit: results.limit,
      offset: results.offset,
      hasMore: results.offset + results.limit < results.totalRecords,
    });
  } catch (error) {
    console.error("SAM.gov search error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to search opportunities",
      },
      { status: 500 }
    );
  }
}

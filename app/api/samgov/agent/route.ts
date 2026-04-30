import { NextRequest, NextResponse } from "next/server";
import { createSamApiClient } from "@/lib/sam-api-client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, filters = {} } = body;

    if (!query) {
      return NextResponse.json(
        { success: false, error: "Query is required" },
        { status: 400 }
      );
    }

    const client = createSamApiClient();
    
    const searchParams = {
      limit: 25,
      offset: 0,
      keyword: query,
      active: filters.active || "true",
      naics: filters.naics,
      psc: filters.psc,
      typeOfSetAside: filters.typeOfSetAside,
      noticeType: filters.noticeType,
      state: filters.state,
      responseDeadlineFrom: filters.responseDeadlineFrom,
      responseDeadlineTo: filters.responseDeadlineTo,
      postedFrom: filters.postedFrom,
      postedTo: filters.postedTo,
    };

    const results = await client.searchOpportunities(searchParams);

    const transformedResults = results.opportunitiesData.map((opp: any) =>
      client.transformSamResponse(opp)
    );

    let recommendation = "";
    if (transformedResults.length > 0) {
      const activeCount = transformedResults.filter((o: any) => o.active).length;
      const setAsideTypes = [...new Set(transformedResults.map((o: any) => o.typeOfSetAsideDescription).filter(Boolean))];
      
      recommendation = `Found ${results.totalRecords} opportunities matching "${query}". `;
      recommendation += `${activeCount} are currently active. `;
      
      if (setAsideTypes.length > 0) {
        recommendation += `Set-aside types include: ${setAsideTypes.slice(0, 3).join(", ")}. `;
      }
      
      if (transformedResults.length > 0) {
        const upcoming = transformedResults.filter((o: any) => {
          if (!o.responseDeadLine) return false;
          const deadline = new Date(o.responseDeadLine);
          const now = new Date();
          const daysUntil = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          return daysUntil > 0 && daysUntil <= 30;
        });
        
        if (upcoming.length > 0) {
          recommendation += `${upcoming.length} opportunities have response deadlines within the next 30 days.`;
        }
      }
    } else {
      recommendation = `No opportunities found matching "${query}". Try broadening your search criteria or using different keywords.`;
    }

    return NextResponse.json({
      success: true,
      query,
      searchResults: transformedResults,
      totalRecords: results.totalRecords,
      recommendation,
      filters: searchParams,
    });
  } catch (error) {
    console.error("SAM.gov agent search error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to process agent search",
      },
      { status: 500 }
    );
  }
}

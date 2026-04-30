import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const apiKey = searchParams.get("api_key");
    const postedFrom = searchParams.get("postedFrom");
    const postedTo = searchParams.get("postedTo");
    const limit = searchParams.get("limit") || "1";
    const offset = searchParams.get("offset") || "0";

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "API key is required" },
        { status: 400 }
      );
    }

    if (!postedFrom || !postedTo) {
      return NextResponse.json(
        { success: false, error: "Date range is required" },
        { status: 400 }
      );
    }

    const queryParams = new URLSearchParams({
      api_key: apiKey,
      limit,
      offset,
      postedFrom,
      postedTo,
    });

    const url = `https://api.sam.gov/opportunities/v2/search?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `SAM.gov API error: ${response.status} ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      totalRecords: data.totalRecords || 0,
      message: "Connection successful",
    });
  } catch (error) {
    console.error("Test connection error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Connection test failed",
      },
      { status: 500 }
    );
  }
}

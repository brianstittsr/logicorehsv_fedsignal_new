import { NextRequest, NextResponse } from "next/server";

/**
 * SAM.gov Wage Determinations API (Service Contract Act & Davis-Bacon Act)
 * Public endpoint: https://api.sam.gov/wage-determinations/v2/wdol
 * Some data is public, full access requires API key
 */
const SAM_WD_BASE = "https://api.sam.gov/wage-determinations/v2/wdol";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get("api_key") || process.env.SAM_GOV_API_KEY || "";

    const params = new URLSearchParams();
    if (apiKey) params.set("api_key", apiKey);

    const wdType = searchParams.get("wdType") || "SCA"; // SCA or DBA
    const state = searchParams.get("state");
    const county = searchParams.get("county");
    const wdNumber = searchParams.get("wdNumber");
    const setAside = searchParams.get("setAside");
    const limit = searchParams.get("limit") || "10";
    const offset = searchParams.get("offset") || "0";

    params.set("wdType", wdType);
    if (state) params.set("state", state);
    if (county) params.set("county", county);
    if (wdNumber) params.set("wdNumber", wdNumber);
    if (setAside) params.set("setAside", setAside);
    params.set("limit", limit);
    params.set("offset", offset);

    const url = `${SAM_WD_BASE}?${params.toString()}`;
    const response = await fetch(url, {
      headers: { "Accept": "application/json" },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.title || "SAM.gov Wage Determinations API error", details: data, status: response.status },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      endpoint: "Wage Determinations API v2",
      totalRecords: data.totalRecords || data.total,
      wageDeterminations: data.items || data.wdList || [],
      links: data._links,
    });
  } catch (error) {
    console.error("[SAM Wage Determinations] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch wage determinations", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";

/**
 * SAM.gov Assistance Listings API (formerly CFDA)
 * Public endpoint: https://api.sam.gov/opportunities/v2/search (assistance listings)
 * Also: https://api.sam.gov/cfda/v2/programs
 */
const SAM_CFDA_BASE = "https://api.sam.gov/cfda/v2/programs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get("api_key") || process.env.SAM_GOV_API_KEY || "";

    if (!apiKey) {
      return NextResponse.json(
        { error: "SAM.gov API key required. Provide api_key param or set SAM_GOV_API_KEY env var." },
        { status: 400 }
      );
    }

    const params = new URLSearchParams();

    const keyword = searchParams.get("keyword");
    const programNumber = searchParams.get("programNumber");
    const federalAgency = searchParams.get("federalAgency");
    const assistanceType = searchParams.get("assistanceType");
    const applicantEligibility = searchParams.get("applicantEligibility");
    const status = searchParams.get("status") || "published";
    const limit = searchParams.get("limit") || "10";
    const offset = searchParams.get("offset") || "0";

    if (keyword) params.set("keyword", keyword);
    if (programNumber) params.set("programNumber", programNumber);
    if (federalAgency) params.set("federalAgency", federalAgency);
    if (assistanceType) params.set("assistanceType", assistanceType);
    if (applicantEligibility) params.set("applicantEligibility", applicantEligibility);
    if (status) params.set("status", status);
    params.set("limit", limit);
    params.set("offset", offset);

    const url = `${SAM_CFDA_BASE}?${params.toString()}`;
    const response = await fetch(url, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.title || "SAM.gov Assistance Listings API error", details: data, status: response.status },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      endpoint: "Assistance Listings API v2 (CFDA)",
      totalRecords: data.total || data.totalRecords,
      programs: data.results || data.programList || [],
      links: data._links,
    });
  } catch (error) {
    console.error("[SAM Assistance Listings] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch assistance listings", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

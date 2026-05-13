import { NextRequest, NextResponse } from "next/server";

/**
 * SAM.gov Exclusions API
 * Public endpoint: https://api.sam.gov/exclusions/v1/exclusions
 * Requires API key
 */
const SAM_EXCLUSIONS_BASE = "https://api.sam.gov/exclusions/v1/exclusions";

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

    const entityName = searchParams.get("entityName");
    const ueiSAM = searchParams.get("ueiSAM");
    const cageCode = searchParams.get("cageCode");
    const exclusionType = searchParams.get("exclusionType");
    const exclusionProgram = searchParams.get("exclusionProgram");
    const activeExclusions = searchParams.get("activeExclusions") || "Y";
    const stateProvince = searchParams.get("stateProvince");
    const country = searchParams.get("country");
    const limit = searchParams.get("limit") || "10";
    const offset = searchParams.get("offset") || "0";

    if (entityName) params.set("entityName", entityName);
    if (ueiSAM) params.set("ueiSAM", ueiSAM);
    if (cageCode) params.set("cageCode", cageCode);
    if (exclusionType) params.set("exclusionType", exclusionType);
    if (exclusionProgram) params.set("exclusionProgram", exclusionProgram);
    if (activeExclusions) params.set("activeExclusions", activeExclusions);
    if (stateProvince) params.set("stateProvince", stateProvince);
    if (country) params.set("country", country);
    params.set("limit", limit);
    params.set("offset", offset);

    const url = `${SAM_EXCLUSIONS_BASE}?${params.toString()}`;
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
        { error: data.title || "SAM.gov Exclusions API error", details: data, status: response.status },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      endpoint: "Exclusions API v1",
      totalRecords: data.totalRecords,
      exclusionData: data.exclusionData || [],
      links: data._links,
    });
  } catch (error) {
    console.error("[SAM Exclusions] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch exclusions", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

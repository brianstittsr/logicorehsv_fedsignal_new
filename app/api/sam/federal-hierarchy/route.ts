import { NextRequest, NextResponse } from "next/server";

/**
 * SAM.gov Federal Hierarchy API
 * Public endpoint: https://api.sam.gov/federalorganizations/v1/orgs
 * Some data is public (no key), full data requires API key
 */
const SAM_FH_BASE = "https://api.sam.gov/federalorganizations/v1/orgs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get("api_key") || process.env.SAM_GOV_API_KEY || "";

    const params = new URLSearchParams();
    if (apiKey) params.set("api_key", apiKey);

    const orgKey = searchParams.get("orgKey");
    const orgName = searchParams.get("orgName");
    const orgCode = searchParams.get("orgCode");
    const level = searchParams.get("level"); // DEPARTMENT, SUBTIER, OFFICE
    const status = searchParams.get("status") || "ACTIVE";
    const fhOrgId = searchParams.get("fhOrgId");
    const limit = searchParams.get("limit") || "10";
    const offset = searchParams.get("offset") || "0";

    if (orgKey) params.set("orgKey", orgKey);
    if (orgName) params.set("orgName", orgName);
    if (orgCode) params.set("orgCode", orgCode);
    if (level) params.set("level", level);
    if (status) params.set("status", status);
    if (fhOrgId) params.set("fhOrgId", fhOrgId);
    params.set("limit", limit);
    params.set("offset", offset);

    const url = `${SAM_FH_BASE}?${params.toString()}`;
    const response = await fetch(url, {
      headers: { "Accept": "application/json" },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.title || "SAM.gov Federal Hierarchy API error", details: data, status: response.status },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      endpoint: "Federal Hierarchy API v1",
      totalRecords: data.totalRecords,
      orgList: data.orgList || [],
      links: data._links,
    });
  } catch (error) {
    console.error("[SAM Federal Hierarchy] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch federal hierarchy", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

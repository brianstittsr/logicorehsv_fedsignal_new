import { NextRequest, NextResponse } from "next/server";

/**
 * SAM.gov Entity Management API v3
 * Docs: https://open.gsa.gov/api/entity-api/
 * 
 * IMPORTANT per official docs:
 * - API key must be sent as "x-api-key" HEADER (not URL param) for System Accounts
 * - For personal/public API keys, api_key query param also works
 * - includeSections: entityRegistration | coreData | assertions | pointsOfContact | repsAndCerts | integrityInformation | All
 * - integrityInformation is NOT included in 'All' — must be explicit
 * - Date format: MM/DD/YYYY
 * - Max page size: 10
 */
const SAM_ENTITY_BASE_V3 = "https://api.sam.gov/entity-information/v3/entities";
const SAM_ENTITY_BASE_V4 = "https://api.sam.gov/entity-information/v4/entities";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get("api_key") || process.env.SAM_GOV_API_KEY || "";
    const apiVersion = searchParams.get("apiVersion") || "v3";

    if (!apiKey) {
      return NextResponse.json(
        { error: "SAM.gov API key required. Get a free key at https://sam.gov/profile/details" },
        { status: 400 }
      );
    }

    const BASE = apiVersion === "v4" ? SAM_ENTITY_BASE_V4 : SAM_ENTITY_BASE_V3;

    // Build query params per official API docs
    const params = new URLSearchParams();

    // Core search filters
    const entityName = searchParams.get("entityName");
    const ueiSAM = searchParams.get("ueiSAM");
    const cageCode = searchParams.get("cageCode");
    const dodaac = searchParams.get("dodaac");
    const registrationStatus = searchParams.get("registrationStatus") || "Active";
    const samRegistered = searchParams.get("samRegistered") || "Yes";

    // Classification filters
    const naicsCode = searchParams.get("naicsCode");
    const stateOfIncorporationCode = searchParams.get("stateOfIncorporationCode");
    const countryOfIncorporationCode = searchParams.get("countryOfIncorporationCode");
    const purposeOfRegistrationCode = searchParams.get("purposeOfRegistrationCode"); // Z1=Fed Assistance, Z2=All Awards
    const businessTypeCode = searchParams.get("businessTypeCode"); // OY=Black American Owned, 8W=WOSB, etc.
    const entityStructureCode = searchParams.get("entityStructureCode"); // 2L=Corp Not Tax Exempt, 8H=Corp Tax Exempt
    const organizationType = searchParams.get("organizationType"); // 2U=Nonprofit, etc.

    // Section & format
    const includeSections = searchParams.get("includeSections") || "entityRegistration,coreData";
    const size = Math.min(parseInt(searchParams.get("size") || "10"), 10); // max 10
    const page = searchParams.get("page") || "0";

    // Query builder (q param for full-text / advanced)
    const q = searchParams.get("q");

    if (entityName) params.set("entityName", entityName);
    if (ueiSAM) params.set("ueiSAM", ueiSAM);
    if (cageCode) params.set("cageCode", cageCode);
    if (dodaac) params.set("dodaac", dodaac);
    if (registrationStatus) params.set("registrationStatus", registrationStatus);
    if (samRegistered) params.set("samRegistered", samRegistered);
    if (naicsCode) params.set("naicsCode", naicsCode);
    if (stateOfIncorporationCode) params.set("stateOfIncorporationCode", stateOfIncorporationCode);
    if (countryOfIncorporationCode) params.set("countryOfIncorporationCode", countryOfIncorporationCode);
    if (purposeOfRegistrationCode) params.set("purposeOfRegistrationCode", purposeOfRegistrationCode);
    if (businessTypeCode) params.set("businessTypeCode", businessTypeCode);
    if (entityStructureCode) params.set("entityStructureCode", entityStructureCode);
    if (organizationType) params.set("organizationType", organizationType);
    if (q) params.set("q", q);
    params.set("includeSections", includeSections);
    params.set("size", String(size));
    params.set("page", page);

    const url = `${BASE}?${params.toString()}`;

    const response = await fetch(url, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        // Per official docs: API key as x-api-key header
        "x-api-key": apiKey,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data.message || data.title || "SAM.gov Entity API error",
          detail: data.detail,
          httpStatus: response.status,
          docsUrl: "https://open.gsa.gov/api/entity-api/",
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      endpoint: `Entity Management API ${apiVersion.toUpperCase()}`,
      url: BASE,
      totalRecords: data.totalRecords,
      entities: data.entityData || [],
      links: data._links,
    });
  } catch (error) {
    console.error("[SAM Entities] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch entities", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

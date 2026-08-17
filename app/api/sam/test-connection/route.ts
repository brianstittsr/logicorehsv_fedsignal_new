import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/sam/test-connection
 * Test SAM.gov proxy connection with provided credentials
 * Body: { apiKey: string, serverUrl: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey, serverUrl } = body;

    if (!apiKey || !serverUrl) {
      return NextResponse.json(
        { success: false, error: "Missing apiKey or serverUrl" },
        { status: 400 }
      );
    }

    // Test with a minimal search query (limit=1 to minimize load)
    const testParams = {
      q: "test",
      limit: 1,
      is_active: "true",
    };

    // Temporarily override the proxy config for this test
    // We'll call the proxy directly here to test the connection
    const url = `${serverUrl}/opportunities?api_key=${apiKey}&q=test&limit=1&is_active=true&sort=-modifiedDate`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "User-Agent": "SamGovApiServer/1.0.0",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[SAM Test Connection] Proxy API error:", response.status, errorText.substring(0, 200));
      return NextResponse.json(
        { success: false, error: `Proxy API error: ${response.status}` },
        { status: 500 }
      );
    }

    const data = await response.json();

    // Check if we got a valid response structure
    const hasResults = data._embedded?.results?.length > 0 ||
                       data.opportunities?.length > 0 ||
                       data.data?.length > 0 ||
                       data.total > 0;

    return NextResponse.json({
      success: true,
      message: "Connection successful",
      hasResults,
      totalRecords: data.total || data.totalRecords || data.page?.totalElements || 0,
    });
  } catch (error) {
    console.error("[SAM Test Connection] Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

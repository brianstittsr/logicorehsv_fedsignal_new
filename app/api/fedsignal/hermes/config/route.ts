import { NextRequest, NextResponse } from "next/server";
import { loadHermesConfig, saveHermesConfig, initializeHermesConfig } from "@/lib/fedsignal/hermes-config";

export async function GET() {
  try {
    let config = await loadHermesConfig();
    
    // Initialize with defaults if not exists
    if (!config) {
      await initializeHermesConfig();
      config = await loadHermesConfig();
    }

    return NextResponse.json({ config });
  } catch (error: any) {
    console.error("Error loading Hermes config:", error);
    return NextResponse.json(
      { error: error.message || "Failed to load configuration" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const success = await saveHermesConfig(body);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Failed to save configuration" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error saving Hermes config:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save configuration" },
      { status: 500 }
    );
  }
}

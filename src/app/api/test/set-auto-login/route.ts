import { NextRequest, NextResponse } from "next/server";
import { setAutoLoginChecker } from "@/utils/auth.utils";

export async function POST(request: NextRequest) {
  console.log("[TEST API] set-auto-login called");

  // Only allow in test mode
  if (process.env.PLAYWRIGHT_TEST !== "true") {
    console.log("[TEST API] Rejected - not in test mode");
    return NextResponse.json(
      { error: "Test endpoints are only available in test mode" },
      { status: 403 },
    );
  }

  try {
    const body = await request.json();
    const { enabled } = body;

    console.log("[TEST API] Setting auto-login to:", enabled);

    if (typeof enabled !== "boolean") {
      return NextResponse.json(
        { error: "enabled must be a boolean" },
        { status: 400 },
      );
    }

    setAutoLoginChecker(() => enabled);

    console.log("[TEST API] Auto-login set successfully");

    return NextResponse.json({ success: true, enabled });
  } catch (error) {
    console.log("[TEST API] Error:", error);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }
}

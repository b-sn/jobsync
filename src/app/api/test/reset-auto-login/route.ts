import { NextRequest, NextResponse } from "next/server";
import { resetAutoLoginChecker } from "@/utils/auth.utils";

export async function POST(request: NextRequest) {
  console.log("[TEST API] reset-auto-login called");

  // Only allow in test mode
  if (process.env.PLAYWRIGHT_TEST !== "true") {
    console.log("[TEST API] Rejected - not in test mode");
    return NextResponse.json(
      { error: "Test endpoints are only available in test mode" },
      { status: 403 },
    );
  }

  resetAutoLoginChecker();
  console.log("[TEST API] Auto-login reset successfully");

  return NextResponse.json({ success: true });
}

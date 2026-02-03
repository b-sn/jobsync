import { NextRequest, NextResponse } from "next/server";
import { isAutoLoginEnabled } from "@/utils/auth.utils";

export async function GET(request: NextRequest) {
  // Only allow in test mode
  if (process.env.PLAYWRIGHT_TEST !== "true") {
    return NextResponse.json(
      { error: "Test endpoints are only available in test mode" },
      { status: 403 },
    );
  }

  const enabled = isAutoLoginEnabled();

  return NextResponse.json({ autoLoginEnabled: enabled });
}

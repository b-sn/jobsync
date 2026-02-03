import { NextRequest, NextResponse } from "next/server";
import { signIn } from "@/auth";
import prisma from "@/lib/db";
import { isAutoLoginEnabled } from "@/utils/auth.utils";

export async function GET(request: NextRequest) {
  try {
    const autoLogin = isAutoLoginEnabled();
    const userEmail = process.env.USER_EMAIL;
    const userPassword = process.env.USER_PASSWORD;

    if (!autoLogin || !userEmail || !userPassword) {
      return NextResponse.json(
        { error: "Auto-login is not properly configured" },
        { status: 400 },
      );
    }

    // Verify that the user exists in the database
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Auto-login user not found" },
        { status: 404 },
      );
    }

    // Perform the sign in
    await signIn("credentials", {
      email: userEmail,
      password: userPassword,
      redirect: false,
    });

    // Get callback URL or default to dashboard
    const callbackUrl =
      request.nextUrl.searchParams.get("callbackUrl") || "/dashboard";

    // Redirect to the callback URL
    return NextResponse.redirect(new URL(callbackUrl, request.url));
  } catch (error) {
    console.error("Auto-login error:", error);
    return NextResponse.json(
      { error: "Failed to perform auto-login" },
      { status: 500 },
    );
  }
}

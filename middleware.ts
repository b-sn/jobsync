import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import { isAutoLoginEnabled } from "@/utils/auth.utils";

export const runtime = "nodejs";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip auth check for health-check, root path, static assets, and API routes that don't need auth
  if (
    // pathname === "/" ||
    pathname === "/api/health" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/icons")
    // pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  try {
    const session = await auth();

    // Check if AUTO_LOGIN is enabled (but disable it during Playwright tests)
    const autoLogin = isAutoLoginEnabled();

    // If AUTO_LOGIN is enabled and user is not authenticated
    if (autoLogin && !session?.user) {
      // Allow access to auto-login API route
      if (pathname === "/api/auth/auto-login") {
        return NextResponse.next();
      }

      const autoLoginUrl = new URL("/api/auth/auto-login", request.url);
      autoLoginUrl.searchParams.set("callbackUrl", "/dashboard");
      return NextResponse.redirect(autoLoginUrl);
    }

    // If AUTO_LOGIN is disabled and user is not authenticated, redirect to signin
    if (!autoLogin && !session?.user && pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    // If AUTO_LOGIN is enabled and user IS authenticated, redirect from signin/signup to dashboard
    if (
      autoLogin &&
      session?.user &&
      (pathname === "/signin" || pathname === "/signup")
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // On error, allow the request to pass through
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icons|images).*)"],
};

import type { NextAuthConfig } from "next-auth";
import { isAutoLoginEnabled } from "@/utils/auth.utils";

declare module "next-auth" {
  interface Session {
    accessToken?: any;
  }
}

export const authConfig = {
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    redirect({ url, baseUrl }) {
      // If the user just signed out, redirect to signin
      if (url === baseUrl || url === `${baseUrl}/`) {
        return `${baseUrl}/signin`;
      }
      return url;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const autoLogin = isAutoLoginEnabled();

      // If AUTO_LOGIN is enabled and user is not logged in
      if (autoLogin && !isLoggedIn) {
        // Allow access to auto-login API route
        if (nextUrl.pathname === "/api/auth/auto-login") {
          return true;
        }
        // For other routes, let middleware handle the redirect
        return false;
      }

      // Normal authentication flow (when AUTO_LOGIN is disabled)
      if (isOnDashboard) {
        // Allow access to dashboard only if logged in
        return isLoggedIn;
      } else if (isLoggedIn) {
        // Redirect logged-in users from signin/signup to dashboard
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token;
      return session;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;

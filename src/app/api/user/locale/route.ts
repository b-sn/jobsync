import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/db";
import {
  normalizeLocale,
  getSupportedLocales,
  LOCALE_COOKIE_NAME,
} from "@/lib/locale";

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const locale = normalizeLocale(body?.locale);

    // Validate locale
    if (!locale) {
      return NextResponse.json(
        {
          error:
            "Invalid locale. Supported locales are: " +
            getSupportedLocales().join(", "),
        },
        { status: 400 },
      );
    }

    const session = await auth();
    if (session && session.user && session.user.id) {
      const user = await prisma.user.update({
        where: { id: session.user.id },
        data: { locale },
      });
      if (!user) {
        console.error("Failed to update locale");
      }
    }

    // Set cookie
    const res = NextResponse.json({ success: true }, { status: 200 });

    res.cookies.set(LOCALE_COOKIE_NAME, locale ?? ("" as string), {
      path: "/",
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res;
  } catch (error) {
    console.error("Error updating locale:", error);
    return NextResponse.json(
      { error: "Failed to update locale" },
      { status: 500 },
    );
  }
}

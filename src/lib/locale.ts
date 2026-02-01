import { cookies, headers } from "next/headers";
import { getCurrentUser } from "@/utils/user.utils";

const SUPPORTED = ["en", "ru"] as const;
export const LOCALE_COOKIE_NAME = "NEXT_LOCALE";
export const LOCALE_DEFAULT = SUPPORTED[0];
type SupportedLocale = (typeof SUPPORTED)[number];

export function normalizeLocale(
  input: string | null | undefined,
): SupportedLocale | null {
  if (!input) return null;
  const normStr = input.toLowerCase();
  return (SUPPORTED as readonly string[]).includes(normStr)
    ? (normStr as SupportedLocale)
    : null;
}

export function getSupportedLocales(): readonly string[] {
  return SUPPORTED;
}

export function fromAcceptLanguage(
  value: string | null,
): SupportedLocale | null {
  if (!value) return null;
  const first = value.split(",")[0]?.trim();
  const tag = first?.split("-")[0];
  return normalizeLocale(tag);
}

export async function myGetLocale(): Promise<string> {
  // 1. Check cookie first
  const cookieStore = await cookies();
  const localeCookie =
    normalizeLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value) ||
    LOCALE_DEFAULT;
  if (localeCookie) return localeCookie;

  // 2. Check user profile locale
  try {
    const user = await getCurrentUser();
    const userLocale = normalizeLocale(user?.locale);
    if (userLocale) return userLocale;
  } catch (error) {
    // User not authenticated or error fetching user, continue to next step
  }

  // 3. Check Accept-Language header
  const headersList = await headers();
  const preferredLanguage = fromAcceptLanguage(
    headersList.get("accept-language"),
  );
  if (preferredLanguage) return preferredLanguage;

  // 4. Default to English if no locale is found
  return LOCALE_DEFAULT;
}

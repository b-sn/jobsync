import Link from "next/link";
import { redirect } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SigninForm from "@/components/auth/SigninForm";
import { i18nTitle } from "@/lib/metadata";
import { getTranslations } from "next-intl/server";
import { myGetLocale } from "@/lib/locale";
import { auth } from "@/auth";
import { isAutoLoginEnabled } from "@/utils/auth.utils";

export async function generateMetadata() {
  return await i18nTitle(await myGetLocale(), "signin");
}

export default async function Signin() {
  // Check if AUTO_LOGIN is enabled
  const autoLogin = isAutoLoginEnabled();
  const session = await auth();

  // If AUTO_LOGIN is enabled, redirect to dashboard
  if (autoLogin && !session?.user) {
    redirect("/api/auth/auto-login?callbackUrl=/dashboard");
  }

  // If already logged in, redirect to dashboard
  if (session?.user) {
    redirect("/dashboard");
  }

  const locale = await myGetLocale();
  const t = await getTranslations({ locale, namespace: "signin" });
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <SigninForm />
        <div className="mt-4 text-center text-sm">
          {t("dontHaveAccount")}
          <Link href="/signup" className="underline ml-1">
            {t("signUp")}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

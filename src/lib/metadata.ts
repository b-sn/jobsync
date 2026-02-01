import { getTranslations } from "next-intl/server";

export async function i18nTitle(locale: string, namespace: string) {
  const t = await getTranslations({ locale, namespace });
  return { title: t("title") };
}

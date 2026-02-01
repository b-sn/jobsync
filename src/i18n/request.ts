import { getRequestConfig } from "next-intl/server";
import { LOCALE_DEFAULT, normalizeLocale } from "../lib/locale";

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = normalizeLocale(await requestLocale) || LOCALE_DEFAULT;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});

import { defineRouting } from "next-intl/routing";
import {
  getSupportedLocales,
  LOCALE_COOKIE_NAME,
  LOCALE_DEFAULT,
} from "../lib/locale";

export const routing = defineRouting({
  locales: getSupportedLocales(),
  defaultLocale: LOCALE_DEFAULT,
  localeCookie: {
    name: LOCALE_COOKIE_NAME,
  },
});

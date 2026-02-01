"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

type UseLocalizedTitleArgs = {
  pageTitle?: string;
  pageTitleKey?: string;
  pageNs?: string;
};

export function useLocalizedTitle({
  pageTitle,
  pageTitleKey,
  pageNs = "common",
}: UseLocalizedTitleArgs) {
  const tCommon = useTranslations("common");
  const tPage = useTranslations(pageNs);

  useEffect(() => {
    const siteName = tCommon("siteName");

    const resolvedPageTitle =
      pageTitle ?? (pageTitleKey ? tPage(pageTitleKey) : "");

    document.title = resolvedPageTitle
      ? `${resolvedPageTitle} | ${siteName}`
      : siteName;
  }, [pageTitle, pageTitleKey, pageNs, tCommon, tPage]);
}

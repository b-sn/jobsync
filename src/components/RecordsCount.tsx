"use client";

import { useTranslations } from "next-intl";

type RecordsCountProps = {
  count: number;
  total: number;
  label?: string;
};

export function RecordsCount({
  count,
  total,
  label = "records",
}: RecordsCountProps) {
  const tc = useTranslations("common");
  const t = useTranslations(label || "common");
  return (
    <div className="text-xs text-muted-foreground">
      {tc("showing")}{" "}
      <strong>
        1 {tc("to")} {count}
      </strong>{" "}
      {tc("of")}
      <strong> {total}</strong> {t("plural")}
    </div>
  );
}

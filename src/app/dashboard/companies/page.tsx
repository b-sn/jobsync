import CompaniesContainer from "@/components/admin/CompaniesContainer";
import { myGetLocale } from "@/lib/locale";
import { i18nTitle } from "@/lib/metadata";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  return await i18nTitle(await myGetLocale(), "companies");
}

async function CompaniesPage() {
  const t = await getTranslations({
    locale: await myGetLocale(),
    namespace: "companies",
  });

  return (
    <div className="flex flex-col col-span-3">
      <CompaniesContainer />
    </div>
  );
}

export default CompaniesPage;

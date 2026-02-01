import AdminTabsContainer from "@/components/admin/AdminTabsContainer";
import { myGetLocale } from "@/lib/locale";
import { i18nTitle } from "@/lib/metadata";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  return await i18nTitle(await myGetLocale(), "admin");
}

async function AdminPage() {
  const t = await getTranslations({
    locale: await myGetLocale(),
    namespace: "admin",
  });
  return (
    <div className="flex flex-col col-span-3">
      <h3 className="text-2xl font-semibold leading-none tracking-tight mb-4">
        {t("title")}
      </h3>
      <AdminTabsContainer />
    </div>
  );
}

export default AdminPage;

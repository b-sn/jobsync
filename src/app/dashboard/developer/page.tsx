import { i18nTitle } from "@/lib/metadata";
import DeveloperContainer from "@/components/developer/DeveloperContainer";
import { myGetLocale } from "@/lib/locale";

export async function generateMetadata() {
  return await i18nTitle(await myGetLocale(), "developer");
}

export default async function DeveloperPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="mx-auto w-full max-w-6xl">
        <DeveloperContainer />
      </div>
    </main>
  );
}

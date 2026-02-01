import ActivitiesContainer from "@/components/activities/ActivitiesContainer";
import { myGetLocale } from "@/lib/locale";
import { i18nTitle } from "@/lib/metadata";

export async function generateMetadata() {
  return await i18nTitle(await myGetLocale(), "activities");
}

function Activities() {
  return (
    <div className="col-span-3">
      <ActivitiesContainer />
    </div>
  );
}

export default Activities;

import TasksPageClient from "./TasksPageClient";
import { getAllActivityTypes } from "@/actions/activity.actions";
import { getActivityTypesWithTaskCounts } from "@/actions/task.actions";

import { i18nTitle } from "@/lib/metadata";
import { myGetLocale } from "@/lib/locale";

export async function generateMetadata() {
  return await i18nTitle(await myGetLocale(), "tasks");
}

async function Tasks() {
  const [activityTypes, activityTypesWithCounts] = await Promise.all([
    getAllActivityTypes(),
    getActivityTypesWithTaskCounts(),
  ]);

  return (
    <TasksPageClient
      activityTypes={activityTypes || []}
      activityTypesWithCounts={activityTypesWithCounts?.data || []}
      totalTasks={activityTypesWithCounts?.totalTasks || 0}
    />
  );
}

export default Tasks;

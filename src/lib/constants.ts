import {
  LayoutDashboard,
  SquareCheckBig,
  BriefcaseBusiness,
  CalendarClock,
  UserRound,
  Sheet,
  Wrench,
} from "lucide-react";

export const APP_CONSTANTS = {
  RECORDS_PER_PAGE: 25,
  RECORDS_PER_PAGE_OPTIONS: [25, 50, 100],
  ACTIVITY_MAX_DURATION_MINUTES: 8 * 60, // 8 Hours
  ACTIVITY_MAX_DURATION_MS: 8 * 60 * 60 * 1000, // 8 hours in milliseconds
} as const;

export const SIDEBAR_LINKS = [
  {
    icon: LayoutDashboard,
    route: "/dashboard",
    label: "dashboard.title",
  },
  {
    icon: BriefcaseBusiness,
    route: "/dashboard/myjobs",
    label: "jobs.title",
  },
  {
    icon: SquareCheckBig,
    route: "/dashboard/tasks",
    label: "tasks.title",
  },
  {
    icon: CalendarClock,
    route: "/dashboard/activities",
    label: "activities.title",
  },
  {
    icon: UserRound,
    route: "/dashboard/profile",
    label: "profile.title",
  },
  {
    icon: Sheet,
    route: "/dashboard/admin",
    label: "admin.title",
  },
  {
    icon: Wrench,
    route: "/dashboard/developer",
    label: "developer.title",
    devOnly: true,
  },
];

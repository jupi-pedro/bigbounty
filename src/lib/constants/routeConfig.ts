export const routeConfig = [
  {
    path: "/",
    label: "Dashboard",
  },
  {
    path: "/job-links",
    label: "Job Links",
    children: [
      {
        path: "/job-links/create",
        label: "Create Job Link",
      },
      {
        path: "/job-links/edit/:id",
        label: "Edit Job Link",
      },
    ],
  },
  {
    path: "/daily-reports",
    label: "Daily Reports",
    children: [
      {
        path: "/daily-reports/create",
        label: "Create Daily Report",
      },
      {
        path: "/daily-reports/edit/:id",
        label: "Edit Daily Report",
      },
    ],
  },
  {
    path: "/interview-questions",
    label: "Interview Questions",
  },
  {
    path: "/user-sessions",
    label: "User Sessions",
  },
]

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
        path: "/job-links/:id",
        label: "Edit Job Link",
      },
    ],
  },
  {
    path: "/interview-questions",
    label: "Interview Questions",
  },
]

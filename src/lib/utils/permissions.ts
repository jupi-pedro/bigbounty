import { Role } from "@prisma/client"

export enum Permission {
  ViewDashboard,
  ListJobLinks,
  CreateJobLink,
  DeleteJobLink,
  ListInterviewQuestions,
  CreateInterviewQuestion,
  DeleteInterviewQuestion,
  ListDailyReports,
  CreateDailyReport,
  EditDailyReport,
  DeleteDailyReport,
  ManageOtherDailyReports,
}

export const rolePermissions: Record<Role, Permission[]> = {
  [Role.Administrator]: [],
  [Role.Moderator]: [
    Permission.ViewDashboard,
    Permission.ManageOtherDailyReports,
  ],
  [Role.Developer]: [
    Permission.ViewDashboard,
    Permission.ListJobLinks,
    Permission.CreateJobLink,
    Permission.DeleteJobLink,
    Permission.ListInterviewQuestions,
    Permission.CreateInterviewQuestion,
    Permission.DeleteInterviewQuestion,
    Permission.ListDailyReports,
    Permission.CreateDailyReport,
    Permission.EditDailyReport,
    Permission.DeleteDailyReport,
  ],
  [Role.Viewer]: [Permission.ViewDashboard, Permission.ListJobLinks],
}

export function hasPermission(role: Role, permission: Permission): boolean {
  if (role === Role.Administrator) {
    return true
  }

  const permissions = rolePermissions[role] || []
  return permissions.includes(permission)
}

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
  ListUsers,
  CreateUser,
  EditUser,
  DeleteUser,
  ListInterviewProcesses,
  CreateInterviewProcess,
  EditInterviewProcess,
  DeleteInterviewProcess,
  ListInterviewSteps,
  CreateInterviewStep,
  EditInterviewStep,
  DeleteInterviewStep,
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
    Permission.ListInterviewProcesses,
    Permission.CreateInterviewProcess,
    Permission.EditInterviewProcess,
    Permission.DeleteInterviewProcess,
    Permission.ListInterviewSteps,
    Permission.CreateInterviewStep,
    Permission.EditInterviewStep,
    Permission.DeleteInterviewStep,
  ],
  [Role.Viewer]: [Permission.ViewDashboard, Permission.ListJobLinks, Permission.ListInterviewProcesses, Permission.ListInterviewSteps],
}

export function hasPermission(role: Role, permission: Permission): boolean {
  if (role === Role.Administrator) {
    return true
  }

  const permissions = rolePermissions[role] || []
  return permissions.includes(permission)
}

export const SPRINT_STATUSES = ["PLANNED", "ACTIVE", "COMPLETED"] as const;

export type SprintStatus = (typeof SPRINT_STATUSES)[number];

export function getSprintStatusLabel(status: SprintStatus | string) {
  switch (status) {
    case "PLANNED":
      return "Запланирован";
    case "ACTIVE":
      return "Активный";
    case "COMPLETED":
      return "Завершён";
    default:
      return status;
  }
}

export function getSprintStatusClasses(status: SprintStatus | string) {
  switch (status) {
    case "PLANNED":
      return "bg-neutral-100 text-neutral-700";
    case "ACTIVE":
      return "bg-emerald-100 text-emerald-800";
    case "COMPLETED":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-neutral-100 text-neutral-700";
  }
}

export function getProjectRoleLabel(role: string) {
  switch (role) {
    case "OWNER":
      return "Владелец";
    case "MANAGER":
      return "Менеджер";
    case "MEMBER":
      return "Участник";
    case "VIEWER":
      return "Наблюдатель";
    default:
      return role;
  }
}

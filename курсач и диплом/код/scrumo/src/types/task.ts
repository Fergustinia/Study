export const TASK_STATUSES = [
  "TODO",
  "IN_PROGRESS",
  "REVIEW",
  "TESTING",
  "DONE",
] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export type KanbanTask = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: string;
  storyPoints: number;
  projectId: string;
  assignee: {
    id: string;
    name: string;
    email: string;
  } | null;
};

export const KANBAN_COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: "TODO", title: "К выполнению" },
  { id: "IN_PROGRESS", title: "В работе" },
  { id: "REVIEW", title: "На ревью" },
  { id: "TESTING", title: "Тестирование" },
  { id: "DONE", title: "Готово" },
];

export function getTaskStatusLabel(status: TaskStatus | string) {
  switch (status) {
    case "TODO":
      return "К выполнению";
    case "IN_PROGRESS":
      return "В работе";
    case "REVIEW":
      return "На ревью";
    case "TESTING":
      return "Тестирование";
    case "DONE":
      return "Готово";
    default:
      return status;
  }
}

export function getPriorityLabel(priority: string) {
  switch (priority) {
    case "LOW":
      return "Low";
    case "MEDIUM":
      return "Medium";
    case "HIGH":
      return "High";
    case "CRITICAL":
      return "Critical";
    default:
      return priority;
  }
}

export function getPriorityClasses(priority: string) {
  switch (priority) {
    case "LOW":
      return "bg-neutral-100 text-neutral-700";
    case "MEDIUM":
      return "bg-blue-100 text-blue-700";
    case "HIGH":
      return "bg-amber-100 text-amber-700";
    case "CRITICAL":
      return "bg-red-100 text-red-700";
    default:
      return "bg-neutral-100 text-neutral-700";
  }
}

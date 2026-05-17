import {
  LayoutDashboard,
  FolderKanban,
  ClipboardList,
  CalendarRange,
  KanbanSquare,
  BarChart3,
  Users,
  Settings,
} from "lucide-react";

export const navigation = [
  { title: "Дашборд", href: "/dashboard", icon: LayoutDashboard },
  { title: "Проекты", href: "/projects", icon: FolderKanban },
  { title: "Бэклог", href: "/backlog", icon: ClipboardList },
  { title: "Планирование", href: "/planning", icon: CalendarRange },
  { title: "Доска", href: "/board", icon: KanbanSquare },
  { title: "Аналитика", href: "/analytics", icon: BarChart3 },
  { title: "Команда", href: "/team", icon: Users },
  { title: "Настройки", href: "/setting", icon: Settings },
] as const;

export function isNavItemActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

const segmentLabels: Record<string, string> = {
  dashboard: "Дашборд",
  projects: "Проекты",
  backlog: "Бэклог",
  planning: "Планирование",
  board: "Доска",
  analytics: "Аналитика",
  team: "Команда",
  setting: "Настройки",
  tasks: "Задачи",
  new: "Новая задача",
  edit: "Редактирование",
};

export function getPageTitle(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return "Dashboard";
  }

  const last = segments[segments.length - 1];
  const known = segmentLabels[last];

  if (known) {
    return known;
  }

  if (segments[0] === "projects" && segments.length >= 2) {
    return "Project";
  }

  return last;
}

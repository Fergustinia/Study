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
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Projects", href: "/projects", icon: FolderKanban },
    { title: "Backlog", href: "/backlog", icon: ClipboardList },
    { title: "Planning", href: "/planning", icon: CalendarRange },
    { title: "Board", href: "/board", icon: KanbanSquare },
    { title: "Analytics", href: "/analytics", icon: BarChart3 },
    { title: "Team", href: "/team", icon: Users },
    { title: "Settings", href: "/setting", icon: Settings },
  ];
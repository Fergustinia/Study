"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ProjectSwitcher } from "@/components/layout/project-switcher";
import type { Project } from "@/contexts/project-context";
import { isNavItemActive, navigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type Props = {
  projects: Project[];
  onNavigate?: () => void;
};

export function SidebarNav({ projects, onNavigate }: Props) {
  const pathname = usePathname();

  return (
    <>
      <ProjectSwitcher projects={projects} />

      <nav className="space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = isNavItemActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-black text-white"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-black"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

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

function NavItem({
  href,
  title,
  icon: Icon,
  active,
  onNavigate,
}: {
  href: string;
  title: string;
  icon: any;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-neutral-900 text-white"
          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{title}</span>
    </Link>
  );
}

export function SidebarNav({ projects, onNavigate }: Props) {
  const pathname = usePathname();

  return (
    <div className="space-y-4">
      {/* Project context */}
      <ProjectSwitcher projects={projects} />

      {/* Navigation */}
      <nav className="space-y-1">
        {navigation.map((item) => {
          const active = isNavItemActive(pathname, item.href);

          return (
            <NavItem
              key={item.href}
              href={item.href}
              title={item.title}
              icon={item.icon}
              active={active}
              onNavigate={onNavigate}
            />
          );
        })}
      </nav>
    </div>
  );
}
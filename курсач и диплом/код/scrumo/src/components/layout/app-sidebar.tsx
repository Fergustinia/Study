"use client";

import { XIcon } from "lucide-react";

import { SidebarNav } from "@/components/layout/sidebar-nav";
import type { Project } from "@/contexts/project-context";
import { cn } from "@/lib/utils";

type Props = {
  projects: Project[];
  mobileOpen: boolean;
  onMobileClose: () => void;
};

function SidebarPanel({
  projects,
  onNavigate,
  className,
}: {
  projects: Project[];
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "flex w-64 shrink-0 flex-col border-r bg-white",
        className
      )}
    >
      <div className="flex h-16 items-center border-b px-6">
        <span className="text-xl font-bold tracking-tight">Scrumo</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <SidebarNav projects={projects} onNavigate={onNavigate} />
      </div>
    </aside>
  );
}

export function AppSidebar({ projects, mobileOpen, onMobileClose }: Props) {
  return (
    <>
      <SidebarPanel
        projects={projects}
        className="hidden lg:flex"
      />

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Закрыть меню"
            className="absolute inset-0 bg-black/40"
            onClick={onMobileClose}
          />

          <SidebarPanel
            projects={projects}
            onNavigate={onMobileClose}
            className="relative z-10 h-full shadow-xl"
          />

          <button
            type="button"
            aria-label="Закрыть меню"
            className="absolute top-4 right-4 z-20 rounded-lg bg-white p-2 shadow-sm lg:hidden"
            onClick={onMobileClose}
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
      ) : null}
    </>
  );
}

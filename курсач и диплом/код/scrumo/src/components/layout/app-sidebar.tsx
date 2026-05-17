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
        "flex w-64 shrink-0 flex-col border-r border-neutral-200 bg-white",
        className
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center border-b border-neutral-200 px-6">
        <span className="text-lg font-semibold tracking-tight">
          Scrumo
        </span>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto p-4">
        <SidebarNav projects={projects} onNavigate={onNavigate} />
      </div>
    </aside>
  );
}

export function AppSidebar({
  projects,
  mobileOpen,
  onMobileClose,
}: Props) {
  return (
    <>
      {/* Desktop */}
      <SidebarPanel projects={projects} className="hidden lg:flex" />

      {/* Mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={onMobileClose}
          />

          {/* drawer */}
          <div className="absolute inset-y-0 left-0 z-10 flex">
            <SidebarPanel
              projects={projects}
              onNavigate={onMobileClose}
              className="h-full shadow-xl"
            />

            {/* close button */}
            <button
              type="button"
              aria-label="Закрыть меню"
              className="absolute top-4 right-4 rounded-lg bg-white p-2 shadow-sm"
              onClick={onMobileClose}
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
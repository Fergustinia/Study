"use client";

import { useState, type ReactNode } from "react";
import type { User } from "next-auth";

import { AppHeaderBar } from "@/components/layout/app-header-bar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import type { Project } from "@/contexts/project-context";

type Props = {
  projects: Project[];
  user: User;
  signOutButton: ReactNode;
  children: ReactNode;
};

export function AppShell({
  projects,
  user,
  signOutButton,
  children,
}: Props) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-100">
      {/* Sidebar */}
      <AppSidebar
        projects={projects}
        mobileOpen={mobileNavOpen}
        onMobileClose={() => setMobileNavOpen(false)}
      />

      {/* Main layout */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <AppHeaderBar
          user={user}
          onMenuClick={() => setMobileNavOpen(true)}
          signOutButton={signOutButton}
        />

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
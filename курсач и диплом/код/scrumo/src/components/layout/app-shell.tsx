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

export function AppShell({ projects, user, signOutButton, children }: Props) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen bg-neutral-100">
      <AppSidebar
        projects={projects}
        mobileOpen={mobileNavOpen}
        onMobileClose={() => setMobileNavOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <AppHeaderBar
          user={user}
          onMenuClick={() => setMobileNavOpen(true)}
          signOutButton={signOutButton}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

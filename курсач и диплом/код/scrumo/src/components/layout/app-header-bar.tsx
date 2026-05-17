"use client";

import type { ReactNode } from "react";
import type { User } from "next-auth";
import { MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getPageTitle } from "@/lib/navigation";

type Props = {
  user: User;
  onMenuClick: () => void;
  signOutButton: ReactNode;
};

export function AppHeaderBar({ user, onMenuClick, signOutButton }: Props) {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  const displayName = user.name ?? user.email ?? "Пользователь";
  const initial = (user.name?.[0] ?? user.email?.[0] ?? "?").toUpperCase();

  return (
    <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-4 sm:px-6">
      {/* Left */}
      <div className="flex min-w-0 items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="rounded-xl lg:hidden"
          onClick={onMenuClick}
          aria-label="Открыть меню"
        >
          <MenuIcon className="h-4 w-4" />
        </Button>

        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span>Scrumo</span>
            <span className="text-neutral-300">/</span>
            <span className="truncate">{pageTitle}</span>
          </div>

          <h1 className="truncate text-lg font-semibold tracking-tight text-neutral-900">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="max-w-[180px] truncate text-sm font-medium text-neutral-900">
            {displayName}
          </p>

          {user.email && (
            <p className="max-w-[180px] truncate text-xs text-neutral-500">
              {user.email}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-xs font-medium text-white"
            title={displayName}
          >
            {initial}
          </div>

          {signOutButton}
        </div>
      </div>
    </header>
  );
}
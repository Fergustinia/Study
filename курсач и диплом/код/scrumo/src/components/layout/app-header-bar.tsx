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
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-white px-4 sm:px-6">
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

        <div>
          <p className="truncate text-sm text-neutral-500">Scrumo</p>
          <h1 className="truncate text-lg font-semibold tracking-tight">
            {pageTitle}
          </h1>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="max-w-[200px] truncate text-sm font-medium text-neutral-800">
            {displayName}
          </p>
          {user.email ? (
            <p className="max-w-[200px] truncate text-xs text-neutral-500">
              {user.email}
            </p>
          ) : null}
        </div>

        <div
          className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-xs font-medium text-white"
          title={displayName}
        >
          {initial}
        </div>

        {signOutButton}
      </div>
    </header>
  );
}

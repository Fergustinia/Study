"use client";

import { User } from "next-auth";
import { usePathname } from "next/navigation";

export function TopHeader({ user }: { user: User }) {
  const pathname = usePathname();

  return (
    <header className="h-14 border-b bg-white flex items-center justify-between px-6">
      {/* Left */}
      <div className="text-sm text-gray-600 capitalize">
        {pathname.replace("/", "") || "dashboard"}
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <div className="text-sm text-gray-700">{user.email}</div>

        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs">
          {user.email?.[0]?.toUpperCase()}
        </div>
      </div>
    </header>
  );
}
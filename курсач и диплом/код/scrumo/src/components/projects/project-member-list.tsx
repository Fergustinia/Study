"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import {
  removeProjectMember,
  updateProjectMemberRole,
} from "@/app/actions/members";
import { Button } from "@/components/ui/button";
import { getProjectRoleLabel } from "@/types/sprint";

type Member = {
  userId: string;
  name: string;
  email: string;
  role: string;
  isPendingInvite: boolean;
};

type Props = {
  projectId: string;
  members: Member[];
  currentUserId: string;
  currentUserRole: string;
  canManage: boolean;
};

const editableRoles = [
  { value: "MEMBER", label: "Участник" },
  { value: "MANAGER", label: "Менеджер" },
  { value: "VIEWER", label: "Наблюдатель" },
] as const;

export function ProjectMemberList({
  projectId,
  members,
  currentUserId,
  currentUserRole,
  canManage,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function canEditMember(member: Member) {
    if (!canManage || member.role === "OWNER") return false;
    if (currentUserRole === "OWNER") return true;
    if (currentUserRole === "MANAGER") {
      return member.role === "MEMBER" || member.role === "VIEWER";
    }
    return false;
  }

  function canRemoveMember(member: Member) {
    if (!canManage || member.userId === currentUserId) return false;
    if (member.role === "OWNER") return false;
    if (currentUserRole === "OWNER") return true;
    if (currentUserRole === "MANAGER") {
      return member.role === "MEMBER" || member.role === "VIEWER";
    }
    return false;
  }

  function handleRoleChange(member: Member, role: string) {
    startTransition(async () => {
      const response = await updateProjectMemberRole(
        projectId,
        member.userId,
        role as "MEMBER" | "MANAGER" | "VIEWER"
      );

      if (response.success) {
        router.refresh();
      }
    });
  }

  function handleRemove(member: Member) {
    if (!confirm(`Удалить ${member.name} из команды проекта?`)) {
      return;
    }

    startTransition(async () => {
      const response = await removeProjectMember(projectId, member.userId);

      if (response.success) {
        router.refresh();
      }
    });
  }

  if (members.length === 0) {
    return <p className="text-sm text-neutral-500">Нет участников</p>;
  }

  return (
    <ul className="space-y-3">
      {members.map((member) => (
        <li
          key={member.userId}
          className="flex items-center justify-between gap-3 rounded-xl border border-neutral-100 px-3 py-2.5"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{member.name}</p>
            <p className="truncate text-xs text-neutral-500">{member.email}</p>
            {member.isPendingInvite ? (
              <p className="text-xs text-amber-600">Ожидает регистрации</p>
            ) : null}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {canEditMember(member) ? (
              <select
                value={member.role}
                disabled={isPending}
                onChange={(event) =>
                  handleRoleChange(member, event.target.value)
                }
                className="h-8 rounded-lg border border-neutral-200 bg-white px-2 text-xs outline-none"
              >
                {editableRoles
                  .filter((role) =>
                    currentUserRole === "OWNER" ? true : role.value !== "MANAGER"
                  )
                  .map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
              </select>
            ) : (
              <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700">
                {getProjectRoleLabel(member.role)}
              </span>
            )}

            {canRemoveMember(member) ? (
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                className="text-red-600 hover:text-red-700"
                disabled={isPending}
                onClick={() => handleRemove(member)}
                aria-label={`Удалить ${member.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

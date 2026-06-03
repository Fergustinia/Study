"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Mail, Search, UserPlus } from "lucide-react";

import {
  addProjectMember,
  inviteUserByEmail,
  searchUsersForProject,
  type UserSearchResult,
} from "@/app/actions/members";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  projectId: string;
  canManage: boolean;
  isOwner: boolean;
};

function looksLikeEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function AddMemberPanel({ projectId, canManage, isOwner }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSearching, startSearch] = useTransition();
  const [isAdding, startAdd] = useTransition();
  const [isInviting, startInvite] = useTransition();

  useEffect(() => {
    if (!canManage) return;

    const trimmed = query.trim();

    if (trimmed.length < 2) {
      setResults([]);
      setError("");
      return;
    }

    const timeout = setTimeout(() => {
      startSearch(async () => {
        const response = await searchUsersForProject(projectId, trimmed);

        if (!response.success) {
          setError(response.error);
          setResults([]);
          return;
        }

        setError("");
        setResults(response.users);
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [canManage, projectId, query]);

  if (!canManage) {
    return (
      <p className="text-xs text-neutral-500">
        Управлять командой могут владелец или менеджер проекта.
      </p>
    );
  }

  function handleAdd(user: UserSearchResult) {
    startAdd(async () => {
      setError("");
      setMessage("");

      const response = await addProjectMember(projectId, user.id, "MEMBER");

      if (!response.success) {
        setError(response.error);
        return;
      }

      setMessage(response.message ?? `${user.name} добавлен в команду.`);
      setQuery("");
      setResults([]);
      router.refresh();
    });
  }

  function handleInvite() {
    const email = query.trim().toLowerCase();

    if (!looksLikeEmail(email)) {
      setError("Введите корректный email для приглашения.");
      return;
    }

    startInvite(async () => {
      setError("");
      setMessage("");

      const response = await inviteUserByEmail(projectId, email, "MEMBER");

      if (!response.success) {
        setError(response.error);
        return;
      }

      setMessage(response.message ?? "Приглашение отправлено.");
      setQuery("");
      setResults([]);
      router.refresh();
    });
  }

  const trimmedQuery = query.trim();
  const showInviteOption =
    trimmedQuery.length >= 3 &&
    looksLikeEmail(trimmedQuery) &&
    results.length === 0 &&
    !isSearching &&
    !isAdding &&
    !isInviting;

  return (
    <section className="space-y-3 rounded-xl border border-dashed border-neutral-200 bg-neutral-50/60 p-4">
      <div className="space-y-1">
        <h3 className="text-sm font-medium">Добавить участника</h3>
        <p className="text-xs text-neutral-500">
          Поиск по имени или email. Если пользователя нет в системе — можно
          пригласить по email.
        </p>
        {!isOwner ? (
          <p className="text-xs text-neutral-400">
            Менеджер может добавлять участников и наблюдателей.
          </p>
        ) : null}
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Например: ivan@mail.ru"
          className="pl-9"
          disabled={isAdding || isInviting}
        />
      </div>

      {trimmedQuery.length > 0 && trimmedQuery.length < 2 ? (
        <p className="text-xs text-neutral-500">Введите минимум 2 символа.</p>
      ) : null}

      {isSearching ? (
        <p className="text-xs text-neutral-500">Поиск...</p>
      ) : null}

      {error ? <p className="text-xs text-red-600">{error}</p> : null}
      {message ? <p className="text-xs text-emerald-600">{message}</p> : null}

      {results.length > 0 ? (
        <ul className="space-y-2">
          {results.map((user) => (
            <li
              key={user.id}
              className="flex items-center justify-between gap-3 rounded-lg border bg-white px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{user.name}</p>
                <p className="truncate text-xs text-neutral-500">{user.email}</p>
              </div>

              <Button
                type="button"
                size="sm"
                variant="outline"
                className="shrink-0 rounded-lg"
                disabled={isAdding}
                onClick={() => handleAdd(user)}
              >
                <UserPlus className="h-3.5 w-3.5" />
                Добавить
              </Button>
            </li>
          ))}
        </ul>
      ) : null}

      {showInviteOption ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-3">
          <p className="text-sm text-amber-900">
            Пользователь с email <strong>{trimmedQuery}</strong> не найден.
          </p>
          <Button
            type="button"
            size="sm"
            className="mt-2 rounded-lg"
            disabled={isInviting}
            onClick={handleInvite}
          >
            <Mail className="h-3.5 w-3.5" />
            Пригласить по email
          </Button>
        </div>
      ) : null}
    </section>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { assignTaskToSprint } from "@/app/actions/sprints";

type SprintOption = {
  id: string;
  name: string;
};

type Props = {
  taskId: string;
  sprints: SprintOption[];
  currentSprintId: string | null;
};

export function AssignSprintSelect({
  taskId,
  sprints,
  currentSprintId,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={currentSprintId ?? ""}
      disabled={isPending}
      onChange={(event) => {
        const sprintId = event.target.value;
        startTransition(async () => {
          await assignTaskToSprint(taskId, sprintId);
          router.refresh();
        });
      }}
      className="h-9 min-w-[160px] rounded-lg border border-neutral-200 bg-white px-2 text-sm outline-none focus:border-neutral-400 disabled:opacity-60"
    >
      <option value="">Без спринта</option>
      {sprints.map((sprint) => (
        <option key={sprint.id} value={sprint.id}>
          {sprint.name}
        </option>
      ))}
    </select>
  );
}

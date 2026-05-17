"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { updateSprintStatus } from "@/app/actions/sprints";
import { Button } from "@/components/ui/button";
import type { SprintStatus } from "@/types/sprint";

type Props = {
  sprintId: string;
  status: SprintStatus;
};

export function SprintStatusActions({ sprintId, status }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function changeStatus(next: SprintStatus) {
    startTransition(async () => {
      await updateSprintStatus(sprintId, next);
      router.refresh();
    });
  }

  return (
    <section className="flex flex-wrap gap-2">
      {status !== "ACTIVE" ? (
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="rounded-lg"
          disabled={isPending}
          onClick={() => changeStatus("ACTIVE")}
        >
          Запустить
        </Button>
      ) : null}
      {status !== "COMPLETED" ? (
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="rounded-lg"
          disabled={isPending}
          onClick={() => changeStatus("COMPLETED")}
        >
          Завершить
        </Button>
      ) : null}
      {status !== "PLANNED" ? (
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="rounded-lg"
          disabled={isPending}
          onClick={() => changeStatus("PLANNED")}
        >
          В план
        </Button>
      ) : null}
    </section>
  );
}

"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { createSprint, type CreateSprintState } from "@/app/actions/sprints";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const initialState: CreateSprintState = {};

type Props = {
  projectId: string;
};

export function CreateSprintDialog({ projectId }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(
    createSprint,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      setOpen(false);
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl">Новый спринт</Button>
      </DialogTrigger>

      <DialogContent className="rounded-2xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Создать спринт</DialogTitle>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="projectId" value={projectId} />

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="sprint-name">
              Название
            </label>
            <Input
              id="sprint-name"
              name="name"
              placeholder="Спринт 1"
              required
              disabled={isPending}
            />
            {state.errors?.name ? (
              <p className="text-sm text-red-500">{state.errors.name[0]}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="sprint-goal">
              Цель
            </label>
            <Textarea
              id="sprint-goal"
              name="goal"
              rows={3}
              placeholder="Что хотим достичь в спринте"
              disabled={isPending}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="startDate">
                Начало
              </label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="endDate">
                Конец
              </label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                disabled={isPending}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="capacity">
              Ёмкость (story points)
            </label>
            <Input
              id="capacity"
              name="capacity"
              type="number"
              min={1}
              placeholder="40"
              disabled={isPending}
            />
          </div>

          {state.errors?._form ? (
            <p className="text-sm text-red-500">{state.errors._form[0]}</p>
          ) : null}

          <Button
            type="submit"
            className="w-full rounded-xl"
            disabled={isPending}
          >
            {isPending ? "Создание..." : "Создать спринт"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

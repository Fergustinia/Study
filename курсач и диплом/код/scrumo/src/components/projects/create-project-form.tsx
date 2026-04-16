"use client";

import { useActionState, useEffect, useRef } from "react";
import { createProject, type CreateProjectState } from "@/app/actions/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const initialState: CreateProjectState = {
  success: false,
};

export function CreateProjectForm() {
  const [state, formAction, isPending] = useActionState(
    createProject,
    initialState
  );

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Название
        </label>
        <Input id="name" name="name" placeholder="Например, Scrumo" />
        {state.errors?.name?.map((error) => (
          <p key={error} className="text-sm text-red-500">
            {error}
          </p>
        ))}
      </div>

      <div className="space-y-2">
        <label htmlFor="key" className="text-sm font-medium">
          Ключ
        </label>
        <Input id="key" name="key" placeholder="Например, SCRUMO" />
        {state.errors?.key?.map((error) => (
          <p key={error} className="text-sm text-red-500">
            {error}
          </p>
        ))}
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Описание
        </label>
        <Textarea
          id="description"
          name="description"
          placeholder="Краткое описание проекта"
          rows={4}
        />
        {state.errors?.description?.map((error) => (
          <p key={error} className="text-sm text-red-500">
            {error}
          </p>
        ))}
      </div>

      {state.errors?.form?.map((error) => (
        <p key={error} className="text-sm text-red-500">
          {error}
        </p>
      ))}

      {state.success && state.message ? (
        <p className="text-sm text-emerald-600">{state.message}</p>
      ) : null}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Создание..." : "Создать проект"}
      </Button>
    </form>
  );
}
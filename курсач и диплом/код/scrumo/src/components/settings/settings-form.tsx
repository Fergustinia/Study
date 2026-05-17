"use client";

import { useActionState } from "react";

import { updateProfile, type UpdateProfileState } from "@/app/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState: UpdateProfileState = {};

type Props = {
  name: string;
  email: string;
  role: string;
};

export function SettingsForm({ name, email, role }: Props) {
  const [state, formAction, isPending] = useActionState(
    updateProfile,
    initialState
  );

  return (
    <form action={formAction} className="max-w-lg space-y-4">
      <section className="space-y-2">
        <label className="text-sm font-medium" htmlFor="name">
          Имя
        </label>
        <Input
          id="name"
          name="name"
          defaultValue={name}
          required
          disabled={isPending}
        />
        {state.errors?.name ? (
          <p className="text-sm text-red-500">{state.errors.name[0]}</p>
        ) : null}
      </section>

      <section className="space-y-2">
        <label className="text-sm font-medium" htmlFor="email">
          Email
        </label>
        <Input id="email" name="email" value={email} disabled readOnly />
      </section>

      <section className="space-y-2">
        <p className="text-sm font-medium">Роль в системе</p>
        <p className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-700">
          {role}
        </p>
      </section>

      {state.errors?._form ? (
        <p className="text-sm text-red-500">{state.errors._form[0]}</p>
      ) : null}

      {state.success ? (
        <p className="text-sm text-emerald-600">Профиль сохранён.</p>
      ) : null}

      <Button type="submit" className="rounded-xl" disabled={isPending}>
        {isPending ? "Сохранение..." : "Сохранить"}
      </Button>
    </form>
  );
}

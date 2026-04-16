"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    startTransition(async () => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Ошибка регистрации");
        return;
      }

      router.push("/login?registered=1");
    });
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center p-6">
        <div className="grid w-full gap-6 lg:grid-cols-2">
          <div className="hidden rounded-3xl bg-white p-10 lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-400">
                Scrumo
              </div>
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-black">
                Создай аккаунт и начни вести проекты по scrum
              </h1>
              <p className="mt-4 max-w-md text-sm text-neutral-500">
                Подключай команду, веди backlog, управляй спринтами и отслеживай
                прогресс в одном интерфейсе.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border bg-neutral-50 p-4">
                <div className="text-2xl font-bold">Backlog</div>
                <div className="mt-1 text-sm text-neutral-500">структурируй задачи</div>
              </div>
              <div className="rounded-2xl border bg-neutral-50 p-4">
                <div className="text-2xl font-bold">Sprints</div>
                <div className="mt-1 text-sm text-neutral-500">планируй итерации</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Card className="w-full max-w-md rounded-3xl border-0 shadow-sm">
              <CardHeader className="space-y-2">
                <CardTitle className="text-3xl font-bold tracking-tight">
                  Регистрация
                </CardTitle>
                <p className="text-sm text-neutral-500">
                  Создай аккаунт для доступа к рабочему пространству Scrumo.
                </p>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Имя</label>
                    <Input
                      type="text"
                      placeholder="Введите имя"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-11 rounded-xl"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      placeholder="you@scrumo.dev"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 rounded-xl"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Пароль</label>
                    <Input
                      type="password"
                      placeholder="Минимум 6 символов"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 rounded-xl"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="h-11 w-full rounded-xl bg-black text-white hover:bg-neutral-800"
                  >
                    {isPending ? "Создание..." : "Создать аккаунт"}
                  </Button>

                  <p className="text-center text-sm text-neutral-500">
                    Уже есть аккаунт?{" "}
                    <Link href="/login" className="font-medium text-black">
                      Войти
                    </Link>
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
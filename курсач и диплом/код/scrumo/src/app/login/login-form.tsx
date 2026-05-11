"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const registered = searchParams.get("registered");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    startTransition(async () => {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Неверный email или пароль");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    });
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center p-6">
        <div className="grid w-full gap-6 lg:grid-cols-2">
          <div className="hidden rounded-3xl bg-black p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="text-sm font-medium uppercase tracking-[0.2em] text-white/60">
                Scrumo
              </div>
              <h1 className="mt-6 text-4xl font-bold tracking-tight">
                Управляй проектами, спринтами и командой в одном месте
              </h1>
              <p className="mt-4 max-w-md text-sm text-white/70">
                Единая agile scrum-платформа для проектов, backlog, планирования,
                доски задач и аналитики.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-2xl font-bold">12</div>
                <div className="mt-1 text-sm text-white/70">участников команды</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-2xl font-bold">32 pts</div>
                <div className="mt-1 text-sm text-white/70">velocity спринта</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Card className="w-full max-w-md rounded-3xl border-0 shadow-sm">
              <CardHeader className="space-y-2">
                <CardTitle className="text-3xl font-bold tracking-tight">
                  Вход в Scrumo
                </CardTitle>
                <p className="text-sm text-neutral-500">
                  Войди в аккаунт, чтобы открыть dashboard приложения.
                </p>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {registered === "1" && (
                    <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                      Аккаунт создан. Теперь войди в систему.
                    </div>
                  )}

                  {error && (
                    <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}

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
                      placeholder="Введите пароль"
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
                    {isPending ? "Вход..." : "Войти"}
                  </Button>

                  <p className="text-center text-sm text-neutral-500">
                    Нет аккаунта?{" "}
                    <Link href="/register" className="font-medium text-black">
                      Зарегистрироваться
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

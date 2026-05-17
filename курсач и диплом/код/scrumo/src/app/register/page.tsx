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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
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
    <div className="min-h-screen relative overflow-hidden bg-black">

      {/* 🌈 gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#1f1f3a,_#000)]" />

      {/* floating blobs */}
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-indigo-500/25 blur-[140px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-purple-500/25 blur-[160px] rounded-full animate-pulse" />

      {/* noise overlay */}
      <div className="absolute inset-0 opacity-[0.05] bg-[url('/noise.png')]" />

      <div className="relative flex min-h-screen items-center justify-center p-6">

        <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-2">

          {/* LEFT SIDE */}
          <div className="hidden lg:flex flex-col justify-between rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 text-white shadow-2xl">

            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-white/50">
                Scrumo Platform
              </div>

              <h1 className="mt-6 text-4xl font-semibold leading-tight">
                Создавай проекты, управляй спринтами и командой
              </h1>

              <p className="mt-4 text-sm text-white/60 max-w-md">
                Полный agile workflow: backlog → sprint → board → analytics.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 mt-10">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-2xl font-bold">Backlog</div>
                <div className="text-xs text-white/60 mt-1">
                  структурируй задачи
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-2xl font-bold">Sprints</div>
                <div className="text-xs text-white/60 mt-1">
                  планирование итераций
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <Card className="w-full max-w-md mx-auto rounded-3xl border border-white/10 bg-white/10 backdrop-blur-2xl shadow-2xl">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-3xl font-semibold text-white">
                Регистрация
              </CardTitle>

              <p className="text-sm text-white/60">
                Создай аккаунт и начни работать
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">

                {error && (
                  <div className="rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-300 border border-red-500/20">
                    {error}
                  </div>
                )}

                {/* NAME */}
                <div className="space-y-2">
                  <label className="text-sm text-white/70">Имя</label>
                  <Input
                    type="text"
                    placeholder="Ваше имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-white/30"
                    required
                  />
                </div>

                {/* EMAIL */}
                <div className="space-y-2">
                  <label className="text-sm text-white/70">Email</label>
                  <Input
                    type="email"
                    placeholder="you@scrumo.dev"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-white/30"
                    required
                  />
                </div>

                {/* PASSWORD */}
                <div className="space-y-2">
                  <label className="text-sm text-white/70">Пароль</label>
                  <Input
                    type="password"
                    placeholder="Минимум 6 символов"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-white/30"
                    required
                  />
                </div>

                {/* BUTTON */}
                <Button
                  type="submit"
                  disabled={isPending}
                  className="h-11 w-full rounded-xl bg-white text-black hover:bg-white/90 transition"
                >
                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                      Создание...
                    </div>
                  ) : (
                    "Создать аккаунт"
                  )}
                </Button>

                <p className="text-center text-sm text-white/50">
                  Уже есть аккаунт?{" "}
                  <Link href="/login" className="text-white hover:underline">
                    Войти
                  </Link>
                </p>

              </form>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
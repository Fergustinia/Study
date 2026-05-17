"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Eye, EyeOff, Github } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);

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

        setShake(true);
        setTimeout(() => setShake(false), 500);

        return;
      }

      router.push("/dashboard");
      router.refresh();
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">

      {/* 🌈 animated gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#1f1f3a,_#000)] animate-pulse" />

      {/* floating blobs */}
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-indigo-500/30 blur-[140px] rounded-full animate-[pulse_6s_ease-in-out_infinite]" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-purple-500/30 blur-[160px] rounded-full animate-[pulse_8s_ease-in-out_infinite]" />

      {/* noise overlay */}
      <div className="absolute inset-0 opacity-[0.06] bg-[url('/noise.png')]" />

      <div className="relative flex min-h-screen items-center justify-center p-6">

        <Card
          className={`w-full max-w-md rounded-3xl border border-white/10 bg-white/10 backdrop-blur-2xl shadow-2xl transition ${
            shake ? "animate-[shake_0.4s_ease-in-out]" : ""
          }`}
        >
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-3xl font-semibold text-white">
              Scrumo
            </CardTitle>

            <p className="text-sm text-white/60">
              Вход в систему управления проектами
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">

              {registered === "1" && (
                <div className="rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300 border border-emerald-500/20">
                  Аккаунт создан. Теперь войди в систему.
                </div>
              )}

              {error && (
                <div className="rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-300 border border-red-500/20">
                  {error}
                </div>
              )}

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

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 rounded-xl bg-white/5 border-white/10 text-white pr-10 placeholder:text-white/40 focus:border-white/30"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-2.5 text-white/60 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
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
                    Вход...
                  </div>
                ) : (
                  "Войти"
                )}
              </Button>

              {/* DIVIDER */}
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-white/40">или</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              {/* OAUTH UI (visual only) */}
              <div className="grid gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 h-11 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition"
                >
                  <Github size={18} />
                  GitHub
                </button>

                <button
                  type="button"
                  className="flex items-center justify-center gap-2 h-11 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition"
                >
                  <span className="text-sm">G</span>
                  Google
                </button>
              </div>

              <p className="text-center text-sm text-white/50 mt-4">
                Нет аккаунта?{" "}
                <Link href="/register" className="text-white hover:underline">
                  Зарегистрироваться
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* animations */}
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          50% { transform: translateX(4px); }
          75% { transform: translateX(-4px); }
        }
      `}</style>
    </div>
  );
}
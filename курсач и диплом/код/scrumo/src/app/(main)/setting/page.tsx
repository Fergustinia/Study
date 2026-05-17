import { SettingsForm } from "@/components/settings/settings-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUserId } from "@/lib/access";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SettingPage() {
  const userId = await requireUserId();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) return null;

  return (
    <div className="mx-auto max-w-5xl space-y-8 py-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Настройки
        </h1>

        <p className="text-sm text-neutral-600">
          Управление профилем и параметрами аккаунта.
        </p>
      </div>

      {/* Layout */}
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Profile */}
        <Card className="rounded-2xl border-neutral-200 shadow-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg font-semibold">
              Профиль
            </CardTitle>

            <p className="text-sm text-neutral-500">
              Основная информация аккаунта
            </p>
          </CardHeader>

          <CardContent>
            <SettingsForm
              name={user.name}
              email={user.email}
              role={user.role}
            />
          </CardContent>
        </Card>

        {/* Account info */}
        <Card className="rounded-2xl border-neutral-200 shadow-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg font-semibold">
              Аккаунт
            </CardTitle>

            <p className="text-sm text-neutral-500">
              Системная информация
            </p>
          </CardHeader>

          <CardContent className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-500">Email</span>
              <span className="text-neutral-900">{user.email}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-neutral-500">Роль</span>
              <span className="text-neutral-900">{user.role}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-neutral-500">Регистрация</span>
              <span className="text-neutral-900">
                {user.createdAt.toLocaleDateString("ru-RU")}
              </span>
            </div>

            <div className="pt-2 text-xs text-neutral-500">
              Email используется для входа в систему и не редактируется здесь.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
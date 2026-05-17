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

  if (!user) {
    return null;
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Настройки</h1>
        <p className="text-neutral-500">
          Профиль и параметры вашей учётной записи.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Профиль</CardTitle>
          </CardHeader>
          <CardContent>
            <SettingsForm
              name={user.name}
              email={user.email}
              role={user.role}
            />
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Аккаунт</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-neutral-600">
            <p>
              Дата регистрации:{" "}
              <span className="font-medium text-neutral-900">
                {user.createdAt.toLocaleDateString("ru-RU")}
              </span>
            </p>
            <p>
              Email используется для входа и не редактируется в этом разделе.
            </p>
            <p>
              Для смены пароля обратитесь к администратору или добавьте отдельный
              flow восстановления позже.
            </p>
          </CardContent>
        </Card>
      </section>
    </section>
  );
}

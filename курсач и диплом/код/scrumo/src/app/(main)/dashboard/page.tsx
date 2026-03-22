import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Главная панель</h1>
        <p className="text-neutral-500">
          Обзор команды, активного спринта и ключевых метрик.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Активные проекты" value="4" description="2 обновлены сегодня" />
        <StatCard title="Задачи в спринте" value="128" description="24 завершены" />
        <StatCard title="Velocity" value="32 pts" description="За текущий спринт" />
        <StatCard title="Команда" value="12" description="6 backend / 6 frontend" />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2 rounded-2xl">
          <CardHeader>
            <CardTitle>Текущий спринт — Sprint 24</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-neutral-600">
            <p>Взято в работу: 42 задачи</p>
            <p>Завершено: 24</p>
            <p>Прогресс: 57%</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Быстрые действия</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full rounded-xl bg-black px-4 py-2 text-sm font-medium text-white">
              Новый проект
            </button>
            <button className="w-full rounded-xl border px-4 py-2 text-sm font-medium">
              Новая задача
            </button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
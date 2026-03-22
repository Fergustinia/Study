import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function getSprintStatusLabel(status: "PLANNED" | "ACTIVE" | "COMPLETED") {
  switch (status) {
    case "PLANNED":
      return "Запланирован";
    case "ACTIVE":
      return "Активный";
    case "COMPLETED":
      return "Завершён";
  }
}

function getTaskStatusLabel(
  status: "TODO" | "IN_PROGRESS" | "REVIEW" | "TESTING" | "DONE"
) {
  switch (status) {
    case "TODO":
      return "К выполнению";
    case "IN_PROGRESS":
      return "В работе";
    case "REVIEW":
      return "На ревью";
    case "TESTING":
      return "Тестирование";
    case "DONE":
      return "Готово";
  }
}

export default async function DashboardPage() {
  const [
    activeProjectsCount,
    totalTasksCount,
    doneTasksCount,
    usersCount,
    activeSprint,
    recentProjects,
    recentTasks,
  ] = await Promise.all([
    prisma.project.count({
      where: {
        status: "ACTIVE",
      },
    }),

    prisma.task.count(),

    prisma.task.count({
      where: {
        status: "DONE",
      },
    }),

    prisma.user.count(),

    prisma.sprint.findFirst({
      where: {
        status: "ACTIVE",
      },
      include: {
        project: true,
        _count: {
          select: {
            tasks: true,
          },
        },
        tasks: {
          select: {
            id: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.project.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            tasks: true,
            sprints: true,
          },
        },
      },
    }),

    prisma.task.findMany({
      take: 6,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            key: true,
          },
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
  ]);

  const sprintTasksCount = activeSprint?._count.tasks ?? 0;

  const sprintDoneTasksCount =
    activeSprint?.tasks.filter((task) => task.status === "DONE").length ?? 0;

  const sprintProgress =
    sprintTasksCount > 0
      ? Math.round((sprintDoneTasksCount / sprintTasksCount) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Главная панель</h1>
        <p className="text-neutral-500">
          Обзор команды, активного спринта и ключевых метрик.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Активные проекты"
          value={String(activeProjectsCount)}
          description="Проекты в статусе Active"
        />
        <StatCard
          title="Всего задач"
          value={String(totalTasksCount)}
          description={`${doneTasksCount} завершено`}
        />
        <StatCard
          title="Задачи в активном спринте"
          value={String(sprintTasksCount)}
          description={`${sprintDoneTasksCount} выполнено`}
        />
        <StatCard
          title="Команда"
          value={String(usersCount)}
          description="Пользователей в системе"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2 rounded-2xl">
          <CardHeader>
            <CardTitle>
              {activeSprint
                ? `Текущий спринт — ${activeSprint.name}`
                : "Текущий спринт"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-neutral-600">
            {activeSprint ? (
              <>
                <p>
                  Проект:{" "}
                  <span className="font-medium text-black">
                    {activeSprint.project.name}
                  </span>
                </p>
                <p>
                  Статус:{" "}
                  <span className="font-medium text-black">
                    {getSprintStatusLabel(activeSprint.status)}
                  </span>
                </p>
                <p>
                  Взято в работу:{" "}
                  <span className="font-medium text-black">
                    {sprintTasksCount} задач
                  </span>
                </p>
                <p>
                  Завершено:{" "}
                  <span className="font-medium text-black">
                    {sprintDoneTasksCount}
                  </span>
                </p>
                <p>
                  Прогресс:{" "}
                  <span className="font-medium text-black">
                    {sprintProgress}%
                  </span>
                </p>
              </>
            ) : (
              <>
                <p>Сейчас нет активного спринта.</p>
                <p className="text-neutral-500">
                  Создай спринт в одном из проектов, чтобы видеть его здесь.
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Быстрые действия</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              href="/projects"
              className="block w-full rounded-xl bg-black px-4 py-2 text-center text-sm font-medium text-white"
            >
              Новый проект
            </Link>
            <Link
              href="/projects"
              className="block w-full rounded-xl border px-4 py-2 text-center text-sm font-medium"
            >
              Открыть проекты
            </Link>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Последние проекты</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentProjects.length === 0 ? (
              <div className="rounded-2xl border border-dashed p-6 text-sm text-neutral-500">
                Проектов пока нет.
              </div>
            ) : (
              recentProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="block rounded-2xl border p-4 transition hover:border-black/20 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="font-semibold text-black">{project.name}</p>
                      <p className="text-sm text-neutral-500">
                        {project.description || "Без описания"}
                      </p>
                    </div>

                    <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700">
                      {project.key}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-2 text-sm text-neutral-600 md:grid-cols-3">
                    <div>
                      <p className="text-neutral-400">Задачи</p>
                      <p className="font-medium text-black">
                        {project._count.tasks}
                      </p>
                    </div>
                    <div>
                      <p className="text-neutral-400">Спринты</p>
                      <p className="font-medium text-black">
                        {project._count.sprints}
                      </p>
                    </div>
                    <div>
                      <p className="text-neutral-400">Создан</p>
                      <p className="font-medium text-black">
                        {new Date(project.createdAt).toLocaleDateString("ru-RU")}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Последние задачи</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTasks.length === 0 ? (
              <div className="rounded-2xl border border-dashed p-6 text-sm text-neutral-500">
                Задач пока нет.
              </div>
            ) : (
              recentTasks.map((task) => (
                <div key={task.id} className="rounded-2xl border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="font-semibold text-black">{task.title}</p>
                      <p className="text-sm text-neutral-500">
                        {task.project.name} · {task.project.key}
                      </p>
                    </div>

                    <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700">
                      {getTaskStatusLabel(task.status)}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-2 text-sm text-neutral-600 md:grid-cols-2">
                    <div>
                      <p className="text-neutral-400">Исполнитель</p>
                      <p className="font-medium text-black">
                        {task.assignee?.name || "Не назначен"}
                      </p>
                    </div>
                    <div>
                      <p className="text-neutral-400">Создана</p>
                      <p className="font-medium text-black">
                        {new Date(task.createdAt).toLocaleDateString("ru-RU")}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
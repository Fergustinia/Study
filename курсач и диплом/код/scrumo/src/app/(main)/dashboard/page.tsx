
export const dynamic = "force-dynamic";

import Link from "next/link";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import { StatCard } from "@/components/shared/stat-card";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  const session = await auth();

  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  const projectWhere = {
    members: {
      some: {
        userId,
      },
    },
  };

  const [projects, tasks, completedTasksCount] = await Promise.all([
    prisma.project.findMany({
      where: projectWhere,

      include: {
        _count: {
          select: {
            tasks: true,
            sprints: true,
            members: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },

      take: 6,
    }),

    prisma.task.findMany({
      where: {
        project: projectWhere,
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
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },

      take: 8,
    }),

    prisma.task.count({
      where: {
        status: "DONE",

        project: projectWhere,
      },
    }),
  ]);

  const totalProjects = projects.length;
  const totalTasks = tasks.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Главная панель
        </h1>

        <p className="text-neutral-500">
          Обзор ваших проектов и задач.
        </p>
      </div>

      <section className="flex flex-wrap gap-2">
        <Link
          href="/board"
          className="inline-flex h-9 items-center rounded-xl border px-3 text-sm font-medium"
        >
          Доска
        </Link>
        <Link
          href="/backlog"
          className="inline-flex h-9 items-center rounded-xl border px-3 text-sm font-medium"
        >
          Бэклог
        </Link>
        <Link
          href="/planning"
          className="inline-flex h-9 items-center rounded-xl border px-3 text-sm font-medium"
        >
          Планирование
        </Link>
        <Link
          href="/analytics"
          className="inline-flex h-9 items-center rounded-xl border px-3 text-sm font-medium"
        >
          Аналитика
        </Link>
        <Link
          href="/team"
          className="inline-flex h-9 items-center rounded-xl border px-3 text-sm font-medium"
        >
          Команда
        </Link>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Ваши проекты"
          value={String(totalProjects)}
          description="Проекты, где вы участник"
        />

        <StatCard
          title="Последние задачи"
          value={String(totalTasks)}
          description={`${completedTasksCount} завершено`}
        />

        <StatCard
          title="Активность"
          value={String(tasks.filter((t) => t.status !== "DONE").length)}
          description="Незавершённых задач"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card className="rounded-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Ваши проекты</CardTitle>

              <Link
                href="/projects"
                className="text-sm text-neutral-500 hover:text-black"
              >
                Все проекты
              </Link>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {projects.length === 0 ? (
              <div className="rounded-2xl border border-dashed p-6 text-sm text-neutral-500">
                У вас пока нет проектов.
              </div>
            ) : (
              projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="block rounded-2xl border p-4 transition hover:border-black/20 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-black">
                        {project.name}
                      </p>

                      <p className="mt-1 text-sm text-neutral-500">
                        {project.description || "Без описания"}
                      </p>
                    </div>

                    <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700">
                      {project.key}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-neutral-400">Задачи</p>

                      <p className="font-semibold text-black">
                        {project._count.tasks}
                      </p>
                    </div>

                    <div>
                      <p className="text-neutral-400">Спринты</p>

                      <p className="font-semibold text-black">
                        {project._count.sprints}
                      </p>
                    </div>

                    <div>
                      <p className="text-neutral-400">Участники</p>

                      <p className="font-semibold text-black">
                        {project._count.members}
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
            {tasks.length === 0 ? (
              <div className="rounded-2xl border border-dashed p-6 text-sm text-neutral-500">
                Задач пока нет.
              </div>
            ) : (
              tasks.map((task) => (
                <Link
                  key={task.id}
                  href={`/projects/${task.project.id}/tasks/${task.id}/edit`}
                  className="block rounded-2xl border p-4 transition hover:border-black/20 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="font-semibold text-black">
                        {task.title}
                      </p>

                      <p className="text-sm text-neutral-500">
                        {task.project.name} · {task.project.key}
                      </p>
                    </div>

                    <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700">
                      {getTaskStatusLabel(task.status)}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm">
                    <div>
                      <p className="text-neutral-400">Исполнитель</p>

                      <p className="font-medium text-black">
                        {task.assignee?.name || "Не назначен"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-neutral-400">Создана</p>

                      <p className="font-medium text-black">
                        {new Date(task.createdAt).toLocaleDateString("ru-RU")}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

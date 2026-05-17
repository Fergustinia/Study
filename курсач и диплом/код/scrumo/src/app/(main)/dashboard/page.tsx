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

  if (!userId) return null;

  const projectWhere = {
    members: {
      some: { userId },
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
      orderBy: { createdAt: "desc" },
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
      orderBy: { createdAt: "desc" },
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
    <div className="space-y-8">

      {/* HEADER */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Главная панель
        </h1>
        <p className="text-sm text-neutral-500">
          Обзор проектов и задач
        </p>
      </div>

      {/* NAV */}
      <section className="flex flex-wrap gap-2">
        {[
          ["Доска", "/board"],
          ["Бэклог", "/backlog"],
          ["Планирование", "/planning"],
          ["Аналитика", "/analytics"],
          ["Команда", "/team"],
        ].map(([label, href]) => (
          <Link
            key={href}
            href={href}
            className="rounded-full bg-neutral-100 px-4 py-1.5 text-sm text-neutral-700 hover:bg-neutral-200 transition"
          >
            {label}
          </Link>
        ))}
      </section>

      {/* STATS */}
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Проекты"
          value={String(totalProjects)}
          description="где вы участник"
        />

        <StatCard
          title="Задачи"
          value={String(totalTasks)}
          description={`${completedTasksCount} завершено`}
        />

        <StatCard
          title="Активные"
          value={String(
            tasks.filter((t) => t.status !== "DONE").length
          )}
          description="в работе сейчас"
        />
      </section>

      {/* MAIN GRID */}
      <section className="grid gap-6 xl:grid-cols-2">

        {/* PROJECTS */}
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">
                Проекты
              </CardTitle>

              <Link
                href="/projects"
                className="text-sm text-neutral-500 hover:text-black transition"
              >
                Все
              </Link>
            </div>
          </CardHeader>

          <CardContent className="space-y-1">
            {projects.length === 0 ? (
              <div className="rounded-xl bg-neutral-50 p-4 text-sm text-neutral-500">
                Нет проектов
              </div>
            ) : (
              projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="block rounded-xl px-4 py-3 hover:bg-neutral-50 transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">
                        {project.name}
                      </p>
                      <p className="text-sm text-neutral-500">
                        {project.description || "Без описания"}
                      </p>
                    </div>

                    <span className="text-xs text-neutral-400">
                      {project.key}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-3 text-sm text-neutral-500">
                    <div>
                      <p className="text-xs">Задачи</p>
                      <p className="font-medium text-black">
                        {project._count.tasks}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs">Спринты</p>
                      <p className="font-medium text-black">
                        {project._count.sprints}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs">Участники</p>
                      <p className="font-medium text-black">
                        {project._count.members}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        {/* TASKS */}
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Последние задачи
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-1">
            {tasks.length === 0 ? (
              <div className="rounded-xl bg-neutral-50 p-4 text-sm text-neutral-500">
                Нет задач
              </div>
            ) : (
              tasks.map((task) => (
                <Link
                  key={task.id}
                  href={`/projects/${task.project.id}/tasks/${task.id}/edit`}
                  className="block rounded-xl px-4 py-3 hover:bg-neutral-50 transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-neutral-500">
                        {task.project.name} · {task.project.key}
                      </p>
                    </div>

                    <span className="text-xs text-neutral-400">
                      {getTaskStatusLabel(task.status)}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-sm text-neutral-500">
                    <span>
                      {task.assignee?.name || "—"}
                    </span>

                    <span>
                      {new Date(task.createdAt).toLocaleDateString("ru-RU")}
                    </span>
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
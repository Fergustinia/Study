export const dynamic = "force-dynamic";

import Link from "next/link";
import {
  ArrowRight,
  CalendarRange,
  CheckCircle2,
  CircleDashed,
  FolderKanban,
  Layers,
  ListTodo,
} from "lucide-react";

import { auth } from "@/auth";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import {
  getSprintStatusClasses,
  getSprintStatusLabel,
} from "@/types/sprint";
import {
  TASK_STATUSES,
  getPriorityClasses,
  getPriorityLabel,
  getTaskStatusClasses,
  getTaskStatusLabel,
} from "@/types/task";

const SPRINT_SORT_ORDER: Record<string, number> = {
  ACTIVE: 0,
  PLANNED: 1,
  COMPLETED: 2,
};

function formatDate(date: Date | null) {
  if (!date) return "—";
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
  });
}

function formatSprintRange(start: Date | null, end: Date | null) {
  if (!start && !end) return "Даты не заданы";
  return `${formatDate(start)} — ${formatDate(end)}`;
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

  const taskWhere = {
    project: projectWhere,
  };

  const [
    projects,
    projectCount,
    sprintsRaw,
    recentTasks,
    myTasks,
    totalTasks,
    doneTasks,
    inProgressTasks,
    backlogTasks,
    activeSprintCount,
    statusGroups,
  ] = await Promise.all([
    prisma.project.findMany({
      where: projectWhere,
      select: {
        id: true,
        name: true,
        key: true,
        description: true,
        _count: {
          select: {
            tasks: true,
            sprints: true,
            members: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),

    prisma.project.count({ where: projectWhere }),

    prisma.sprint.findMany({
      where: {
        project: projectWhere,
      },
      select: {
        id: true,
        name: true,
        goal: true,
        status: true,
        startDate: true,
        endDate: true,
        capacity: true,
        project: {
          select: {
            id: true,
            name: true,
            key: true,
          },
        },
        _count: {
          select: { tasks: true },
        },
        tasks: {
          where: { status: "DONE" },
          select: { storyPoints: true },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 12,
    }),

    prisma.task.findMany({
      where: taskWhere,
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        storyPoints: true,
        createdAt: true,
        project: {
          select: { id: true, name: true, key: true },
        },
        assignee: {
          select: { id: true, name: true },
        },
        sprint: {
          select: { id: true, name: true },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 6,
    }),

    prisma.task.findMany({
      where: {
        project: projectWhere,
        assigneeId: userId,
        status: { not: "DONE" },
      },
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        deadline: true,
        project: {
          select: { id: true, name: true, key: true },
        },
      },
      orderBy: [{ deadline: "asc" }, { updatedAt: "desc" }],
      take: 5,
    }),

    prisma.task.count({ where: taskWhere }),
    prisma.task.count({ where: { ...taskWhere, status: "DONE" } }),
    prisma.task.count({
      where: {
        ...taskWhere,
        status: { in: ["IN_PROGRESS", "REVIEW", "TESTING"] },
      },
    }),
    prisma.task.count({
      where: {
        ...taskWhere,
        sprintId: null,
      },
    }),
    prisma.sprint.count({
      where: {
        project: projectWhere,
        status: "ACTIVE",
      },
    }),
    prisma.task.groupBy({
      by: ["status"],
      where: taskWhere,
      _count: { _all: true },
    }),
  ]);

  const sprints = [...sprintsRaw].sort(
    (a, b) =>
      (SPRINT_SORT_ORDER[a.status] ?? 9) - (SPRINT_SORT_ORDER[b.status] ?? 9)
  );

  const statusCounts = TASK_STATUSES.map((status) => ({
    status,
    count:
      statusGroups.find((group) => group.status === status)?._count._all ?? 0,
  }));

  const completionPercent =
    totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const displayName = session.user?.name ?? session.user?.email ?? "коллега";

  const quickLinks = [
    { label: "Доска", href: "/board", icon: Layers },
    { label: "Бэклог", href: "/backlog", icon: ListTodo },
    { label: "Планирование", href: "/planning", icon: CalendarRange },
    { label: "Проекты", href: "/projects", icon: FolderKanban },
    { label: "Аналитика", href: "/analytics", icon: CheckCircle2 },
  ] as const;

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <section className="space-y-1">
          <p className="text-sm font-medium text-neutral-500">
            {new Date().toLocaleDateString("ru-RU", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Привет, {displayName}
          </h1>
          <p className="text-sm text-neutral-500">
            Сводка по вашим проектам, спринтам и задачам
          </p>
        </section>

        <nav className="flex flex-wrap gap-2">
          {quickLinks.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-sm text-neutral-700 shadow-sm transition hover:border-neutral-300 hover:bg-neutral-50"
            >
              <Icon className="h-3.5 w-3.5 text-neutral-500" />
              {label}
            </Link>
          ))}
        </nav>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Проекты"
          value={String(projectCount)}
          description={
            projectCount > projects.length
              ? `показано ${projects.length} из ${projectCount}`
              : "где вы участник"
          }
        />
        <StatCard
          title="Все задачи"
          value={String(totalTasks)}
          description={`${completionPercent}% выполнено`}
        />
        <StatCard
          title="В работе"
          value={String(inProgressTasks)}
          description="In Progress · Review · Testing"
        />
        <StatCard
          title="Активные спринты"
          value={String(activeSprintCount)}
          description={`${backlogTasks} задач в бэклоге`}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="rounded-2xl border-0 shadow-sm lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              По статусам
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {totalTasks === 0 ? (
              <p className="text-sm text-neutral-500">Задач пока нет</p>
            ) : (
              statusCounts.map(({ status, count }) => {
                const percent = Math.round((count / totalTasks) * 100);

                return (
                  <section key={status} className="space-y-1.5">
                    <section className="flex items-center justify-between text-sm">
                      <span className="text-neutral-600">
                        {getTaskStatusLabel(status)}
                      </span>
                      <span className="tabular-nums text-neutral-400">
                        {count}
                      </span>
                    </section>
                    <section className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
                      <section
                        className="h-full rounded-full bg-neutral-900 transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </section>
                  </section>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 shadow-sm lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold">
              Мои открытые задачи
            </CardTitle>
            <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
              {myTasks.length}
            </span>
          </CardHeader>
          <CardContent>
            {myTasks.length === 0 ? (
              <section className="flex flex-col items-center justify-center rounded-xl bg-neutral-50 py-8 text-center">
                <CheckCircle2 className="mb-2 h-8 w-8 text-emerald-500" />
                <p className="text-sm font-medium text-neutral-700">
                  Нет назначенных задач
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  Или все ваши задачи уже выполнены
                </p>
              </section>
            ) : (
              <ul className="divide-y divide-neutral-100">
                {myTasks.map((task) => (
                  <li key={task.id}>
                    <Link
                      href={`/projects/${task.project.id}/tasks/${task.id}/edit`}
                      className="flex items-center justify-between gap-3 py-3 transition hover:bg-neutral-50 -mx-2 px-2 rounded-lg"
                    >
                      <section className="min-w-0">
                        <p className="truncate font-medium">{task.title}</p>
                        <p className="text-xs text-neutral-500">
                          {task.project.name} · {task.project.key}
                          {task.deadline
                            ? ` · до ${formatDate(task.deadline)}`
                            : ""}
                        </p>
                      </section>
                      <section className="flex shrink-0 items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${getPriorityClasses(task.priority)}`}
                        >
                          {getPriorityLabel(task.priority)}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${getTaskStatusClasses(task.status)}`}
                        >
                          {getTaskStatusLabel(task.status)}
                        </span>
                      </section>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>

      <Card className="rounded-2xl border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <section>
            <CardTitle className="text-base font-semibold">Спринты</CardTitle>
            <p className="mt-0.5 text-sm text-neutral-500">
              Активные и запланированные итерации
            </p>
          </section>
          <Link
            href="/planning"
            className="inline-flex items-center gap-1 text-sm font-medium text-neutral-600 transition hover:text-black"
          >
            Планирование
            <ArrowRight className="h-4 w-4" />
          </Link>
        </CardHeader>
        <CardContent>
          {sprints.length === 0 ? (
            <section className="rounded-xl border border-dashed border-neutral-200 py-10 text-center">
              <CalendarRange className="mx-auto mb-2 h-8 w-8 text-neutral-300" />
              <p className="text-sm text-neutral-500">Спринтов пока нет</p>
              <Link
                href="/planning"
                className="mt-2 inline-block text-sm font-medium text-black underline"
              >
                Создать спринт
              </Link>
            </section>
          ) : (
            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {sprints.map((sprint) => {
                const donePoints = sprint.tasks.reduce(
                  (sum, task) => sum + task.storyPoints,
                  0
                );
                const isActive = sprint.status === "ACTIVE";
                const progressPercent =
                  sprint.capacity && sprint.capacity > 0
                    ? Math.min(
                        100,
                        Math.round((donePoints / sprint.capacity) * 100)
                      )
                    : null;

                return (
                  <Link
                    key={sprint.id}
                    href={`/planning?projectId=${sprint.project.id}`}
                    className={`group block rounded-xl border p-4 transition hover:shadow-md ${
                      isActive
                        ? "border-emerald-200 bg-emerald-50/40 ring-1 ring-emerald-100"
                        : "border-neutral-200 bg-white hover:border-neutral-300"
                    }`}
                  >
                    <section className="flex items-start justify-between gap-2">
                      <section className="min-w-0">
                        <p className="truncate font-semibold">{sprint.name}</p>
                        <p className="text-xs text-neutral-500">
                          {sprint.project.name}{" "}
                          <span className="text-neutral-400">
                            ({sprint.project.key})
                          </span>
                        </p>
                      </section>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${getSprintStatusClasses(sprint.status)}`}
                      >
                        {getSprintStatusLabel(sprint.status)}
                      </span>
                    </section>

                    {sprint.goal ? (
                      <p className="mt-2 line-clamp-2 text-sm text-neutral-600">
                        {sprint.goal}
                      </p>
                    ) : null}

                    <p className="mt-2 text-xs text-neutral-500">
                      {formatSprintRange(sprint.startDate, sprint.endDate)}
                    </p>

                    <section className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-neutral-500">
                        {sprint._count.tasks} задач
                      </span>
                      <span className="font-medium tabular-nums">
                        {donePoints}
                        {sprint.capacity ? ` / ${sprint.capacity}` : ""} SP
                      </span>
                    </section>

                    {progressPercent !== null ? (
                      <section className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/80">
                        <section
                          className={`h-full rounded-full transition-all ${
                            isActive ? "bg-emerald-500" : "bg-neutral-800"
                          }`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </section>
                    ) : null}
                  </Link>
                );
              })}
            </section>
          )}
        </CardContent>
      </Card>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">Проекты</CardTitle>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1 text-sm text-neutral-500 transition hover:text-black"
            >
              Все
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <section className="rounded-xl bg-neutral-50 p-6 text-center text-sm text-neutral-500">
                <FolderKanban className="mx-auto mb-2 h-7 w-7 text-neutral-300" />
                Нет проектов
              </section>
            ) : (
              <ul className="divide-y divide-neutral-100">
                {projects.map((project) => (
                  <li key={project.id}>
                    <Link
                      href={`/projects/${project.id}`}
                      className="flex items-center gap-4 py-3.5 transition hover:bg-neutral-50 -mx-2 px-2 rounded-lg"
                    >
                      <section className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-sm font-bold text-neutral-700">
                        {project.key.slice(0, 2)}
                      </section>
                      <section className="min-w-0 flex-1">
                        <p className="truncate font-medium">{project.name}</p>
                        <p className="truncate text-xs text-neutral-500">
                          {project.description || "Без описания"}
                        </p>
                      </section>
                      <section className="hidden shrink-0 gap-4 text-center text-xs sm:flex">
                        <section>
                          <p className="text-neutral-400">Задачи</p>
                          <p className="font-semibold tabular-nums">
                            {project._count.tasks}
                          </p>
                        </section>
                        <section>
                          <p className="text-neutral-400">Спринты</p>
                          <p className="font-semibold tabular-nums">
                            {project._count.sprints}
                          </p>
                        </section>
                      </section>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">
              Недавняя активность
            </CardTitle>
            <CircleDashed className="h-4 w-4 text-neutral-400" />
          </CardHeader>
          <CardContent>
            {recentTasks.length === 0 ? (
              <section className="rounded-xl bg-neutral-50 p-6 text-center text-sm text-neutral-500">
                Нет задач
              </section>
            ) : (
              <ul className="divide-y divide-neutral-100">
                {recentTasks.map((task) => (
                  <li key={task.id}>
                    <Link
                      href={`/projects/${task.project.id}/tasks/${task.id}/edit`}
                      className="block py-3.5 transition hover:bg-neutral-50 -mx-2 px-2 rounded-lg"
                    >
                      <section className="flex items-start justify-between gap-3">
                        <section className="min-w-0">
                          <p className="truncate font-medium">{task.title}</p>
                          <p className="text-xs text-neutral-500">
                            {task.project.key}
                            {task.sprint
                              ? ` · ${task.sprint.name}`
                              : " · бэклог"}
                          </p>
                        </section>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${getTaskStatusClasses(task.status)}`}
                        >
                          {getTaskStatusLabel(task.status)}
                        </span>
                      </section>
                      <section className="mt-2 flex items-center justify-between text-xs text-neutral-500">
                        <span>{task.assignee?.name ?? "Не назначен"}</span>
                        <span>
                          {task.storyPoints} SP ·{" "}
                          {new Date(task.createdAt).toLocaleDateString("ru-RU")}
                        </span>
                      </section>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

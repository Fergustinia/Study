import Link from "next/link";
import { notFound } from "next/navigation";

import { Prisma } from "@/generated/prisma";
import { requireUserId, requireProjectMember } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ProjectTasksPageProps = {
  params: Promise<{
    projectId: string;
  }>;
  searchParams?: Promise<{
    q?: string;
    status?: string;
    priority?: string;
    assigneeId?: string;
    sort?: string;
  }>;
};

const TASK_STATUS_VALUES = ["TODO", "IN_PROGRESS", "REVIEW", "TESTING", "DONE"] as const;

const TASK_PRIORITY_VALUES = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
] as const;

type TaskStatusValue = (typeof TASK_STATUS_VALUES)[number];
type TaskPriorityValue = (typeof TASK_PRIORITY_VALUES)[number];

function isTaskStatus(value: string): value is TaskStatusValue {
  return TASK_STATUS_VALUES.includes(value as TaskStatusValue);
}

function isTaskPriority(value: string): value is TaskPriorityValue {
  return TASK_PRIORITY_VALUES.includes(value as TaskPriorityValue);
}

function formatDate(date: Date | string | null | undefined) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("ru-RU");
}

function getTaskStatusLabel(status: string) {
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
    default:
      return status;
  }
}

function getTaskStatusClasses(status: string) {
  switch (status) {
    case "TODO":
      return "bg-neutral-100 text-neutral-700";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-700";
    case "REVIEW":
      return "bg-amber-100 text-amber-700";
    case "TESTING":
      return "bg-violet-100 text-violet-700";
    case "DONE":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-neutral-100 text-neutral-700";
  }
}

function getPriorityLabel(priority: string) {
  switch (priority) {
    case "LOW":
      return "Low";
    case "MEDIUM":
      return "Medium";
    case "HIGH":
      return "High";
    case "CRITICAL":
      return "Critical";
    default:
      return priority;
  }
}

function getPriorityClasses(priority: string) {
  switch (priority) {
    case "LOW":
      return "bg-neutral-100 text-neutral-700";
    case "MEDIUM":
      return "bg-blue-100 text-blue-700";
    case "HIGH":
      return "bg-amber-100 text-amber-700";
    case "CRITICAL":
      return "bg-red-100 text-red-700";
    default:
      return "bg-neutral-100 text-neutral-700";
  }
}

function buildOrderBy(sort: string | undefined): Prisma.TaskOrderByWithRelationInput[] {
  switch (sort) {
    case "oldest":
      return [{ createdAt: "asc" }];
    case "deadline_asc":
      return [{ deadline: "asc" }, { createdAt: "desc" }];
    case "deadline_desc":
      return [{ deadline: "desc" }, { createdAt: "desc" }];
    case "newest":
    default:
      return [{ createdAt: "desc" }];
  }
}

export default async function ProjectTasksPage({
  params,
  searchParams,
}: ProjectTasksPageProps) {
  const userId = await requireUserId();
  const { projectId } = await params;
  await requireProjectMember(projectId, userId);
  const resolvedSearchParams = (await searchParams) ?? {};

  const q = resolvedSearchParams.q?.trim() || "";
  const rawStatus = resolvedSearchParams.status?.trim() || "";
  const rawPriority = resolvedSearchParams.priority?.trim() || "";
  const assigneeId = resolvedSearchParams.assigneeId?.trim() || "";
  const sort = resolvedSearchParams.sort?.trim() || "newest";

  const status = rawStatus && isTaskStatus(rawStatus) ? rawStatus : "";
  const priority = rawPriority && isTaskPriority(rawPriority) ? rawPriority : "";

  const where: Prisma.TaskWhereInput = {
    projectId,
  };

  if (q) {
    where.title = {
      contains: q,
      mode: "insensitive",
    };
  }

  if (status) {
    where.status = status;
  }

  if (priority) {
    where.priority = priority;
  }

  if (assigneeId) {
    where.assigneeId = assigneeId;
  }

  const [
    project,
    tasks,
    assignees,
    totalTasks,
    doneTasks,
    inProgressTasks,
    overdueTasks,
  ] = await Promise.all([
    prisma.project.findUnique({
      where: {
        id: projectId,
      },
      select: {
        id: true,
        name: true,
        key: true,
      },
    }),
    prisma.task.findMany({
      where,
      orderBy: buildOrderBy(sort),
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        sprint: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
    prisma.user.findMany({
      where: {
        tasks: {
          some: {
            projectId,
          },
        },
      },
      orderBy: [{ name: "asc" }, { email: "asc" }],
      select: {
        id: true,
        name: true,
        email: true,
      },
    }),
    prisma.task.count({
      where: {
        projectId,
      },
    }),
    prisma.task.count({
      where: {
        projectId,
        status: "DONE",
      },
    }),
    prisma.task.count({
      where: {
        projectId,
        status: "IN_PROGRESS",
      },
    }),
    prisma.task.count({
      where: {
        projectId,
        deadline: {
          lt: new Date(),
        },
        status: {
          not: "DONE",
        },
      },
    }),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <Link
            href={`/projects/${project.id}`}
            className="inline-flex text-sm text-neutral-500 transition hover:text-black"
          >
            ← Назад к проекту
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">Задачи проекта</h1>
            <span className="rounded-lg bg-neutral-100 px-2.5 py-1 text-sm font-medium text-neutral-700">
              {project.key}
            </span>
          </div>

          <p className="text-sm text-neutral-600">
            Все задачи проекта <span className="font-medium text-black">{project.name}</span>.
          </p>
        </div>

        <Link
          href={`/projects/${project.id}/tasks/new`}
          className="inline-flex h-10 items-center justify-center rounded-xl bg-black px-4 text-sm font-medium text-white"
        >
          Создать задачу
        </Link>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Всего задач"
          value={String(totalTasks)}
          description="Во всём проекте"
        />
        <StatCard
          title="Готово"
          value={String(doneTasks)}
          description="Со статусом Done"
        />
        <StatCard
          title="В работе"
          value={String(inProgressTasks)}
          description="Активно выполняются"
        />
        <StatCard
          title="Просрочено"
          value={String(overdueTasks)}
          description="Не завершены и дедлайн прошёл"
        />
      </section>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Фильтры и поиск</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <div className="space-y-2 xl:col-span-2">
              <label htmlFor="q" className="text-sm font-medium">
                Поиск
              </label>
              <input
                id="q"
                name="q"
                defaultValue={q}
                placeholder="Поиск по названию задачи"
                className="flex h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-400"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">
                Статус
              </label>
              <select
                id="status"
                name="status"
                defaultValue={status}
                className="flex h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400"
              >
                <option value="">Все</option>
                <option value="TODO">К выполнению</option>
                <option value="IN_PROGRESS">В работе</option>
                <option value="REVIEW">На ревью</option>
                <option value="TESTING">Тестирование</option>
                <option value="DONE">Готово</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="priority" className="text-sm font-medium">
                Приоритет
              </label>
              <select
                id="priority"
                name="priority"
                defaultValue={priority}
                className="flex h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400"
              >
                <option value="">Все</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="assigneeId" className="text-sm font-medium">
                Исполнитель
              </label>
              <select
                id="assigneeId"
                name="assigneeId"
                defaultValue={assigneeId}
                className="flex h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400"
              >
                <option value="">Все</option>
                {assignees.map((assignee) => (
                  <option key={assignee.id} value={assignee.id}>
                    {assignee.name || assignee.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="sort" className="text-sm font-medium">
                Сортировка
              </label>
              <select
                id="sort"
                name="sort"
                defaultValue={sort}
                className="flex h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400"
              >
                <option value="newest">Сначала новые</option>
                <option value="oldest">Сначала старые</option>
                <option value="deadline_asc">Ближайший дедлайн</option>
                <option value="deadline_desc">Дальний дедлайн</option>
              </select>
            </div>

            <div className="flex gap-2 md:col-span-2 xl:col-span-5">
              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center rounded-xl bg-black px-4 text-sm font-medium text-white"
              >
                Применить
              </button>

              <Link
                href={`/projects/${project.id}/tasks`}
                className="inline-flex h-10 items-center justify-center rounded-xl border px-4 text-sm font-medium"
              >
                Сбросить
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Список задач</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {tasks.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-6 text-sm text-neutral-500">
              По текущим фильтрам задач не найдено.
            </div>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="rounded-2xl border p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-1">
                    <Link
                      href={`/projects/${project.id}/tasks/${task.id}/edit`}
                      className="font-semibold transition hover:text-neutral-700 hover:underline"
                    >
                      {task.title}
                    </Link>
                    <p className="text-sm text-neutral-500">
                      {task.description || "Без описания"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getTaskStatusClasses(task.status)}`}
                    >
                      {getTaskStatusLabel(task.status)}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getPriorityClasses(task.priority)}`}
                    >
                      {getPriorityLabel(task.priority)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 text-sm text-neutral-600 md:grid-cols-4">
                  <div>
                    <p className="text-neutral-400">Исполнитель</p>
                    <p className="font-medium text-black">
                      {task.assignee?.name || task.assignee?.email || "Не назначен"}
                    </p>
                  </div>

                  <div>
                    <p className="text-neutral-400">Спринт</p>
                    <p className="font-medium text-black">
                      {task.sprint?.name || "Без спринта"}
                    </p>
                  </div>

                  <div>
                    <p className="text-neutral-400">Story Points</p>
                    <p className="font-medium text-black">
                      {task.storyPoints ?? "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-neutral-400">Deadline</p>
                    <p className="font-medium text-black">
                      {formatDate(task.deadline)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
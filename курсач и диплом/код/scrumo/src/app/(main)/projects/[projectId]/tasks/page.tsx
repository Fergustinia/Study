import Link from "next/link";
import { notFound } from "next/navigation";

import { Prisma } from "@/generated/prisma";
import { requireUserId, requireProjectMember } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/shared/stat-card";
import { TaskPriority, TaskStatus } from "@prisma/client";

type ProjectTasksPageProps = {
  params: Promise<{ projectId: string }>;
  searchParams?: Promise<{
    q?: string;
    status?: string;
    priority?: string;
    assigneeId?: string;
    sort?: string;
  }>;
};

const TASK_STATUS_VALUES = ["TODO", "IN_PROGRESS", "REVIEW", "TESTING", "DONE"] as const;
const TASK_PRIORITY_VALUES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;

function isTaskStatus(value: string) {
  return TASK_STATUS_VALUES.includes(value as any);
}

function isTaskPriority(value: string) {
  return TASK_PRIORITY_VALUES.includes(value as any);
}

function formatDate(date: Date | string | null | undefined) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("ru-RU");
}

function getStatusLabel(status: string) {
  const map: Record<string, string> = {
    TODO: "К выполнению",
    IN_PROGRESS: "В работе",
    REVIEW: "На ревью",
    TESTING: "Тестирование",
    DONE: "Готово",
  };
  return map[status] ?? status;
}

function getStatusClass(status: string) {
  const map: Record<string, string> = {
    TODO: "bg-neutral-100 text-neutral-700",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
    REVIEW: "bg-amber-100 text-amber-700",
    TESTING: "bg-violet-100 text-violet-700",
    DONE: "bg-emerald-100 text-emerald-700",
  };
  return map[status] ?? "bg-neutral-100 text-neutral-700";
}

function getPriorityLabel(priority: string) {
  const map: Record<string, string> = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
    CRITICAL: "Critical",
  };
  return map[priority] ?? priority;
}

function getPriorityClass(priority: string) {
  const map: Record<string, string> = {
    LOW: "bg-neutral-100 text-neutral-700",
    MEDIUM: "bg-blue-100 text-blue-700",
    HIGH: "bg-amber-100 text-amber-700",
    CRITICAL: "bg-red-100 text-red-700",
  };
  return map[priority] ?? "bg-neutral-100 text-neutral-700";
}

function buildOrderBy(sort?: string): Prisma.TaskOrderByWithRelationInput[] {
  switch (sort) {
    case "oldest":
      return [{ createdAt: "asc" }];
    case "deadline_asc":
      return [{ deadline: "asc" }];
    case "deadline_desc":
      return [{ deadline: "desc" }];
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

  const sp = (await searchParams) ?? {};

  const q = sp.q?.trim() || "";
  const status = isTaskStatus(sp.status || "") ? sp.status as TaskStatus : undefined;
  const priority = isTaskPriority(sp.priority || "") ? sp.priority as TaskPriority : undefined;
  const assigneeId = sp.assigneeId?.trim() || "";
  const sort = sp.sort || "newest";

  const where: Prisma.TaskWhereInput = { projectId };

  if (q) where.title = { contains: q, mode: "insensitive" };
  if (status) where.status = status as TaskStatus;
  if (priority) where.priority = priority as unknown as TaskPriority;
  if (assigneeId) where.assigneeId = assigneeId;

  const [project, tasks, assignees, total, done, inProgress, overdue] =
    await Promise.all([
      prisma.project.findUnique({
        where: { id: projectId },
        select: { id: true, name: true, key: true },
      }),

      prisma.task.findMany({
        where,
        orderBy: buildOrderBy(sort),
        include: {
          assignee: true,
          sprint: true,
        },
      }),

      prisma.user.findMany({
        where: {
          tasks: { some: { projectId } },
        },
        select: { id: true, name: true, email: true },
      }),

      prisma.task.count({ where: { projectId } }),
      prisma.task.count({ where: { projectId, status: "DONE" } }),
      prisma.task.count({ where: { projectId, status: "IN_PROGRESS" } }),
      prisma.task.count({
        where: {
          projectId,
          status: { not: "DONE" },
          deadline: { lt: new Date() },
        },
      }),
    ]);

  if (!project) notFound();

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <Link
            href={`/projects/${project.id}`}
            className="text-sm text-neutral-500 hover:text-black"
          >
            ← Назад
          </Link>

          <h1 className="text-2xl font-semibold">
            Задачи
          </h1>

          <p className="text-sm text-neutral-500">
            {project.name} · {project.key}
          </p>
        </div>

        <Link
          href={`/projects/${project.id}/tasks/new`}
          className="rounded-full bg-black px-4 py-2 text-sm text-white"
        >
          Создать
        </Link>
      </div>

      {/* STATS */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Всего" value={String(total)} />
        <StatCard title="Готово" value={String(done)} />
        <StatCard title="В работе" value={String(inProgress)} />
        <StatCard title="Просрочено" value={String(overdue)} />
      </div>

      {/* FILTERS (simplified, NO CARD) */}
      <form className="grid gap-3 md:grid-cols-5">

        <input
          name="q"
          defaultValue={q}
          placeholder="Поиск..."
          className="h-10 rounded-xl border px-3 text-sm"
        />

        <select name="status" defaultValue={status} className="h-10 rounded-xl border px-3 text-sm">
          <option value="">Статус</option>
          <option value="TODO">TODO</option>
          <option value="IN_PROGRESS">IN PROGRESS</option>
          <option value="REVIEW">REVIEW</option>
          <option value="TESTING">TESTING</option>
          <option value="DONE">DONE</option>
        </select>

        <select name="priority" defaultValue={priority} className="h-10 rounded-xl border px-3 text-sm">
          <option value="">Приоритет</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>

        <select name="assigneeId" defaultValue={assigneeId} className="h-10 rounded-xl border px-3 text-sm">
          <option value="">Исполнитель</option>
          {assignees.map(a => (
            <option key={a.id} value={a.id}>
              {a.name || a.email}
            </option>
          ))}
        </select>

        <select name="sort" defaultValue={sort} className="h-10 rounded-xl border px-3 text-sm">
          <option value="newest">Новые</option>
          <option value="oldest">Старые</option>
          <option value="deadline_asc">Дедлайн ↑</option>
          <option value="deadline_desc">Дедлайн ↓</option>
        </select>

        <button className="h-10 rounded-xl bg-black text-white text-sm">
          Применить
        </button>
      </form>

      {/* TASK LIST (clean product-style list) */}
      <div className="space-y-2">

        {tasks.length === 0 ? (
          <div className="rounded-xl bg-neutral-50 p-6 text-sm text-neutral-500">
            Нет задач
          </div>
        ) : (
          tasks.map(task => (
            <Link
              key={task.id}
              href={`/projects/${project.id}/tasks/${task.id}/edit`}
              className="block rounded-xl px-4 py-3 hover:bg-neutral-50 transition"
            >

              <div className="flex items-start justify-between">

                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-neutral-500">
                    {task.assignee?.name || "—"}
                  </p>
                </div>

                <div className="flex gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusClass(task.status)}`}>
                    {getStatusLabel(task.status)}
                  </span>

                  <span className={`text-xs px-2 py-1 rounded-full ${getPriorityClass(task.priority)}`}>
                    {getPriorityLabel(task.priority)}
                  </span>
                </div>

              </div>

              <div className="mt-2 flex justify-between text-xs text-neutral-500">
                <span>{task.sprint?.name || "Без спринта"}</span>
                <span>{formatDate(task.deadline)}</span>
              </div>

            </Link>
          ))
        )}

      </div>

    </div>
  );
}
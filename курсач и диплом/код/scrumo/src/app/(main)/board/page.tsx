import Link from "next/link";
import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { BoardProjectSelect } from "@/components/kanban/board-project-select";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { prisma } from "@/lib/prisma";
import { TASK_STATUSES, type KanbanTask, type TaskStatus } from "@/types/task";

type BoardPageProps = {
  searchParams?: Promise<{
    projectId?: string;
  }>;
};

function isTaskStatus(value: string): value is TaskStatus {
  return TASK_STATUSES.includes(value as TaskStatus);
}

export default async function BoardPage({ searchParams }: BoardPageProps) {
  const session = await auth();
  const userId = session?.user?.id;

  const resolvedSearchParams = (await searchParams) ?? {};
  const projectId = resolvedSearchParams.projectId?.trim() || "";

  const projects = userId
    ? await prisma.project.findMany({
        where: {
          members: {
            some: { userId },
          },
        },
        select: {
          id: true,
          name: true,
          key: true,
        },
        orderBy: { name: "asc" },
      })
    : [];

  const selectedProjectId =
    projectId && projects.some((p) => p.id === projectId)
      ? projectId
      : projects[0]?.id ?? "";

  const selectedProject = projects.find(
    (p) => p.id === selectedProjectId
  );

  let tasks: KanbanTask[] = [];

  if (userId && selectedProjectId) {
    const membership = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId,
          projectId: selectedProjectId,
        },
      },
      select: { id: true },
    });

    if (!membership) notFound();

    const rawTasks = await prisma.task.findMany({
      where: { projectId: selectedProjectId },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      include: {
        assignee: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    tasks = rawTasks
      .filter((t) => isTaskStatus(t.status))
      .map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        status: t.status,
        priority: t.priority,
        storyPoints: t.storyPoints,
        projectId: t.projectId,
        assignee: t.assignee,
      }));
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 py-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Доска задач
          </h1>

          <p className="text-sm text-neutral-600">
            Kanban-доска для управления задачами по статусам и приоритетам.
          </p>
        </div>

        {selectedProject && (
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/projects/${selectedProjectId}/tasks/new`}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-black px-4 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              Новая задача
            </Link>

            <Link
              href={`/projects/${selectedProjectId}/tasks`}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-neutral-200 px-4 text-sm font-medium text-neutral-900 hover:bg-neutral-50"
            >
              Список задач
            </Link>
          </div>
        )}
      </div>

      {/* Empty projects */}
      {projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center">
          <h2 className="text-lg font-semibold">
            Нет доступных проектов
          </h2>

          <p className="mt-2 text-sm text-neutral-500">
            Создайте проект, чтобы использовать Kanban-доску.
          </p>

          <Link
            href="/projects"
            className="mt-4 inline-flex text-sm font-medium text-neutral-900 underline"
          >
            Перейти к проектам
          </Link>
        </div>
      ) : (
        <>
          {/* Project selector */}
          <div className="flex flex-wrap items-center gap-3">
            <BoardProjectSelect
              projects={projects}
              selectedProjectId={selectedProjectId}
            />

            {selectedProject && (
              <span className="rounded-full border bg-neutral-50 px-3 py-1 text-sm font-medium text-neutral-700">
                {selectedProject.key}
              </span>
            )}
          </div>

          {/* Board */}
          <KanbanBoard key={selectedProjectId} initialTasks={tasks} />
        </>
      )}
    </div>
  );
}
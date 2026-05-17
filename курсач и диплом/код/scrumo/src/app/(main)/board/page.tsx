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
        orderBy: {
          name: "asc",
        },
      })
    : [];

  const selectedProjectId =
    projectId && projects.some((project) => project.id === projectId)
      ? projectId
      : projects[0]?.id ?? "";

  const selectedProject = projects.find(
    (project) => project.id === selectedProjectId
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

    if (!membership) {
      notFound();
    }

    const rawTasks = await prisma.task.findMany({
      where: {
        projectId: selectedProjectId,
      },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    tasks = rawTasks
      .filter((task) => isTaskStatus(task.status))
      .map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        storyPoints: task.storyPoints,
        projectId: task.projectId,
        assignee: task.assignee,
      }));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Доска</h1>
          <p className="text-neutral-500">
            Kanban по статусам задач. Перетащите карточку в другую колонку.
          </p>
        </div>

        {selectedProject ? (
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/projects/${selectedProjectId}/tasks/new`}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-black px-4 text-sm font-medium text-white"
            >
              Новая задача
            </Link>
            <Link
              href={`/projects/${selectedProjectId}/tasks`}
              className="inline-flex h-10 items-center justify-center rounded-xl border px-4 text-sm font-medium"
            >
              Список задач
            </Link>
          </div>
        ) : null}
      </div>

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-8 text-center">
          <h2 className="text-lg font-semibold">Нет доступных проектов</h2>
          <p className="mt-2 text-sm text-neutral-500">
            Создайте проект, чтобы открыть Scrum-доску.
          </p>
          <Link
            href="/projects"
            className="mt-4 inline-flex text-sm font-medium text-black underline"
          >
            Перейти к проектам
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-end gap-3">
            <BoardProjectSelect
              projects={projects}
              selectedProjectId={selectedProjectId}
            />
            {selectedProject ? (
              <span className="rounded-lg bg-neutral-100 px-2.5 py-1 text-sm font-medium text-neutral-700">
                {selectedProject.key}
              </span>
            ) : null}
          </div>

          <KanbanBoard key={selectedProjectId} initialTasks={tasks} />
        </>
      )}
    </div>
  );
}

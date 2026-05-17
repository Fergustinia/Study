import Link from "next/link";

import { AssignSprintSelect } from "@/components/tasks/assign-sprint-select";
import { EmptyProjectsState } from "@/components/shared/empty-projects-state";
import { ProjectPageSelect } from "@/components/shared/project-page-select";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUserId } from "@/lib/access";
import { getProjectsForUser, resolveSelectedProjectId } from "@/lib/projects";
import { prisma } from "@/lib/prisma";
import {
  getPriorityClasses,
  getPriorityLabel,
  getTaskStatusLabel,
} from "@/types/task";

export const dynamic = "force-dynamic";

type BacklogPageProps = {
  searchParams?: Promise<{
    projectId?: string;
  }>;
};

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

export default async function BacklogPage({ searchParams }: BacklogPageProps) {
  const userId = await requireUserId();
  const resolvedSearchParams = (await searchParams) ?? {};

  const projects = await getProjectsForUser(userId);

  const selectedProjectId = resolveSelectedProjectId(
    projects,
    resolvedSearchParams.projectId
  );

  const [sprints, backlogTasks] =
    selectedProjectId.length > 0
      ? await Promise.all([
          prisma.sprint.findMany({
            where: { projectId: selectedProjectId },
            select: { id: true, name: true },
            orderBy: { createdAt: "desc" },
          }),
          prisma.task.findMany({
            where: {
              projectId: selectedProjectId,
              sprintId: null,
            },
            include: {
              assignee: {
                select: { id: true, name: true },
              },
            },
            orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
          }),
        ])
      : [[], []];

  const totalBacklogPoints = backlogTasks.reduce(
    (sum, task) => sum + task.storyPoints,
    0
  );

  return (
    <div className="mx-auto max-w-6xl space-y-8 py-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Бэклог
          </h1>

          <p className="text-sm text-neutral-600">
            Задачи без спринта. Их можно распределить позже во время планирования.
          </p>
        </div>

        {selectedProjectId && (
          <Link
            href={`/projects/${selectedProjectId}/tasks/new`}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-black px-4 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            Новая задача
          </Link>
        )}
      </div>

      {/* Empty state */}
      {projects.length === 0 ? (
        <EmptyProjectsState
          title="Нет доступных проектов"
          description="Создайте проект, чтобы начать работу с бэклогом."
        />
      ) : (
        <>
          {/* Project selector */}
          <ProjectPageSelect
            projects={projects}
            selectedProjectId={selectedProjectId}
            basePath="/backlog"
          />

          {/* Stats */}
          <section className="grid gap-4 md:grid-cols-3">
            <StatCard
              title="В бэклоге"
              value={String(backlogTasks.length)}
              description="Без спринта"
            />
            <StatCard
              title="Story points"
              value={String(totalBacklogPoints)}
              description="Общий объём"
            />
            <StatCard
              title="Спринты"
              value={String(sprints.length)}
              description="Доступны для назначения"
            />
          </section>

          {/* Task list */}
          <Card className="rounded-2xl border-neutral-200 shadow-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-lg font-semibold">
                Задачи бэклога
              </CardTitle>
              <p className="text-sm text-neutral-500">
                Перетащите или назначьте задачи в спринты
              </p>
            </CardHeader>

            <CardContent>
              {backlogTasks.length === 0 ? (
                <p className="text-sm text-neutral-500">
                  Пока нет задач без спринта.
                </p>
              ) : (
                <ul className="space-y-3">
                  {backlogTasks.map((task) => (
                    <li
                      key={task.id}
                      className="flex flex-col gap-3 rounded-xl border border-neutral-200 p-4 transition hover:bg-neutral-50 lg:flex-row lg:items-center lg:justify-between"
                    >
                      {/* Left */}
                      <div className="min-w-0 flex-1 space-y-2">
                        <Link
                          href={`/projects/${selectedProjectId}/tasks/${task.id}/edit`}
                          className="block font-medium text-neutral-900 hover:underline"
                        >
                          {task.title}
                        </Link>

                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span
                            className={`rounded-full px-2.5 py-1 font-medium ${getTaskStatusClasses(
                              task.status
                            )}`}
                          >
                            {getTaskStatusLabel(task.status)}
                          </span>

                          <span
                            className={`rounded-full px-2.5 py-1 font-medium ${getPriorityClasses(
                              task.priority
                            )}`}
                          >
                            {getPriorityLabel(task.priority)}
                          </span>

                          <span className="text-neutral-500">
                            {task.storyPoints} SP
                          </span>

                          {task.assignee && (
                            <span className="text-neutral-500">
                              {task.assignee.name}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right */}
                      <div className="flex items-center justify-between gap-3 lg:justify-end">
                        <span className="text-xs text-neutral-500">
                          Спринт
                        </span>

                        <AssignSprintSelect
                          taskId={task.id}
                          sprints={sprints}
                          currentSprintId={task.sprintId}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
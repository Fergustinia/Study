import Link from "next/link";

import { CreateSprintDialog } from "@/components/sprints/create-sprint-dialog";
import { SprintStatusActions } from "@/components/sprints/sprint-status-actions";
import { EmptyProjectsState } from "@/components/shared/empty-projects-state";
import { ProjectPageSelect } from "@/components/shared/project-page-select";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUserId, requireProjectMember } from "@/lib/access";
import { getProjectsForUser, resolveSelectedProjectId } from "@/lib/projects";
import { prisma } from "@/lib/prisma";
import {
  getSprintStatusClasses,
  getSprintStatusLabel,
} from "@/types/sprint";
import { getTaskStatusLabel } from "@/types/task";

export const dynamic = "force-dynamic";

type PlanningPageProps = {
  searchParams?: Promise<{
    projectId?: string;
  }>;
};

function formatDate(date: Date | null) {
  if (!date) return "—";
  return date.toLocaleDateString("ru-RU");
}

export default async function PlanningPage({
  searchParams,
}: PlanningPageProps) {
  const userId = await requireUserId();
  const resolvedSearchParams = (await searchParams) ?? {};

  const projects = await getProjectsForUser(userId);

  const selectedProjectId = resolveSelectedProjectId(
    projects,
    resolvedSearchParams.projectId
  );

  if (selectedProjectId) {
    await requireProjectMember(selectedProjectId, userId);
  }

  const sprints =
    selectedProjectId.length > 0
      ? await prisma.sprint.findMany({
          where: { projectId: selectedProjectId },
          include: {
            tasks: {
              select: {
                id: true,
                title: true,
                status: true,
                storyPoints: true,
              },
              orderBy: { createdAt: "desc" },
            },
            _count: { select: { tasks: true } },
          },
          orderBy: [{ status: "asc" }, { startDate: "desc" }],
        })
      : [];

  const activeSprint = sprints.find((s) => s.status === "ACTIVE");
  const plannedCount = sprints.filter((s) => s.status === "PLANNED").length;

  return (
    <div className="mx-auto max-w-6xl space-y-8 py-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Планирование
          </h1>

          <p className="text-sm text-neutral-600">
            Управление спринтами, задачами и их жизненным циклом.
          </p>
        </div>

        {selectedProjectId && (
          <CreateSprintDialog projectId={selectedProjectId} />
        )}
      </div>

      {/* Empty */}
      {projects.length === 0 ? (
        <EmptyProjectsState
          title="Нет доступных проектов"
          description="Создайте проект, чтобы начать планирование спринтов."
        />
      ) : (
        <>
          {/* Project selector */}
          <ProjectPageSelect
            projects={projects}
            selectedProjectId={selectedProjectId}
            basePath="/planning"
          />

          {/* Stats */}
          <section className="grid gap-4 md:grid-cols-3">
            <StatCard title="Спринтов" value={String(sprints.length)} />

            <StatCard
              title="Активный"
              value={activeSprint?.name ?? "—"}
              description={
                activeSprint ? "В работе сейчас" : "Нет активного спринта"
              }
            />

            <StatCard
              title="Запланировано"
              value={String(plannedCount)}
              description="Ожидают запуска"
            />
          </section>

          {/* Empty state for sprints */}
          {sprints.length === 0 ? (
            <Card className="rounded-2xl border-dashed">
              <CardContent className="py-10 text-center text-sm text-neutral-500">
                Спринтов пока нет
              </CardContent>
            </Card>
          ) : (
            <section className="space-y-4">
              {sprints.map((sprint) => {
                const points = sprint.tasks.reduce(
                  (sum, t) => sum + t.storyPoints,
                  0
                );

                return (
                  <Card
                    key={sprint.id}
                    className="rounded-2xl border-neutral-200 shadow-sm"
                  >
                    <CardHeader>
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        {/* Left */}
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <CardTitle className="text-lg font-semibold">
                              {sprint.name}
                            </CardTitle>

                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-medium ${getSprintStatusClasses(
                                sprint.status
                              )}`}
                            >
                              {getSprintStatusLabel(sprint.status)}
                            </span>
                          </div>

                          {sprint.goal && (
                            <p className="text-sm text-neutral-600">
                              {sprint.goal}
                            </p>
                          )}

                          <p className="text-xs text-neutral-500">
                            {formatDate(sprint.startDate)} —{" "}
                            {formatDate(sprint.endDate)} ·{" "}
                            {sprint._count.tasks} задач · {points} SP
                            {sprint.capacity
                              ? ` / ${sprint.capacity} SP`
                              : ""}
                          </p>
                        </div>

                        {/* Right */}
                        <SprintStatusActions
                          sprintId={sprint.id}
                          status={
                            sprint.status as
                              | "PLANNED"
                              | "ACTIVE"
                              | "COMPLETED"
                          }
                        />
                      </div>
                    </CardHeader>

                    <CardContent>
                      {sprint.tasks.length === 0 ? (
                        <p className="text-sm text-neutral-500">
                          Нет задач в этом спринте
                        </p>
                      ) : (
                        <ul className="space-y-2">
                          {sprint.tasks.map((task) => (
                            <li
                              key={task.id}
                              className="flex items-center justify-between rounded-lg border border-neutral-100 px-3 py-2 text-sm hover:bg-neutral-50"
                            >
                              <Link
                                href={`/projects/${selectedProjectId}/tasks/${task.id}/edit`}
                                className="font-medium text-neutral-900 hover:underline"
                              >
                                {task.title}
                              </Link>

                              <div className="flex items-center gap-2 text-xs text-neutral-500">
                                <span>{getTaskStatusLabel(task.status)}</span>
                                <span>{task.storyPoints} SP</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </section>
          )}

          {/* Footer hint */}
          <p className="text-sm text-neutral-500">
            <Link
              href="/backlog"
              className="font-medium text-neutral-900 underline"
            >
              Перейти в бэклог
            </Link>{" "}
            для назначения задач в спринты
          </p>
        </>
      )}
    </div>
  );
}
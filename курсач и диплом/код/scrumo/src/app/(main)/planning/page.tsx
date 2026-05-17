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

  const activeSprint = sprints.find((sprint) => sprint.status === "ACTIVE");
  const plannedCount = sprints.filter(
    (sprint) => sprint.status === "PLANNED"
  ).length;

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <section>
          <h1 className="text-3xl font-bold tracking-tight">Планирование</h1>
          <p className="text-neutral-500">
            Спринты, цели и задачи. Запускайте активный спринт и завершайте
            итерации.
          </p>
        </section>

        {selectedProjectId ? <CreateSprintDialog projectId={selectedProjectId} /> : null}
      </header>

      {projects.length === 0 ? (
        <EmptyProjectsState
          title="Нет доступных проектов"
          description="Создайте проект, чтобы планировать спринты."
        />
      ) : (
        <>
          <ProjectPageSelect
            projects={projects}
            selectedProjectId={selectedProjectId}
            basePath="/planning"
          />

          <section className="grid gap-4 md:grid-cols-3">
            <StatCard
              title="Всего спринтов"
              value={String(sprints.length)}
            />
            <StatCard
              title="Активный спринт"
              value={activeSprint?.name ?? "—"}
              description={
                activeSprint ? "Сейчас в работе" : "Нет активного спринта"
              }
            />
            <StatCard
              title="Запланировано"
              value={String(plannedCount)}
              description="Спринтов в очереди"
            />
          </section>

          {sprints.length === 0 ? (
            <Card className="rounded-2xl border-dashed">
              <CardContent className="py-10 text-center text-sm text-neutral-500">
                Спринтов пока нет. Создайте первый спринт для проекта.
              </CardContent>
            </Card>
          ) : (
            <section className="space-y-4">
              {sprints.map((sprint) => {
                const points = sprint.tasks.reduce(
                  (sum, task) => sum + task.storyPoints,
                  0
                );

                return (
                  <Card key={sprint.id} className="rounded-2xl">
                    <CardHeader className="gap-3">
                      <section className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <section className="space-y-2">
                          <section className="flex flex-wrap items-center gap-2">
                            <CardTitle>{sprint.name}</CardTitle>
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-medium ${getSprintStatusClasses(sprint.status)}`}
                            >
                              {getSprintStatusLabel(sprint.status)}
                            </span>
                          </section>
                          {sprint.goal ? (
                            <p className="text-sm text-neutral-500">
                              {sprint.goal}
                            </p>
                          ) : null}
                          <p className="text-xs text-neutral-500">
                            {formatDate(sprint.startDate)} —{" "}
                            {formatDate(sprint.endDate)} · {sprint._count.tasks}{" "}
                            задач · {points} SP
                            {sprint.capacity
                              ? ` / ${sprint.capacity} SP`
                              : ""}
                          </p>
                        </section>

                        <SprintStatusActions
                          sprintId={sprint.id}
                          status={sprint.status as "PLANNED" | "ACTIVE" | "COMPLETED"}
                        />
                      </section>
                    </CardHeader>

                    <CardContent>
                      {sprint.tasks.length === 0 ? (
                        <p className="text-sm text-neutral-500">
                          В спринте пока нет задач. Назначьте из бэклога.
                        </p>
                      ) : (
                        <ul className="space-y-2">
                          {sprint.tasks.map((task) => (
                            <li
                              key={task.id}
                              className="flex items-center justify-between gap-3 rounded-lg border border-neutral-100 px-3 py-2 text-sm"
                            >
                              <Link
                                href={`/projects/${selectedProjectId}/tasks/${task.id}/edit`}
                                className="font-medium hover:underline"
                              >
                                {task.title}
                              </Link>
                              <section className="flex items-center gap-2 text-xs text-neutral-500">
                                <span>{getTaskStatusLabel(task.status)}</span>
                                <span>{task.storyPoints} SP</span>
                              </section>
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

          <p className="text-sm text-neutral-500">
            <Link href="/backlog" className="font-medium text-black underline">
              Открыть бэклог
            </Link>{" "}
            для назначения задач в спринты.
          </p>
        </>
      )}
    </section>
  );
}

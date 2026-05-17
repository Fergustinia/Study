import { EmptyProjectsState } from "@/components/shared/empty-projects-state";
import { ProjectPageSelect } from "@/components/shared/project-page-select";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUserId, requireProjectMember } from "@/lib/access";
import { getProjectsForUser, resolveSelectedProjectId } from "@/lib/projects";
import { prisma } from "@/lib/prisma";
import { TASK_STATUSES, getTaskStatusLabel } from "@/types/task";

export const dynamic = "force-dynamic";

type AnalyticsPageProps = {
  searchParams?: Promise<{
    projectId?: string;
  }>;
};

export default async function AnalyticsPage({
  searchParams,
}: AnalyticsPageProps) {
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

  const tasks =
    selectedProjectId.length > 0
      ? await prisma.task.findMany({
          where: { projectId: selectedProjectId },
          select: {
            status: true,
            priority: true,
            storyPoints: true,
          },
        })
      : [];

  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "DONE").length;
  const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS").length;

  const totalPoints = tasks.reduce((s, t) => s + t.storyPoints, 0);
  const donePoints = tasks
    .filter((t) => t.status === "DONE")
    .reduce((s, t) => s + t.storyPoints, 0);

  const completionPercent = total ? Math.round((done / total) * 100) : 0;

  const statusCounts = TASK_STATUSES.map((status) => {
    const count = tasks.filter((t) => t.status === status).length;
    return { status, count };
  });

  const priorityLevels = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;

  const priorityCounts = priorityLevels.map((priority) => {
    const count = tasks.filter((t) => t.priority === priority).length;
    return { priority, count };
  });

  return (
    <div className="mx-auto max-w-6xl space-y-8 py-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Аналитика
        </h1>

        <p className="text-sm text-neutral-600">
          Метрики и распределение задач по выбранному проекту.
        </p>
      </div>

      {/* Empty */}
      {projects.length === 0 ? (
        <EmptyProjectsState
          title="Нет доступных проектов"
          description="Создайте проект, чтобы увидеть аналитику."
        />
      ) : (
        <>
          {/* Project selector */}
          <ProjectPageSelect
            projects={projects}
            selectedProjectId={selectedProjectId}
            basePath="/analytics"
          />

          {/* Overview stats */}
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Всего задач" value={String(total)} />

            <StatCard
              title="Выполнено"
              value={`${completionPercent}%`}
              description={`${done} из ${total}`}
            />

            <StatCard
              title="В работе"
              value={String(inProgress)}
              description="IN_PROGRESS"
            />

            <StatCard
              title="Story points"
              value={`${donePoints}/${totalPoints}`}
              description="done / total"
            />
          </section>

          {/* Breakdown */}
          <section className="grid gap-4 lg:grid-cols-2">
            {/* Status */}
            <Card className="rounded-2xl border-neutral-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  По статусам
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {statusCounts.map(({ status, count }) => {
                  const percent = total
                    ? Math.round((count / total) * 100)
                    : 0;

                  return (
                    <div key={status} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{getTaskStatusLabel(status)}</span>
                        <span className="text-neutral-500">
                          {count} · {percent}%
                        </span>
                      </div>

                      <div className="h-2 rounded-full bg-neutral-100">
                        <div
                          className="h-2 rounded-full bg-black transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Priority */}
            <Card className="rounded-2xl border-neutral-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  По приоритету
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {priorityCounts.map(({ priority, count }) => {
                  const percent = total
                    ? Math.round((count / total) * 100)
                    : 0;

                  return (
                    <div key={priority} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{priority}</span>
                        <span className="text-neutral-500">
                          {count} · {percent}%
                        </span>
                      </div>

                      <div className="h-2 rounded-full bg-neutral-100">
                        <div
                          className="h-2 rounded-full bg-neutral-700 transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </section>
        </>
      )}
    </div>
  );
}
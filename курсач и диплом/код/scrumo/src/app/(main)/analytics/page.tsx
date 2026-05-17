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
  const done = tasks.filter((task) => task.status === "DONE").length;
  const inProgress = tasks.filter(
    (task) => task.status === "IN_PROGRESS"
  ).length;
  const totalPoints = tasks.reduce((sum, task) => sum + task.storyPoints, 0);
  const donePoints = tasks
    .filter((task) => task.status === "DONE")
    .reduce((sum, task) => sum + task.storyPoints, 0);

  const statusCounts = TASK_STATUSES.map((status) => ({
    status,
    count: tasks.filter((task) => task.status === status).length,
  }));

  const priorityCounts = ["LOW", "MEDIUM", "HIGH", "CRITICAL"].map(
    (priority) => ({
      priority,
      count: tasks.filter((task) => task.priority === priority).length,
    })
  );

  const completionPercent =
    total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Аналитика</h1>
        <p className="text-neutral-500">
          Сводка по задачам и прогрессу выбранного проекта.
        </p>
      </header>

      {projects.length === 0 ? (
        <EmptyProjectsState
          title="Нет доступных проектов"
          description="Создайте проект, чтобы смотреть метрики."
        />
      ) : (
        <>
          <ProjectPageSelect
            projects={projects}
            selectedProjectId={selectedProjectId}
            basePath="/analytics"
          />

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Всего задач" value={String(total)} />
            <StatCard
              title="Выполнено"
              value={`${completionPercent}%`}
              description={`${done} из ${total} задач`}
            />
            <StatCard
              title="В работе"
              value={String(inProgress)}
              description="Статус In Progress"
            />
            <StatCard
              title="Story points"
              value={`${donePoints}/${totalPoints}`}
              description="Выполнено / всего"
            />
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>По статусам</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {statusCounts.map(({ status, count }) => {
                  const percent = total > 0 ? Math.round((count / total) * 100) : 0;

                  return (
                    <section key={status} className="space-y-1">
                      <section className="flex justify-between text-sm">
                        <span>{getTaskStatusLabel(status)}</span>
                        <span className="text-neutral-500">
                          {count} ({percent}%)
                        </span>
                      </section>
                      <section className="h-2 overflow-hidden rounded-full bg-neutral-100">
                        <section
                          className="h-full rounded-full bg-black transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </section>
                    </section>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>По приоритету</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {priorityCounts.map(({ priority, count }) => {
                  const percent = total > 0 ? Math.round((count / total) * 100) : 0;

                  return (
                    <section key={priority} className="space-y-1">
                      <section className="flex justify-between text-sm">
                        <span>{priority}</span>
                        <span className="text-neutral-500">
                          {count} ({percent}%)
                        </span>
                      </section>
                      <section className="h-2 overflow-hidden rounded-full bg-neutral-100">
                        <section
                          className="h-full rounded-full bg-neutral-700 transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </section>
                    </section>
                  );
                })}
              </CardContent>
            </Card>
          </section>
        </>
      )}
    </section>
  );
}

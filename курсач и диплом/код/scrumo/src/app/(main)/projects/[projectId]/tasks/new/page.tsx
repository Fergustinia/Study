import Link from "next/link";
import { notFound } from "next/navigation";

import { requireUserId, requireProjectMember } from "@/lib/access";
import { getProjectMemberUsers } from "@/lib/project-members";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateTaskForm } from "@/components/tasks/create-task-form";

type CreateProjectTaskPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function CreateProjectTaskPage({
  params,
}: CreateProjectTaskPageProps) {
  const userId = await requireUserId();
  const { projectId } = await params;

  await requireProjectMember(projectId, userId);

  const [project, sprints, users] = await Promise.all([
    prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        name: true,
        key: true,
        status: true,
      },
    }),
    prisma.sprint.findMany({
      where: { projectId },
      orderBy: [{ startDate: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        name: true,
        status: true,
      },
    }),
    getProjectMemberUsers(projectId),
  ]);

  if (!project) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-6">
      {/* Header */}
      <div className="space-y-4">
        <Link
          href={`/projects/${project.id}`}
          className="inline-flex items-center gap-2 text-sm text-neutral-500 transition hover:text-neutral-900"
        >
          <span>←</span>
          <span>Назад к проекту</span>
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
              Создание задачи
            </h1>

            <p className="text-sm text-neutral-600">
              Новая задача будет добавлена в проект{" "}
              <span className="font-medium text-neutral-900">
                {project.name}
              </span>
              .
            </p>
          </div>

          <div className="shrink-0 rounded-xl border bg-neutral-50 px-3 py-1.5 text-sm font-medium text-neutral-700">
            {project.key}
          </div>
        </div>
      </div>

      {/* Form Card */}
      <Card className="rounded-2xl border-neutral-200 shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-lg font-semibold">
            Детали задачи
          </CardTitle>
          <p className="text-sm text-neutral-500">
            Заполните информацию перед созданием задачи
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <CreateTaskForm
            projectId={project.id}
            sprints={sprints}
            users={users}
            defaultAssigneeId={userId}
          />
        </CardContent>
      </Card>
    </div>
  );
}
import Link from "next/link";
import { notFound } from "next/navigation";

import { requireUserId, requireProjectMember } from "@/lib/access";
import { getProjectMemberUsers } from "@/lib/project-members";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditTaskForm } from "@/components/tasks/edit-task-form";

type EditProjectTaskPageProps = {
  params: Promise<{
    projectId: string;
    taskId: string;
  }>;
};

function formatDateInputValue(date: Date | null) {
  if (!date) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default async function EditProjectTaskPage({
  params,
}: EditProjectTaskPageProps) {
  const userId = await requireUserId();
  const { projectId, taskId } = await params;

  await requireProjectMember(projectId, userId);

  const [project, task, sprints, users] = await Promise.all([
    prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        name: true,
        key: true,
      },
    }),
    prisma.task.findFirst({
      where: { id: taskId, projectId },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        storyPoints: true,
        deadline: true,
        assigneeId: true,
        sprintId: true,
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

  if (!project || !task) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-6">
      {/* Header */}
      <div className="space-y-4">
        <Link
          href={`/projects/${project.id}/tasks`}
          className="inline-flex items-center gap-2 text-sm text-neutral-500 transition hover:text-neutral-900"
        >
          <span>←</span>
          <span>Назад к задачам</span>
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
              Редактирование задачи
            </h1>

            <p className="text-sm text-neutral-600">
              Изменение задачи{" "}
              <span className="font-medium text-neutral-900">
                {task.title}
              </span>{" "}
              в проекте{" "}
              <span className="font-medium text-neutral-900">
                {project.name}
              </span>
              .
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-1">
            <span className="rounded-xl border bg-neutral-50 px-3 py-1.5 text-sm font-medium text-neutral-700">
              {project.key}
            </span>

            <span className="text-xs text-neutral-400">
              Task ID: {task.id.slice(0, 6)}…
            </span>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className="rounded-2xl border-neutral-200 shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-lg font-semibold">
            Параметры задачи
          </CardTitle>
          <p className="text-sm text-neutral-500">
            Обновите данные задачи и сохраните изменения
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <EditTaskForm
            projectId={project.id}
            taskId={task.id}
            initialValues={{
              title: task.title,
              description: task.description,
              status: task.status,
              priority: task.priority,
              storyPoints: task.storyPoints,
              deadline: formatDateInputValue(task.deadline),
              assigneeId: task.assigneeId,
              sprintId: task.sprintId,
            }}
            sprints={sprints}
            users={users}
          />
        </CardContent>
      </Card>
    </div>
  );
}
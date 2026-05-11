import Link from "next/link";
import { notFound } from "next/navigation";

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
  if (!date) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default async function EditProjectTaskPage({ params }: EditProjectTaskPageProps) {
  const { projectId, taskId } = await params;

  const [project, task, sprints, users] = await Promise.all([
    prisma.project.findUnique({
      where: {
        id: projectId,
      },
      select: {
        id: true,
        name: true,
        key: true,
      },
    }),
    prisma.task.findFirst({
      where: {
        id: taskId,
        projectId,
      },
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
      where: {
        projectId,
      },
      orderBy: [{ startDate: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        name: true,
        status: true,
      },
    }),
    prisma.user.findMany({
      orderBy: [{ name: "asc" }, { email: "asc" }],
      select: {
        id: true,
        name: true,
        email: true,
      },
    }),
  ]);

  if (!project || !task) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Link
          href={`/projects/${project.id}/tasks`}
          className="inline-flex text-sm text-neutral-500 transition hover:text-black"
        >
          ← Назад к задачам проекта
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">Редактирование задачи</h1>
          <span className="rounded-lg bg-neutral-100 px-2.5 py-1 text-sm font-medium text-neutral-700">
            {project.key}
          </span>
        </div>

        <p className="text-sm text-neutral-600">
          Изменения для задачи <span className="font-medium text-black">{task.title}</span> в
          проекте <span className="font-medium text-black">{project.name}</span>.
        </p>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Параметры задачи</CardTitle>
        </CardHeader>
        <CardContent>
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

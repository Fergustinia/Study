import Link from "next/link";
import { notFound } from "next/navigation";

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
  const { projectId } = await params;

  const [project, sprints, users] = await Promise.all([
    prisma.project.findUnique({
      where: {
        id: projectId,
      },
      select: {
        id: true,
        name: true,
        key: true,
        status: true,
      },
    }),
    prisma.sprint.findMany({
      where: {
        projectId,
      },
      orderBy: [
        { startDate: "desc" },
        { createdAt: "desc" },
      ],
      select: {
        id: true,
        name: true,
        status: true,
      },
    }),
    prisma.user.findMany({
      orderBy: [
        { name: "asc" },
        { email: "asc" },
      ],
      select: {
        id: true,
        name: true,
        email: true,
      },
    }),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Link
          href={`/projects/${project.id}`}
          className="inline-flex text-sm text-neutral-500 transition hover:text-black"
        >
          ← Назад к проекту
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">Создание задачи</h1>
          <span className="rounded-lg bg-neutral-100 px-2.5 py-1 text-sm font-medium text-neutral-700">
            {project.key}
          </span>
        </div>

        <p className="text-sm text-neutral-600">
          Новая задача будет создана внутри проекта{" "}
          <span className="font-medium text-black">{project.name}</span>.
        </p>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Новая задача</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateTaskForm
            projectId={project.id}
            sprints={sprints}
            users={users}
          />
        </CardContent>
      </Card>
    </div>
  );
}
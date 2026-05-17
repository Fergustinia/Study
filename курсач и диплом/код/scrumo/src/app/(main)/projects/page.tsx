import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

import { CreateProjectDialog } from "@/components/projects/create-project-dialog";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function ProjectsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const projects = userId
    ? await prisma.project.findMany({
        where: {
          members: {
            some: { userId },
          },
        },
        include: {
          _count: {
            select: {
              tasks: true,
              sprints: true,
              members: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Проекты</h1>
          <p className="text-neutral-500">
            Управление проектами и Scrum-командами.
          </p>
        </div>
        <CreateProjectDialog />
      </div>

      {projects.length === 0 ? (
        <Card className="rounded-2xl border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <h2 className="text-xl font-semibold">Пока нет проектов</h2>
            <p className="mt-2 max-w-md text-sm text-neutral-500">
              Создай первый проект, чтобы начать работу со спринтами, backlog и
              Scrum-доской.
            </p>
            <div className="mt-6">
              <CreateProjectDialog />
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="h-full rounded-2xl transition hover:border-black/20 hover:shadow-sm">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle>{project.name}</CardTitle>
                      <p className="mt-1 text-sm text-neutral-500">
                        {project.description || "Без описания"}
                      </p>
                    </div>
                    <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700">
                      {project.key}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-neutral-400">Задачи</p>
                      <p className="font-semibold text-black">
                        {project._count.tasks}
                      </p>
                    </div>
                    <div>
                      <p className="text-neutral-400">Спринты</p>
                      <p className="font-semibold text-black">
                        {project._count.sprints}
                      </p>
                    </div>
                    <div>
                      <p className="text-neutral-400">Участники</p>
                      <p className="font-semibold text-black">
                        {project._count.members}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
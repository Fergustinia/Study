import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

import { CreateProjectDialog } from "@/components/projects/create-project-dialog";

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

      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Проекты
          </h1>
          <p className="text-sm text-neutral-500">
            Управление проектами и командами
          </p>
        </div>

        <CreateProjectDialog />
      </div>

      {/* EMPTY STATE */}
      {projects.length === 0 ? (
        <div className="rounded-2xl bg-neutral-50 p-10 text-center">
          <h2 className="text-lg font-medium">Нет проектов</h2>
          <p className="mt-2 text-sm text-neutral-500">
            Создай первый проект, чтобы начать работу со спринтами и задачами
          </p>

          <div className="mt-6">
            <CreateProjectDialog />
          </div>
        </div>
      ) : (
        /* GRID */
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="group rounded-2xl bg-white p-5 hover:bg-neutral-50 transition border border-transparent"
            >

              {/* TOP */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-base font-medium group-hover:text-black">
                    {project.name}
                  </p>

                  <p className="text-sm text-neutral-500 line-clamp-2">
                    {project.description || "Без описания"}
                  </p>
                </div>

                <span className="text-xs text-neutral-400">
                  {project.key}
                </span>
              </div>

              {/* METRICS */}
              <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-xs text-neutral-400">Задачи</p>
                  <p className="font-medium text-black">
                    {project._count.tasks}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-neutral-400">Спринты</p>
                  <p className="font-medium text-black">
                    {project._count.sprints}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-neutral-400">Команда</p>
                  <p className="font-medium text-black">
                    {project._count.members}
                  </p>
                </div>
              </div>

            </Link>
          ))}

        </div>
      )}
    </div>
  );
}
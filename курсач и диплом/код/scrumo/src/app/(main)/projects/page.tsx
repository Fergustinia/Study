import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/shared/stat-card";
import { CreateProjectForm } from "@/components/projects/create-project-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function getStatusLabel(status: "ACTIVE" | "ARCHIVED") {
  return status === "ACTIVE" ? "Активный" : "Архивный";
}

function getStatusClasses(status: "ACTIVE" | "ARCHIVED") {
  return status === "ACTIVE"
    ? "bg-emerald-100 text-emerald-700"
    : "bg-neutral-200 text-neutral-700";
}

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    include: {
      _count: {
        select: {
          tasks: true,
          sprints: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const activeProjects = projects.filter(
    (project) => project.status === "ACTIVE"
  ).length;

  const archivedProjects = projects.filter(
    (project) => project.status === "ARCHIVED"
  ).length;

  const totalTasks = projects.reduce(
    (acc, project) => acc + project._count.tasks,
    0
  );

  const totalSprints = projects.reduce(
    (acc, project) => acc + project._count.sprints,
    0
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Проекты</h1>
        <p className="text-neutral-500">
          Управление всеми проектами команды, их статусами и текущей нагрузкой.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Всего проектов"
          value={String(projects.length)}
          description={`${activeProjects} активных`}
        />
        <StatCard
          title="Архивные проекты"
          value={String(archivedProjects)}
          description="История завершенных инициатив"
        />
        <StatCard
          title="Всего задач"
          value={String(totalTasks)}
          description="Во всех проектах"
        />
        <StatCard
          title="Всего спринтов"
          value={String(totalSprints)}
          description="По всем проектам"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="grid gap-4 xl:col-span-2">
          {projects.length === 0 ? (
            <Card className="rounded-2xl border-dashed">
              <CardContent className="flex min-h-[220px] flex-col items-center justify-center text-center">
                <h3 className="text-lg font-semibold">Проектов пока нет</h3>
                <p className="mt-2 max-w-md text-sm text-neutral-500">
                  Создай первый проект справа, чтобы начать работу со спринтами,
                  задачами и командной нагрузкой.
                </p>
              </CardContent>
            </Card>
          ) : (
            projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="block"
              >
                <Card className="rounded-2xl transition hover:border-black/20 hover:shadow-md">
                  <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{project.name}</CardTitle>
                      <p className="text-sm text-neutral-500">
                        {project.description || "Без описания"}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                        project.status
                      )}`}
                    >
                      {getStatusLabel(project.status)}
                    </span>
                  </CardHeader>

                  <CardContent className="grid gap-3 text-sm text-neutral-600 md:grid-cols-4">
                    <div>
                      <p className="text-neutral-400">Ключ</p>
                      <p className="font-medium text-black">{project.key}</p>
                    </div>

                    <div>
                      <p className="text-neutral-400">Задачи</p>
                      <p className="font-medium text-black">
                        {project._count.tasks}
                      </p>
                    </div>

                    <div>
                      <p className="text-neutral-400">Спринты</p>
                      <p className="font-medium text-black">
                        {project._count.sprints}
                      </p>
                    </div>

                    <div>
                      <p className="text-neutral-400">Создан</p>
                      <p className="font-medium text-black">
                        {new Date(project.createdAt).toLocaleDateString("ru-RU")}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Новый проект</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateProjectForm />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
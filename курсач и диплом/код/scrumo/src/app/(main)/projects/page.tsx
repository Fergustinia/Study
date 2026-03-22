import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/shared/stat-card";
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

  const activeProjects = projects.filter((project) => project.status === "ACTIVE").length;
  const archivedProjects = projects.filter((project) => project.status === "ARCHIVED").length;
  const totalTasks = projects.reduce((acc, project) => acc + project._count.tasks, 0);
  const totalSprints = projects.reduce((acc, project) => acc + project._count.sprints, 0);

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
          {projects.map((project) => (
            <Card key={project.id} className="rounded-2xl">
              <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{project.name}</CardTitle>
                  <p className="text-sm text-neutral-500">
                    {project.description || "Без описания"}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(project.status)}`}
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
                  <p className="font-medium text-black">{project._count.tasks}</p>
                </div>

                <div>
                  <p className="text-neutral-400">Спринты</p>
                  <p className="font-medium text-black">{project._count.sprints}</p>
                </div>

                <div>
                  <p className="text-neutral-400">Создан</p>
                  <p className="font-medium text-black">
                    {new Date(project.createdAt).toLocaleDateString("ru-RU")}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Быстрые действия</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full rounded-xl bg-black px-4 py-2 text-sm font-medium text-white">
              Новый проект
            </button>
            <button className="w-full rounded-xl border px-4 py-2 text-sm font-medium">
              Открыть backlog
            </button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
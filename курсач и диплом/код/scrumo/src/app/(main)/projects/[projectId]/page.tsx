import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ProjectPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

function formatDate(date: Date | string | null | undefined) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("ru-RU");
}

function getProjectStatusLabel(status: string) {
  switch (status) {
    case "PLANNING":
      return "Планирование";
    case "ACTIVE":
      return "Активный";
    case "ON_HOLD":
      return "На паузе";
    case "COMPLETED":
      return "Завершён";
    case "ARCHIVED":
      return "Архивный";
    default:
      return status;
  }
}

function getProjectStatusClasses(status: string) {
  switch (status) {
    case "PLANNING":
      return "bg-blue-100 text-blue-700";
    case "ACTIVE":
      return "bg-emerald-100 text-emerald-700";
    case "ON_HOLD":
      return "bg-amber-100 text-amber-700";
    case "COMPLETED":
      return "bg-violet-100 text-violet-700";
    case "ARCHIVED":
      return "bg-neutral-200 text-neutral-700";
    default:
      return "bg-neutral-100 text-neutral-700";
  }
}

function getSprintStatusLabel(status: string) {
  switch (status) {
    case "PLANNED":
      return "Запланирован";
    case "ACTIVE":
      return "Активный";
    case "COMPLETED":
      return "Завершён";
    default:
      return status;
  }
}

function getSprintStatusClasses(status: string) {
  switch (status) {
    case "PLANNED":
      return "bg-blue-100 text-blue-700";
    case "ACTIVE":
      return "bg-emerald-100 text-emerald-700";
    case "COMPLETED":
      return "bg-neutral-200 text-neutral-700";
    default:
      return "bg-neutral-100 text-neutral-700";
  }
}

function getTaskStatusLabel(status: string) {
  switch (status) {
    case "TODO":
      return "К выполнению";
    case "IN_PROGRESS":
      return "В работе";
    case "REVIEW":
      return "На ревью";
    case "TESTING":
      return "Тестирование";
    case "DONE":
      return "Готово";
    default:
      return status;
  }
}

function getTaskStatusClasses(status: string) {
  switch (status) {
    case "TODO":
      return "bg-neutral-100 text-neutral-700";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-700";
    case "REVIEW":
      return "bg-amber-100 text-amber-700";
    case "TESTING":
      return "bg-violet-100 text-violet-700";
    case "DONE":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-neutral-100 text-neutral-700";
  }
}

export default async function ProjectDetailsPage({ params }: ProjectPageProps) {
  const { projectId } = await params;

  const [project, completedTasks, activeSprints] = await Promise.all([
    prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        _count: {
          select: {
            tasks: true,
            sprints: true,
          },
        },
        sprints: {
          orderBy: [{ startDate: "desc" }, { createdAt: "desc" }],
          take: 6,
        },
        tasks: {
          orderBy: {
            createdAt: "desc",
          },
          take: 8,
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            sprint: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    }),
    prisma.task.count({
      where: {
        projectId,
        status: "DONE",
      },
    }),
    prisma.sprint.count({
      where: {
        projectId,
        status: "ACTIVE",
      },
    }),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <Link
            href="/projects"
            className="inline-flex text-sm text-neutral-500 transition hover:text-black"
          >
            ← Назад к проектам
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${getProjectStatusClasses(project.status)}`}
            >
              {getProjectStatusLabel(project.status)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-500">
            <span className="rounded-lg bg-neutral-100 px-2.5 py-1 font-medium text-neutral-700">
              {project.key}
            </span>
            <span>Создан {formatDate(project.createdAt)}</span>
          </div>

          <p className="max-w-3xl text-sm text-neutral-600">
            {project.description || "Описание проекта пока не заполнено."}
          </p>
        </div>

        <div className="flex gap-2">
          <button className="rounded-xl border px-4 py-2 text-sm font-medium">
            Редактировать
          </button>
          <button className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white">
            Новый спринт
          </button>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Всего задач"
          value={String(project._count.tasks)}
          description="Во всём проекте"
        />
        <StatCard
          title="Завершено задач"
          value={String(completedTasks)}
          description="Со статусом Готово"
        />
        <StatCard
          title="Всего спринтов"
          value={String(project._count.sprints)}
          description={`${activeSprints} активных`}
        />
        <StatCard
          title="Статус проекта"
          value={getProjectStatusLabel(project.status)}
          description="Текущее состояние проекта"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Спринты</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {project.sprints.length === 0 ? (
                <div className="rounded-2xl border border-dashed p-6 text-sm text-neutral-500">
                  У проекта пока нет спринтов.
                </div>
              ) : (
                project.sprints.map((sprint) => (
                  <div
                    key={sprint.id}
                    className="flex flex-col gap-3 rounded-2xl border p-4 md:flex-row md:items-start md:justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{sprint.name}</h3>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${getSprintStatusClasses(sprint.status)}`}
                        >
                          {getSprintStatusLabel(sprint.status)}
                        </span>
                      </div>

                      <p className="text-sm text-neutral-500">
                        {sprint.goal || "Цель спринта не указана"}
                      </p>
                    </div>

                    <div className="grid gap-2 text-sm text-neutral-600 md:min-w-[220px]">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-neutral-400">Даты</span>
                        <span className="font-medium text-black">
                          {formatDate(sprint.startDate)} — {formatDate(sprint.endDate)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <span className="text-neutral-400">Capacity</span>
                        <span className="font-medium text-black">
                          {sprint.capacity ?? "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>Последние задачи</CardTitle>
                <Link
                  href={`/projects/${project.id}/tasks`}
                  className="text-sm text-neutral-500 transition hover:text-black"
                >
                  Все задачи
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {project.tasks.length === 0 ? (
                <div className="rounded-2xl border border-dashed p-6 text-sm text-neutral-500">
                  У проекта пока нет задач.
                </div>
              ) : (
                project.tasks.map((task) => (
                  <div key={task.id} className="rounded-2xl border p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-1">
                        <Link
                          href={`/projects/${project.id}/tasks/${task.id}/edit`}
                          className="font-semibold transition hover:text-neutral-700 hover:underline"
                        >
                          {task.title}
                        </Link>
                        <p className="text-sm text-neutral-500">
                          {task.description || "Без описания"}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getTaskStatusClasses(task.status)}`}
                      >
                        {getTaskStatusLabel(task.status)}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-2 text-sm text-neutral-600 md:grid-cols-3">
                      <div>
                        <p className="text-neutral-400">Исполнитель</p>
                        <p className="font-medium text-black">
                          {task.assignee?.name || task.assignee?.email || "Не назначен"}
                        </p>
                      </div>

                      <div>
                        <p className="text-neutral-400">Спринт</p>
                        <p className="font-medium text-black">
                          {task.sprint?.name || "Без спринта"}
                        </p>
                      </div>

                      <div>
                        <p className="text-neutral-400">Story Points</p>
                        <p className="font-medium text-black">
                          {task.storyPoints ?? "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>О проекте</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="text-neutral-400">Название</p>
                <p className="font-medium text-black">{project.name}</p>
              </div>

              <div>
                <p className="text-neutral-400">Ключ</p>
                <p className="font-medium text-black">{project.key}</p>
              </div>

              <div>
                <p className="text-neutral-400">Статус</p>
                <p className="font-medium text-black">
                  {getProjectStatusLabel(project.status)}
                </p>
              </div>

              <div>
                <p className="text-neutral-400">Создан</p>
                <p className="font-medium text-black">{formatDate(project.createdAt)}</p>
              </div>

              <div>
                <p className="text-neutral-400">Обновлён</p>
                <p className="font-medium text-black">{formatDate(project.updatedAt)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Следующие шаги</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                href={`/projects/${project.id}/tasks/new`}
                className="inline-flex w-full items-center justify-center rounded-xl bg-black px-4 py-2 text-sm font-medium text-white"
              >
                Создать задачу
              </Link>
              <Link
                href={`/projects/${project.id}/tasks`}
                className="inline-flex w-full items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium"
              >
                Все задачи
              </Link>
              <button className="w-full rounded-xl border px-4 py-2 text-sm font-medium">
                Создать спринт
              </button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
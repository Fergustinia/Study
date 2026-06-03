import Link from "next/link";
import { notFound } from "next/navigation";

import { StatCard } from "@/components/shared/stat-card";
import { auth } from "@/auth";
import { requireProjectMember } from "@/lib/access";
import { canManageProjectMembers } from "@/lib/project-members";
import { prisma } from "@/lib/prisma";
import { getProjectRoleLabel } from "@/types/sprint";

interface Props {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectDetailsPage({ params }: Props) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return null;

  const { projectId } = await params;
  const membership = await requireProjectMember(projectId, userId);

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              passwordHash: true,
            },
          },
        },
      },
      sprints: { orderBy: { createdAt: "desc" }, take: 3 },
      _count: {
        select: {
          tasks: true,
          sprints: true,
          members: true,
        },
      },
    },
  });

  if (!project) notFound();

  const doneTasks = await prisma.task.count({
    where: {
      projectId,
      status: "DONE",
    },
  });

  const activeSprint = await prisma.sprint.findFirst({
    where: {
      projectId,
      status: "ACTIVE",
    },
    select: { name: true },
  });

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">
              {project.name}
            </h1>

            <span className="text-xs text-neutral-400">
              {project.key}
            </span>
          </div>

          <p className="text-sm text-neutral-500 max-w-xl">
            {project.description || "Без описания"}
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-wrap gap-2">

          <Link
            href={`/board?projectId=${project.id}`}
            className="rounded-full bg-black px-4 py-2 text-sm text-white"
          >
            Доска
          </Link>

          <Link
            href={`/projects/${project.id}/tasks`}
            className="rounded-full bg-neutral-100 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-200 transition"
          >
            Задачи
          </Link>

          <Link
            href={`/backlog?projectId=${project.id}`}
            className="rounded-full bg-neutral-100 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-200 transition"
          >
            Бэклог
          </Link>

          <Link
            href={`/planning?projectId=${project.id}`}
            className="rounded-full bg-neutral-100 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-200 transition"
          >
            Планирование
          </Link>

        </div>
      </div>

      {/* STATS */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Задачи" value={String(project._count.tasks)} />
        <StatCard title="Выполнено" value={String(doneTasks)} />
        <StatCard title="Спринты" value={String(project._count.sprints)} />
        <StatCard
          title="Активный спринт"
          value={activeSprint?.name ?? "—"}
        />
      </section>

      {/* MAIN GRID */}
      <section className="grid gap-6 lg:grid-cols-2">

        {/* TEAM */}
        <div className="rounded-2xl bg-white p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-base font-medium">Команда</h2>

            <Link
              href={`/team?projectId=${project.id}`}
              className="text-sm font-medium text-neutral-600 underline hover:text-black"
            >
              Управление
            </Link>
          </div>

          {project.members.length === 0 ? (
            <p className="text-sm text-neutral-500">Нет участников</p>
          ) : (
            <ul className="space-y-3">
              {project.members.map((member) => (
                <li
                  key={member.id}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {member.user.name}
                    </p>
                    <p className="truncate text-xs text-neutral-500">
                      {member.user.email}
                    </p>
                    {!member.user.passwordHash ? (
                      <p className="text-xs text-amber-600">
                        Ожидает регистрации
                      </p>
                    ) : null}
                  </div>

                  <span className="shrink-0 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700">
                    {getProjectRoleLabel(member.role)}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {canManageProjectMembers(membership.role) ? (
            <Link
              href={`/team?projectId=${project.id}`}
              className="mt-4 inline-flex text-sm font-medium text-black underline"
            >
              Добавить участника →
            </Link>
          ) : null}
        </div>

        {/* SPRINTS */}
        <div className="rounded-2xl bg-white p-5">

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-medium">
              Последние спринты
            </h2>

            <Link
              href={`/planning?projectId=${project.id}`}
              className="text-sm text-neutral-500 hover:text-black"
            >
              Все
            </Link>
          </div>

          {project.sprints.length === 0 ? (
            <p className="text-sm text-neutral-500">
              Спринтов пока нет
            </p>
          ) : (
            <div className="space-y-2">

              {project.sprints.map((sprint) => (
                <div
                  key={sprint.id}
                  className="rounded-xl bg-neutral-50 px-4 py-3"
                >
                  <p className="text-sm font-medium">
                    {sprint.name}
                  </p>

                  <p className="text-xs text-neutral-400">
                    {sprint.status}
                  </p>
                </div>
              ))}

            </div>
          )}

        </div>

      </section>
    </div>
  );
}
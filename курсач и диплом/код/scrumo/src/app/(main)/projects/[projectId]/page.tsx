import Link from "next/link";
import { notFound } from "next/navigation";

import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/auth";
import { requireProjectMember } from "@/lib/access";
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

  if (!userId) {
    return null;
  }

  const { projectId } = await params;
  await requireProjectMember(projectId, userId);

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
      sprints: {
        orderBy: { createdAt: "desc" },
        take: 3,
      },
      _count: {
        select: {
          tasks: true,
          sprints: true,
          members: true,
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

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
    <section className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <section>
          <section className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
              {project.key}
            </span>
          </section>
          <p className="mt-2 text-neutral-500">
            {project.description || "Без описания"}
          </p>
        </section>

        <section className="flex flex-wrap gap-2">
          <Link
            href={`/board?projectId=${project.id}`}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-black px-4 text-sm font-medium text-white"
          >
            Доска
          </Link>
          <Link
            href={`/projects/${project.id}/tasks`}
            className="inline-flex h-10 items-center justify-center rounded-xl border px-4 text-sm font-medium"
          >
            Задачи
          </Link>
          <Link
            href={`/backlog?projectId=${project.id}`}
            className="inline-flex h-10 items-center justify-center rounded-xl border px-4 text-sm font-medium"
          >
            Бэклог
          </Link>
          <Link
            href={`/planning?projectId=${project.id}`}
            className="inline-flex h-10 items-center justify-center rounded-xl border px-4 text-sm font-medium"
          >
            Планирование
          </Link>
        </section>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Задачи" value={String(project._count.tasks)} />
        <StatCard title="Выполнено" value={String(doneTasks)} />
        <StatCard title="Спринты" value={String(project._count.sprints)} />
        <StatCard
          title="Активный спринт"
          value={activeSprint?.name ?? "—"}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Команда проекта</CardTitle>
          </CardHeader>
          <CardContent>
            {project.members.length === 0 ? (
              <p className="text-sm text-neutral-500">Участников пока нет</p>
            ) : (
              <ul className="space-y-3">
                {project.members.map((member) => (
                  <li
                    key={member.id}
                    className="flex items-center justify-between gap-4 text-sm"
                  >
                    <section>
                      <p className="font-medium">{member.user.name}</p>
                      <p className="text-neutral-500">{member.user.email}</p>
                    </section>
                    <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700">
                      {getProjectRoleLabel(member.role)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Последние спринты</CardTitle>
            <Link
              href={`/planning?projectId=${project.id}`}
              className="text-sm font-medium text-black underline"
            >
              Все
            </Link>
          </CardHeader>
          <CardContent>
            {project.sprints.length === 0 ? (
              <p className="text-sm text-neutral-500">Спринтов пока нет</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {project.sprints.map((sprint) => (
                  <li
                    key={sprint.id}
                    className="rounded-lg border border-neutral-100 px-3 py-2"
                  >
                    <p className="font-medium">{sprint.name}</p>
                    <p className="text-xs text-neutral-500">{sprint.status}</p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>
    </section>
  );
}

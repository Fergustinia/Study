import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectDetailsPage({ params }: Props) {
  const { projectId } = await params;

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
      sprints: true,
      _count: {
        select: {
          tasks: true,
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
            {project.key}
          </span>
        </div>
        <p className="mt-2 text-neutral-500">
          {project.description || "Без описания"}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Задачи</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{project._count.tasks}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Спринты</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{project.sprints.length}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Участники</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{project.members.length}</p>
          </CardContent>
        </Card>
      </div>

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
                  <div>
                    <p className="font-medium">{member.user.name}</p>
                    <p className="text-neutral-500">{member.user.email}</p>
                  </div>
                  <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700">
                    {member.role}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

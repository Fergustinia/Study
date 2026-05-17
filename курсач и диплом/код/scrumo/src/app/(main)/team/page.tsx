import Link from "next/link";

import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUserId } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { getProjectRoleLabel } from "@/types/sprint";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const userId = await requireUserId();

  const memberships = await prisma.projectMember.findMany({
    where: {
      project: {
        members: {
          some: { userId },
        },
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      project: {
        select: {
          id: true,
          name: true,
          key: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const peopleMap = new Map<
    string,
    {
      id: string;
      name: string;
      email: string;
      systemRole: string;
      projects: Array<{
        projectId: string;
        projectName: string;
        projectKey: string;
        role: string;
      }>;
    }
  >();

  for (const membership of memberships) {
    const existing = peopleMap.get(membership.user.id);

    const projectEntry = {
      projectId: membership.project.id,
      projectName: membership.project.name,
      projectKey: membership.project.key,
      role: membership.role,
    };

    if (existing) {
      existing.projects.push(projectEntry);
    } else {
      peopleMap.set(membership.user.id, {
        id: membership.user.id,
        name: membership.user.name,
        email: membership.user.email,
        systemRole: membership.user.role,
        projects: [projectEntry],
      });
    }
  }

  const people = Array.from(peopleMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name, "ru")
  );

  const projectCount = new Set(
    memberships.map((membership) => membership.project.id)
  ).size;

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Команда</h1>
        <p className="text-neutral-500">
          Участники проектов, к которым у вас есть доступ.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <StatCard title="Участников" value={String(people.length)} />
        <StatCard title="Проектов" value={String(projectCount)} />
      </section>

      {people.length === 0 ? (
        <Card className="rounded-2xl border-dashed">
          <CardContent className="py-10 text-center text-sm text-neutral-500">
            В ваших проектах пока нет других участников.
          </CardContent>
        </Card>
      ) : (
        <section className="grid gap-4 lg:grid-cols-2">
          {people.map((person) => (
            <Card key={person.id} className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg">{person.name}</CardTitle>
                <p className="text-sm text-neutral-500">{person.email}</p>
                <p className="text-xs text-neutral-400">
                  Роль в системе: {person.systemRole}
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {person.projects.map((project) => (
                    <li
                      key={`${person.id}-${project.projectId}`}
                      className="flex items-center justify-between gap-3 rounded-lg border border-neutral-100 px-3 py-2 text-sm"
                    >
                      <Link
                        href={`/projects/${project.projectId}`}
                        className="font-medium hover:underline"
                      >
                        {project.projectName}{" "}
                        <span className="text-neutral-400">
                          ({project.projectKey})
                        </span>
                      </Link>
                      <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700">
                        {getProjectRoleLabel(project.role)}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </section>
      )}
    </section>
  );
}

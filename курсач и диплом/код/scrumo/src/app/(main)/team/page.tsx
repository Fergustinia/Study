import Link from "next/link";

import { AddMemberPanel } from "@/components/projects/add-member-panel";
import { ProjectMemberList } from "@/components/projects/project-member-list";
import { EmptyProjectsState } from "@/components/shared/empty-projects-state";
import { ProjectPageSelect } from "@/components/shared/project-page-select";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUserId, requireProjectMember } from "@/lib/access";
import { canManageProjectMembers } from "@/lib/project-members";
import { getProjectsForUser, resolveSelectedProjectId } from "@/lib/projects";
import { prisma } from "@/lib/prisma";
import { getProjectRoleLabel } from "@/types/sprint";

export const dynamic = "force-dynamic";

type TeamPageProps = {
  searchParams?: Promise<{
    projectId?: string;
  }>;
};

export default async function TeamPage({ searchParams }: TeamPageProps) {
  const userId = await requireUserId();
  const resolvedSearchParams = (await searchParams) ?? {};
  const projects = await getProjectsForUser(userId);
  const selectedProjectId = resolveSelectedProjectId(
    projects,
    resolvedSearchParams.projectId
  );

  const selectedProject = projects.find(
    (project) => project.id === selectedProjectId
  );

  let membershipRole: string | null = null;
  let projectMembers: Array<{
    userId: string;
    name: string;
    email: string;
    role: string;
    isPendingInvite: boolean;
  }> = [];

  if (selectedProjectId) {
    const membership = await requireProjectMember(selectedProjectId, userId);
    membershipRole = membership.role;

    const project = await prisma.project.findUnique({
      where: { id: selectedProjectId },
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
          orderBy: { createdAt: "asc" },
        },
      },
    });

    projectMembers =
      project?.members.map((member) => ({
        userId: member.user.id,
        name: member.user.name,
        email: member.user.email,
        role: member.role,
        isPendingInvite: !member.user.passwordHash,
      })) ?? [];
  }

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
    orderBy: { createdAt: "asc" },
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

  for (const member of memberships) {
    const existing = peopleMap.get(member.user.id);

    const projectEntry = {
      projectId: member.project.id,
      projectName: member.project.name,
      projectKey: member.project.key,
      role: member.role,
    };

    if (existing) {
      existing.projects.push(projectEntry);
    } else {
      peopleMap.set(member.user.id, {
        id: member.user.id,
        name: member.user.name,
        email: member.user.email,
        systemRole: member.user.role,
        projects: [projectEntry],
      });
    }
  }

  const people = Array.from(peopleMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name, "ru")
  );

  const canManage =
    membershipRole !== null && canManageProjectMembers(membershipRole);

  return (
    <div className="mx-auto max-w-6xl space-y-8 py-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Команда</h1>
        <p className="text-sm text-neutral-600">
          Управление участниками проекта и обзор команд.
        </p>
      </header>

      {projects.length === 0 ? (
        <EmptyProjectsState
          title="Нет доступных проектов"
          description="Создайте проект, чтобы добавлять участников в команду."
        />
      ) : (
        <>
          <ProjectPageSelect
            projects={projects}
            selectedProjectId={selectedProjectId}
            basePath="/team"
            label="Проект для управления командой"
          />

          {selectedProject ? (
            <Card className="rounded-2xl border-neutral-200 shadow-sm">
              <CardHeader className="space-y-1">
                <CardTitle className="text-lg font-semibold">
                  Команда проекта {selectedProject.name}
                </CardTitle>
                <p className="text-sm text-neutral-500">
                  Добавление участников, смена ролей и удаление — здесь.
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                {canManage ? (
                  <AddMemberPanel
                    projectId={selectedProjectId}
                    canManage={canManage}
                    isOwner={membershipRole === "OWNER"}
                  />
                ) : (
                  <p className="text-xs text-neutral-500">
                    Добавлять участников могут владелец или менеджер проекта.
                  </p>
                )}

                <ProjectMemberList
                  projectId={selectedProjectId}
                  currentUserId={userId}
                  currentUserRole={membershipRole ?? "MEMBER"}
                  canManage={canManage}
                  members={projectMembers}
                />
              </CardContent>
            </Card>
          ) : null}

          <section className="grid gap-4 md:grid-cols-2">
            <StatCard title="Участников" value={String(people.length)} />
            <StatCard
              title="В проекте"
              value={String(projectMembers.length)}
              description={selectedProject ? selectedProject.key : "—"}
            />
          </section>

          <section className="space-y-4">
            <h2 className="text-base font-semibold">Все участники</h2>

            {people.length === 0 ? (
              <Card className="rounded-2xl border-dashed">
                <CardContent className="py-10 text-center text-sm text-neutral-500">
                  Участников пока нет
                </CardContent>
              </Card>
            ) : (
              <section className="grid gap-4 lg:grid-cols-2">
                {people.map((person) => (
                  <Card
                    key={person.id}
                    className="rounded-2xl border-neutral-200 shadow-sm"
                  >
                    <CardHeader className="space-y-1">
                      <CardTitle className="text-lg font-semibold">
                        {person.name}
                      </CardTitle>
                      <p className="text-sm text-neutral-600">{person.email}</p>
                    </CardHeader>

                    <CardContent className="space-y-2">
                      {person.projects.map((project) => (
                        <div
                          key={project.projectId}
                          className="flex items-center justify-between rounded-lg border border-neutral-100 px-3 py-2 text-sm hover:bg-neutral-50"
                        >
                          <Link
                            href={`/team?projectId=${project.projectId}`}
                            className="font-medium text-neutral-900 hover:underline"
                          >
                            {project.projectName}
                            <span className="ml-2 text-xs text-neutral-400">
                              {project.projectKey}
                            </span>
                          </Link>

                          <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700">
                            {getProjectRoleLabel(project.role)}
                          </span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </section>
            )}
          </section>
        </>
      )}
    </div>
  );
}

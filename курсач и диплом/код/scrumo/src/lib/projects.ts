import { prisma } from "@/lib/prisma";

export type ProjectOption = {
  id: string;
  name: string;
  key: string;
};

export async function getProjectsForUser(userId: string): Promise<ProjectOption[]> {
  return prisma.project.findMany({
    where: {
      members: {
        some: { userId },
      },
    },
    select: {
      id: true,
      name: true,
      key: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}

export function resolveSelectedProjectId(
  projects: ProjectOption[],
  requestedId?: string
): string {
  const trimmed = requestedId?.trim();

  if (trimmed && projects.some((project) => project.id === trimmed)) {
    return trimmed;
  }

  return projects[0]?.id ?? "";
}

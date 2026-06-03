import { prisma } from "@/lib/prisma";

export type ProjectMemberUser = {
  id: string;
  name: string;
  email: string;
};

export async function getProjectMemberUsers(
  projectId: string
): Promise<ProjectMemberUser[]> {
  const members = await prisma.projectMember.findMany({
    where: { projectId },
    select: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      user: { name: "asc" },
    },
  });

  return members.map((member) => member.user);
}

export function canManageProjectMembers(role: string): boolean {
  return role === "OWNER" || role === "MANAGER";
}

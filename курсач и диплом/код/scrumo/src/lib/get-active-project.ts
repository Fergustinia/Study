import { cache } from "react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const getActiveProject = cache(async () => {
  const session = await auth();
  if (!session?.user?.id) return null;

  const project = await prisma.project.findFirst({
    where: {
      members: {
        some: { userId: session.user.id },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return project;
});
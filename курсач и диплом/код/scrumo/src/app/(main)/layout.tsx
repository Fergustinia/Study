import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AppShell } from "@/components/layout/app-shell";
import { SignOutButton } from "@/components/layout/sign-out-button";
import { ProjectProvider } from "@/contexts/project-context";
import { prisma } from "@/lib/prisma";

type Props = {
  children: ReactNode;
};

export default async function MainLayout({ children }: Props) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const projects = await prisma.project.findMany({
    where: {
      members: {
        some: { userId: session.user.id },
      },
    },
    select: {
      id: true,
      name: true,
      key: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const initialProject = projects[0] ?? null;

  return (
    <ProjectProvider initialProject={initialProject} projects={projects}>
      <AppShell
        projects={projects}
        user={session.user}
        signOutButton={<SignOutButton />}
      >
        {children}
      </AppShell>
    </ProjectProvider>
  );
}

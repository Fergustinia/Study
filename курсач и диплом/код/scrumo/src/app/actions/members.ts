"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canManageProjectMembers } from "@/lib/project-members";

export type UserSearchResult = {
  id: string;
  name: string;
  email: string;
};

export type MemberActionResult =
  | { success: true; message?: string }
  | { success: false; error: string };

export type SearchUsersResult =
  | { success: true; users: UserSearchResult[] }
  | { success: false; error: string };

const searchSchema = z.object({
  projectId: z.string().min(1),
  query: z.string().trim().min(2, "Введите минимум 2 символа.").max(100),
});

const addMemberSchema = z.object({
  projectId: z.string().min(1),
  userId: z.string().min(1),
  role: z.enum(["MEMBER", "MANAGER", "VIEWER"]).default("MEMBER"),
});

const inviteSchema = z.object({
  projectId: z.string().min(1),
  email: z.string().trim().email("Некорректный email."),
  role: z.enum(["MEMBER", "MANAGER", "VIEWER"]).default("MEMBER"),
});

const updateRoleSchema = z.object({
  projectId: z.string().min(1),
  memberUserId: z.string().min(1),
  role: z.enum(["MEMBER", "MANAGER", "VIEWER"]),
});

const removeMemberSchema = z.object({
  projectId: z.string().min(1),
  memberUserId: z.string().min(1),
});

type ProjectRole = "OWNER" | "MANAGER" | "MEMBER" | "VIEWER";

async function getMembership(projectId: string, userId: string) {
  return prisma.projectMember.findUnique({
    where: {
      userId_projectId: { userId, projectId },
    },
    select: { id: true, role: true },
  });
}

function revalidateMemberPaths(projectId: string) {
  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/team");
  revalidatePath(`/team?projectId=${projectId}`);
  revalidatePath(`/projects/${projectId}/tasks`);
  revalidatePath(`/projects/${projectId}/tasks/new`);
}

function assertCanManage(actorRole: ProjectRole) {
  if (!canManageProjectMembers(actorRole)) {
    return "Недостаточно прав для управления командой.";
  }
  return null;
}

function canEditTargetRole(actorRole: ProjectRole, targetRole: ProjectRole) {
  if (targetRole === "OWNER") return false;
  if (actorRole === "OWNER") return true;
  if (actorRole === "MANAGER") {
    return targetRole === "MEMBER" || targetRole === "VIEWER";
  }
  return false;
}

function canRemoveTarget(actorRole: ProjectRole, targetRole: ProjectRole) {
  if (targetRole === "OWNER") return false;
  if (actorRole === "OWNER") return true;
  if (actorRole === "MANAGER") {
    return targetRole === "MEMBER" || targetRole === "VIEWER";
  }
  return false;
}

function nameFromEmail(email: string) {
  const local = email.split("@")[0] ?? "user";
  return local.replace(/[._-]+/g, " ").trim() || "Новый пользователь";
}

export async function searchUsersForProject(
  projectId: string,
  query: string
): Promise<SearchUsersResult> {
  const session = await auth();
  const currentUserId = session?.user?.id;

  if (!currentUserId) {
    return { success: false, error: "Требуется авторизация." };
  }

  const parsed = searchSchema.safeParse({ projectId, query });

  if (!parsed.success) {
    return {
      success: false,
      error:
        parsed.error.flatten().fieldErrors.query?.[0] ?? "Некорректный запрос.",
    };
  }

  const membership = await getMembership(projectId, currentUserId);

  if (!membership) {
    return { success: false, error: "Нет доступа к проекту." };
  }

  const manageError = assertCanManage(membership.role);
  if (manageError) {
    return { success: false, error: manageError };
  }

  const existingMemberIds = await prisma.projectMember.findMany({
    where: { projectId },
    select: { userId: true },
  });

  const excludeIds = existingMemberIds.map((member) => member.userId);

  const users = await prisma.user.findMany({
    where: {
      id: { notIn: excludeIds },
      OR: [
        { name: { contains: parsed.data.query, mode: "insensitive" } },
        { email: { contains: parsed.data.query, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
    orderBy: [{ name: "asc" }, { email: "asc" }],
    take: 8,
  });

  return { success: true, users };
}

export async function addProjectMember(
  projectId: string,
  userId: string,
  role: "MEMBER" | "MANAGER" | "VIEWER" = "MEMBER"
): Promise<MemberActionResult> {
  const session = await auth();
  const currentUserId = session?.user?.id;

  if (!currentUserId) {
    return { success: false, error: "Требуется авторизация." };
  }

  const parsed = addMemberSchema.safeParse({ projectId, userId, role });

  if (!parsed.success) {
    return { success: false, error: "Некорректные данные." };
  }

  const membership = await getMembership(projectId, currentUserId);

  if (!membership) {
    return { success: false, error: "Нет доступа к проекту." };
  }

  const manageError = assertCanManage(membership.role);
  if (manageError) {
    return { success: false, error: manageError };
  }

  if (parsed.data.role === "MANAGER" && membership.role !== "OWNER") {
    return { success: false, error: "Назначать менеджеров может только владелец." };
  }

  const user = await prisma.user.findUnique({
    where: { id: parsed.data.userId },
    select: { id: true },
  });

  if (!user) {
    return { success: false, error: "Пользователь не найден." };
  }

  const existing = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId: parsed.data.userId,
        projectId: parsed.data.projectId,
      },
    },
    select: { id: true },
  });

  if (existing) {
    return { success: false, error: "Пользователь уже в команде проекта." };
  }

  await prisma.projectMember.create({
    data: {
      projectId: parsed.data.projectId,
      userId: parsed.data.userId,
      role: parsed.data.role,
    },
  });

  revalidateMemberPaths(projectId);

  return { success: true, message: "Участник добавлен." };
}

export async function inviteUserByEmail(
  projectId: string,
  email: string,
  role: "MEMBER" | "MANAGER" | "VIEWER" = "MEMBER"
): Promise<MemberActionResult> {
  const session = await auth();
  const currentUserId = session?.user?.id;

  if (!currentUserId) {
    return { success: false, error: "Требуется авторизация." };
  }

  const parsed = inviteSchema.safeParse({
    projectId,
    email: email.toLowerCase(),
    role,
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.flatten().fieldErrors.email?.[0] ?? "Некорректный email.",
    };
  }

  const membership = await getMembership(projectId, currentUserId);

  if (!membership) {
    return { success: false, error: "Нет доступа к проекту." };
  }

  const manageError = assertCanManage(membership.role);
  if (manageError) {
    return { success: false, error: manageError };
  }

  if (parsed.data.role === "MANAGER" && membership.role !== "OWNER") {
    return { success: false, error: "Назначать менеджеров может только владелец." };
  }

  let user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: { id: true, passwordHash: true },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: parsed.data.email,
        name: nameFromEmail(parsed.data.email),
        role: "MEMBER",
        passwordHash: null,
      },
      select: { id: true, passwordHash: true },
    });
  }

  const existingMember = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId: user.id,
        projectId: parsed.data.projectId,
      },
    },
    select: { id: true },
  });

  if (existingMember) {
    return { success: false, error: "Пользователь уже в команде проекта." };
  }

  await prisma.projectMember.create({
    data: {
      projectId: parsed.data.projectId,
      userId: user.id,
      role: parsed.data.role,
    },
  });

  revalidateMemberPaths(projectId);

  if (!user.passwordHash) {
    return {
      success: true,
      message:
        "Приглашение отправлено. Пользователь сможет зарегистрироваться по этому email и получить доступ.",
    };
  }

  return {
    success: true,
    message: "Пользователь добавлен в команду проекта.",
  };
}

export async function updateProjectMemberRole(
  projectId: string,
  memberUserId: string,
  role: "MEMBER" | "MANAGER" | "VIEWER"
): Promise<MemberActionResult> {
  const session = await auth();
  const currentUserId = session?.user?.id;

  if (!currentUserId) {
    return { success: false, error: "Требуется авторизация." };
  }

  const parsed = updateRoleSchema.safeParse({ projectId, memberUserId, role });

  if (!parsed.success) {
    return { success: false, error: "Некорректные данные." };
  }

  const actorMembership = await getMembership(projectId, currentUserId);

  if (!actorMembership) {
    return { success: false, error: "Нет доступа к проекту." };
  }

  const manageError = assertCanManage(actorMembership.role);
  if (manageError) {
    return { success: false, error: manageError };
  }

  const targetMembership = await getMembership(
    parsed.data.projectId,
    parsed.data.memberUserId
  );

  if (!targetMembership) {
    return { success: false, error: "Участник не найден в проекте." };
  }

  if (!canEditTargetRole(actorMembership.role, targetMembership.role)) {
    return { success: false, error: "Нельзя изменить роль этого участника." };
  }

  if (parsed.data.role === "MANAGER" && actorMembership.role !== "OWNER") {
    return { success: false, error: "Назначать менеджеров может только владелец." };
  }

  await prisma.projectMember.update({
    where: { id: targetMembership.id },
    data: { role: parsed.data.role },
  });

  revalidateMemberPaths(projectId);

  return { success: true, message: "Роль обновлена." };
}

export async function removeProjectMember(
  projectId: string,
  memberUserId: string
): Promise<MemberActionResult> {
  const session = await auth();
  const currentUserId = session?.user?.id;

  if (!currentUserId) {
    return { success: false, error: "Требуется авторизация." };
  }

  const parsed = removeMemberSchema.safeParse({ projectId, memberUserId });

  if (!parsed.success) {
    return { success: false, error: "Некорректные данные." };
  }

  const actorMembership = await getMembership(projectId, currentUserId);

  if (!actorMembership) {
    return { success: false, error: "Нет доступа к проекту." };
  }

  const manageError = assertCanManage(actorMembership.role);
  if (manageError) {
    return { success: false, error: manageError };
  }

  const targetMembership = await getMembership(
    parsed.data.projectId,
    parsed.data.memberUserId
  );

  if (!targetMembership) {
    return { success: false, error: "Участник не найден в проекте." };
  }

  if (!canRemoveTarget(actorMembership.role, targetMembership.role)) {
    return { success: false, error: "Нельзя удалить этого участника." };
  }

  await prisma.projectMember.delete({
    where: { id: targetMembership.id },
  });

  revalidateMemberPaths(projectId);

  return { success: true, message: "Участник удалён из проекта." };
}

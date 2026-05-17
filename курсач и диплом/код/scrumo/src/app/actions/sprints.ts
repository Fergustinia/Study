"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SPRINT_STATUSES, type SprintStatus } from "@/types/sprint";

export type CreateSprintState = {
  errors?: {
    name?: string[];
    goal?: string[];
    startDate?: string[];
    endDate?: string[];
    capacity?: string[];
    projectId?: string[];
    _form?: string[];
  };
  success?: boolean;
};

const createSprintSchema = z.object({
  projectId: z.string().min(1),
  name: z
    .string()
    .min(1, "Название спринта обязательно.")
    .max(120, "Название слишком длинное."),
  goal: z.string().max(2000).optional().or(z.literal("")),
  startDate: z.union([z.literal(""), z.string().date()]).optional(),
  endDate: z.union([z.literal(""), z.string().date()]).optional(),
  capacity: z
    .union([z.literal(""), z.coerce.number().int().min(1).max(999)])
    .optional(),
});

async function assertProjectAccess(projectId: string, userId: string) {
  const membership = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId,
        projectId,
      },
    },
    select: { id: true },
  });

  return Boolean(membership);
}

function revalidateProjectViews(projectId: string) {
  revalidatePath("/planning");
  revalidatePath("/backlog");
  revalidatePath("/board");
  revalidatePath("/analytics");
  revalidatePath(`/projects/${projectId}`);
  revalidatePath(`/projects/${projectId}/tasks`);
}

export async function createSprint(
  _prevState: CreateSprintState,
  formData: FormData
): Promise<CreateSprintState> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { errors: { _form: ["Требуется авторизация."] } };
  }

  const validated = createSprintSchema.safeParse({
    projectId: formData.get("projectId"),
    name: formData.get("name"),
    goal: formData.get("goal"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    capacity: formData.get("capacity"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const data = validated.data;

  if (!(await assertProjectAccess(data.projectId, userId))) {
    return { errors: { _form: ["Нет доступа к проекту."] } };
  }

  await prisma.sprint.create({
    data: {
      projectId: data.projectId,
      name: data.name.trim(),
      goal: data.goal?.trim() || null,
      startDate:
        data.startDate && data.startDate !== ""
          ? new Date(`${data.startDate}T00:00:00`)
          : null,
      endDate:
        data.endDate && data.endDate !== ""
          ? new Date(`${data.endDate}T00:00:00`)
          : null,
      capacity:
        data.capacity === "" || data.capacity === undefined
          ? null
          : Number(data.capacity),
    },
  });

  revalidateProjectViews(data.projectId);

  return { success: true };
}

export type SprintActionResult =
  | { success: true }
  | { success: false; error: string };

export async function updateSprintStatus(
  sprintId: string,
  status: SprintStatus
): Promise<SprintActionResult> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { success: false, error: "Требуется авторизация." };
  }

  if (!SPRINT_STATUSES.includes(status)) {
    return { success: false, error: "Некорректный статус спринта." };
  }

  const sprint = await prisma.sprint.findUnique({
    where: { id: sprintId },
    select: {
      id: true,
      projectId: true,
      project: {
        select: {
          members: {
            where: { userId },
            select: { id: true },
          },
        },
      },
    },
  });

  if (!sprint) {
    return { success: false, error: "Спринт не найден." };
  }

  if (sprint.project.members.length === 0) {
    return { success: false, error: "Нет доступа к проекту." };
  }

  if (status === "ACTIVE") {
    await prisma.$transaction([
      prisma.sprint.updateMany({
        where: {
          projectId: sprint.projectId,
          status: "ACTIVE",
          NOT: { id: sprintId },
        },
        data: { status: "PLANNED" },
      }),
      prisma.sprint.update({
        where: { id: sprintId },
        data: { status: "ACTIVE" },
      }),
    ]);
  } else {
    await prisma.sprint.update({
      where: { id: sprintId },
      data: { status },
    });
  }

  revalidateProjectViews(sprint.projectId);

  return { success: true };
}

export async function assignTaskToSprint(
  taskId: string,
  sprintId: string
): Promise<SprintActionResult> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { success: false, error: "Требуется авторизация." };
  }

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: {
      id: true,
      projectId: true,
      project: {
        select: {
          members: {
            where: { userId },
            select: { id: true },
          },
        },
      },
    },
  });

  if (!task) {
    return { success: false, error: "Задача не найдена." };
  }

  if (task.project.members.length === 0) {
    return { success: false, error: "Нет доступа к проекту." };
  }

  if (sprintId) {
    const sprint = await prisma.sprint.findFirst({
      where: {
        id: sprintId,
        projectId: task.projectId,
      },
      select: { id: true },
    });

    if (!sprint) {
      return { success: false, error: "Спринт не найден в этом проекте." };
    }
  }

  await prisma.task.update({
    where: { id: taskId },
    data: {
      sprintId: sprintId || null,
    },
  });

  revalidateProjectViews(task.projectId);
  revalidatePath("/backlog");

  return { success: true };
}

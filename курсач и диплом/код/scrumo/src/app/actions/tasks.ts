"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TASK_STATUSES, type TaskStatus } from "@/types/task";

export type CreateTaskFormState = {
  errors?: {
    title?: string[];
    description?: string[];
    status?: string[];
    priority?: string[];
    storyPoints?: string[];
    deadline?: string[];
    assigneeId?: string[];
    sprintId?: string[];
    projectId?: string[];
    _form?: string[];
  };
};

export type UpdateTaskFormState = CreateTaskFormState;

const taskStatusValues = ["TODO", "IN_PROGRESS", "REVIEW", "TESTING", "DONE"] as const;
const taskPriorityValues = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;

const createTaskSchema = z.object({
  projectId: z.string().min(1, "Project id is required."),
  title: z
    .string()
    .min(1, "Название задачи обязательно.")
    .max(200, "Название слишком длинное."),
  description: z
    .string()
    .max(5000, "Описание слишком длинное.")
    .optional()
    .or(z.literal("")),
  status: z.enum(taskStatusValues),
  priority: z.enum(taskPriorityValues),
  storyPoints: z
    .union([z.literal(""), z.coerce.number().int().min(0).max(999)])
    .optional(),
  deadline: z.union([z.literal(""), z.string().date()]).optional(),
  assigneeId: z.string().optional().or(z.literal("")),
  sprintId: z.string().optional().or(z.literal("")),
});

const updateTaskSchema = createTaskSchema.extend({
  taskId: z.string().min(1, "Task id is required."),
});

async function assertProjectMembership(projectId: string, userId: string) {
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

async function assertAssigneeIsProjectMember(
  projectId: string,
  assigneeId: string
) {
  const membership = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId: assigneeId,
        projectId,
      },
    },
    select: { id: true },
  });

  return Boolean(membership);
}

function revalidateTaskViews(projectId: string) {
  revalidatePath(`/projects/${projectId}`);
  revalidatePath(`/projects/${projectId}/tasks`);
  revalidatePath("/projects");
  revalidatePath("/board");
  revalidatePath("/backlog");
  revalidatePath("/planning");
  revalidatePath("/analytics");
  revalidatePath("/dashboard");
}

export async function createTask(
  _prevState: CreateTaskFormState,
  formData: FormData
): Promise<CreateTaskFormState> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { errors: { _form: ["Требуется авторизация."] } };
  }

  const validatedFields = createTaskSchema.safeParse({
    projectId: formData.get("projectId"),
    title: formData.get("title"),
    description: formData.get("description"),
    status: formData.get("status"),
    priority: formData.get("priority"),
    storyPoints: formData.get("storyPoints"),
    deadline: formData.get("deadline"),
    assigneeId: formData.get("assigneeId"),
    sprintId: formData.get("sprintId"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const data = validatedFields.data;

  const project = await prisma.project.findUnique({
    where: {
      id: data.projectId,
    },
    select: {
      id: true,
    },
  });

  if (!project) {
    return {
      errors: {
        _form: ["Проект не найден."],
      },
    };
  }

  if (!(await assertProjectMembership(data.projectId, userId))) {
    return {
      errors: {
        _form: ["Нет доступа к проекту."],
      },
    };
  }

  if (data.assigneeId) {
    const isMember = await assertAssigneeIsProjectMember(
      data.projectId,
      data.assigneeId
    );

    if (!isMember) {
      return {
        errors: {
          assigneeId: ["Исполнитель должен быть участником проекта."],
        },
      };
    }
  }

  if (data.sprintId) {
    const sprint = await prisma.sprint.findFirst({
      where: {
        id: data.sprintId,
        projectId: data.projectId,
      },
      select: {
        id: true,
      },
    });

    if (!sprint) {
      return {
        errors: {
          sprintId: ["Выбранный спринт не принадлежит проекту."],
        },
      };
    }
  }

  await prisma.task.create({
    data: {
      projectId: data.projectId,
      title: data.title.trim(),
      description: data.description?.trim() || null,
      status: data.status,
      priority: data.priority,
      storyPoints:
        data.storyPoints === "" || data.storyPoints === undefined
          ? undefined
          : Number(data.storyPoints),
      deadline:
        data.deadline && data.deadline !== ""
          ? new Date(`${data.deadline}T00:00:00`)
          : null,
      assigneeId: data.assigneeId || null,
      sprintId: data.sprintId || null,
    },
  });

  revalidateTaskViews(data.projectId);
  redirect(`/projects/${data.projectId}`);
}

export async function updateTask(
  _prevState: UpdateTaskFormState,
  formData: FormData
): Promise<UpdateTaskFormState> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { errors: { _form: ["Требуется авторизация."] } };
  }

  const validatedFields = updateTaskSchema.safeParse({
    taskId: formData.get("taskId"),
    projectId: formData.get("projectId"),
    title: formData.get("title"),
    description: formData.get("description"),
    status: formData.get("status"),
    priority: formData.get("priority"),
    storyPoints: formData.get("storyPoints"),
    deadline: formData.get("deadline"),
    assigneeId: formData.get("assigneeId"),
    sprintId: formData.get("sprintId"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const data = validatedFields.data;

  const task = await prisma.task.findFirst({
    where: {
      id: data.taskId,
      projectId: data.projectId,
    },
    select: {
      id: true,
    },
  });

  if (!task) {
    return {
      errors: {
        _form: ["Задача не найдена в этом проекте."],
      },
    };
  }

  if (!(await assertProjectMembership(data.projectId, userId))) {
    return {
      errors: {
        _form: ["Нет доступа к проекту."],
      },
    };
  }

  if (data.assigneeId) {
    const isMember = await assertAssigneeIsProjectMember(
      data.projectId,
      data.assigneeId
    );

    if (!isMember) {
      return {
        errors: {
          assigneeId: ["Исполнитель должен быть участником проекта."],
        },
      };
    }
  }

  if (data.sprintId) {
    const sprint = await prisma.sprint.findFirst({
      where: {
        id: data.sprintId,
        projectId: data.projectId,
      },
      select: {
        id: true,
      },
    });

    if (!sprint) {
      return {
        errors: {
          sprintId: ["Выбранный спринт не принадлежит проекту."],
        },
      };
    }
  }

  await prisma.task.update({
    where: {
      id: data.taskId,
    },
    data: {
      title: data.title.trim(),
      description: data.description?.trim() || null,
      status: data.status,
      priority: data.priority,
      storyPoints:
        data.storyPoints === "" || data.storyPoints === undefined
          ? undefined
          : Number(data.storyPoints),
      deadline:
        data.deadline && data.deadline !== ""
          ? new Date(`${data.deadline}T00:00:00`)
          : null,
      assigneeId: data.assigneeId || null,
      sprintId: data.sprintId || null,
    },
  });

  revalidateTaskViews(data.projectId);
  redirect(`/projects/${data.projectId}/tasks`);
}

export type UpdateTaskStatusResult =
  | { success: true }
  | { success: false; error: string };

export async function updateTaskStatus(
  taskId: string,
  status: TaskStatus
): Promise<UpdateTaskStatusResult> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { success: false, error: "Требуется авторизация." };
  }

  if (!TASK_STATUSES.includes(status)) {
    return { success: false, error: "Некорректный статус." };
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

  await prisma.task.update({
    where: { id: taskId },
    data: { status },
  });

  revalidateTaskViews(task.projectId);

  return { success: true };
}
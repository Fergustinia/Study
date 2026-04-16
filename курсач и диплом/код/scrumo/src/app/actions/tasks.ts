"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

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

export async function createTask(
  _prevState: CreateTaskFormState,
  formData: FormData
): Promise<CreateTaskFormState> {
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

  if (data.assigneeId) {
    const assignee = await prisma.user.findUnique({
      where: {
        id: data.assigneeId,
      },
      select: {
        id: true,
      },
    });

    if (!assignee) {
      return {
        errors: {
          assigneeId: ["Выбранный исполнитель не найден."],
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

  revalidatePath(`/projects/${data.projectId}`);
  revalidatePath("/projects");
  redirect(`/projects/${data.projectId}`);
}
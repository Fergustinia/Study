"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const createProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Название должно быть не короче 2 символов")
    .max(100, "Название слишком длинное"),

  key: z
    .string()
    .trim()
    .min(2, "Ключ должен быть не короче 2 символов")
    .max(12, "Ключ должен быть не длиннее 12 символов")
    .regex(/^[A-Z0-9_-]+$/, "Ключ может содержать только A-Z, 0-9, _ и -"),

  description: z
    .string()
    .trim()
    .max(500, "Описание слишком длинное")
    .optional()
    .or(z.literal("")),
});

export type CreateProjectState = {
  success: boolean;
  message?: string;
  errors?: {
    name?: string[];
    key?: string[];
    description?: string[];
    form?: string[];
  };
};

export async function createProject(
  _prevState: CreateProjectState,
  formData: FormData
): Promise<CreateProjectState> {
  const parsed = createProjectSchema.safeParse({
    name: formData.get("name"),
    key: typeof formData.get("key") === "string"
      ? String(formData.get("key")).toUpperCase()
      : "",
    description: formData.get("description"),
  });

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, key, description } = parsed.data;

  const session = await auth();
  if (!session?.user?.id) {
    return {
      success: false,
      errors: {
        form: ["Необходимо войти в систему"],
      },
    };
  }

  const existingProject = await prisma.project.findUnique({
    where: { key },
    select: { id: true },
  });

  if (existingProject) {
    return {
      success: false,
      errors: {
        key: ["Проект с таким ключом уже существует"],
      },
    };
  }

  try {
    await prisma.project.create({
      data: {
        name,
        key,
        description: description || null,
        members: {
          create: {
            userId: session.user.id,
            role: "OWNER",
          },
        },
      },
    });

    revalidatePath("/projects");

    return {
      success: true,
      message: "Проект успешно создан",
    };
  } catch (error) {
    console.error("createProject error:", error);

    return {
      success: false,
      errors: {
        form: ["Не удалось создать проект"],
      },
    };
  }
}
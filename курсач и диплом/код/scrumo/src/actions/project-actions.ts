"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function createProject(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Необходимо войти в систему");
  }

  const name = String(formData.get("name") ?? "").trim();
  const key = String(formData.get("key") ?? "")
    .trim()
    .toUpperCase();
  const description = String(formData.get("description") ?? "").trim();

  if (!name || !key) {
    throw new Error("Название и ключ проекта обязательны");
  }

  if (key.length < 2 || key.length > 12) {
    throw new Error("Ключ должен быть от 2 до 12 символов");
  }

  if (!/^[A-Z0-9_-]+$/.test(key)) {
    throw new Error("Ключ может содержать только A-Z, 0-9, _ и -");
  }

  const existingProject = await prisma.project.findUnique({
    where: { key },
  });

  if (existingProject) {
    throw new Error("Проект с таким ключом уже существует");
  }

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
}

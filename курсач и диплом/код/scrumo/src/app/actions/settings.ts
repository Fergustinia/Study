"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type UpdateProfileState = {
  errors?: {
    name?: string[];
    _form?: string[];
  };
  success?: boolean;
};

const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Имя должно быть не короче 2 символов.")
    .max(80, "Имя слишком длинное."),
});

export async function updateProfile(
  _prevState: UpdateProfileState,
  formData: FormData
): Promise<UpdateProfileState> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { errors: { _form: ["Требуется авторизация."] } };
  }

  const validated = updateProfileSchema.safeParse({
    name: formData.get("name"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      name: validated.data.name.trim(),
    },
  });

  revalidatePath("/setting");
  revalidatePath("/team");
  revalidatePath("/dashboard");

  return { success: true };
}

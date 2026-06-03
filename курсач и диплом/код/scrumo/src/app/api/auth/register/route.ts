import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("REGISTER BODY:", body);

    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "").trim();

    if (!name || !email || !password) {
      console.log("REGISTER FAIL: empty fields");
      return NextResponse.json(
        { error: "Все поля обязательны" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    console.log("EXISTING USER:", existingUser ? { id: existingUser.id, hasPassword: Boolean(existingUser.passwordHash) } : null);

    if (existingUser?.passwordHash) {
      return NextResponse.json(
        { error: "Пользователь с таким email уже существует" },
        { status: 409 }
      );
    }

    const passwordHash = await hash(password, 10);

    const user = existingUser
      ? await prisma.user.update({
          where: { email },
          data: {
            name,
            passwordHash,
          },
        })
      : await prisma.user.create({
          data: {
            name,
            email,
            passwordHash,
            role: "MEMBER",
          },
        });

    console.log("USER CREATED:", user);

    const allUsers = await prisma.user.findMany();
    console.log("ALL USERS AFTER CREATE:", allUsers);

    return NextResponse.json(
      {
        message: existingUser
          ? "Регистрация завершена. Можно войти в систему."
          : "Пользователь успешно создан",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: existingUser ? 200 : 201 }
    );
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown server error",
      },
      { status: 500 }
    );
  }
}
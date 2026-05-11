import "dotenv/config";
import { PrismaClient, ProjectStatus, SprintStatus, TaskPriority, TaskStatus, UserRole } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new Pool({ connectionString, max: 5 });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  await prisma.comment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.sprint.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "Алексей Смирнов",
        email: "alexey@scrumo.dev",
        role: UserRole.MANAGER,
      },
    }),
    prisma.user.create({
      data: {
        name: "Мария Иванова",
        email: "maria@scrumo.dev",
        role: UserRole.MEMBER,
      },
    }),
    prisma.user.create({
      data: {
        name: "Игорь Петров",
        email: "igor@scrumo.dev",
        role: UserRole.MEMBER,
      },
    }),
  ]);

  const [manager, member1, member2] = users;

  const websiteProject = await prisma.project.create({
    data: {
      name: "Scrumo Website",
      key: "SCR-WEB",
      description: "Маркетинговый сайт и лендинг платформы Scrumo.",
      status: ProjectStatus.ACTIVE,
    },
  });

  const appProject = await prisma.project.create({
    data: {
      name: "Scrumo App",
      key: "SCR-APP",
      description: "Основное dashboard-приложение для управления проектами и спринтами.",
      status: ProjectStatus.ACTIVE,
    },
  });

  const mobileProject = await prisma.project.create({
    data: {
      name: "Scrumo Mobile",
      key: "SCR-MOB",
      description: "Мобильная версия сервиса для команды и менеджеров.",
      status: ProjectStatus.ARCHIVED,
    },
  });

  const sprint24 = await prisma.sprint.create({
    data: {
      name: "Sprint 24",
      goal: "Собрать базовый модуль управления проектами",
      status: SprintStatus.ACTIVE,
      startDate: new Date("2026-03-20T09:00:00.000Z"),
      endDate: new Date("2026-04-03T18:00:00.000Z"),
      capacity: 32,
      projectId: appProject.id,
    },
  });

  await prisma.task.createMany({
    data: [
      {
        title: "Сделать Projects page",
        description: "Вывести список проектов в виде карточек.",
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        storyPoints: 5,
        deadline: new Date("2026-03-26T18:00:00.000Z"),
        projectId: appProject.id,
        sprintId: sprint24.id,
        assigneeId: manager.id,
      },
      {
        title: "Добавить API /api/projects",
        description: "Сделать получение списка проектов через Prisma.",
        status: TaskStatus.DONE,
        priority: TaskPriority.MEDIUM,
        storyPoints: 3,
        projectId: appProject.id,
        sprintId: sprint24.id,
        assigneeId: member1.id,
      },
      {
        title: "Подготовить лендинг",
        description: "Сделать hero section и преимущества сервиса.",
        status: TaskStatus.TODO,
        priority: TaskPriority.HIGH,
        storyPoints: 8,
        projectId: websiteProject.id,
        assigneeId: member2.id,
      },
      {
        title: "Архив мобильного MVP",
        description: "Собрать итоги старой мобильной версии.",
        status: TaskStatus.TESTING,
        priority: TaskPriority.LOW,
        storyPoints: 2,
        projectId: mobileProject.id,
        assigneeId: member2.id,
      },
    ],
  });

  console.log("Seed completed successfully");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (error) => {
    console.error("Seed failed:", error);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
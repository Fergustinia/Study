import dotenv from "dotenv";
dotenv.config();

import { getPrisma, disconnectPrisma } from "../../src/lib/prisma";

const prisma = getPrisma();

describe("Integration: Tasks", () => {

  beforeAll(async () => {
    await prisma.task.deleteMany();
    await prisma.project.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test("should create task linked to project", async () => {

    const project = await prisma.project.create({
      data: {
        name: "Project A",
        key: "PRJ-A"
      }
    });

    const task = await prisma.task.create({
      data: {
        title: "Test Task",
        projectId: project.id,
        status: "TODO"
      }
    });

    expect(task.projectId).toBe(project.id);
    expect(task.status).toBe("TODO");
  });

});
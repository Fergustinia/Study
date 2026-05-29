import dotenv from "dotenv";
dotenv.config();

import { getPrisma } from "../../src/lib/prisma";

const prisma = getPrisma();

describe("Integration: Projects", () => {

  beforeAll(async () => {
    await prisma.task.deleteMany();
    await prisma.project.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test("should create project", async () => {
    const project = await prisma.project.create({
      data: {
        name: "Project A",
        key: "PRJ-A"
      }
    });

    expect(project.name).toBe("Project A");
    expect(project.key).toBe("PRJ-A");
  });

  test("should add member to project", async () => {
    const project = await prisma.project.create({
      data: {
        name: "Project B",
        key: "PRJ-B"
      }
    });

    const updated = await prisma.project.update({
      where: { id: project.id },
      data: {
        members: {
          connect: { id: "some-user-id" } // если есть user в БД
        }
      }
    });

    expect(updated.id).toBe(project.id);
  });

});
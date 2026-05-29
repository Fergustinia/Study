import dotenv from "dotenv";
dotenv.config();

import { getPrisma } from "../../src/lib/prisma";
import { SprintStatus } from "@prisma/client";

const prisma = getPrisma();

describe("Integration: Sprints", () => {

  beforeAll(async () => {
    await prisma.task.deleteMany();
    await prisma.project.deleteMany();
    await prisma.sprint.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test("should create sprint", async () => {

    const project = await prisma.project.create({
      data: {
        name: "Project A",
        key: `PRJ-${Date.now()}`
      }
    });
  
    const sprint = await prisma.sprint.create({
      data: {
        name: "Sprint 1",
        projectId: project.id,
        status: "PLANNED"
      }
    });
  
    expect(sprint.projectId).toBe(project.id);
    expect(sprint.status).toBe("PLANNED");
  });

});
import dotenv from "dotenv";
dotenv.config();

import { getPrisma } from "../../src/lib/prisma";

const prisma = getPrisma();

describe("Integration: Users", () => {

  beforeAll(async () => {
    await prisma.task.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test("should create user", async () => {
    const user = await prisma.user.create({
      data: {
        email: "test@mail.com",
        name: "Test User"
      }
    });

    expect(user.email).toBe("test@mail.com");
  });

});
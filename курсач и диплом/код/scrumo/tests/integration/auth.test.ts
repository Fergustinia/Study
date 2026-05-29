import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

import { getPrisma } from "../../src/lib/prisma";

const prisma = getPrisma();

describe("Integration: Auth", () => {

  beforeAll(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test("should validate password", async () => {
    const password = "123456";

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: "Test User",
        email: "auth@test.com",
        passwordHash: hash
      }
    });

    const isValid = await bcrypt.compare(password, user.passwordHash ?? "");

    expect(isValid).toBe(true);
  });

});
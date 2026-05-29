import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

let prisma: PrismaClient | null = null;
let pool: Pool | null = null;

export function getPrisma() {
  if (prisma) return prisma;

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  pool = new Pool({
    connectionString,
    max: 10,
  });

  const adapter = new PrismaPg(pool);

  prisma = new PrismaClient({
    adapter,
  });

  return prisma;
}

// optional cleanup for tests
export async function disconnectPrisma() {
  if (pool) {
    await pool.end();
    pool = null;
  }
  prisma = null;
}
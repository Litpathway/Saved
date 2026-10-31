import { PrismaClient } from "@prisma/client";
import { databaseConnectionOptions } from "./database-config";
import { PrismaPg } from "@prisma/adapter-pg";
const globalDb = globalThis as unknown as { prisma?: PrismaClient };
export const db =
  globalDb.prisma ??
  new PrismaClient({
    adapter: new PrismaPg(databaseConnectionOptions()),
  });
if (process.env.NODE_ENV !== "production") globalDb.prisma = db;

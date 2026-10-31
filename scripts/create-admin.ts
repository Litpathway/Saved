import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";
const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});
async function main() {
  const email = process.env.ADMIN_SETUP_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_SETUP_PASSWORD;
  if (!email || !password || password.length < 14)
    throw new Error(
      "Set ADMIN_SETUP_EMAIL and ADMIN_SETUP_PASSWORD (at least 14 characters) securely in your shell.",
    );
  if (await db.admin.findUnique({ where: { email } }))
    throw new Error(
      "Administrator already exists. This command does not overwrite passwords.",
    );
  await db.admin.create({
    data: { email, passwordHash: await hash(password, 12), role: "OWNER" },
  });
  console.log("Owner administrator created.");
}
main()
  .catch((e) => {
    console.error(e.message);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());

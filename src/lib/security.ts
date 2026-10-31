import { createHash } from "crypto";
import { db } from "./db";
export async function limit(key: string, max = 30, seconds = 60) {
  const hashed = createHash("sha256").update(key).digest("hex");
  return db.$transaction(async (tx) => {
    await tx.$executeRaw`INSERT INTO "RateLimit" ("key","count","resetAt") VALUES (${hashed},1,NOW() + ${seconds} * INTERVAL '1 second') ON CONFLICT ("key") DO UPDATE SET "count"=CASE WHEN "RateLimit"."resetAt" < NOW() THEN 1 ELSE "RateLimit"."count"+1 END, "resetAt"=CASE WHEN "RateLimit"."resetAt" < NOW() THEN NOW() + ${seconds} * INTERVAL '1 second' ELSE "RateLimit"."resetAt" END`;
    const row = await tx.rateLimit.findUniqueOrThrow({
      where: { key: hashed },
    });
    return row.count <= max;
  });
}
export function identity(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}
export function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  return (
    !!origin && origin === new URL(process.env.NEXTAUTH_URL ?? req.url).origin
  );
}
export function error(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

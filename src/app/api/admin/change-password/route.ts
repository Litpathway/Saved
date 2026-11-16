import { compare, hash } from "bcryptjs";
import { z } from "zod";
import { sessionAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { error, identity, limit, sameOrigin } from "@/lib/security";

const requestSchema = z.object({
  currentPassword: z.string().min(1).max(200),
  newPassword: z.string().min(14).max(200),
});

export async function POST(req: Request) {
  if (!sameOrigin(req)) return error("Forbidden", 403);
  if (!(await limit("password-change:" + identity(req), 10, 900)))
    return error("Too many attempts. Try again later.", 429);
  const admin = await sessionAdmin();
  if (!admin) return error("Sign in required", 401);
  const parsed = requestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success)
    return error("Use a new password of at least 14 characters.");
  const { currentPassword, newPassword } = parsed.data;
  if (currentPassword === newPassword)
    return error("Choose a password different from your temporary password.");
  try {
    if (admin.role !== "OWNER_PASSWORD_RESET")
      return error("Password setup is not available for this account.", 403);
    if (!(await compare(currentPassword, admin.passwordHash)))
      return error("The temporary password is incorrect.", 400);
    const passwordHash = await hash(newPassword, 12);
    const updated = await db.$transaction(async (tx) => {
      const result = await tx.admin.updateMany({
        where: {
          id: admin.id,
          role: "OWNER_PASSWORD_RESET",
          passwordHash: admin.passwordHash,
        },
        data: { passwordHash, role: "OWNER" },
      });
      if (result.count !== 1) return false;
      await tx.auditLog.create({
        data: {
          actor: admin.email,
          action: "first_login_password_change",
          entityId: admin.id,
        },
      });
      return true;
    });
    if (!updated) return error("This password has already been changed.", 409);
    return Response.json(
      { changed: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return error("Password change is temporarily unavailable.", 503);
  }
}

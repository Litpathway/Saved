import { del, head } from "@vercel/blob";
import { z } from "zod";
import { administrator } from "@/lib/auth";
import { db } from "@/lib/db";
import { error, sameOrigin } from "@/lib/security";

const itemSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500),
  url: z.url(),
});

export async function GET() {
  if (!(await administrator())) return error("Unauthorized", 401);
  try {
    const items = await db.galleryItem.findMany({ orderBy: { createdAt: "desc" } });
    return Response.json(items, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return error("Gallery unavailable", 503);
  }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return error("Forbidden", 403);
  const user = await administrator();
  if (!user) return error("Unauthorized", 401);
  const parsed = itemSchema.safeParse(await request.json());
  if (!parsed.success) return error("Enter a title and valid upload.");
  try {
    const blob = await head(parsed.data.url);
    if (!blob.pathname.startsWith("gallery/") || !blob.url.includes(".public.blob.vercel-storage.com/"))
      return error("This file is not in the public gallery store.");
    const kind = blob.contentType.startsWith("image/") ? "image" : blob.contentType.startsWith("video/") ? "video" : null;
    if (!kind || blob.size > 100 * 1024 * 1024) return error("Unsupported image or video.");
    const item = await db.galleryItem.create({ data: { ...parsed.data, url: blob.url, kind } });
    await db.auditLog.create({ data: { actor: user.email, action: "gallery:create", entityId: item.id } });
    return Response.json(item, { status: 201 });
  } catch {
    return error("Could not publish this upload. Check storage and try again.", 400);
  }
}

export async function DELETE(request: Request) {
  if (!sameOrigin(request)) return error("Forbidden", 403);
  const user = await administrator();
  if (!user) return error("Unauthorized", 401);
  const parsed = z.object({ id: z.string().cuid() }).safeParse(await request.json());
  if (!parsed.success) return error("Invalid gallery item.");
  try {
    const item = await db.galleryItem.findUnique({ where: { id: parsed.data.id } });
    if (!item) return error("Gallery item not found.", 404);
    await del(item.url);
    await db.galleryItem.delete({ where: { id: item.id } });
    await db.auditLog.create({ data: { actor: user.email, action: "gallery:delete", entityId: item.id } });
    return Response.json({ ok: true });
  } catch {
    return error("Could not remove this item. Try again.", 503);
  }
}

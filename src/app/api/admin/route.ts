import { randomBytes } from "crypto";
import { z } from "zod";
import { administrator } from "@/lib/auth";
import { db } from "@/lib/db";
import { defaultStatuses, shipmentSchema } from "@/lib/validation";
import { trackingSchema } from "@/lib/validation";
import { containerStage } from "@/lib/container-tracking";
import { error, sameOrigin, identity, limit } from "@/lib/security";
export async function GET(req: Request) {
  try {
    if (!(await administrator())) return error("Unauthorized", 401);
    if (!(await limit("admin-read:" + identity(req), 120)))
      return error("Too many requests", 429);
    const [shipments, enquiries, knowledge, statuses, audits] =
      await Promise.all([
        db.shipment.findMany({ orderBy: { updatedAt: "desc" }, take: 200 }),
        db.enquiry.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
        db.knowledge.findMany({ orderBy: { updatedAt: "desc" } }),
        db.shippingStatus.findMany({ orderBy: { order: "asc" } }),
        db.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
      ]);
    return Response.json(
      {
        shipments: shipments.map((shipment) => ({
          ...shipment,
          status: shipment.automaticTracking && !shipment.manualOverride && shipment.loadedAt && shipment.estimatedDelivery
            ? containerStage(shipment.loadedAt, shipment.estimatedDelivery)
            : shipment.status,
        })),
        enquiries,
        knowledge,
        statuses: statuses.length
          ? statuses.map((s) => s.name)
          : defaultStatuses,
        audits,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return error("Database unavailable", 503);
  }
}
export async function POST(req: Request) {
  try {
    if (!sameOrigin(req)) return error("Forbidden", 403);
    const user = await administrator();
    if (!user) return error("Unauthorized", 401);
    if (!(await limit("admin-write:" + user.id, 60)))
      return error("Too many updates. Please wait.", 429);
    const body = await req.json();
    const action = z
      .enum(["shipment", "enquiry", "knowledge", "status"])
      .parse(body.action);
    const result = await db.$transaction(async (tx) => {
      let id = "";
      let value: unknown;
      if (action === "shipment") {
        const {
          note, estimatedDelivery, loadedAt, trackingNumber,
          automaticTracking, manualOverride, ...data
        } = shipmentSchema.parse(body);
        const manifest = trackingNumber ? trackingSchema.parse(trackingNumber) : "";
        if (automaticTracking && (!manifest || !loadedAt || !estimatedDelivery || data.method !== "Sea"))
          throw new Error("Automatic container tracking requires a manifest, sea freight, loading date, and estimated arrival date.");
        if (automaticTracking && !/^(SL|GZ)\d{7}$/.test(manifest))
          throw new Error("Use a Yiwu or Guangzhou manifest for automatic tracking.");
        if (loadedAt && estimatedDelivery && new Date(estimatedDelivery) <= new Date(loadedAt))
          throw new Error("Estimated arrival must be after the loading date.");
        if (automaticTracking && !body.id && loadedAt && estimatedDelivery) {
          const sailingDays = Math.round((Date.parse(estimatedDelivery) - Date.parse(loadedAt)) / 86_400_000);
          if (sailingDays < 45 || sailingDays > 60)
            throw new Error("Set an initial estimated arrival 45 to 60 days after loading. You can adjust it later for delays.");
        }
        if (manualOverride && (!automaticTracking || !note))
          throw new Error("A delayed container needs a public correction note.");
        const statuses = await tx.shippingStatus.findMany();
        if (
          !automaticTracking &&
          !(
            statuses.length ? statuses.map((s) => s.name) : defaultStatuses
          ).includes(data.status)
        )
          throw new Error("Invalid status");
        const details = {
          ...data,
          status: automaticTracking && !manualOverride
            ? containerStage(new Date(loadedAt!), new Date(estimatedDelivery!))
            : data.status,
          estimatedDelivery: estimatedDelivery
            ? new Date(estimatedDelivery)
            : null,
          loadedAt: loadedAt ? new Date(loadedAt) : null,
          automaticTracking,
          manualOverride,
        };
        const shipment = body.id
          ? await tx.shipment.update({
              where: { id: z.string().cuid().parse(body.id) },
              data: { ...details, ...(manifest ? { trackingNumber: manifest } : {}) },
            })
          : await tx.shipment.create({
              data: {
                ...details,
                trackingNumber: manifest ||
                  "SL-" + randomBytes(8).toString("hex").toUpperCase(),
              },
            });
        if (!automaticTracking || manualOverride)
          await tx.milestone.create({
            data: { shipmentId: shipment.id, status: data.status, note },
          });
        id = shipment.id;
        value = shipment;
      } else if (action === "enquiry") {
        id = z.string().cuid().parse(body.id);
        value = await tx.enquiry.update({
          where: { id },
          data: {
            status: z
              .enum(["NEW", "IN_PROGRESS", "RESOLVED"])
              .parse(body.status),
          },
        });
      } else {
        if (user.role !== "OWNER") throw new Error("Owner role required");
        if (action === "knowledge") {
          const data = z
            .object({
              question: z.string().trim().min(3).max(300),
              answer: z.string().trim().min(3).max(3000),
              published: z.boolean(),
            })
            .parse(body);
          const item = body.id
            ? await tx.knowledge.update({
                where: { id: z.string().cuid().parse(body.id) },
                data,
              })
            : await tx.knowledge.create({ data });
          id = item.id;
          value = item;
        } else {
          const name = z.string().trim().min(2).max(80).parse(body.name);
          if (!(await tx.shippingStatus.count()))
            await tx.shippingStatus.createMany({
              data: defaultStatuses.map((name, order) => ({ name, order })),
            });
          const item = await tx.shippingStatus.create({
            data: { name, order: await tx.shippingStatus.count() },
          });
          id = item.id;
          value = item;
        }
      }
      await tx.auditLog.create({
        data: { actor: user.email, action, entityId: id },
      });
      return value;
    });
    return Response.json(result, { status: 201 });
  } catch (e) {
    return error(
      e instanceof z.ZodError
        ? "Please check the submitted fields."
        : e instanceof Error &&
            ["Owner role required", "Invalid status", "Automatic container tracking requires a manifest, sea freight, loading date, and estimated arrival date.", "Use a Yiwu or Guangzhou manifest for automatic tracking.", "Estimated arrival must be after the loading date.", "Set an initial estimated arrival 45 to 60 days after loading. You can adjust it later for delays.", "A delayed container needs a public correction note."].includes(e.message)
          ? e.message
          : "Unable to save. Check the record and try again.",
      400,
    );
  }
}

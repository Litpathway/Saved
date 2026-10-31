import { db } from "@/lib/db";
import { trackingSchema } from "@/lib/validation";
import { error, identity, limit } from "@/lib/security";
export async function GET(
  req: Request,
  { params }: { params: Promise<{ number: string }> },
) {
  try {
    if (!(await limit("tracking:" + identity(req))))
      return error("Too many searches. Please try again in a minute.", 429);
    const parsed = trackingSchema.safeParse((await params).number);
    if (!parsed.success) return error("Please check your tracking number.");
    const shipment = await db.shipment.findUnique({
      where: { trackingNumber: parsed.data },
      select: {
        trackingNumber: true,
        origin: true,
        destination: true,
        method: true,
        status: true,
        estimatedDelivery: true,
        updatedAt: true,
        milestones: {
          select: { status: true, note: true, occurredAt: true },
          orderBy: { occurredAt: "asc" },
        },
      },
    });
    return shipment
      ? Response.json(shipment, { headers: { "Cache-Control": "no-store" } })
      : error(
          "No shipment found. Check the number supplied by our team, or contact support.",
          404,
        );
  } catch {
    return error(
      "Tracking is temporarily unavailable. Please try again later.",
      503,
    );
  }
}

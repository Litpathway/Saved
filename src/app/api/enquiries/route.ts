import { db } from "@/lib/db";
import { enquirySchema } from "@/lib/validation";
import { error, identity, limit, sameOrigin } from "@/lib/security";
import { deliverEmails } from "@/lib/email";
export async function POST(req: Request) {
  try {
    if (!sameOrigin(req)) return error("Request origin not allowed.", 403);
    if (!(await limit("enquiry:" + identity(req), 5, 600)))
      return error("Please wait before sending another enquiry.", 429);
    const p = enquirySchema.safeParse(await req.json());
    if (!p.success)
      return error(p.error.issues[0]?.message ?? "Check your form.");
    const { website, ...data } = p.data;
    const row = await db.$transaction(async (tx) => {
      const item = await tx.enquiry.create({ data });
      const text = `Thank you, ${data.name}. Your Savelanded Company enquiry reference is ${item.id}. Our team will review your request. This is not a confirmed booking or quotation.`;
      await tx.emailJob.create({
        data: {
          enquiryId: item.id,
          recipient: data.email,
          subject: "Your Savelanded enquiry",
          text,
        },
      });
      if (process.env.ADMIN_EMAIL)
        await tx.emailJob.create({
          data: {
            enquiryId: item.id,
            recipient: process.env.ADMIN_EMAIL,
            subject: "New Savelanded enquiry",
            text: `A new ${data.kind.toLowerCase()} enquiry is available in the secure admin dashboard. Reference: ${item.id}.`,
          },
        });
      return item;
    });
    const delivery = await deliverEmails();
    return Response.json(
      {
        reference: row.id,
        message: delivery.configured
          ? "Your request is saved. Email confirmation is being processed."
          : "Your request is saved. Keep this reference; email confirmation is not configured yet.",
      },
      { status: 201 },
    );
  } catch {
    return error(
      "We could not save your request. Please try again later.",
      503,
    );
  }
}

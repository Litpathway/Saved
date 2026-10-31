import { timingSafeEqual } from "crypto";
import { deliverEmails } from "@/lib/email";
export async function POST(req: Request) {
  const actual = Buffer.from(req.headers.get("authorization") ?? "");
  const expected = Buffer.from("Bearer " + (process.env.MAIL_JOB_SECRET ?? ""));
  if (
    !process.env.MAIL_JOB_SECRET ||
    actual.length !== expected.length ||
    !timingSafeEqual(actual, expected)
  )
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  return Response.json(await deliverEmails());
}

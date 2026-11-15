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
  try {
    const result = await deliverEmails();
    const unavailable =
      !result.configured ||
      result.failed > 0 ||
      (result.pending > 0 && result.sent === 0);
    return Response.json(result, { status: unavailable ? 503 : 200 });
  } catch {
    return Response.json(
      { error: "Email processing unavailable" },
      { status: 503 },
    );
  }
}

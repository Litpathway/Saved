import { db } from "./db";
export async function deliverEmails() {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM)
    return { configured: false, sent: 0 };
  const jobs = await db.emailJob.findMany({
    where: { sentAt: null, attempts: { lt: 5 } },
    take: 20,
    orderBy: { createdAt: "asc" },
  });
  let sent = 0;
  for (const job of jobs) {
    await db.emailJob.update({
      where: { id: job.id },
      data: { attempts: { increment: 1 } },
    });
    try {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
          "Idempotency-Key": job.id,
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM,
          to: [job.recipient],
          subject: job.subject,
          text: job.text,
        }),
        signal: AbortSignal.timeout(10000),
      });
      if (r.ok) {
        await db.emailJob.update({
          where: { id: job.id },
          data: { sentAt: new Date() },
        });
        sent++;
      }
    } catch {
      /* Retain queued message for retry; never log customer data. */
    }
  }
  return { configured: true, sent };
}

import { db } from "./db";
export async function deliverEmails(
  jobsStore = db.emailJob,
  send: typeof fetch = fetch,
) {
  const pending = () => jobsStore.count({ where: { sentAt: null } });
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM)
    return { configured: false, sent: 0, failed: 0, pending: await pending() };
  const jobs = await jobsStore.findMany({
    where: { sentAt: null, attempts: { lt: 5 } },
    take: 20,
    orderBy: { createdAt: "asc" },
  });
  let sent = 0;
  let failed = 0;
  for (const job of jobs) {
    try {
      await jobsStore.update({
        where: { id: job.id },
        data: { attempts: { increment: 1 } },
      });
      const response = await send("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + process.env.RESEND_API_KEY,
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
      if (!response.ok) {
        failed++;
        continue;
      }
      await jobsStore.update({
        where: { id: job.id },
        data: { sentAt: new Date() },
      });
      sent++;
    } catch {
      failed++;
    }
  }
  return { configured: true, sent, failed, pending: await pending() };
}

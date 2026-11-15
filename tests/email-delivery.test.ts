import { test } from "node:test";
import assert from "node:assert/strict";
import { deliverEmails } from "../src/lib/email";

test("email delivery reports rejection, network failure, and confirmed delivery", async () => {
  const priorKey = process.env.RESEND_API_KEY;
  const priorFrom = process.env.EMAIL_FROM;
  process.env.RESEND_API_KEY = "test-only";
  process.env.EMAIL_FROM = "test@example.test";
  try {
    for (const scenario of [
      "rejected",
      "network",
      "success",
      "database",
    ] as const) {
      let confirmed = false;
      const store = {
        findMany: async () => [
          {
            id: "job",
            recipient: "customer@example.test",
            subject: "Test",
            text: "Test",
          },
        ],
        count: async () => (confirmed ? 0 : 1),
        update: async ({ data }: { data: { sentAt?: Date } }) => {
          if (scenario === "database") throw new Error("unavailable");
          if (data.sentAt) confirmed = true;
        },
      } as unknown as Parameters<typeof deliverEmails>[0];
      const send = (async () => {
        if (scenario === "network") throw new Error("network unavailable");
        return new Response(null, {
          status: scenario === "rejected" ? 500 : 200,
        });
      }) as typeof fetch;
      const result = await deliverEmails(store, send);
      assert.equal(result.sent, scenario === "success" ? 1 : 0);
      assert.equal(result.failed, scenario === "success" ? 0 : 1);
      assert.equal(result.pending, scenario === "success" ? 0 : 1);
      assert.equal(confirmed, scenario === "success");
    }
    delete process.env.RESEND_API_KEY;
    const store = { count: async () => 3 } as unknown as Parameters<
      typeof deliverEmails
    >[0];
    assert.deepEqual(await deliverEmails(store), {
      configured: false,
      sent: 0,
      failed: 0,
      pending: 3,
    });
  } finally {
    if (priorKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = priorKey;
    if (priorFrom === undefined) delete process.env.EMAIL_FROM;
    else process.env.EMAIL_FROM = priorFrom;
  }
});

import "dotenv/config";
import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";
import { randomBytes } from "crypto";
import AxeBuilder from "@axe-core/playwright";
const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});
const email = `test-${randomBytes(5).toString("hex")}@example.test`;
const password = randomBytes(24).toString("base64url");
let tracking = "";
let shipmentId = "";
const enquiryIds: string[] = [];
test.beforeAll(async () => {
  await db.admin.create({
    data: { email, passwordHash: await hash(password, 12), role: "OWNER" },
  });
  await db.admin.create({
    data: {
      email: "editor-" + email,
      passwordHash: await hash(password, 12),
      role: "EDITOR",
    },
  });
});
test.afterAll(async () => {
  if (shipmentId) {
    await db.milestone.deleteMany({ where: { shipmentId } });
    await db.shipment.deleteMany({ where: { id: shipmentId } });
    await db.auditLog.deleteMany({ where: { entityId: shipmentId } });
  }
  await db.emailJob.deleteMany({ where: { enquiryId: { in: enquiryIds } } });
  await db.enquiry.deleteMany({ where: { id: { in: enquiryIds } } });
  await db.admin.deleteMany({
    where: { email: { in: [email, "editor-" + email] } },
  });
  await db.$disconnect();
});
test("responsive home, menus, accordion, carousel and navigation", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "A world of possibilities.",
  );
  await expect(page.locator(".hero-image")).toBeVisible();
  await page.getByRole("button", { name: "Sea", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Sea", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("button", { name: "How much does shipping cost?" })
    .click();
  await expect(page.getByText("Pricing depends on the route")).toBeVisible();
  await page.getByRole("button", { name: "02 Plan your shipment" }).click();
  await expect(
    page.getByText("Confirm the proposed method, scope"),
  ).toBeVisible();
  for (const width of [360, 390, 768, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "About us" })
    .click();
  await expect(page).toHaveURL("/about");
});
test("anonymous callers cannot read or modify admin data; cross-origin writes rejected", async ({
  request,
}) => {
  expect((await request.get("/api/admin")).status()).toBe(401);
  expect(
    (
      await request.post("/api/admin", {
        headers: { Origin: "http://localhost:3000" },
        data: { action: "shipment" },
      })
    ).status(),
  ).toBe(401);
  expect(
    (
      await request.post("/api/enquiries", {
        headers: { Origin: "https://untrusted.test" },
        data: {},
      })
    ).status(),
  ).toBe(403);
});
test("quote form persists enquiry and confirmation outbox without claiming email delivery", async ({
  page,
}) => {
  await page.goto("/quote");
  await page.getByLabel("Your name").fill("AUTOMATED TEST Customer");
  await page.getByLabel("Email address").fill(email);
  await page.locator("input[name=origin]").fill("TEST City A");
  await page.locator("input[name=destination]").fill("TEST City B");
  await page.getByLabel("What are you shipping?").fill("TEST cartons");
  await page
    .getByLabel("Additional instructions")
    .fill("Automated test request; not real cargo.");
  await page.getByRole("button", { name: "Send quote request" }).click();
  await expect(
    page.getByRole("heading", { name: "Your request is with us." }),
  ).toBeVisible();
  const enquiry = await db.enquiry.findFirstOrThrow({ where: { email } });
  enquiryIds.push(enquiry.id);
  expect(enquiry.kind).toBe("QUOTE");
  expect(
    await db.emailJob.count({ where: { enquiryId: enquiry.id } }),
  ).toBeGreaterThan(0);
});
test("owner creates shipment, update appears in public tracking and records audit history", async ({
  page,
}) => {
  await page.goto("/admin");
  await expect(page).toHaveURL("/admin/login");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Your control centre." }),
  ).toBeVisible();
  await page.getByLabel("Origin", { exact: true }).fill("TEST Origin City");
  await page
    .getByLabel("Destination", { exact: true })
    .fill("TEST Destination City");
  await page.getByLabel("Shipping method", { exact: true }).fill("TEST Sea");
  await page
    .getByLabel("Public milestone note")
    .fill("Automated test registration.");
  await page
    .getByRole("button", { name: "Create shipment", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("Changes saved");
  const shipment = await db.shipment.findFirstOrThrow({
    where: { origin: "TEST Origin City" },
  });
  tracking = shipment.trackingNumber;
  shipmentId = shipment.id;
  await page
    .getByRole("button", { name: "Edit / add milestone" })
    .first()
    .click();
  await page.locator("select[name=status]").selectOption("In Transit");
  await page.getByLabel("Public milestone note").fill("Automated test update.");
  await page.getByRole("button", { name: "Save update" }).click();
  await expect(page.getByRole("status")).toContainText("Changes saved");
  await page.goto("/track?number=" + tracking);
  await expect(
    page.getByRole("heading", { name: "In Transit", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Automated test registration.")).toBeVisible();
  await expect(page.getByText("Automated test update.")).toBeVisible();
  expect(await db.auditLog.count({ where: { entityId: shipmentId } })).toBe(2);
  const response = await page.request.get("/api/tracking/" + tracking);
  const body = await response.json();
  expect(body).not.toHaveProperty("id");
  expect(body).not.toHaveProperty("email");
  expect(body).not.toHaveProperty("customer");
});
test("invalid and unknown tracking provide useful feedback", async ({
  page,
}) => {
  await page.goto("/track");
  await page.getByLabel("Your tracking number").fill("invalid");
  await page.getByRole("button", { name: "Track now" }).click();
  await expect(page.locator(".tracking-empty")).toContainText(
    "Enter a tracking number",
  );
  await page.getByLabel("Your tracking number").fill("SL-0000000000000000");
  await page.getByRole("button", { name: "Track now" }).click();
  await expect(page.locator(".tracking-empty")).toContainText(
    "No shipment found",
  );
});
test("chat gives verified fallback and human escalation", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open support chat" }).click();
  await page
    .getByRole("button", { name: "Request a shipping quote", exact: true })
    .click();
  await expect(page.locator(".chat-message.assistant").last()).toContainText(
    "not a confirmed booking",
  );
  await page
    .getByRole("link", { name: "Contact our team", exact: true })
    .last()
    .click();
  await expect(page).toHaveURL("/contact");
});

test("contact submission persists and missing required quote fields fail", async ({
  request,
}) => {
  const response = await request.post("/api/enquiries", {
    headers: { Origin: "http://localhost:3000" },
    data: {
      kind: "CONTACT",
      name: "AUTOMATED TEST Contact",
      email,
      message: "Automated test contact enquiry.",
    },
  });
  expect(response.status()).toBe(201);
  const result = await response.json();
  enquiryIds.push(result.reference);
  expect(
    (await db.enquiry.findUniqueOrThrow({ where: { id: result.reference } }))
      .kind,
  ).toBe("CONTACT");
  const invalid = await request.post("/api/enquiries", {
    headers: { Origin: "http://localhost:3000" },
    data: {
      kind: "QUOTE",
      name: "Test",
      email,
      message: "Missing route and cargo",
    },
  });
  expect(invalid.status()).toBe(400);
});
test("editor cannot publish company knowledge or configure statuses", async ({
  page,
}) => {
  await page.goto("/admin/login");
  await page.getByLabel("Email address").fill("editor-" + email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Your control centre." }),
  ).toBeVisible();
  const response = await page.request.post("/api/admin", {
    headers: { Origin: "http://localhost:3000" },
    data: {
      action: "knowledge",
      question: "Unapproved claim?",
      answer: "This must never be published.",
      published: true,
    },
  });
  expect(response.status()).toBe(400);
  expect(
    await db.knowledge.count({ where: { question: "Unapproved claim?" } }),
  ).toBe(0);
  const status = await page.request.post("/api/admin", {
    headers: { Origin: "http://localhost:3000" },
    data: { action: "status", name: "Unauthorized status" },
  });
  expect(status.status()).toBe(400);
});
test("public tracking rate limit is enforced and mail scheduler requires a secret", async ({
  request,
}) => {
  const identity = "test-" + randomBytes(6).toString("hex");
  let status = 0;
  for (let i = 0; i < 31; i++)
    status = (
      await request.get("/api/tracking/SL-0000000000000000", {
        headers: { "x-forwarded-for": identity },
      })
    ).status();
  expect(status).toBe(429);
  expect((await request.post("/api/mail")).status()).toBe(401);
});
test("public pages have no automated WCAG A/AA violations", async ({
  page,
}) => {
  for (const path of [
    "/",
    "/quote",
    "/contact",
    "/track",
    "/about",
    "/shipping",
    "/admin/login",
  ]) {
    await page.goto(path);
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    expect(
      result.violations,
      `${path}: ${JSON.stringify(result.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })))}`,
    ).toEqual([]);
  }
});

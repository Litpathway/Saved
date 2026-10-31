import { db } from "./db";

export type AdminAvailability =
  | { status: "ready" }
  | { status: "setup-required"; missing: string[] }
  | { status: "account-required" }
  | { status: "unavailable" };

export function missingAdminConfiguration(
  environment: Record<string, string | undefined> = process.env,
): string[] {
  return ["DATABASE_URL", "NEXTAUTH_SECRET"].filter(
    (name) => !environment[name]?.trim(),
  );
}

export async function adminAvailability(): Promise<AdminAvailability> {
  const missing = missingAdminConfiguration();
  if (missing.length) return { status: "setup-required", missing };
  try {
    const admin = await db.admin.findFirst({
      where: { role: { in: ["OWNER", "EDITOR"] } },
      select: { id: true },
    });
    return admin ? { status: "ready" } : { status: "account-required" };
  } catch (error) {
    // Only log machine-readable error codes; never log messages or connection details.
    const issue = error as {
      name?: string;
      code?: string;
      meta?: {
        driverAdapterError?: {
          cause?: { kind?: string; originalCode?: string; code?: string };
        };
      };
    };
    const cause = issue?.meta?.driverAdapterError?.cause;
    const safe = (value: unknown) =>
      typeof value === "string" && /^[A-Za-z0-9_]+$/.test(value)
        ? value
        : undefined;
    console.error("Admin database diagnostic", {
      name: safe(issue?.name),
      code: safe(issue?.code),
      kind: safe(cause?.kind),
      driverCode: safe(cause?.originalCode ?? cause?.code),
    });
    // Do not expose connection strings, database errors, or account details.
    return { status: "unavailable" };
  }
}

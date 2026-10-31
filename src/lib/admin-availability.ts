import { db } from "./db";

export type AdminAvailability =
  | { status: "ready" }
  | { status: "setup-required"; missing: string[] }
  | { status: "account-required" }
  | { status: "unavailable"; reference?: string };

export function missingAdminConfiguration(
  environment: Record<string, string | undefined> = process.env,
): string[] {
  return ["DATABASE_URL", "NEXTAUTH_SECRET"].filter(
    (name) => !environment[name]?.trim(),
  );
}

export function adminFailureReference(error: unknown): string {
  const codes: string[] = [];
  const descriptions: string[] = [];
  const visit = (value: unknown, depth = 0) => {
    if (!value || typeof value !== "object" || depth > 5) return;
    const item = value as Record<string, unknown>;
    for (const key of ["message", "originalMessage", "reason"])
      if (typeof item[key] === "string") descriptions.push(item[key] as string);
    for (const key of ["code", "originalCode", "kind"])
      if (typeof item[key] === "string") codes.push(item[key] as string);
    for (const key of ["meta", "driverAdapterError", "cause", "error"])
      visit(item[key], depth + 1);
  };
  visit(error);
  // Classify provider messages in memory; never return or log their contents.
  const description = descriptions.join(" ");
  if (/tenant or user not found/i.test(description)) return "DB-POOLER-USER";
  if (/password authentication failed|invalid password/i.test(description))
    return "DB-AUTH";
  if (
    /self.signed certificate|unable to verify|certificate chain|certificate has expired/i.test(
      description,
    )
  )
    return "DB-TLS";
  if (/wasm|query compiler|cannot find module|ENOENT/i.test(description))
    return "DB-CLIENT";
  if (
    /connection timeout|connection timed out|connection terminated|timeout exceeded/i.test(
      description,
    )
  )
    return "DB-CONNECTION";
  if (codes.some((code) => /Tls|TLS|CERT_|P1011/.test(code))) return "DB-TLS";
  if (codes.some((code) => ["28P01", "28000", "P1000"].includes(code)))
    return "DB-AUTH";
  if (
    codes.some((code) =>
      [
        "P1001",
        "P1002",
        "ENOTFOUND",
        "ECONNREFUSED",
        "ETIMEDOUT",
        "DatabaseNotReachable",
        "ConnectTimeout",
      ].includes(code),
    )
  )
    return "DB-CONNECTION";
  if (codes.some((code) => ["P2021", "P2022", "42P01"].includes(code)))
    return "DB-SCHEMA";
  if (codes.some((code) => code === "42501")) return "DB-PERMISSIONS";
  const code = codes.find((value) =>
    /^(P[0-9]{4}|[0-9A-Z]{5}|E[A-Z_]{2,40})$/.test(value),
  );
  const name = (error as { name?: string })?.name;
  return (
    "DB-UNAVAILABLE" + (code ? "-" + code : name === "TypeError" ? "-TYPE" : "")
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
    return { status: "unavailable", reference: adminFailureReference(error) };
  }
}

export function localAdminEnabled(
  environment: Record<string, string | undefined> = process.env,
) {
  if (
    environment.NODE_ENV !== "development" ||
    environment.LOCAL_ADMIN_ACCESS !== "true" ||
    environment.LOCAL_ADMIN_SERVER !== "loopback"
  )
    return false;
  try {
    const database = new URL(environment.DATABASE_URL ?? "");
    const site = new URL(environment.NEXTAUTH_URL ?? "");
    return (
      ["localhost", "127.0.0.1"].includes(database.hostname) &&
      ["localhost", "127.0.0.1"].includes(site.hostname)
    );
  } catch {
    return false;
  }
}

export const localAdminEmail = "local@savelanded.test";

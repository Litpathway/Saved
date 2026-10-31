import { rootCertificates } from "node:tls";

export function databaseConnectionOptions(
  environment: Record<string, string | undefined> = process.env,
) {
  const base = {
    connectionString: environment.DATABASE_URL,
    connectionTimeoutMillis: 5000,
    max: 5,
  };
  const certificate = environment.DATABASE_SSL_CA;
  if (!certificate || !base.connectionString) return base;
  let connectionString = base.connectionString;
  try {
    const url = new URL(connectionString);
    // pg's URL sslmode parsing otherwise replaces the explicit CA configuration.
    for (const key of ["sslmode", "sslrootcert", "sslcert", "sslkey"])
      url.searchParams.delete(key);
    connectionString = url.toString();
  } catch {
    /* Let the database adapter report an invalid connection string safely. */
  }
  return {
    ...base,
    connectionString,
    ssl: {
      ca: [...rootCertificates, certificate.replace(/\\n/g, "\n")],
      rejectUnauthorized: true,
    },
  };
}

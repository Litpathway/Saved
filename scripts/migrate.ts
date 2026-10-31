import "dotenv/config";
import { Client } from "pg";
import { readdir, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
// Apply reviewed Prisma-generated SQL without requiring a native schema engine.
const client = new Client({ connectionString: process.env.DATABASE_URL });
async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
  await client.connect();
  await client.query("SELECT pg_advisory_lock(771928341)");
  try {
    await client.query(
      'CREATE TABLE IF NOT EXISTS "_savelanded_migrations" (name TEXT PRIMARY KEY, checksum TEXT NOT NULL, applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW())',
    );
    const root = path.resolve("prisma/migrations");
    for (const name of (await readdir(root, { withFileTypes: true }))
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .sort()) {
      const sql = await readFile(
        path.join(root, name, "migration.sql"),
        "utf8",
      );
      const checksum = createHash("sha256").update(sql).digest("hex");
      const prior = await client.query(
        'SELECT checksum FROM "_savelanded_migrations" WHERE name=$1',
        [name],
      );
      if (prior.rows.length) {
        if (prior.rows[0].checksum !== checksum)
          throw new Error(`Migration checksum mismatch: ${name}`);
        continue;
      }
      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query(
          'INSERT INTO "_savelanded_migrations" (name,checksum) VALUES ($1,$2)',
          [name, checksum],
        );
        await client.query("COMMIT");
        console.log(`Applied ${name}`);
      } catch (e) {
        await client.query("ROLLBACK");
        throw e;
      }
    }
    console.log("Database migrations are current.");
  } finally {
    await client.query("SELECT pg_advisory_unlock(771928341)");
  }
}
main()
  .catch((e) => {
    console.error(e.message);
    process.exitCode = 1;
  })
  .finally(() => client.end());

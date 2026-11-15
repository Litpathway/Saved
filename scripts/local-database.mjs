import {
  existsSync,
  readFileSync,
  writeFileSync,
  readdirSync,
  mkdirSync,
  unlinkSync,
} from "node:fs";
import { resolve, join } from "node:path";
import { spawnSync } from "node:child_process";
import { randomBytes, createHash } from "node:crypto";
import { Client } from "pg";
import { hash } from "bcryptjs";
import dotenv from "dotenv";

const root = resolve(".local");
const bin = join(root, "pgsql", "bin");
const data = join(root, "postgres-data");
const environmentPath = resolve(".env");
function run(name, args) {
  const result = spawnSync(join(bin, `${name}.exe`), args, {
    encoding: "utf8",
    windowsHide: true,
  });
  if (result.status !== 0)
    throw new Error(`${name} failed: ${result.stderr || result.stdout}`);
}
export function startLocalDatabase() {
  if (!existsSync(join(data, "PG_VERSION")))
    throw new Error("Run npm.cmd run local:setup first.");
  const pidFile = join(data, "postmaster.pid");
  if (existsSync(pidFile)) {
    const pid = Number(readFileSync(pidFile, "utf8").split(/\r?\n/)[0]);
    try {
      process.kill(pid, 0);
      return;
    } catch {
      /* Start a stopped local database. */
    }
  }
  run("pg_ctl", ["start", "-D", data, "-l", join(root, "postgres.log"), "-w"]);
}

async function setup() {
  if (!existsSync(join(bin, "initdb.exe")))
    throw new Error("Extract the PostgreSQL binaries to .local/pgsql first.");
  mkdirSync(root, { recursive: true });
  const existing = existsSync(environmentPath)
    ? dotenv.parse(readFileSync(environmentPath))
    : {};
  const password = randomBytes(24).toString("hex");
  const connection =
    existing.DATABASE_URL ||
    `postgresql://savelanded:${password}@127.0.0.1:55432/savelanded`;
  const url = new URL(connection);
  if (url.hostname !== "127.0.0.1" || url.port !== "55432")
    throw new Error(
      "Local setup requires a dedicated 127.0.0.1:55432 database; existing configuration was preserved.",
    );
  if (!existsSync(join(data, "PG_VERSION"))) {
    const passwordFile = join(root, "init-password");
    writeFileSync(passwordFile, decodeURIComponent(url.password), {
      mode: 0o600,
    });
    try {
      run("initdb", [
        "-D",
        data,
        "-U",
        "savelanded",
        "--pwfile",
        passwordFile,
        "-A",
        "scram-sha-256",
        "-E",
        "UTF8",
        "--locale=C",
      ]);
    } finally {
      unlinkSync(passwordFile);
    }
    writeFileSync(
      join(data, "postgresql.conf"),
      "listen_addresses = '127.0.0.1'\nport = 55432\n",
      { flag: "a" },
    );
  }
  const environment = {
    ...existing,
    DATABASE_URL: connection,
    NEXTAUTH_URL: "http://localhost:3000",
    NEXTAUTH_SECRET:
      existing.NEXTAUTH_SECRET || randomBytes(32).toString("hex"),
    LOCAL_ADMIN_ACCESS: "true",
  };
  writeFileSync(
    environmentPath,
    Object.entries(environment)
      .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
      .join("\n") + "\n",
    { mode: 0o600 },
  );
  startLocalDatabase();
  const adminConnection = new URL(connection);
  adminConnection.pathname = "/postgres";
  const admin = new Client({ connectionString: adminConnection.toString() });
  await admin.connect();
  try {
    if (
      !(
        await admin.query(
          "SELECT 1 FROM pg_database WHERE datname='savelanded'",
        )
      ).rowCount
    )
      await admin.query("CREATE DATABASE savelanded");
  } finally {
    await admin.end();
  }
  const client = new Client({ connectionString: connection });
  await client.connect();
  try {
    await client.query("SELECT pg_advisory_lock(771928341)");
    await client.query(
      'CREATE TABLE IF NOT EXISTS "_savelanded_migrations" (name TEXT PRIMARY KEY, checksum TEXT NOT NULL, applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW())',
    );
    for (const entry of readdirSync("prisma/migrations", {
      withFileTypes: true,
    })
      .filter((d) => d.isDirectory())
      .sort((a, b) => a.name.localeCompare(b.name))) {
      const sql = readFileSync(
        join("prisma/migrations", entry.name, "migration.sql"),
        "utf8",
      );
      const checksum = createHash("sha256").update(sql).digest("hex");
      const prior = await client.query(
        'SELECT checksum FROM "_savelanded_migrations" WHERE name=$1',
        [entry.name],
      );
      if (prior.rowCount) {
        if (prior.rows[0].checksum !== checksum)
          throw new Error("Migration checksum mismatch");
        continue;
      }
      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query(
          'INSERT INTO "_savelanded_migrations" (name,checksum) VALUES ($1,$2)',
          [entry.name, checksum],
        );
        await client.query("COMMIT");
      } catch (e) {
        await client.query("ROLLBACK");
        throw e;
      }
    }
    await client.query(
      'INSERT INTO "Admin" (id,email,"passwordHash",role,"createdAt") VALUES ($1,$2,$3,$4,NOW()) ON CONFLICT (email) DO NOTHING',
      [
        "local-dev-owner",
        "local@savelanded.test",
        await hash(randomBytes(32).toString("hex"), 12),
        "OWNER",
      ],
    );
    console.log(
      "Local database is ready. Run npm.cmd run dev and open /edit-tracking.",
    );
  } finally {
    await client.end();
  }
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === resolve("scripts/local-database.mjs")
)
  setup().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });

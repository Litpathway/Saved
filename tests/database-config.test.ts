import { test } from "node:test";
import assert from "node:assert/strict";
import { databaseConnectionOptions } from "../src/lib/database-config";
test("database CA trust preserves certificate verification and standard roots", () => {
  const config = databaseConnectionOptions({
    DATABASE_URL:
      "postgresql://app:password@pooler.example.test:5432/postgres?sslmode=verify-full",
    DATABASE_SSL_CA: "public-ca-pem",
  });
  assert.ok("ssl" in config);
  assert.equal(config.ssl?.rejectUnauthorized, true);
  assert.ok((config.ssl?.ca.length ?? 0) > 1);
  assert.ok(config.ssl?.ca.includes("public-ca-pem"));
  assert.equal(
    new URL(config.connectionString!).searchParams.has("sslmode"),
    false,
  );
  assert.equal(new URL(config.connectionString!).password, "password");
});
test("local database connections remain usable without a custom CA", () => {
  const config = databaseConnectionOptions({
    DATABASE_URL: "postgresql://localhost/savelanded",
  });
  assert.equal(config.connectionString, "postgresql://localhost/savelanded");
  assert.equal("ssl" in config, false);
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { missingAdminConfiguration } from "../src/lib/admin-availability";
test("admin reports missing server configuration without attempting authentication", () => {
  assert.deepEqual(missingAdminConfiguration({}), [
    "DATABASE_URL",
    "NEXTAUTH_SECRET",
  ]);
  assert.deepEqual(
    missingAdminConfiguration({
      DATABASE_URL: "postgresql://configured.test/db",
    }),
    ["NEXTAUTH_SECRET"],
  );
  assert.deepEqual(
    missingAdminConfiguration({ NEXTAUTH_SECRET: "  ", DATABASE_URL: "  " }),
    ["DATABASE_URL", "NEXTAUTH_SECRET"],
  );
});
test("configured admin does not require a hardcoded deployment URL", () => {
  assert.deepEqual(
    missingAdminConfiguration({
      DATABASE_URL: "postgresql://configured.test/db",
      NEXTAUTH_SECRET: "test-secret-only",
    }),
    [],
  );
});

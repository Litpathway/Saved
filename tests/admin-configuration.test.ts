import { test } from "node:test";
import assert from "node:assert/strict";
import {
  missingAdminConfiguration,
  adminFailureReference,
} from "../src/lib/admin-availability";
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

test("admin failure references never expose raw connection details", () => {
  assert.equal(
    adminFailureReference({
      meta: {
        driverAdapterError: {
          cause: {
            kind: "TlsConnectionError",
            reason: "private connection detail",
          },
        },
      },
    }),
    "DB-TLS",
  );
  assert.equal(
    adminFailureReference({ message: "postgresql://private:secret@host/db" }),
    "DB-UNAVAILABLE",
  );
  assert.equal(adminFailureReference({ code: "P1000" }), "DB-AUTH");
});

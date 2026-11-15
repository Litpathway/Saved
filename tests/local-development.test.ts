import { test } from "node:test";
import assert from "node:assert/strict";
import { localAdminEnabled } from "../src/lib/local-development";

const local = {
  NODE_ENV: "development",
  LOCAL_ADMIN_SERVER: "loopback",
  LOCAL_ADMIN_ACCESS: "true",
  DATABASE_URL: "postgresql://user:password@127.0.0.1:55432/savelanded",
  NEXTAUTH_URL: "http://localhost:3000",
};
test("local administrator access requires explicit development configuration", () => {
  assert.equal(localAdminEnabled(local), true);
  assert.equal(
    localAdminEnabled({ ...local, LOCAL_ADMIN_SERVER: undefined }),
    false,
  );
  assert.equal(localAdminEnabled({ ...local, NODE_ENV: "production" }), false);
  assert.equal(localAdminEnabled({ ...local, NODE_ENV: "test" }), false);
  assert.equal(
    localAdminEnabled({ ...local, LOCAL_ADMIN_ACCESS: "false" }),
    false,
  );
  assert.equal(
    localAdminEnabled({
      ...local,
      DATABASE_URL: "postgresql://remote.example/db",
    }),
    false,
  );
  assert.equal(
    localAdminEnabled({ ...local, NEXTAUTH_URL: "https://public.example" }),
    false,
  );
  assert.equal(localAdminEnabled({ ...local, DATABASE_URL: "invalid" }), false);
  assert.equal(localAdminEnabled({}), false);
});

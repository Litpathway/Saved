import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
test("serverless database routes retain the dynamically loaded Prisma compiler", () => {
  for (const route of [
    "admin/page",
    "admin/login/page",
    "api/admin/route",
    "api/auth/[...nextauth]/route",
    "api/chat/route",
    "api/enquiries/route",
    "api/tracking/[number]/route",
  ]) {
    const manifest = path.resolve(".next/server/app", route + ".js.nft.json");
    const trace = JSON.parse(readFileSync(manifest, "utf8")) as {
      files: string[];
    };
    const compiler = trace.files.find((file) =>
      file.endsWith("/query_compiler_bg.wasm"),
    );
    assert.ok(
      compiler,
      `${route} is missing the Prisma compiler from its serverless bundle`,
    );
    assert.ok(
      existsSync(path.resolve(path.dirname(manifest), compiler)),
      `${route} compiler trace points to a missing file`,
    );
  }
});

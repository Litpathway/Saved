import { test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
async function checkDeployment(
  port: number,
  environment: Record<string, string>,
  heading: string,
) {
  const server = spawn(
    process.execPath,
    [
      require.resolve("next/dist/bin/next"),
      "start",
      "--hostname",
      "127.0.0.1",
      "--port",
      String(port),
    ],
    {
      env: {
        ...process.env,
        ...environment,
        NEXTAUTH_URL: `http://localhost:${port}`,
      },
      stdio: "ignore",
    },
  );
  try {
    let response: Response | undefined;
    for (let attempt = 0; attempt < 40; attempt++) {
      if (server.exitCode !== null)
        throw new Error("Test server exited before readiness");
      try {
        response = await fetch(`http://localhost:${port}/admin`, {
          signal: AbortSignal.timeout(10000),
        });
        break;
      } catch {
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
    }
    assert.ok(response, "Test server did not become ready");
    assert.equal(response.status, 200);
    assert.ok((await response.text()).includes(heading));
    const login = await fetch(`http://localhost:${port}/admin/login`);
    assert.equal(login.status, 200);
    const html = await login.text();
    assert.ok(html.includes(heading));
    assert.ok(
      !html.includes('name="password"'),
      "Unavailable deployments must not offer a broken sign-in form",
    );
  } finally {
    server.kill("SIGTERM");
    if (server.exitCode === null)
      await new Promise<void>((resolve) =>
        server.once("exit", () => resolve()),
      );
  }
}
test(
  "production admin renders setup rather than throwing when auth configuration is missing",
  { timeout: 30000 },
  async () => {
    await checkDeployment(
      3101,
      { NEXTAUTH_SECRET: "", DATABASE_URL: "" },
      "Administrator setup required",
    );
  },
);
test(
  "production admin recovers safely from an unreachable database",
  { timeout: 30000 },
  async () => {
    await checkDeployment(
      3102,
      {
        NEXTAUTH_SECRET: "isolated-regression-secret-not-for-production",
        DATABASE_URL: "postgresql://test:test@127.0.0.1:1/unreachable",
      },
      "Administration temporarily unavailable",
    );
  },
);

import "dotenv/config";
import { spawn } from "node:child_process";
import { startLocalDatabase } from "./local-database.mjs";
const local = process.env.LOCAL_ADMIN_ACCESS === "true";
if (local) startLocalDatabase();
const portIndex = process.argv.indexOf("--port");
const port =
  portIndex >= 0 ? process.argv[portIndex + 1] : process.env.PORT || "3000";
if (!/^\d+$/.test(port)) throw new Error("Invalid development port");
const next = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "dev",
    "--hostname",
    local ? "127.0.0.1" : "0.0.0.0",
    ...process.argv.slice(2),
  ],
  {
    stdio: "inherit",
    windowsHide: true,
    env: {
      ...process.env,
      LOCAL_ADMIN_SERVER: local ? "loopback" : "",
      LOCAL_DEV_DIST: local ? `.local/next-${port}` : "",
    },
  },
);
next.on("exit", (code) => {
  process.exitCode = code ?? 1;
});
process.on("SIGINT", () => next.kill("SIGINT"));
process.on("SIGTERM", () => next.kill("SIGTERM"));

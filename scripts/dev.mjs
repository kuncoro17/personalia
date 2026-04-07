import http from "node:http";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const dockerCommand = process.platform === "win32" ? "docker.exe" : "docker";
const composeFile = path.join(
  "deployment",
  "compose",
  "docker-compose.local.yml",
);
const envFile = ".env.example";
const backendHealthUrl = "http://127.0.0.1:3001/health";
const frontendApiUrl = "http://localhost:3001";

let shuttingDown = false;

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: repoRoot,
      env: process.env,
      stdio: "inherit",
      ...options,
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(
          `${command} ${args.join(" ")} exited with code ${code ?? "unknown"}`,
        ),
      );
    });
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function waitForBackend(timeoutMs = 60_000, intervalMs = 1_500) {
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + timeoutMs;

    const check = () => {
      const request = http.get(backendHealthUrl, (response) => {
        response.resume();

        if (response.statusCode === 200) {
          resolve();
          return;
        }

        if (Date.now() >= deadline) {
          reject(
            new Error(
              `Backend did not become healthy in time. Last status: ${response.statusCode ?? "unknown"}`,
            ),
          );
          return;
        }

        setTimeout(check, intervalMs);
      });

      request.on("error", async () => {
        if (Date.now() >= deadline) {
          reject(new Error("Backend did not become healthy in time."));
          return;
        }

        await sleep(intervalMs);
        check();
      });
    };

    check();
  });
}

async function buildFrontend() {
  console.log("Building frontend assets for Docker on http://localhost:3002");

  await runCommand(npmCommand, ["--prefix", "frontend", "run", "build"], {
    env: {
      ...process.env,
      VITE_API_URL: frontendApiUrl,
    },
  });
}

function shutdown(exitCode = 0) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  process.exit(exitCode);
}

async function main() {
  await buildFrontend();

  console.log("Starting Docker services: postgres, redis, backend, frontend");

  await runCommand(dockerCommand, [
    "compose",
    "-f",
    composeFile,
    "--env-file",
    envFile,
    "up",
    "-d",
    "postgres",
    "redis",
    "backend",
    "frontend",
  ]);

  console.log("Waiting for backend health check...");
  await waitForBackend();

  console.log("Docker local stack is ready.");
  console.log("Frontend: http://localhost:3002");
  console.log("Backend: http://localhost:3001");
  console.log('Use "npm run dev:stop" to stop the Docker services.');
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  shutdown(1);
});

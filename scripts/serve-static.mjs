import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { access } from "node:fs/promises";

const [, , rootArg = "/app/dist", portArg = "3000"] = process.argv;
const rootDir = path.resolve(rootArg);
const port = Number(portArg);

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function getMimeType(filePath) {
  return (
    MIME_TYPES[path.extname(filePath).toLowerCase()] ??
    "application/octet-stream"
  );
}

function resolveRequestPath(urlPath) {
  const normalizedPath = decodeURIComponent(urlPath.split("?")[0]);
  const candidatePath = normalizedPath === "/" ? "/index.html" : normalizedPath;
  const safePath = path
    .normalize(candidatePath)
    .replace(/^(\.\.(\/|\\|$))+/, "");
  return path.join(rootDir, safePath);
}

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

const server = http.createServer(async (req, res) => {
  try {
    let filePath = resolveRequestPath(req.url ?? "/");

    if (!(await fileExists(filePath))) {
      filePath = path.join(rootDir, "index.html");
    }

    const stream = fs.createReadStream(filePath);
    res.writeHead(200, { "Content-Type": getMimeType(filePath) });
    stream.pipe(res);

    stream.on("error", () => {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Failed to read file");
    });
  } catch {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Internal server error");
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Static server listening on http://0.0.0.0:${port}`);
});

import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const port = Number(process.env.PORT || 3002);
const distRoot = resolve("dist");

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".eot": "application/vnd.ms-fontobject",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const getFileStats = async (filePath) => {
  try {
    const result = await stat(filePath);
    return result.isFile() ? result : null;
  } catch {
    return null;
  }
};

const sendFile = (request, response, filePath, fileStats) => {
  const extension = extname(filePath).toLowerCase();
  const isHtml = extension === ".html";

  response.statusCode = 200;
  response.setHeader(
    "Content-Type",
    MIME_TYPES[extension] || "application/octet-stream",
  );
  response.setHeader("Content-Length", fileStats.size);
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader(
    "Cache-Control",
    isHtml
      ? "no-store, no-cache, must-revalidate"
      : "public, max-age=31536000, immutable",
  );

  if (request.method === "HEAD") {
    response.end();
    return;
  }

  createReadStream(filePath).pipe(response);
};

const server = createServer(async (request, response) => {
  const requestUrl = new URL(
    request.url || "/",
    `http://${request.headers.host}`,
  );
  const decodedPath = decodeURIComponent(requestUrl.pathname);
  const relativePath = normalize(decodedPath).replace(/^[/\\]+/, "");
  const requestedFile = resolve(join(distRoot, relativePath));
  const isWithinDist =
    requestedFile === distRoot || requestedFile.startsWith(`${distRoot}/`);

  if (!isWithinDist) {
    response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Bad request");
    return;
  }

  const fileStats = await getFileStats(requestedFile);
  if (fileStats) {
    sendFile(request, response, requestedFile, fileStats);
    return;
  }

  // Missing static assets must be a real 404, never the SPA HTML fallback.
  if (decodedPath.startsWith("/assets/")) {
    response.writeHead(404, {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
    response.end("Asset not found");
    return;
  }

  const indexPath = join(distRoot, "index.html");
  const indexStats = await getFileStats(indexPath);
  if (!indexStats) {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Frontend build is unavailable");
    return;
  }

  sendFile(request, response, indexPath, indexStats);
});

server.listen(port, () => {
  console.log(`Frontend listening on port ${port}`);
});

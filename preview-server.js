const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "out");
const port = Number(process.env.PORT || 8088);
const host = "0.0.0.0";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function resolveFile(urlPath) {
  const cleanPath = decodeURIComponent(urlPath.split("?")[0]).replace(/^\/+/, "");
  const candidates = [];

  if (!cleanPath) {
    candidates.push(path.join(root, "index.html"));
  } else {
    const requested = path.join(root, cleanPath);
    candidates.push(requested);
    candidates.push(`${requested}.html`);
    candidates.push(path.join(requested, "index.html"));
  }

  return candidates.find((candidate) => {
    const relative = path.relative(root, candidate);
    return (
      relative &&
      !relative.startsWith("..") &&
      !path.isAbsolute(relative) &&
      fs.existsSync(candidate) &&
      fs.statSync(candidate).isFile()
    );
  });
}

const server = http.createServer((request, response) => {
  const filePath = resolveFile(request.url || "/");

  if (!filePath) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Preview file not found");
    return;
  }

  const extension = path.extname(filePath).toLowerCase();
  response.writeHead(200, {
    "Content-Type": mimeTypes[extension] || "application/octet-stream",
    "Cache-Control": "no-store",
  });
  fs.createReadStream(filePath).pipe(response);
});

server.listen(port, host, () => {
  console.log(`Static preview running at http://localhost:${port}`);
});

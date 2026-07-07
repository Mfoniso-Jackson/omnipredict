import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { parseArgs } from "node:util";

const args = parseArgs({
  options: {
    host: { type: "string", default: "127.0.0.1" },
    port: { type: "string", default: "4173" }
  },
  allowPositionals: true
});

const root = resolve(new URL("..", import.meta.url).pathname);
const host = args.values.host;
const port = Number(args.values.port);
const displayHost = host === "0.0.0.0" ? "localhost" : host;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const candidate = normalize(join(root, decoded === "/" ? "index.html" : decoded));
  if (!candidate.startsWith(root)) return join(root, "index.html");
  if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  return join(root, "index.html");
}

const server = createServer((request, response) => {
  const filePath = safePath(request.url || "/");
  const stream = createReadStream(filePath);
  response.setHeader("Content-Type", mimeTypes[extname(filePath)] || "application/octet-stream");
  response.setHeader("Cache-Control", "no-store");
  stream.on("error", () => {
    response.statusCode = 500;
    response.end("Unable to read file");
  });
  stream.pipe(response);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use. Try: npm run dev -- --port ${port + 1}`);
  } else if (error.code === "EPERM") {
    console.error(`Unable to bind ${host}:${port}. Check local firewall or sandbox permissions.`);
  } else {
    console.error(error);
  }
  process.exit(1);
});

server.listen(port, host, () => {
  console.log(`OmniPredict dev server running at http://${displayHost}:${port}`);
  if (host === "0.0.0.0") {
    console.log("Listening on all interfaces for Codespaces or container port forwarding.");
  }
});

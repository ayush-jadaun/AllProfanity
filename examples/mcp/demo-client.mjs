/**
 * Minimal MCP client demonstrating the AllProfanity MCP server.
 *
 * Spawns the server over stdio (exactly how Claude Code / Claude Desktop /
 * Cursor run it), performs the protocol handshake, lists the tools and calls
 * a few of them.
 *
 * Run from the repository root after `npm run build`:
 *   node examples/mcp/demo-client.mjs
 *
 * Real agents don't need any of this code — they just add the server to
 * their MCP config (see examples/mcp/README.md).
 */
import { spawn } from "child_process";
import { createInterface } from "readline";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const server = spawn(process.execPath, [join(repoRoot, "bin", "mcp.js")], {
  stdio: ["pipe", "pipe", "inherit"],
  env: { ...process.env, ALLPROFANITY_LANGUAGES: "french" },
});

const lines = createInterface({ input: server.stdout });
const pending = new Map();
let nextId = 1;

lines.on("line", (line) => {
  const message = JSON.parse(line);
  const resolve = pending.get(message.id);
  if (resolve) {
    pending.delete(message.id);
    resolve(message);
  }
});

function request(method, params) {
  const id = nextId++;
  const promise = new Promise((resolve) => pending.set(id, resolve));
  server.stdin.write(
    JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n"
  );
  return promise;
}

function notify(method) {
  server.stdin.write(JSON.stringify({ jsonrpc: "2.0", method }) + "\n");
}

const toolPayload = (response) =>
  JSON.parse(response.result.content[0].text);

// --- 1. Handshake ---
const init = await request("initialize", {
  protocolVersion: "2025-06-18",
  capabilities: {},
  clientInfo: { name: "demo-client", version: "1.0" },
});
notify("notifications/initialized");
console.log(
  `Connected to ${init.result.serverInfo.name} v${init.result.serverInfo.version}\n`
);

// --- 2. Discover tools ---
const toolList = await request("tools/list");
console.log("Tools:", toolList.result.tools.map((t) => t.name).join(", "), "\n");

// --- 3. Call tools ---
const checks = [
  "a perfectly clean sentence",
  "what the f*ck",
  "f u c k you",
  "merde alors", // French — preloaded via ALLPROFANITY_LANGUAGES
];
for (const text of checks) {
  const result = await request("tools/call", {
    name: "check_profanity",
    arguments: { text },
  });
  console.log(`check("${text}") ->`, toolPayload(result).hasProfanity);
}

const detection = await request("tools/call", {
  name: "detect_profanity",
  arguments: { text: "this sh1t is fuuuuck-ing wild" },
});
console.log("\ndetect ->", toolPayload(detection));

// --- 4. Read the docs through the server ---
const docs = await request("tools/call", {
  name: "get_documentation",
  arguments: {},
});
console.log("\nDoc topics:", toolPayload(docs).topics.slice(0, 6).join(" | "), "...");

server.stdin.end();

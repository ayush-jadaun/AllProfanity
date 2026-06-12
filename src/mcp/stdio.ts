/**
 * Stdio transport for the AllProfanity MCP server.
 *
 * Reads newline-delimited JSON-RPC 2.0 messages from stdin and writes
 * responses to stdout, per the MCP stdio transport specification.
 *
 * Configuration via environment variables:
 * - ALLPROFANITY_LANGUAGES: comma-separated extra languages to load
 *   (e.g. "french,german,spanish")
 * - ALLPROFANITY_CONFIG: path to an allprofanity.config.json to load
 */
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { createMcpServer, JsonRpcRequest } from "./server.js";
import { AllProfanityOptions } from "../index.js";

function loadOptionsFromEnv(): AllProfanityOptions {
  let options: AllProfanityOptions = {};

  const configPath = process.env.ALLPROFANITY_CONFIG;
  if (configPath) {
    try {
      options = JSON.parse(readFileSync(configPath, "utf-8"));
    } catch (error) {
      process.stderr.write(
        `[allprofanity-mcp] Failed to read config '${configPath}': ${error}\n`
      );
    }
  }

  const languages = process.env.ALLPROFANITY_LANGUAGES;
  if (languages) {
    options.languages = languages
      .split(",")
      .map((language) => language.trim())
      .filter((language) => language.length > 0);
  }

  return options;
}

export function runStdioServer(): void {
  // Docs ship with the package: dist/mcp/stdio.js -> package root is ../../
  const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
  const server = createMcpServer(loadOptionsFromEnv(), {
    docsRoot: packageRoot,
  });
  let buffer = "";

  process.stdin.setEncoding("utf-8");
  process.stdin.on("data", (chunk: string) => {
    buffer += chunk;
    let newlineIndex = buffer.indexOf("\n");
    while (newlineIndex !== -1) {
      const line = buffer.slice(0, newlineIndex).trim();
      buffer = buffer.slice(newlineIndex + 1);
      newlineIndex = buffer.indexOf("\n");
      if (line.length === 0) continue;

      let response;
      try {
        const request = JSON.parse(line) as JsonRpcRequest;
        response = server.handleRequest(request);
      } catch {
        response = {
          jsonrpc: "2.0" as const,
          id: null,
          error: { code: -32700, message: "Parse error" },
        };
      }
      if (response) {
        process.stdout.write(JSON.stringify(response) + "\n");
      }
    }
  });

  process.stdin.on("end", () => process.exit(0));
}

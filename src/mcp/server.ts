/**
 * Model Context Protocol (MCP) server for AllProfanity.
 *
 * Exposes the profanity filter as MCP tools so any MCP-capable agent
 * (Claude Code, Claude Desktop, Cursor, custom agents, ...) can check,
 * analyze and clean text without writing integration code.
 *
 * The protocol layer is implemented directly (JSON-RPC 2.0) to keep the
 * library's zero-dependency guarantee. Transport handling lives in
 * `stdio.ts`; this module is pure request -> response and fully testable.
 */
import { readFileSync } from "fs";
import { join } from "path";
import {
  AllProfanity,
  AllProfanityOptions,
  ProfanitySeverity,
} from "../index.js";

const PROTOCOL_VERSION = "2025-06-18";
const SERVER_VERSION = "2.3.0";

/** Configuration for the MCP server itself (not the profanity filter). */
export interface McpServerConfig {
  /** Package root containing README.md and examples-config/ (defaults to cwd). */
  docsRoot?: string;
}

export interface JsonRpcRequest {
  jsonrpc: "2.0";
  id?: number | string | null;
  method: string;
  params?: unknown;
}

export interface JsonRpcResponse {
  jsonrpc: "2.0";
  id: number | string | null;
  result?: unknown;
  error?: { code: number; message: string };
}

interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  handler: (args: Record<string, unknown>) => unknown;
}

/** Throws a TypeError with a tool-friendly message when a required string is missing. */
function requireString(
  args: Record<string, unknown>,
  field: string
): string {
  const value = args[field];
  if (typeof value !== "string") {
    throw new TypeError(`'${field}' is required and must be a string`);
  }
  return value;
}

function requireStringArray(
  args: Record<string, unknown>,
  field: string
): string[] {
  const value = args[field];
  if (
    !Array.isArray(value) ||
    value.some((item) => typeof item !== "string")
  ) {
    throw new TypeError(`'${field}' is required and must be a string array`);
  }
  return value as string[];
}

/**
 * Create an MCP server instance backed by its own AllProfanity filter.
 *
 * @param options - Optional AllProfanity configuration (e.g. from a config
 * file or environment) used to construct the underlying filter.
 */
export function createMcpServer(
  options?: AllProfanityOptions,
  serverConfig?: McpServerConfig
) {
  const filter = new AllProfanity({ silent: true, ...options });
  const docsRoot = serverConfig?.docsRoot ?? process.cwd();

  // --- documentation (lazily read from the shipped markdown files) ---
  const docCache = new Map<string, string>();
  function readDoc(relativePath: string): string {
    let content = docCache.get(relativePath);
    if (content === undefined) {
      content = readFileSync(join(docsRoot, relativePath), "utf-8");
      docCache.set(relativePath, content);
    }
    return content;
  }

  /** Split the README into { heading -> section text } chunks. */
  function readmeSections(): Map<string, string> {
    const sections = new Map<string, string>();
    const readme = readDoc("README.md");
    const parts = readme.split(/^## /m);
    for (const part of parts.slice(1)) {
      const newlineIndex = part.indexOf("\n");
      const heading = part.slice(0, newlineIndex).trim();
      sections.set(heading, "## " + part.trim());
    }
    return sections;
  }

  function getDocumentation(topic?: string) {
    const sections = readmeSections();
    const topics = [...sections.keys(), "Configuration Presets"];
    if (!topic) {
      return {
        library: "allprofanity",
        version: SERVER_VERSION,
        description:
          "Evasion-resistant multi-language profanity filter for " +
          "JavaScript/TypeScript. Request a topic for the full section.",
        topics,
      };
    }
    const wanted = topic.toLowerCase();
    if (wanted.includes("preset")) {
      return {
        topic: "Configuration Presets",
        content: readDoc(join("examples-config", "README.md")),
      };
    }
    for (const [heading, content] of sections) {
      if (heading.toLowerCase().includes(wanted)) {
        return { topic: heading, content };
      }
    }
    throw new TypeError(
      `Unknown topic '${topic}'. Available topics: ${topics.join(", ")}`
    );
  }

  const resources = [
    {
      uri: "allprofanity://docs/readme",
      name: "AllProfanity README",
      description:
        "Full library documentation: features, API reference, configuration, benchmarks.",
      mimeType: "text/markdown",
      path: "README.md",
    },
    {
      uri: "allprofanity://docs/config-presets",
      name: "Configuration preset guide",
      description:
        "Plug-and-play configuration presets: who each preset is for, why, and trade-offs.",
      mimeType: "text/markdown",
      path: join("examples-config", "README.md"),
    },
  ];

  const tools: ToolDefinition[] = [
    {
      name: "check_profanity",
      description:
        "Check whether text contains profanity in any loaded language. " +
        "Evasion-resistant: catches leet-speak (sh1t), masked words (f*ck), " +
        "stretched letters (fuuuuck), spaced-out spelling (f u c k) and " +
        "Unicode tricks. Returns { hasProfanity: boolean }.",
      inputSchema: {
        type: "object",
        properties: {
          text: { type: "string", description: "The text to check" },
        },
        required: ["text"],
      },
      handler: (args) => ({
        hasProfanity: filter.check(requireString(args, "text")),
      }),
    },
    {
      name: "detect_profanity",
      description:
        "Full profanity analysis of a text: which words were detected, " +
        "their exact positions, a severity rating " +
        "(NONE/MILD/MODERATE/SEVERE/EXTREME) and a censored version of the " +
        "text. Use this when you need details; use check_profanity for a " +
        "fast boolean.",
      inputSchema: {
        type: "object",
        properties: {
          text: { type: "string", description: "The text to analyze" },
        },
        required: ["text"],
      },
      handler: (args) => {
        const result = filter.detect(requireString(args, "text"));
        return {
          hasProfanity: result.hasProfanity,
          detectedWords: result.detectedWords,
          cleanedText: result.cleanedText,
          severity: ProfanitySeverity[result.severity],
          positions: result.positions,
        };
      },
    },
    {
      name: "clean_profanity",
      description:
        "Censor profanity in a text. mode 'character' (default) replaces " +
        "each character of a profane word with the placeholder character; " +
        "mode 'word' replaces each profane word with the whole placeholder " +
        "string. Returns { cleanedText }.",
      inputSchema: {
        type: "object",
        properties: {
          text: { type: "string", description: "The text to clean" },
          placeholder: {
            type: "string",
            description:
              "Replacement: a character for mode 'character' (default '*'), " +
              "or a full string for mode 'word' (default '***')",
          },
          mode: {
            type: "string",
            enum: ["character", "word"],
            description: "Replacement granularity (default 'character')",
          },
        },
        required: ["text"],
      },
      handler: (args) => {
        const text = requireString(args, "text");
        const placeholder =
          typeof args.placeholder === "string" ? args.placeholder : undefined;
        const cleanedText =
          args.mode === "word"
            ? filter.cleanWithPlaceholder(text, placeholder)
            : filter.clean(text, placeholder);
        return { cleanedText };
      },
    },
    {
      name: "add_words",
      description:
        "Add custom words or phrases to the profanity dictionary for this " +
        "session (e.g. community-specific slang or brand-banned terms).",
      inputSchema: {
        type: "object",
        properties: {
          words: {
            type: "array",
            items: { type: "string" },
            description: "Words or phrases to treat as profanity",
          },
        },
        required: ["words"],
      },
      handler: (args) => {
        const words = requireStringArray(args, "words");
        filter.add(words);
        return { added: words.length };
      },
    },
    {
      name: "add_to_whitelist",
      description:
        "Whitelist words so they are never flagged as profanity (e.g. " +
        "domain vocabulary that overlaps with dictionary entries).",
      inputSchema: {
        type: "object",
        properties: {
          words: {
            type: "array",
            items: { type: "string" },
            description: "Words to whitelist",
          },
        },
        required: ["words"],
      },
      handler: (args) => {
        const words = requireStringArray(args, "words");
        filter.addToWhitelist(words);
        return { whitelisted: words.length };
      },
    },
    {
      name: "load_language",
      description:
        "Load an additional built-in language dictionary. Available: " +
        "english, hindi, french, german, spanish, bengali, tamil, telugu, " +
        "brazilian. English and Hindi are loaded by default.",
      inputSchema: {
        type: "object",
        properties: {
          language: { type: "string", description: "Language key to load" },
        },
        required: ["language"],
      },
      handler: (args) => {
        const language = requireString(args, "language");
        const loaded = filter.loadLanguage(language);
        return { loaded, loadedLanguages: filter.getLoadedLanguages() };
      },
    },
    {
      name: "list_languages",
      description:
        "List currently loaded language dictionaries and all available " +
        "built-in languages.",
      inputSchema: { type: "object", properties: {} },
      handler: () => ({
        loaded: filter.getLoadedLanguages(),
        available: filter.getAvailableLanguages(),
      }),
    },
    {
      name: "get_documentation",
      description:
        "Get AllProfanity documentation. Call without arguments for the " +
        "list of topics, then with a topic (e.g. 'Quick Start', " +
        "'API Reference', 'How It Compares', 'presets') for that section. " +
        "Use this to learn how to integrate or configure the library.",
      inputSchema: {
        type: "object",
        properties: {
          topic: {
            type: "string",
            description:
              "Documentation topic. Omit to list all available topics.",
          },
        },
      },
      handler: (args) =>
        getDocumentation(
          typeof args.topic === "string" ? args.topic : undefined
        ),
    },
  ];

  const toolsByName = new Map(tools.map((tool) => [tool.name, tool]));

  function toolResult(payload: unknown, isError = false) {
    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      ...(isError ? { isError: true } : {}),
    };
  }

  function handleToolsCall(params: unknown) {
    const { name, arguments: args } = (params ?? {}) as {
      name?: string;
      arguments?: Record<string, unknown>;
    };
    const tool = name ? toolsByName.get(name) : undefined;
    if (!tool) {
      return toolResult({ error: `Unknown tool: ${name}` }, true);
    }
    try {
      return toolResult(tool.handler(args ?? {}));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return toolResult({ error: message }, true);
    }
  }

  function handleRequest(request: JsonRpcRequest): JsonRpcResponse | null {
    // Notifications (no id) never get a response
    if (request.id === undefined || request.method.startsWith("notifications/")) {
      return null;
    }

    const respond = (result: unknown): JsonRpcResponse => ({
      jsonrpc: "2.0",
      id: request.id ?? null,
      result,
    });

    switch (request.method) {
      case "initialize": {
        const clientVersion = (request.params as { protocolVersion?: string })
          ?.protocolVersion;
        return respond({
          protocolVersion:
            typeof clientVersion === "string"
              ? clientVersion
              : PROTOCOL_VERSION,
          capabilities: { tools: {}, resources: {} },
          serverInfo: { name: "allprofanity", version: SERVER_VERSION },
        });
      }

      case "ping":
        return respond({});

      case "resources/list":
        return respond({
          resources: resources.map(({ uri, name, description, mimeType }) => ({
            uri,
            name,
            description,
            mimeType,
          })),
        });

      case "resources/read": {
        const uri = (request.params as { uri?: string })?.uri;
        const resource = resources.find((entry) => entry.uri === uri);
        if (!resource) {
          return {
            jsonrpc: "2.0",
            id: request.id ?? null,
            error: { code: -32602, message: `Unknown resource: ${uri}` },
          };
        }
        return respond({
          contents: [
            {
              uri: resource.uri,
              mimeType: resource.mimeType,
              text: readDoc(resource.path),
            },
          ],
        });
      }

      case "tools/list":
        return respond({
          tools: tools.map(({ name, description, inputSchema }) => ({
            name,
            description,
            inputSchema,
          })),
        });

      case "tools/call":
        return respond(handleToolsCall(request.params));

      default:
        return {
          jsonrpc: "2.0",
          id: request.id ?? null,
          error: { code: -32601, message: `Method not found: ${request.method}` },
        };
    }
  }

  return { handleRequest };
}

import { createMcpServer } from "../src/mcp/server.js";

type Rpc = { jsonrpc: "2.0"; id?: number; method: string; params?: unknown };

const req = (method: string, params?: unknown, id: number = 1): Rpc => ({
  jsonrpc: "2.0",
  id,
  method,
  params,
});

const callTool = (
  server: ReturnType<typeof createMcpServer>,
  name: string,
  args: Record<string, unknown>
) => {
  const response: any = server.handleRequest(
    req("tools/call", { name, arguments: args })
  );
  const result = response.result;
  return { ...result, parsed: JSON.parse(result.content[0].text) };
};

describe("MCP server", () => {
  describe("protocol handshake", () => {
    test("initialize returns server info and tool capability", () => {
      const server = createMcpServer();
      const response: any = server.handleRequest(
        req("initialize", {
          protocolVersion: "2025-06-18",
          capabilities: {},
          clientInfo: { name: "test", version: "1.0" },
        })
      );
      expect(response.jsonrpc).toBe("2.0");
      expect(response.id).toBe(1);
      expect(response.result.serverInfo.name).toBe("allprofanity");
      expect(response.result.capabilities.tools).toBeDefined();
      expect(response.result.protocolVersion).toBe("2025-06-18");
    });

    test("notifications get no response", () => {
      const server = createMcpServer();
      expect(
        server.handleRequest({
          jsonrpc: "2.0",
          method: "notifications/initialized",
        })
      ).toBeNull();
    });

    test("ping returns an empty result", () => {
      const server = createMcpServer();
      const response: any = server.handleRequest(req("ping"));
      expect(response.result).toEqual({});
    });

    test("unknown method returns method-not-found error", () => {
      const server = createMcpServer();
      const response: any = server.handleRequest(req("bogus/method"));
      expect(response.error.code).toBe(-32601);
    });
  });

  describe("tools/list", () => {
    test("lists all profanity tools with schemas", () => {
      const server = createMcpServer();
      const response: any = server.handleRequest(req("tools/list"));
      const names = response.result.tools.map((t: any) => t.name);
      expect(names).toEqual(
        expect.arrayContaining([
          "check_profanity",
          "detect_profanity",
          "clean_profanity",
          "add_words",
          "add_to_whitelist",
          "load_language",
          "list_languages",
        ])
      );
      for (const tool of response.result.tools) {
        expect(typeof tool.description).toBe("string");
        expect(tool.inputSchema.type).toBe("object");
      }
    });
  });

  describe("tools/call", () => {
    test("check_profanity detects evasion and passes clean text", () => {
      const server = createMcpServer();
      expect(callTool(server, "check_profanity", { text: "f*ck" }).parsed)
        .toEqual({ hasProfanity: true });
      expect(
        callTool(server, "check_profanity", { text: "a clean sentence" })
          .parsed
      ).toEqual({ hasProfanity: false });
    });

    test("detect_profanity returns full analysis", () => {
      const server = createMcpServer();
      const { parsed } = callTool(server, "detect_profanity", {
        text: "what the fuck",
      });
      expect(parsed.hasProfanity).toBe(true);
      expect(parsed.detectedWords).toContain("fuck");
      expect(parsed.cleanedText).toBe("what the ****");
      expect(parsed.severity).toBe("MILD");
      expect(parsed.positions).toHaveLength(1);
    });

    test("clean_profanity supports character and word modes", () => {
      const server = createMcpServer();
      expect(
        callTool(server, "clean_profanity", { text: "fuck this" }).parsed
          .cleanedText
      ).toBe("**** this");
      expect(
        callTool(server, "clean_profanity", {
          text: "fuck this",
          mode: "word",
          placeholder: "[CENSORED]",
        }).parsed.cleanedText
      ).toBe("[CENSORED] this");
    });

    test("add_words extends the dictionary for the session", () => {
      const server = createMcpServer();
      expect(
        callTool(server, "check_profanity", { text: "zzcustomzz" }).parsed
          .hasProfanity
      ).toBe(false);
      callTool(server, "add_words", { words: ["zzcustomzz"] });
      expect(
        callTool(server, "check_profanity", { text: "zzcustomzz" }).parsed
          .hasProfanity
      ).toBe(true);
    });

    test("add_to_whitelist suppresses matches", () => {
      const server = createMcpServer();
      callTool(server, "add_to_whitelist", { words: ["hell"] });
      expect(
        callTool(server, "check_profanity", { text: "what the hell" }).parsed
          .hasProfanity
      ).toBe(false);
    });

    test("load_language enables additional languages", () => {
      const server = createMcpServer();
      callTool(server, "load_language", { language: "french" });
      expect(
        callTool(server, "check_profanity", { text: "merde alors" }).parsed
          .hasProfanity
      ).toBe(true);
    });

    test("list_languages reports loaded and available languages", () => {
      const server = createMcpServer();
      const { parsed } = callTool(server, "list_languages", {});
      expect(parsed.loaded).toEqual(
        expect.arrayContaining(["english", "hindi"])
      );
      expect(parsed.available).toEqual(
        expect.arrayContaining(["french", "german", "spanish"])
      );
    });

    test("unknown tool returns isError result", () => {
      const server = createMcpServer();
      const response: any = server.handleRequest(
        req("tools/call", { name: "bogus_tool", arguments: {} })
      );
      expect(response.result.isError).toBe(true);
    });

    test("invalid arguments return isError result", () => {
      const server = createMcpServer();
      const response: any = server.handleRequest(
        req("tools/call", { name: "check_profanity", arguments: {} })
      );
      expect(response.result.isError).toBe(true);
      expect(response.result.content[0].text).toMatch(/text/);
    });
  });

  describe("documentation", () => {
    test("get_documentation without topic lists available topics", () => {
      const server = createMcpServer();
      const { parsed } = callTool(server, "get_documentation", {});
      expect(Array.isArray(parsed.topics)).toBe(true);
      expect(parsed.topics.length).toBeGreaterThan(5);
      expect(parsed.topics.join(" ")).toMatch(/Quick Start/i);
    });

    test("get_documentation returns a README section by topic", () => {
      const server = createMcpServer();
      const { parsed } = callTool(server, "get_documentation", {
        topic: "Quick Start",
      });
      expect(parsed.topic).toMatch(/Quick Start/i);
      expect(parsed.content).toContain("import profanity from 'allprofanity'");
    });

    test("get_documentation serves the preset guide", () => {
      const server = createMcpServer();
      const { parsed } = callTool(server, "get_documentation", {
        topic: "presets",
      });
      expect(parsed.content).toContain("chat-app.json");
    });

    test("get_documentation reports unknown topics with suggestions", () => {
      const server = createMcpServer();
      const response: any = server.handleRequest(
        req("tools/call", {
          name: "get_documentation",
          arguments: { topic: "zzz-no-such-topic" },
        })
      );
      expect(response.result.isError).toBe(true);
      expect(response.result.content[0].text).toMatch(/topics/i);
    });

    test("initialize advertises the resources capability", () => {
      const server = createMcpServer();
      const response: any = server.handleRequest(
        req("initialize", { protocolVersion: "2025-06-18" })
      );
      expect(response.result.capabilities.resources).toBeDefined();
    });

    test("resources/list and resources/read serve the docs", () => {
      const server = createMcpServer();
      const list: any = server.handleRequest(req("resources/list"));
      const uris = list.result.resources.map((r: any) => r.uri);
      expect(uris).toContain("allprofanity://docs/readme");
      expect(uris).toContain("allprofanity://docs/config-presets");

      const read: any = server.handleRequest(
        req("resources/read", { uri: "allprofanity://docs/readme" })
      );
      expect(read.result.contents[0].mimeType).toBe("text/markdown");
      expect(read.result.contents[0].text).toContain("# AllProfanity");
    });

    test("resources/read of an unknown uri returns an error", () => {
      const server = createMcpServer();
      const response: any = server.handleRequest(
        req("resources/read", { uri: "allprofanity://docs/missing" })
      );
      expect(response.error).toBeDefined();
    });
  });
});

# AllProfanity MCP Server

AllProfanity ships a built-in [Model Context Protocol](https://modelcontextprotocol.io) server (`allprofanity-mcp`) so AI agents can check, analyze and clean text — and read the library's documentation — with **zero integration code and zero extra dependencies**.

## Connect an agent (no code required)

**Claude Code:**

```bash
claude mcp add allprofanity -- npx -y -p allprofanity allprofanity-mcp
```

**Claude Desktop** (`claude_desktop_config.json`) **/ Cursor / any MCP client:**

```json
{
  "mcpServers": {
    "allprofanity": {
      "command": "npx",
      "args": ["-y", "-p", "allprofanity", "allprofanity-mcp"],
      "env": {
        "ALLPROFANITY_LANGUAGES": "french,german,spanish"
      }
    }
  }
}
```

Once connected, ask the agent things like *"check whether this comment is profane"*, *"censor the bad words in this text"*, or *"how do I configure allprofanity for a kids' platform?"* — the last one works because the server exposes the library docs via the `get_documentation` tool and as MCP resources.

## Tools

| Tool | What it does |
|---|---|
| `check_profanity` | Fast boolean check (evasion-resistant) |
| `detect_profanity` | Full analysis: words, positions, severity, cleaned text |
| `clean_profanity` | Censor text (character or word mode, custom placeholder) |
| `add_words` | Add session-specific banned words |
| `add_to_whitelist` | Whitelist safe vocabulary |
| `load_language` | Load any of the 9 built-in languages |
| `list_languages` | Show loaded/available languages |
| `get_documentation` | Read the library docs (topics or full sections) |

## Configuration

| Env var | Effect |
|---|---|
| `ALLPROFANITY_LANGUAGES` | Comma-separated languages to preload (english and hindi load by default) |
| `ALLPROFANITY_CONFIG` | Path to an `allprofanity.config.json` — any [preset](../../examples-config/README.md) works |

## Demo client

[`demo-client.mjs`](./demo-client.mjs) spawns the server over stdio and exercises the protocol — useful for verifying your setup or as a starting point for custom (non-MCP-framework) integrations:

```bash
# from the repository root
npm run build
node examples/mcp/demo-client.mjs
```

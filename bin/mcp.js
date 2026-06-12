#!/usr/bin/env node
// AllProfanity MCP server — newline-delimited JSON-RPC over stdio.
// Usage: npx -p allprofanity allprofanity-mcp
import { runStdioServer } from "../dist/mcp/stdio.js";

runStdioServer();

# Context7 Integration

Context7 (context7.com) provides up-to-date documentation and code examples for your tech stack, ensuring your agent uses the latest APIs and best practices.

## Setup

1.  **Get API Key**: Go to [context7.com](https://context7.com) and get your API key.
2.  **Configure Agent**:
    *   **Cursor/Windsurf**: Add Context7 as an MCP server.
        *   Server URL: `https://context7.com/api/mcp` (or as per their specific MCP setup instructions)
        *   Env: `CONTEXT7_API_KEY=your_key`
    *   **Manual**: Just tell the agent "Use Context7 to look up documentation for [library]" if you have the proper system prompt or tool configured.

## Usage

When running `/research-tech` or implementation commands, the agent will look for Context7 tools.

### Example Prompts
- "Using Context7, interpret the latest docs for Next.js App Router."
- "Check Context7 for `shadcn/ui` installation steps."

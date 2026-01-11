# @theproductguy/create-mission-control

The official scaffolding tool for **Agent OS** applications.

Agent OS provides a structured workspace for building AI Agents, including:
- **Control Center**: A local dashboard to manage your agent's mission, specs, and status.
- **Design OS**: A pre-configured Design System (colors, typography, components) to ensure your agent's UI looks premium.
- **Agent OS UI**: A component library optimized for building agentic interfaces.

## Usage

To create a new project, run:

```bash
npx @theproductguy/create-mission-control@latest
```

Follow the prompts to name your project.

## Workspace Structure

The scaffolded workspace includes:
- `app/`: Your main application (React + Vite).
- `control-center/`: Local tools for managing the agent lifecycle.
- `design-system/`: Your customizable design system documentation.
- `agent-os/`: Markdown-based storage for specs, roadmap, and tasks.

## Getting Started

1. `cd <project-name>`
2. `npm install`
3. `npm run dev`

This will start all services concurrently:
- **Control Center**: http://localhost:3001
- **Design OS**: http://localhost:3000
- **Your App**: http://localhost:3002

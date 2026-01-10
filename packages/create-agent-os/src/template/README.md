# {PROJECT_NAME}

> Built with [Agent OS](https://github.com/s1dd4rth/mission-control) — Design-driven development

## Quick Start

```bash
# Install dependencies
npm install

# Start development servers
npm run dev
```

This will start:
- **Design OS:** http://localhost:5400
- **Mission Control:** http://localhost:5401
- **Application:** http://localhost:5402
- **API:** http://localhost:5403

## Project Structure

```
├── agent-os/              # Product strategy & commands
│   ├── product/           # Mission, roadmap, tech stack
│   ├── commands/          # Agent OS commands
│   ├── specs/             # Feature specifications
│   └── constitution.md    # Project principles
│
├── design-system/         # Design OS
│   ├── .gemini/           # Commands, skills, hooks
│   ├── product/           # Synced from agent-os
│   └── src/               # Design components
│
├── control-center/        # Mission Control dashboard
│   ├── frontend/          # React dashboard
│   └── backend/           # API server
│
└── app/                   # Your application
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start all development servers |
| `npm run build` | Build for production |
| `npm test` | Run tests |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm run typecheck` | TypeScript type checking |

## Workflow

1. **Plan** — Define mission, roadmap, and tech stack
2. **Design** — Create design tokens, shell, and sections
3. **Specify** — Shape detailed feature specifications
4. **Implement** — Build features with TDD approach

## Quality Commands

| Command | Purpose |
|---------|---------|
| `/create-constitution` | Establish project principles |
| `/research-tech` | Research tech stack best practices |
| `/audit` | Run accessibility & quality audit |
| `/polish` | Final visual refinements |

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run `npm run lint && npm test`
4. Submit a pull request

## License

MIT

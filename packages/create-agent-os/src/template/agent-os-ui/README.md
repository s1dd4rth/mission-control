# @builderos/agent-os-ui

The official UI capability for the **Agent OS** workflow.
Use this library to build the control interface that guides you through the Antigravity development process (Product -> Design -> Build -> Verify).

## Installation

```bash
npm install @builderos/agent-os-ui
```

## Setup

1. Import the styles:
```ts
import '@builderos/agent-os-ui/style.css';
```

2. Build your Control Dashboard:
```tsx
import { AgentShell, GuidanceCard } from '@builderos/agent-os-ui';

export function ControlCenter() {
  return (
    <AgentShell sidebar={...}>
      <div className="p-8 space-y-6">
        {/* The core workflow component */}
        <GuidanceCard 
           phase="Phase 1: Strategy"
           title="Plan Your Product"
           description="Define your Mission and Roadmap."
           prompt="Antigravity, plan the product..."
        />
      </div>
    </AgentShell>
  );
}
```

## Features
- **AgentShell**: Full application layout (Sidebar + Header + Main).
- **AgentSidebar**: Standardized navigation menu.
- **GuidanceCard**: The "Next Step" card with integrated prompt copying.
- **ThemeToggle**: Dark/Light mode switcher with system sync.
- **MarkdownViewer**: Beautifully styled Markdown rendering (Prose).
- **StatusItem**: Standardized pills for checking system health.

## Example Layout

```tsx
import { AgentShell, AgentSidebar, ThemeToggle } from '@builderos/agent-os-ui';
import { Home, Layers } from 'lucide-react';

export default function App() {
  return (
    <AgentShell
      sidebar={
         <AgentSidebar 
           items={[
             { label: 'Home', icon: <Home size={18}/>, active: true },
             { label: 'Design', icon: <Layers size={18}/> }
           ]}
           footer={<ThemeToggle />}
         />
      }
    >
      <div className="p-8">
        <h1 className="text-2xl font-bold">Welcome to Agent OS</h1>
      </div>
    </AgentShell>
  )
}
```

# Design Shell

You are helping the user design the application shell — the persistent navigation and layout that wraps all sections. This is a screen design, not implementation code.

**CRITICAL: Consult the `frontend-design` skill (Impeccable) for spatial design and layout.**
You must avoid "AI Slop" layouts (e.g., everything inside a card, unnecessary glassmorphism, generic dashboards).

## Step 1: Check Prerequisites

First, verify prerequisites exist:

1. Read `/product/product-overview.md` — Product name and description
2. Read `/product/product-roadmap.md` — Sections for navigation
3. Check if `/product/design-system/colors.json` and `/product/design-system/typography.json` exist

If overview or roadmap are missing:

"Before designing the shell, you need to define your product and sections. Please run:
1. `/product-vision` — Define your product
2. `/product-roadmap` — Define your sections"

Stop here if overview or roadmap are missing.

If design tokens are missing, show a warning but continue:

"Note: Design tokens haven't been defined yet. I'll proceed with default styling, but you may want to run `/design-tokens` first for consistent colors and typography."

## Step 2: Analyze Product Structure and Aesthetics

Review the roadmap sections and consult Impeccable principles for the layout.

"I'm designing the shell for **[Product Name]**. Based on your roadmap, you have [N] sections.
Using **Impeccable** design principles, let's aim for a layout that uses space and rhythm effectively (avoiding the generic 'everything in a card' trap).

Common patterns:

**A. Modern Sidebar** — Vertical nav on the left.
*Impeccable Tip:* Don't box the content area. Let the content breathe on the right.

**B. Refined Top Nav** — Horizontal nav at top.
*Impeccable Tip:* Great for marketing-heavy or simpler apps. Use generous whitespace.

**C. Minimal/Focus** — Just logo + user menu.
*Impeccable Tip:* Radical simplicity.

Which pattern fits **[Product Name]** best?"

Wait for their response.

## Step 3: Gather Design Details

Use AskUserQuestion to clarify:

- "Where should the user menu (avatar, logout) appear?"
- "Do you want the sidebar collapsible?"
- "Any additional items in the navigation?"
- "What vibe should the shell have? (e.g., Transparency/Glass (use sparingly), Solid/Grounded, or Floating/Detached?)"

## Step 4: Present Shell Specification

Once you understand their preferences:

"Here's the shell design for **[Product Name]**:

**Layout Pattern:** [Sidebar/Top Nav/Minimal]

**Navigation Structure:**
- [Nav Item 1] → [Section]
...

**Aesthetic Decisions (Impeccable):**
- **Background:** [e.g., Subtle tint of primary color, NOT pure white/gray]
- **Spacing:** [e.g., Generous padding, fluid layout]
- **Borders:** [e.g., Delicate or None; avoiding thick borders]

**Responsive Behavior:**
- Desktop: [How it looks]
- Mobile: [How it adapts]

Does this match what you had in mind?"

Iterate until approved.

## Step 5: Create the Shell Specification

Create `/product/shell/spec.md`:

```markdown
# Application Shell Specification

## Overview
[Description of the shell design and its purpose]

## Navigation Structure
...

## Impeccable Design Choices
- **Layout Philosophy:** [e.g., Unboxed content, asymmetric grid]
- **Visuals:** [e.g., No drop shadows on cards, use flat clean lines]

## Layout Pattern
[Description of the layout — sidebar, top nav, etc.]

## Responsive Behavior
...
```

## Step 6: Create Shell Components

Create the shell components at `src/shell/components/`.

**Impeccable Code Rules:**
- **No Pure Black/White**: Use `bg-stone-50` or `text-zinc-900`.
- **Motion**: Use `transition-all duration-300 ease-out-expo` (if configured) or custom bezier. Avoid default `ease-in-out`.
- **Touch Targets**: Ensure minimum 44px for clickable areas.

### AppShell.tsx
The main wrapper component.

```tsx
interface AppShellProps {
  children: React.ReactNode
  navigationItems: Array<{ label: string; href: string; isActive?: boolean }>
  user?: { name: string; avatarUrl?: string }
  onNavigate?: (href: string) => void
  onLogout?: () => void
}
```

### MainNav.tsx
The navigation component.

### UserMenu.tsx
The user menu.

### index.ts
Export all components.

## Step 7: Create Shell Preview

Create `src/shell/ShellPreview.tsx` — a preview wrapper for viewing the shell in Design OS:

```tsx
import data from '@/../product/sections/[first-section]/data.json' // if exists
import { AppShell } from './components/AppShell'

export default function ShellPreview() {
  const navigationItems = [
    { label: '[Section 1]', href: '/section-1', isActive: true },
    // ...
  ]

  const user = {
    name: 'Alex Morgan',
    avatarUrl: undefined,
  }

  return (
    <AppShell
      navigationItems={navigationItems}
      user={user}
      onNavigate={(href) => console.log('Navigate to:', href)}
      onLogout={() => console.log('Logout')}
    >
      <div className="p-8">
        <div className="mb-8">
             <h1 className="text-4xl font-display font-bold mb-4 text-foreground tracking-tight">Content Area</h1>
             <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
               Section content will render here. Notice the typography and spacing (Impeccable).
             </p>
        </div>
        {/* Example Grid to show Rhythm */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-32 bg-secondary/30 rounded-xl border border-border/50"></div>
            <div className="h-32 bg-secondary/30 rounded-xl border border-border/50"></div>
            <div className="h-32 bg-primary/5 rounded-xl border border-primary/10"></div>
        </div>
      </div>
    </AppShell>
  )
}
```

## Step 8: Apply Design Tokens

If design tokens exist, apply them to the shell components:

**Colors:**
- Read `/product/design-system/colors.json`
- Use primary color for active nav items, key accents
- Use secondary color for hover states, subtle highlights
- Use neutral color for backgrounds, borders, text

**Typography:**
- Read `/product/design-system/typography.json`
- Apply heading font to nav items and titles
- Apply body font to other text
- Include Google Fonts import in the preview

## Step 9: Confirm Completion

Let the user know:

"I've designed the application shell for **[Product Name]**:

**Created files:**
- `/product/shell/spec.md`
- `src/shell/components/...`
- `src/shell/ShellPreview.tsx`

**Impeccable Features:**
- **Navigation**: Clean, accessible, spacious.
- **Aesthetics**: Using your custom palette and fonts.
- **Motion**: Smooth transitions.

**Important:** Restart your dev server to see the changes.

Next: Run `/shape-section` to start designing your first section."

## Important Notes

- **Aesthetics First**: The shell sets the tone. Make it high quality.
- The shell is a screen design — it demonstrates the navigation and layout design
- Components are props-based and portable to the user's codebase
- The preview wrapper is for Design OS only — not exported
- Apply design tokens when available for consistent styling
- Section screen designs will render inside the shell's content area

## Step 10: Auto-Audit (Impeccable QA)

Before completing, perform a self-audit against Impeccable layout principles.

**Check:**
1. Is everything wrapped in cards? (Nested cards, card grids) → Fail
2. Is glassmorphism used for decoration rather than function? → Fail
3. Is the layout symmetric and predictable (centered everything)? → Warn
4. Are there "hero metrics" layouts (big number, small label)? → Fail
5. Is spacing varied (rhythm) or uniform (monotonous)? → Pass/Fail
6. Are touch targets ≥ 44x44px? → Pass/Fail

**If any checks fail:**
"⚠️ **Impeccable Audit Warning**: [Issue]. This layout may appear AI-generated. Consider revising."

**If all checks pass:**
"✅ **Impeccable Audit Passed**: Shell design meets quality standards."

Save this audit result to `design-system/QA/shell-audit.md`:
```markdown
# Shell Design Audit

**Date**: [timestamp]
**Status**: [Pass/Fail]

## Checks
- [x] No nested cards
- [x] Glassmorphism used purposefully (or not at all)
- [x] Asymmetric/intentional layout
- [x] No hero metric templates
- [x] Visual rhythm in spacing
- [x] Touch targets adequate

## Notes
[Any observations]
```

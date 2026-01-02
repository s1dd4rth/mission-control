# Export Product Package

You are helping the user export their complete product design as a handoff package for implementation. This generates all files needed to build the product in a real codebase.

## Step 1: Check Prerequisites

Verify the minimum requirements exist:

**Required:**
- `design-system/product/product-overview.md` — Product overview
- `design-system/product/product-roadmap.md` — Sections defined
- At least one section with screen designs in `design-system/src/sections/[section-id]/`

**Recommended (show warning if missing):**
- `design-system/product/data-model/data-model.md` — Global data model
- `design-system/public/product/design-system/colors.json` — Color tokens
- `design-system/public/product/design-system/typography.json` — Typography tokens
- `design-system/src/shell/components/AppShell.tsx` — Application shell

If required files are missing, stop and ask the user to complete them first.

## Step 2: Create Export Directory Structure

Create the `product-plan/` directory in the project root with this structure:

```
product-plan/
├── README.md                    # Quick start guide
├── product-overview.md          # Product summary (always provide)
│
├── prompts/                     # Ready-to-use prompts for coding agents
│   ├── one-shot-prompt.md       # Prompt for full implementation
│   └── section-prompt.md        # Prompt template for section-by-section
│
├── instructions/                # Implementation instructions
│   ├── one-shot-instructions.md # All milestones combined
│   └── incremental/             # For milestone-by-milestone implementation
│       ├── 01-foundation.md
│       ├── 02-[first-section].md
│       ├── 03-[second-section].md
│       └── ...
│
├── design-system/               # Design tokens
│   ├── tokens.css
│   ├── tailwind-colors.md
│   └── fonts.md
│   ├── colors.json
│   └── typography.json
│
├── data-model/                  # Data model
│   ├── README.md
│   ├── types.ts
│   └── sample-data.json
│
├── shell/                       # Shell components
│   ├── README.md
│   ├── components/
│   └── screenshot.png (if exists)
│
└── sections/                    # Section components
    └── [section-id]/
        ├── README.md
        ├── tests.md               # Test-writing instructions for TDD
        ├── components/
        ├── types.ts
        ├── sample-data.json
        └── screenshot.png (if exists)
```

## Step 3: Copy Core Documentation

1. Copy `design-system/product/product-overview.md` to `product-plan/product-overview.md`
2. Copy `design-system/product/product-roadmap.md` to `product-plan/product-roadmap.md`

## Step 4: Generate Design System Files

### tokens.css
Create `product-plan/design-system/tokens.css` based on `colors.json` and `typography.json` found in `design-system/public/product/design-system/`.

### tailwind-colors.md
Create `product-plan/design-system/tailwind-colors.md` mapping the colors to proper Tailwind configuration.

### Copy JSONs
Copy `colors.json` and `typography.json` to `product-plan/design-system/`.

## Step 5: Generate Data Model Files

If `design-system/product/data-model/data-model.md` exists, copy it to `product-plan/data-model/README.md`.
If schema types exist (e.g. `schema.ts`), copy to `product-plan/data-model/types.ts`.

## Step 6: Generate Milestone Instructions

(Same logic as internal Design OS command, adapted for path `design-system/src/...`)

### 01-foundation.md
Create `product-plan/instructions/incremental/01-foundation.md`.
Includes: Design tokens setup, App Shell (copy from `design-system/src/shell/`), and Routing structure.

### Section Milestones
For each section in the roadmap (`design-system/product/sections/[id]/`):
Create `product-plan/instructions/incremental/[NN]-[section-id].md`.
Content should include:
- Goal & Overview
- TDD Instructions (reference `product-plan/sections/[id]/tests.md`)
- Components listing
- Data Layer requirements
- Expected User Flows

## Step 7: Generate Section Assets

For each section:
1. Creates `product-plan/sections/[section-id]/README.md`
2. Creates `product-plan/sections/[section-id]/tests.md` (Framework-agnostic test specs)
3. Copies components from `design-system/src/sections/[section-id]/` to `product-plan/sections/[section-id]/components/`
   - **Crucial:** Transform imports to be relative!
4. Copies types and data from `design-system/product/sections/[section-id]/` to `product-plan/sections/[section-id]/`

## Step 8: Generate Prompt Files

**This is the most important step for the user.**

### product-plan/prompts/one-shot-prompt.md

```markdown
# One-Shot Implementation Prompt

I need you to implement a complete web application based on detailed design specifications.

## Instructions
1. Read **@product-plan/product-overview.md**
2. Read **@product-plan/instructions/one-shot-instructions.md** (which combines all milestones)

## Context
- **Design System:** @product-plan/design-system/
- **Data Model:** @product-plan/data-model/
- **Shell:** @product-plan/shell/
- **Sections:** @product-plan/sections/

## Before coding
Ask me satisfying questions about:
1. Authentication
2. User Modeling
3. Tech Stack
4. Backend Logic

Then create a plan and implement.
```

### product-plan/prompts/section-prompt.md

```markdown
# Section Implementation Prompt

## Variables
- **SECTION_ID**: [folder name]

## Instructions
I need you to implement the **SECTION_ID** section.

1. Read **@product-plan/product-overview.md**
2. Read **@product-plan/instructions/incremental/[Milestone]-SECTION_ID.md**

## Approach
Use Test-Driven Development (TDD) based on `@product-plan/sections/SECTION_ID/tests.md`.
```

## Step 9: Zip and Handoff

1. Zip `product-plan/` into `product-plan.zip`.
2. Copy `product-plan.zip` to `design-system/product-plan.zip` (so Design OS can detect it).
3. Sync key files to `app/agent-os/product/` (Overview, Roadmap, Data Model, Design System) to update the status in the main app dashboard.

## Final Output

Tell the user:
"Export complete!
- **Prompts:** `product-plan/prompts/`
- **Instructions:** `product-plan/instructions/`
- **Assets:** `product-plan/sections/`
- **Zip:** `product-plan.zip`

You can use `product-plan/prompts/one-shot-prompt.md` to start building!"

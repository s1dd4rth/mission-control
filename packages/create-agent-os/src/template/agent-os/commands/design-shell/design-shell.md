# COMMAND: Generate App Shell

## 🛡️ Hooks & Standards
- **Pre-Check**: Read `design-system/.gemini/hooks/ai-slop-guard.md`. Avoid all listed "slop" patterns.
- **Post-Check**: Read `design-system/.gemini/hooks/on-design-complete.md`. Perform the required audit for this phase.

## Goal
Design the application shell (navigation, layout) for the product.

## Prerequisites
- `design-system/product/product-roadmap.md` must exist (to determine navigation items).
- `design-system/product/product-overview.md` must exist.

## Instructions

### Step 1: Analyze Roadmap
Read the roadmap to determine the main navigation sections (e.g. Dashboard, Settings, Projects).

### Step 2: Create Shell Spec
Create `design-system/product/shell/spec.md`.

Format:
```markdown
# Application Shell Specification

## Overview
[Describe the layout strategy - e.g. Sidebar layout for complex apps, Top-nav for simple tools]

## Navigation Structure
- [Nav Item 1] -> [Link to Section]
- [Nav Item 2] -> [Link to Section]

## Layout Pattern
[Description of the layout components]
```

### Step 3: Verification
- Output: "App Shell designed! You can now view the layout in Design OS."

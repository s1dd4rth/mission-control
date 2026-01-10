# COMMAND: Shape Section Spec

## Goal
Create the technical specification (`spec.md`) for a specific product section.

## Prerequisites
- `design-system/product/product-roadmap.md` must exist.
- You must know the **Section Title** and **Section ID**.

## Instructions

### Step 1: Analyze Context
- Read `design-system/product/product-roadmap.md` to understand where this section fits.
- Read `design-system/product/product-overview.md` to understand the data model and core flows.
- Read `design-system/design-tokens.md` and `design-system/app-shell.md` to understand the design language and layout constraints.

### Step 2: Create Spec File
Create `design-system/product/sections/[section-id]/spec.md`.

Format:
```markdown
# [Section Title] Specification

## Overview
[A clear, concise description of what this section does and its purpose.]

## User Flows
- [User Action] -> [System Response] -> [Next Step]
- [User Action] -> [System Response]

## UI Requirements
- [Requirement 1: e.g., A list of items with sortable columns]
- [Requirement 2: e.g., A primary action button in the top right]
- [Requirement 3]

## Configuration
- shell: true (or false if this is a standalone public page like login)
```

### Step 3: Verification
- Output: "Spec for '[Section Title]' created! You can now view it in Design OS."

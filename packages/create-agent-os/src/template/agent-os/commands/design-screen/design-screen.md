# COMMAND: Design Screen Component

## 🛡️ Hooks & Standards
- **Pre-Check**: Read `design-system/.gemini/hooks/ai-slop-guard.md`. Avoid all listed "slop" patterns.
- **Post-Check**: Read `design-system/.gemini/hooks/on-design-complete.md`. Perform the required audit for this phase.

## Goal
Implement a React component for a specific screen design within a section.

## Prerequisites
- `design-system/product/sections/[section-id]/spec.md` (for requirements).
- `design-system/product/sections/[section-id]/data.json` (for sample data).
- `design-system/src/components/ui` (Design System components must be used).
- You must know the **Section Title** and **Section ID**.

## Instructions

### Step 1: Analyze Requirements
- Read the Spec to understand the user flow and UI requirements.
- Read the Data to understand the content structure.

### Step 2: Create Component
Create `design-system/src/sections/[section-id]/[ComponentName].tsx`.

**Guidelines:**
- Use `lucide-react` for icons.
- Use `Tailwind CSS` for styling (matching `colors.json` and `typography.json`).
- Import UI components from `@/components/ui/...`.
- **Mock Data**: Import data from the section's `data.json` if possible, or define strictly typed mock data within the file matching the real data structure.
- **Props**: The component can accept props but should have a default export with no required props for easy rendering in the viewer.

### Step 3: Register Component
(Note: The `section-loader.ts` will automatically pick up any `.tsx` file in `src/sections/[id]/` as a screen design. No manual registration needed.)

### Step 4: Verification
- Output: "Screen design '[ComponentName]' created! You can now view it in Design OS."

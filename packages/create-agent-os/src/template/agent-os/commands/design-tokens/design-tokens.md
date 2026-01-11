# COMMAND: Generate Design Tokens

## 🛡️ Hooks & Standards
- **Pre-Check**: Read `design-system/.gemini/hooks/ai-slop-guard.md`. Avoid all listed "slop" patterns.
- **Post-Check**: Read `design-system/.gemini/hooks/on-design-complete.md`. Perform the required audit for this phase.
- **Skill**: Read `design-system/.gemini/skills/frontend-design/SKILL.md`. Apply these aesthetic principles to every decision.

## Goal
Create the visual foundation (colors, typography) for the product based on its Mission and Brand.

## Prerequisites
- `design-system/product/product-overview.md` must exist.

## Instructions

### Step 1: Analyze Product Brand
Read `design-system/product/product-overview.md` to understand the product's mood, target audience, and vibe (e.g., "Professional & Trustworthy" vs "Playful & Vibrant").

### Step 2: Generate Color Key
Create `design-system/product/design-system/colors.json` with the following structure. select colors that match the brand.
```json
{
  "primary": "blue",    // e.g. blue, indigo, violet, rose (Tailwind color names)
  "secondary": "slate", // e.g. slate, gray, zinc, stone
  "neutral": "gray"     // e.g. slate, gray, zinc, stone
}
```

### Step 3: Generate Typography
Create `design-system/product/design-system/typography.json`.
```json
{
  "heading": "Inter",      // e.g. Inter, DM Sans, Roboto, Playfair Display
  "body": "Inter",         // e.g. Inter, Roboto, Open Sans
  "mono": "JetBrains Mono" // e.g. JetBrains Mono, Fira Code, IBM Plex Mono
}
```

### Step 4: Verification
- Check that the files exist.
- Output: "Design Tokens generated! You can now view them in Design OS."

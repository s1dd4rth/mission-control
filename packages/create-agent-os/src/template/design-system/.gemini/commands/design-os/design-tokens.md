# Design Tokens

You are helping the user choose colors and typography for their product. These design tokens will be used consistently across all screen designs and the application shell.

**CRITICAL: Consult the `frontend-design` skill (Impeccable) for all aesthetics.**
You must avoid "AI Slop" (generic choices like Inter, plain Tailwind colors, and predictable pairings).

## Step 1: Check Prerequisites

First, verify that the product overview exists:

Read `/product/product-overview.md` to understand what the product is.

If it doesn't exist:

"Before defining your design system, you'll need to establish your product vision. Please run `/product-vision` first."

Stop here if the prerequisite is missing.

## Step 2: Explain the Process

"Let's define the visual identity for **[Product Name]**. We will use the **Impeccable** design methodology to ensure a distinctive, premium feel.

I'll help you choose:
1. **Colors** — A primary accent, secondary accent, and neutral palette (using `oklch` or wide-gamut principles where possible, mapped to Tailwind).
2. **Typography** — Distinctive fonts that give your product character (no generic defaults).

These will be applied consistently across all your screen designs and the application shell.

Do you have any existing brand colors or fonts in mind, or would you like suggestions?"

Wait for their response.

## Step 3: Choose Colors

Help the user select from Tailwind's built-in color palette, but choose **Opinionated** combinations.
*Impeccable Rule:* Dominant colors with sharp accents outperform timid, evenly-distributed palettes.

"For colors, we'll pick from Tailwind's palette. I recommend avoiding the standard 'safe' blues and grays unless they are tinted or paired dramatically.

**Primary color** (main accent, buttons, links):
*Aim for character:* `violet`, `rose`, `amber`, `emerald`, `indigo` (avoid generic `blue` unless styled heavily)

**Secondary color** (complementary accent, tags, highlights):
Should support the primary—consider a split-complementary or analog.

**Neutral color** (backgrounds, text, borders):
*Impeccable Rule:* Never use pure gray. Tint your neutrals towards the primary hue.
Options: `slate` (cool), `zinc` (tech), `stone` (warm/earthy), `neutral`

Based on [Product Name], I'd suggest:
- **Primary:** [suggestion] — [why it fits the 'Impeccable' vibe]
- **Secondary:** [suggestion] — [why it complements]
- **Neutral:** [suggestion] — [why it works]

What feels right for your product?"

Use AskUserQuestion to gather their preferences if they're unsure:

- "What vibe are you going for? Brutalist, Organic, Minimalist, Cyber?"
- "Any colors you definitely want to avoid?"
- "Light mode, dark mode, or both?"

## Step 4: Choose Typography

Help the user select Google Fonts.
**Impeccable Rule:** Avoid `Inter`, `Roboto`, `Open Sans`, `Arial`, `Lato`. They are "AI Slop" markers.
Choose fonts with personality.

"For typography, we'll use Google Fonts. We will avoid generic defaults to ensure your app stands out.

**Heading font** (titles, section headers):
*Distinctive Choices:* `Outfit`, `Manrope`, `Space Grotesk`, `Syne`, `Epilogue`, `DM Serif Display`, `Playfair Display`

**Body font** (paragraphs, UI text):
*Readable but refined:* `Plus Jakarta Sans`, `DM Sans`, `Satoshi` (if avail), `Urbanist`
*Avoid:* Inter, Roboto (too generic)

**Mono font** (code, technical content):
Options: `JetBrains Mono`, `IBM Plex Mono`, `Fira Code`, `Space Mono`

My suggestions for [Product Name]:
- **Heading:** [suggestion] — [why]
- **Body:** [suggestion] — [why]
- **Mono:** [suggestion] — [why]

What do you prefer?"

## Step 5: Present Final Choices

Once they've made decisions:

"Here's your design system:

**Colors:**
- Primary: `[color]`
- Secondary: `[color]`
- Neutral: `[color]`

**Typography:**
- Heading: [Font Name]
- Body: [Font Name]
- Mono: [Font Name]

Does this look good? Ready to save it?"

## Step 6: Create the Files

Once approved, create two files:

**File 1:** `/product/design-system/colors.json`
```json
{
  "primary": "[color]",
  "secondary": "[color]",
  "neutral": "[color]"
}
```

**File 2:** `/product/design-system/typography.json`
```json
{
  "heading": "[Font Name]",
  "body": "[Font Name]",
  "mono": "[Font Name]"
}
```

## Step 7: Implement Changes in Code

Now, apply these choices to the running application:

1.  **Update Fonts**:
    -   Modify `index.html`.
    -   Replace the existing Google Fonts `<link>` with the new selection.
    -   Ensure you include weights 400, 500, 700 for non-mono, and 400 for mono.

2.  **Update Colors**:
    -   Modify `src/index.css`.
    -   Replace the CSS variables in `:root` and `.dark` with the `oklch` values of the chosen Tailwind colors (you can approximate or use a converter if needed, or mapped hex values if `oklch` is too complex, but Impeccable prefers `oklch`).
    -   Ensure `--font-display`, `--font-body`, and `--font-mono` in `src/index.css` or `tailwind.config.js` match the new font names.

## Step 8: Confirm Completion

Let the user know:

"I've saved AND applied your design tokens:
- **Files**: `colors.json`, `typography.json`
- **Code**: Updated `index.html` and `src/index.css`

**Your palette:**
- Primary: `[color]`
- Secondary: `[color]`
- Neutral: `[color]`

**Your fonts:**
- [Heading Font]
- [Body Font]
- [Mono Font]

The application now reflects your Impeccable aesthetic.

Next step: Run `/design-shell` to design your application's navigation and layout."

## Reference: Impeccable Font Pairings

- **Modern & Characterful:** DM Sans + Plus Jakarta Sans + JetBrains Mono
- **Bold & Technical:** Space Grotesk + Manrope + Space Mono
- **Refined Editorial:** Playfair Display + Urbanist + IBM Plex Mono
- **Soft & Organic:** Nunito (Rounded) + Quicksand + Fira Code
- **Brutalist:** Syne + Epilogue + JetBrains Mono

## Important Notes

- Colors should be Tailwind palette names (not hex codes)
- Fonts should be exact Google Fonts names
- **Keep it distinct**: If the user suggests "Inter", suggest "Plus Jakarta Sans" or "Manrope" as a more modern alternative.
- Design tokens apply to screen designs only — the Design OS app keeps its own aesthetic

## Step 9: Auto-Audit (Impeccable QA)

Before completing, perform a quick self-audit against Impeccable principles.

**Check:**
1. Are any "AI Slop" fonts used? (Inter, Roboto, Open Sans, Arial) → Fail
2. Are colors tinted (not pure gray)? → Pass/Fail
3. Is there a clear dominant + accent hierarchy? → Pass/Fail
4. Are `oklch` or wide-gamut values preferred over hex where possible? → Pass/Fail

**If any checks fail:**
"⚠️ **Impeccable Audit Warning**: [Issue]. Recommend revising before proceeding."

**If all checks pass:**
"✅ **Impeccable Audit Passed**: Design tokens meet quality standards."

Save this audit result to `design-system/QA/tokens-audit.md`:
```markdown
# Design Tokens Audit

**Date**: [timestamp]
**Status**: [Pass/Fail]

## Checks
- [x] No AI Slop fonts
- [x] Tinted neutrals
- [x] Dominant + accent hierarchy
- [x] Modern color format (oklch)

## Notes
[Any observations]
```

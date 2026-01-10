# Hook: AI Slop Guard

## Purpose
Warn when code or design patterns that indicate generic AI-generated output are detected.

## Trigger
- PreToolUse: Before writing to CSS/TSX/HTML files
- PreCommit: Before committing changes

## Patterns to Watch For

### Typography Slop
- ⚠️ `font-family: 'Inter'` — Generic AI default font
- ⚠️ `font-family: 'Roboto'` — Overused AI choice
- ⚠️ `font-family: 'Open Sans'` — Too common
- ⚠️ `font-family: 'Poppins'` — AI favorite

### Color Slop
- ⚠️ `#808080` or `gray` — Dead gray
- ⚠️ `#cccccc`, `#dddddd` — Lifeless neutral
- ⚠️ `#f5f5f5` — The AI background color
- ⚠️ Pure `#000000` or `#ffffff` — No warmth
- ⚠️ `#3b82f6` or `#2563eb` — Everyone's blue

### Layout Slop
- ⚠️ Cards in cards — Nested containers
- ⚠️ Hero with centered h1 + subtitle + CTA — The AI template
- ⚠️ 3-column feature grid — Overused pattern
- ⚠️ Centered everything — Lazy alignment

### Effect Slop
- ⚠️ `backdrop-filter: blur(10px)` — Glassmorphism default
- ⚠️ `border-radius: 12px` — The AI corner radius
- ⚠️ `box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1)` — Tailwind default

### Animation Slop
- ⚠️ `transition: all` — Lazy animation
- ⚠️ `animate-bounce` — Generic micro-interaction
- ⚠️ `animate-pulse` — Loading skeleton overuse

### Copy Slop
- ⚠️ "Streamline your workflow" — Generic SaaS copy
- ⚠️ "Unlock the power of" — AI cliché
- ⚠️ "Seamlessly integrate" — Meaningless buzzword
- ⚠️ "Best-in-class" — Tells nothing

## Response When Detected

```
⚠️ AI Slop Guard Warning

Detected potentially generic AI patterns:
- [Pattern name]: [File:Line]

Consider:
1. Running `/audit` to get specific recommendations
2. Consulting the frontend-design skill for alternatives
3. Using `/bolder` if design is too safe

Continue anyway? [y/N]
```

## Configuration
Users can customize in `.gemini/settings.json`:
```json
{
  "hooks": {
    "ai-slop-guard": {
      "enabled": true,
      "strictness": "medium",  // low, medium, high
      "ignore": ["Inter"]      // Patterns to ignore
    }
  }
}
```

## Notes
- This is a warning, not a blocker
- Some patterns are acceptable in context
- The goal is awareness, not restriction

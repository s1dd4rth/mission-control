# Audit Report: Action Centre

## Anti-Patterns Verdict
**FAIL**. The codebase exhibits "Monolithic Spaghetti" and "Generic Utility" anti-patterns. While it functionality works, the structure is brittle and the aesthetic is generic "Dashboard UI".

## Executive Summary
- **Total Issues**: 4 key issues
- **Critical**: 1 (Monolithic Architecture)
- **High**: 2 (Mixed Tokens, Inline Components)
- **Overall Score**: C-
- **Next Steps**: Refactor `App.tsx`, Normalize Tokens.

## Detailed Findings

### Critical Issues
1.  **Monolithic `App.tsx`**: The file is 1000+ lines, containing state (`ProjectState`), API logic (`fetchStatus`), and UI components (`Guidance`, `StatusItem`). This violates clean code principles and makes "polishing" impossible.
    - *Recommendation*: Extract `StatusItem`, `Guidance`, `NextStepCard` to `components/`. Move state to `hooks/useProjectState`.

### High Severity
2.  **Hardcoded Colors**: `App.tsx` contains literals like `bg-emerald-50`, `text-red-500`.
    - *Impact*: Inconsistent theming. If we change the "Success" token, these won't update.
    - *Fix*: Use `text-destructive`, `bg-success-subtle` (need to define semantic tokens).

3.  **Inline Components**: `StatusItem` and `PromptButton` are defined inside the same file as `App`.
    - *Impact*: Low reusability, hard to read.

### Medium Severity
4.  **Generic Typography**: `App.tsx` relies on default `font-sans`.
    - *Fix*: Adopt a distinct font stack in `index.css` (e.g., `Outfit` or `Space Grotesk` for headers) to match "Impeccable" standards.

## Recommendations
1.  **Refactor**: Break `App.tsx` into `components/` and `hooks/`.
2.  **Normalize**: Replace all `red-500`, `emerald-50` with semantic variables (`--destructive`, `--success`).
3.  **Polish**: Introduce micro-interactions for the "Action" buttons.

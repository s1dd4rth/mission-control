# Product Roadmap

1. [ ] **Refactor Monolithic App** — Extract `Guidance`, `StatusItem`, and `PromptButton` into dedicated components and move logic to `useProjectState`; ensure `App.tsx` is < 200 lines. `[M]`
2. [ ] **Normalize Design Tokens** — Replace all hardcoded Tailwind colors (e.g., `emerald-50`, `red-500`) with semantic CSS variables (`--success`, `--destructive`) in `index.css` and components. `[S]`
3. [ ] **Enhance Typography** — Introduce a distinct font stack (e.g., Outfit/Inter pair) and update `index.css` to remove generic "system-ui" failover. `[S]`
4. [ ] **Add "Impeccable" Polish** — Implementation of micro-interactions for buttons (hover lift, active scale) and list items (staggered entrance). `[S]`

> Notes
> - Priority is refactoring to enable easier design iteration.
> - "Polish" phase depends on "Normalize" being complete.

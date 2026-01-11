# Agent OS: Master Workflow

This guide maps the end-to-end lifecycle of building a product with Agent OS, from strategy to deployment. It integrates the **Impeccable Design System**, Specification, and Implementation workflows into a single cohesive path.

---

## 🗺️ The Lifecycle at a Glance

1.  **STRATEGY** (`/plan-product`) - Define Mission, Roadmap, Tech Stack.
2.  **DESIGN** (`/impeccable`) - Create Visuals, Shell, and Quality Gates.
3.  **SPECIFICATION** (`/shape-spec`) - Define features in technical detail.
4.  **IMPLEMENTATION** (`/implement-tasks`) - Write code, tests, and commit.
5.  **SHIP** (`/optimize`) - Final audit, build, and deploy.

---

## 1️⃣ Phase 1: Strategy & Foundation
*Goal: Define WHAT we are building and WHY.*

1.  **Initialize Mission Control**:
    ```bash
    /plan-product
    ```
    - Follow the prompts to define **Mission**, **Roadmap**, and **Tech Stack**.
    - **Crucial**: Ensure "Phase 0: Design System Integration" is in your roadmap.

2.  **Establish Design Context** (One-time setup):
    ```bash
    /teach-impeccable
    ```
    - The agent interviews you to understand brand vibe, aesthetics, and principles.
    - Saves context to `GEMINI.md` for all future sessions.

---

## 2️⃣ Phase 2: Impeccable Design
*Goal: Create a distinctive, high-quality visual foundation.*

1.  **Define Visuals**:
    ```bash
    /design-tokens
    ```
    - Generates colors, typography, and spacing in `design-system/`.
    - **Guard**: Checks against "AI Slop" patterns automatically.

2.  **Build App Shell**:
    ```bash
    /design-shell
    ```
    - Creates the main layout, navigation, and responsive structure.

3.  **Quality Checkpoint**:
    ```bash
    /audit
    ```
    - Runs a comprehensive check on A11y, Theming, and Responsiveness.
    - If issues found, use: `/normalize` (theming), `/harden` (edge cases).

4.  **UX Polish**:
    ```bash
    /critique
    ```
    - Evaluates hierarchy and emotion.
    - Adjust intensity: `/bolder` (if too safe) or `/quieter` (if too loud).

---

## 3️⃣ Phase 3: Specification
*Goal: Plan HOW a specific feature will work.*

1.  **Select Feature**: Pick the next item from `agent-os/product/roadmap.md`.
2.  **Shape the Spec**:
    ```bash
    /shape-spec
    ```
    - define the interface, data model, and logic *before* coding.
    - Result: `agent-os/specs/[feature-name]/spec.md`.

3.  **Design Screens** (Optional but recommended):
    ```bash
    /design-screen
    ```
    - Create the UI components for this spec using the Design System.

---

## 4️⃣ Phase 4: Implementation
*Goal: Write the code.*

1.  **Scaffold Files**:
    ```bash
    /scaffold-implementation
    ```
    - Creates the file structure defined in the spec.

2.  **Implement Tasks**:
    ```bash
    /implement-tasks
    ```
    - Iteratively writes code, runs tests, and fixes bugs.
    - Works through `tasks.md` checklist until complete.

---

## 5️⃣ Phase 5: Quality & Ship
*Goal: Production-ready code.*

1.  **Final Audit**:
    ```bash
    /audit
    ```
    - Ensure no regressions in accessibility or performance.

2.  **Optimization**:
    ```bash
    /optimize
    ```
    - Check bundle size, render performance, and asset loading.

3.  **Final Polish**:
    ```bash
    /polish
    /delight
    ```
    - Add micro-interactions and smooth rough edges.

4.  **Build & Deploy**:
    ```bash
    npm run build
    ```
    - Verify production build succeeds.
    - Deploy to your hosting provider (Vercel, Netlify, etc.).

---

## 📚 Reference workflows

- **Design System Table**: Run `/impeccable` to see the full periodic table of design commands.
- **Context7**: Use `/research-tech` to look up latest documentation.

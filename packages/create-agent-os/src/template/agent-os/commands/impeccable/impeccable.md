# Impeccable Command Workflow

This guide shows how Impeccable commands work together to transform your designs.

## The Periodic Table

```
╔═══════════════════════════════════════════════════════════════════════════════════════╗
║  DIAGNOSTIC          QUALITY                ADAPTATION           ENHANCEMENT          ║
║  ┌────┐ ┌────┐      ┌────┐ ┌────┐ ┌────┐ ┌────┐   ┌────┐ ┌────┐ ┌────┐   ┌────┐ ┌────┐ ┌────┐  ║
║  │ Au │ │ Cr │      │ No │ │ Po │ │ Op │ │ Ha │   │ Cl │ │ Si │ │ Ad │   │ An │ │ Co │ │ De │  ║
║  │audit│ │crit│      │norm│ │poli│ │opti│ │hard│   │clar│ │simp│ │adap│   │anim│ │colo│ │deli│  ║
║  └────┘ └────┘      └────┘ └────┘ └────┘ └────┘   └────┘ └────┘ └────┘   └────┘ └────┘ └────┘  ║
║                                                                                         ║
║  INTENSITY           SYSTEM                                                            ║
║  ┌────┐ ┌────┐      ┌────┐ ┌────┐ ┌────┐                                               ║
║  │ Qu │ │ Bo │      │ Ti │ │ Ex │ │ On │                                               ║
║  │quie│ │bold│      │teac│ │extr│ │onbo│                                               ║
║  └────┘ └────┘      └────┘ └────┘ └────┘                                               ║
╚═══════════════════════════════════════════════════════════════════════════════════════╝
```

---

## Command Categories

### 🔧 SYSTEM — Run Once

| Command | When | Purpose |
|---------|------|---------|
| `/teach-impeccable` | **Before Phase 2** | One-time setup for project design context |
| `/extract` | After 2-3 features built | Extract reusable components into design system |
| `/onboard` | When designing first-time UX | Design onboarding flows and empty states |

### 🔍 DIAGNOSTIC — Run at Checkpoints

| Command | When | Purpose |
|---------|------|---------|
| `/audit` | After tokens, shell, before export | Technical quality check (a11y, perf, theming) |
| `/critique` | After shell, after each section | UX evaluation (hierarchy, emotion, architecture) |

### ✅ QUALITY — Run After Diagnostics

| Command | Fixes issues from | Purpose |
|---------|-------------------|---------|
| `/normalize` | `/audit` (theming) | Design system consistency |
| `/harden` | `/audit` (resilience) | Error handling, i18n, edge cases |
| `/optimize` | `/audit` (performance) | Speed, animations, bundle size |
| `/polish` | `/critique` (details) | Alignment, spacing, refinements |

### 🔄 ADAPTATION — Run During Refinement

| Command | When | Purpose |
|---------|------|---------|
| `/clarify` | Copy is confusing | Improve labels, errors, microcopy |
| `/simplify` | Design feels cluttered | Strip to essence |
| `/adapt` | Before export | Ensure multi-device compatibility |

### 🎚️ INTENSITY — Run for Calibration

| Command | When | Purpose |
|---------|------|---------|
| `/bolder` | `/critique` says "too safe" | Amplify generic designs |
| `/quieter` | `/critique` says "too loud" | Tone down aggressive designs |

⚠️ These are **mutually exclusive**. Never run both.

### ✨ ENHANCEMENT — Run Before Shipping

| Command | When | Purpose |
|---------|------|---------|
| `/animate` | After polish | Add purposeful motion |
| `/colorize` | Design is monochromatic | Add strategic color |
| `/delight` | Before export | Add moments of joy |

---

## The Complete Flow

### Phase 2: Design System

```
                    ┌─────────────────────┐
                    │  /teach-impeccable  │ ← One-time setup
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │   /design-tokens    │
                    │   ← Auto-audit      │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │   /design-shell     │
                    │   ← Auto-audit      │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │      /audit         │ ← Full manual check
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
     ┌────────▼───────┐ ┌──────▼──────┐ ┌───────▼───────┐
     │  /normalize    │ │  /harden    │ │  /optimize    │
     │  (if theming)  │ │ (if edge)   │ │ (if perf)     │
     └────────┬───────┘ └──────┬──────┘ └───────┬───────┘
              │                │                │
              └────────────────┼────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │     /critique       │ ← UX evaluation
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
     ┌────────▼───────┐ ┌──────▼──────┐ ┌───────▼───────┐
     │   /bolder      │ │  /quieter   │ │  /simplify    │
     │   (if safe)    │ │ (if loud)   │ │ (if complex)  │
     └────────┬───────┘ └──────┬──────┘ └───────┬───────┘
              │                │                │
              └────────────────┼────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │      /adapt         │ ← Responsive check
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │      /polish        │ ← Final details
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
     ┌────────▼───────┐ ┌──────▼──────┐ ┌───────▼───────┐
     │   /animate     │ │  /colorize  │ │   /delight    │
     └────────┬───────┘ └──────┬──────┘ └───────┬───────┘
              │                │                │
              └────────────────┼────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │   /export-product   │ ← Pre-export audit check
                    └─────────────────────┘
```

### Phase 4: Per Feature

```
/shape-spec → Design screens → /clarify → /simplify → /audit → /polish → /implement-tasks
```

---

## Quick Reference

| Situation | Run |
|-----------|-----|
| Starting design phase | `/teach-impeccable` |
| Design looks generic/AI-generated | `/audit` → `/bolder` |
| Design is overwhelming | `/critique` → `/quieter` |
| Accessibility issues | `/audit` → `/harden` |
| Inconsistent tokens | `/audit` → `/normalize` |
| Slow performance | `/audit` → `/optimize` |
| Ready to ship | `/polish` → `/animate` → `/delight` |
| Before export | `/audit` check required |

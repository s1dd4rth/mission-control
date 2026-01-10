# COMMAND: Create Constitution

## Goal
Establish the project's governing principles and development guidelines that will guide all subsequent development phases. This is a one-time setup command inspired by spec-driven development.

## When to Run
- **Once** at the beginning of a new project
- After `/plan-product` but before `/design-tokens`
- When you want to formalize project standards

## Instructions

### Step 1: Gather Context
Read the following files to understand the project:
- `agent-os/product/mission.md` — Product vision and goals
- `agent-os/product/roadmap.md` — Planned features
- `agent-os/product/tech-stack.md` — Technology choices

### Step 2: Create Constitution Document
Create `agent-os/constitution.md` with the following sections:

```markdown
# Project Constitution

## Core Principles
[3-5 high-level principles that guide all decisions]

## Code Quality Standards
- [ ] All code must pass ESLint with no errors
- [ ] All code must be formatted with Prettier
- [ ] TypeScript strict mode is enforced
- [ ] No `any` types without explicit justification
- [ ] All public APIs must have JSDoc comments

## Testing Philosophy
- [ ] Unit tests for all business logic
- [ ] Integration tests for critical user flows
- [ ] Minimum 80% code coverage for new features
- [ ] TDD approach for complex features

## UX Consistency Rules
- [ ] Follow the Impeccable design principles
- [ ] Run `/audit` before any design handoff
- [ ] No AI Slop patterns (see frontend-design skill)
- [ ] Mobile-first responsive design
- [ ] WCAG 2.1 AA accessibility compliance

## Performance Budgets
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Bundle size < 200KB (gzipped)

## Security Requirements
- [ ] No secrets in code
- [ ] Input validation on all user inputs
- [ ] HTTPS only in production
- [ ] CSP headers configured

## Git Workflow
- [ ] Conventional commits required
- [ ] PR reviews required before merge
- [ ] Feature branches from `main`
- [ ] Squash merge to maintain clean history

## Definition of Done
A feature is considered "done" when:
1. [ ] Code is written and reviewed
2. [ ] Tests are passing (unit + integration)
3. [ ] Documentation is updated
4. [ ] Accessibility audit passes
5. [ ] Performance budget is met
6. [ ] `/audit` passes with no critical issues
```

### Step 3: Customize for Project
Based on the product mission and tech stack, customize:
- Add project-specific principles
- Adjust performance budgets if needed
- Add any domain-specific requirements

### Step 4: Verification
- Confirm `agent-os/constitution.md` exists
- Output message: "Constitution created! These principles will guide all subsequent development. Run `/research-tech` next to analyze your tech stack."

## Notes
- The constitution should be a living document
- Team members should review and commit to these principles
- Reference this document in code reviews

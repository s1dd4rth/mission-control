# COMMAND: Research Tech Stack

## Goal
Research and document best practices, current versions, and known gotchas for the technologies chosen in `tech-stack.md`. This ensures the implementation uses up-to-date patterns and avoids common pitfalls.

## When to Run
- After `/plan-product` has created `tech-stack.md`
- Before `/design-tokens` or implementation begins
- When updating to new versions of key dependencies

## Instructions

### Step 1: Read Tech Stack
Read `agent-os/product/tech-stack.md` to understand the chosen technologies.

### Step 2: Research Each Technology
For each major technology in the stack, research:

1. **Current stable version** — What version should we pin to?
2. **Breaking changes** — Any recent breaking changes to be aware of?
3. **Best practices** — What are the current recommended patterns?
4. **Common pitfalls** — What mistakes do developers commonly make?
5. **Performance tips** — Any optimization opportunities?

### Step 3: Create Research Document
Create `agent-os/research.md` with the following structure:

```markdown
# Technology Research

**Generated:** [Date]
**Tech Stack:** [List from tech-stack.md]

---

## [Technology Name]

### Version
- **Recommended:** [version]
- **Latest Stable:** [version]
- **Our Choice:** [version + justification]

### Key Features to Use
- [Feature 1]
- [Feature 2]

### Patterns to Follow
- [Pattern 1 with code example]
- [Pattern 2 with code example]

### Pitfalls to Avoid
- ⚠️ [Pitfall 1 and how to avoid]
- ⚠️ [Pitfall 2 and how to avoid]

### Performance Considerations
- [Tip 1]
- [Tip 2]

### Resources
- [Official docs link]
- [Helpful article link]

---

[Repeat for each technology]
```

### Step 4: Identify Integration Concerns
Document any concerns where technologies interact:
- State management + React patterns
- CSS framework + component library conflicts
- Build tool configuration needs

### Step 5: Create Version Lock File
Update `package.json` with pinned versions based on research.

### Step 6: Verification
- Confirm `agent-os/research.md` exists
- Ensure all major technologies are covered
- Output message: "Tech research complete! Review the findings in `agent-os/research.md`. Run `/design-tokens` next to begin designing."

## Notes
- Research should be done even for familiar technologies
- Check for security advisories on dependencies
- Consider LTS vs. latest tradeoffs

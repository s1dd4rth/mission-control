# Hook: On Design Complete

## Purpose
Automatically run quality checks when a design phase is completed.

## Trigger
After completing:
- `/design-tokens`
- `/design-shell`
- `/design-screen`

## Actions

### 1. Run Auto-Audit
Execute a mini-audit focusing on the just-completed work:

**After `/design-tokens`:**
- Check for AI slop fonts
- Verify color hierarchy exists
- Ensure contrast ratios meet WCAG AA
- Validate color format consistency

**After `/design-shell`:**
- Check for AI slop layout patterns
- Verify touch targets (44x44 minimum)
- Check spacing consistency
- Validate responsive breakpoints

**After `/design-screen`:**
- Full component audit
- Accessibility check
- Performance impact assessment

### 2. Generate Report
Save audit results to `design-system/QA/[phase]-audit.md`

### 3. Suggest Next Steps
Based on audit results:
- If issues found: Suggest specific fix commands
- If clean: Suggest next phase

## Output Format

```
✅ Design phase completed!

Auto-audit results:
├── Accessibility: ✓ Pass
├── Typography: ⚠️ 1 warning (consider font alternatives)
├── Colors: ✓ Pass
└── Layout: ✓ Pass

Suggestions:
- Run `/critique` for UX evaluation
- Continue to `/design-shell` when ready

Full report: design-system/QA/tokens-audit.md
```

## Notes
- This hook runs automatically, no user action needed
- Reports accumulate, so you can see progress over time
- Hook can be disabled in settings if desired

# Lesson Template — schema for every `feedback_*.md` memory

> Every feedback lesson (good or bad) follows this shape so lessons stay consistent, searchable,
> and recall-matchable. Mirrors the discipline `docs/REPAIR-PATTERNS.md` already enforces for repairs.
> The `Applies-to:` tag is what the `recall-lessons.sh` hook matches against — always include it.

## Frontmatter (YAML)
```yaml
---
name: <short-kebab-case-slug>
description: <one line — used in MEMORY.md index + recall matching>
metadata:
  node_type: memory
  type: feedback
---
```

## Body (required fields, in order)

```markdown
# <Title>

**Applies-to:** <task/floorplan tags for recall — e.g. sidenav, list-report, dialog, wizard,
  object-page, table, filter-bar, progress-row, schedule, flight-card, tokens, naming, all-builds>

**Signal:** <what the user actually said that triggered this — the exact phrasing/feedback>

**What-worked / Mistake:** <for positive: the reusable pattern that earned approval.
  for correction: the specific wrong action.>

**Why:** <why it worked / why it was wrong — the root cause, not just the symptom>

**How-to-apply:** <the concrete rule to follow next time — imperative, checkable>

**Evidence:** <date + node/session ID + confidence — e.g. "2026-07-15, node 615:36810, confirmed 'Perfect'". Makes stale lessons auditable.>
```

Optional frontmatter for ranking: add `severity: hard-rule | canonical | guidance` to `metadata:` so recall can surface load-bearing rules above notes.

## Rules
- `Applies-to:` is MANDATORY (recall depends on it). Use lowercase tags matching the recall keyword list.
- One lesson = one authoritative file. If the lesson also belongs in REPAIR-PATTERNS.md, **cross-link**, don't restate (no-duplication rule — see `docs/OPERATING-MANIFEST.md`).
- Positive lessons that confirm a canonical build → also flagged in MEMORY.md with ⭐ and "READ BEFORE any <X> build".
- Keep `Why` about root cause. A lesson with no `Why` is a symptom note, not a lesson.
- `Evidence` makes a lesson auditable — a lesson with no date/node can't be checked for staleness.

## Example (correction)
```markdown
# Never use native frames for SAP components

**Applies-to:** all-builds
**Signal:** "not SAP — WTF, these are just frames"
**Mistake:** Built the header + tabs as figma.createFrame() instead of real SAP kit instances.
**Why:** Native frames can't bind SAP tokens; the plugin can't ink them; result looks SAP but is a wireframe.
**How-to-apply:** Every UI element via importComponentSetByKeyAsync → createInstance. On key 404, STOP + re-harvest (fail-closed, SAP_BUILD_MANIFEST §1). Cross-ref: RULE 25, RULE 1.
**Evidence:** 2026-07-14, repeated user directive, hard-rule confidence.
```

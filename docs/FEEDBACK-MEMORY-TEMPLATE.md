# Feedback Memory Template
## The ONE contract for every `feedback_*.md` in the auto-memory system
## Enforced by `.claude/hooks/validate-lesson.sh`

Every feedback lesson (good or bad) follows this shape so lessons stay consistent, auditable,
and **recall-matchable**. A thin lesson (no Why / no How) can't change behavior; a lesson with no
`Applies-to` can't be surfaced by `recall-lessons.sh`.

Single source of truth — do not create a second template. `skill/references/lesson-template.md` points here.

---

## Required frontmatter (YAML)
```yaml
---
name: <kebab-case-name>
description: "<one line — becomes the MEMORY.md index line>"
metadata:
  node_type: memory
  type: feedback
  severity: hard-rule   # hard-rule | canonical | guidance  (lets recall rank load-bearing lessons)
  see_also: []          # related memories / repair-pattern IDs (e.g. P-026) — cross-link, don't restate
---
```

## Required body fields (all present; bold-inline form, matched by the validator)
```markdown
# <Title>

**Applies-to:** <task/floorplan tags for recall — lowercase, matching recall-lessons.sh keywords:
  sidenav, list-report, object-page, dialog, wizard, table, filter-bar, progress-row, schedule,
  flight-card, tokens, naming, all-builds>

**Signal:** <what the user actually said that triggered this — exact phrasing>

**Mistake / What-worked:** <correction: the specific wrong action + concrete BEFORE example.
  positive: the reusable pattern that earned approval.>

**Why:** <the mechanism — root cause, not "the user was angry">

**How-to-apply:** <the exact corrected action next time — imperative, with a snippet/step list>

**Evidence:** <date + node/session ID + confidence — makes stale lessons auditable>
```

## Rules
- `Applies-to:` is MANDATORY — recall depends on it.
- One lesson = one authoritative file. If it also belongs in `docs/REPAIR-PATTERNS.md`, **cross-link** (`see_also`), don't restate (no-duplication — `docs/OPERATING-MANIFEST.md`).
- Canonical-confirming positives → also flag in MEMORY.md with ⭐ + "READ BEFORE any <X> build".
- A lesson with no `Why` is a symptom note; with no `Evidence` it can't be checked for staleness.
- Meta-lessons (describing the loop itself, not a build) use `severity: guidance` and are exempt from `Applies-to`/`Mistake`.

## Example (correction)
```markdown
# Never use native frames for SAP components

**Applies-to:** all-builds
**Signal:** "not SAP — WTF, these are just frames"
**Mistake:** Built header + tabs as figma.createFrame() instead of real SAP kit instances.
**Why:** Native frames can't bind SAP tokens; the plugin can't ink them; looks SAP but is a wireframe.
**How-to-apply:** Every UI element via importComponentSetByKeyAsync → createInstance. On key 404 STOP + re-harvest (fail-closed, SAP_BUILD_MANIFEST §1). Cross-ref RULE 25, RULE 1.
**Evidence:** 2026-07-14, repeated user directive, hard-rule confidence.
```

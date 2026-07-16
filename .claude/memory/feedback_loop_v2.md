---
name: feedback-loop-v2
description: "⭐ Feedback loop v2 (2026-07-16): smart detection (negation/dedup/hedged/mixed/word-boundary) + verified capture (Stop re-reminder) + task-matched recall (recall-lessons.sh surfaces the right lesson) + lesson template. 9 hooks total."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 8f1e0953-d5bb-448c-8c6b-dc4220c65f91
---

# Feedback / Learning Loop v2 (2026-07-16)

**Applies-to:** all-builds, learning-loop, hooks

Upgraded the feedback/lesson loop across all 4 weaknesses found in the deep map.

## What changed
- **Detection** (`feedback-learn.sh`): negation guard ("not perfect"→correction), CANON supersedes POS (no double-fire), hedged corrections ("close but"/"not quite"/"isn't what I meant"), word-boundaries (`\bbad\b` not "badge"), mixed feedback → single "mixed" row asking to disambiguate.
- **Verified capture** (`verify-learnings.sh`, NEW Stop hook): if any ledger entry is still `pending` at turn end, re-injects a hard reminder — lesson can't silently evaporate.
- **Task-matched recall** (`recall-lessons.sh`, NEW UserPromptSubmit hook): scans the prompt for build-task keywords (sidenav/list-report/dialog/wizard/card/…) and surfaces ONLY the matching MEMORY.md lesson lines — fixes "all 60 load flat, Claude self-selects" (the #1 repeated-mistake cause). Keys off existing MEMORY.md descriptions — no per-file re-tagging.
- **Lesson template** (`skill/references/lesson-template.md`): required shape — Applies-to / Signal / What-worked-or-Mistake / Why / How-to-apply.
- **Dedup**: SideNav lesson single source of truth = `feedback_sap_sidenav_canonical_method.md` + figma-build-patterns §Slot Injection; REPAIR-PATTERNS P-026 cross-links (doesn't restate).

## Hook inventory (9 total)
SessionStart: surface-learnings · UserPromptSubmit: feedback-learn + recall-lessons ·
Stop: lint-on-stop + verify-learnings · PostToolUse: registry-rebuild + manifest-sync-check ·
PreToolUse: block-generated-files + block-codejs-read

## Enforcement honesty
Detection + durable ledger + turn-end/session re-reminders + recall = mechanical.
Final memory-write = guided (by a persistent self-surfacing reminder). Not fully autonomous, but nothing evaporates silently.

## Verified
All 9 hooks valid bash · settings.json valid · test-build.sh exit 0 · detection tested (negation/dedup/hedged/mixed/boundary all correct) · recall surfaces right lesson per task.

[[july915_recovery_complete]] [[operating_manifest]] [[rule_29_visual_recovery_protocol]]

**Signal:** "how to improve this loop feedback and remember lessons - good and bad?"
**Why:** All 4 loop concerns (detect/capture/recall/quality) had gaps; a lesson that evaporates or never surfaces is a repeated mistake waiting to happen.
**Evidence:** 2026-07-16, deep-map audit + live-tested hooks.

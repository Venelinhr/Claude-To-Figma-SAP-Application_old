---
name: audit-fixes-2026-07-17
description: "Audit-execute pass (H1/H2/M1/M2/L2/L3 + feedback-learn bug): fixed the enforced-but-dead Loop B lint, added procurement recall keywords, synced stale docs to RULE 30, made canonical PNGs private-by-default (allowlist not blacklist), added post-clone rename checklist, fixed 'correct'-imperative false-positive."
metadata:
  node_type: memory
  type: feedback
  severity: guidance
  see_also:
    - feedback_keep_private_screens_out_of_github
    - feedback_loop_v2
    - feedback_procurement_list_report_canonical
  originSessionId: 8f1e0953-d5bb-448c-8c6b-dc4220c65f91
---

# Audit-Execute Pass — 2026-07-17 (better-workflow fixes)

**Applies-to:** all-builds, hooks, feedback-loop, docs-sync, privacy, clone-canonical

**Signal:** user ran `/code-review` on ~6h of work then "Do all, skipp L1. Privacy: 6!" + "Archive them (recommended) and remove from GitHub!!!"

**What-worked / what was fixed:**
- **H1 (enforcement gap):** `lint-on-stop.sh` only linted `output/*-spec.json` — the legacy path. RULE 25 (the DEFAULT) builds via `use_figma` and produces NO spec file, so the "enforced" Loop B quality gate silently did nothing on every real build. Fixed with a `.claude/.last-build-node` marker → Stop hook reminds to Bind SAP Tokens + read a11y report when a build is unbound. **Lesson: an enforced hook that keys off the wrong artifact is worse than no hook — it reads as covered.**
- **H2 (recall miss):** `recall-lessons.sh` had no procurement/PO/outage keywords, so the freshest canonical lesson wouldn't surface for the exact scenario it was captured for. Added rows.
- **M1/M2 (doc drift):** KNOWLEDGE-INDEX + OPERATING-MANIFEST still said "29 RULEs / RULE 1–29" and lacked RULE 30 + sector-analysis. Synced both.
- **L2 (privacy — the big one):** the .gitignore was **blacklist-shaped** (`!docs/canonical-screens/*.png` un-ignored the whole folder, then re-excluded named files). A NEW screenshot was public unless someone remembered a blacklist line — that is why the leak recurred twice. **Flipped to private-by-default: ignore the folder, explicit `!`-allowlist only the user-confirmed public files.** Added `guard-private-screens.sh` PreToolUse(Bash) hook that warns on `git add -f` of a private screen. Verified a hypothetical new PNG is private automatically.
- **L3:** clone-canonical inherits source frame names verbatim → "Progress Row" holding an Amount. Added a post-clone rename checklist to figma-build-patterns.md.
- **feedback-learn bug:** bare `\bcorrect\b` in POS classified the imperative "correct the padding" as *positive* (inverting a correction). Replaced with approval-context form `(that.?s|is|looks|…) correct`.

**Why:** governance that is "enforced" on paper but keys off the wrong signal (H1) or has a fragile default (L2 blacklist) fails silently and recurs. Safe-by-default (allowlist) + advisory guardrail beats a lesson-only fix for anything that already leaked twice.

**How-to-apply:**
- When adding an enforcement hook, verify it fires on the DEFAULT path, not just the legacy one. Test with real stdin.
- Privacy/allowlist > blacklist for anything that must not leak. New item private unless explicitly published + user-confirmed.
- After any clone, run the L3 rename checklist before reporting the node ID.
- Keep doc RULE counts in sync when a rule is added (grep `RULE 1–NN`, `NN mandatory`, `NN RULEs`).

**Evidence:** 2026-07-17. `bash build/test-build.sh` exit 0 (3 pass, 0 fail). All 4 touched hooks `bash -n` clean. git status: 0 PNG changes staged. gitignore test: 6 confirmed public, new "99" screen private by default.

## Related
[[feedback_keep_private_screens_out_of_github]] [[feedback_loop_v2]] [[feedback_procurement_list_report_canonical]] [[feedback_sector_based_reference_reading]]

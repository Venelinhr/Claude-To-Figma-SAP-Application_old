---
name: july915-recovery-complete
description: "⭐ 2026-07-16: July 9-15 lessons FULLY recovered into project + shipped to GitHub. 525 claims audited by 20-agent workflow, all gaps fixed + verified. Repo is production-ready. START HERE if resuming."
metadata: 
  node_type: memory
  type: project
  originSessionId: 8f1e0953-d5bb-448c-8c6b-dc4220c65f91
---

# July 9-15 Recovery — COMPLETE (2026-07-16)

**Status:** All July 9-15 knowledge propagated into project files, verified by a 20-agent
gap-audit workflow (525 claims checked), shipped to GitHub. Repo is production-ready for teammates.

## GitHub
- Repo: `github.com/Venelinhr/Claude-To-Figma-SAP-Application` (remote name: `github`)
- HEAD: commit `cd2e8fc` — all pushed, working tree clean
- Note: `origin` = github.tools.sap (internal); we push to `github` (public)

## What was recovered into project files
- **RULE 28** (Clone-Canonical) + **RULE 29** (Visual Recovery Protocol) → SYSTEM_PROMPT.md
- **P-026/027/028** (clone-clear-repopulate) → docs/REPAIR-PATTERNS.md (28 patterns total)
- **9 pattern sections** (Progress Row, DPH clone, IconTabBar, SegmentedButton, Form FILL, SideNav keys, motion defaults, 13 API gotchas) → figma-build-patterns.md
- **FAIL-CLOSED rule** (never silent createFrame on key 404 — the #1 root cause) → SAP_BUILD_MANIFEST §1
- **750:174xxx benchmark screens** + all canonical nodes → SAP_BUILD_MANIFEST §3b
- **All 10 typography keys** → knowledge/guidelines/token-assignment-rules.md
- **docs/HOOKS-REFERENCE.md** (new) — 5 hooks, stdin format, restart requirement
- **README** — full rewrite: ANALYZE→PLAN→EXECUTE→VALIDATE→LEARN, 5 MCPs (+3 optional), skills, plugin, learning loop, token opt
- **.claude/memory/rule_29_visual_recovery_protocol.md** — ships with repo
- All 8 agent files fixed (RULE 25 MCP-first banners, 52→80 token, 151→152, broken path)

## Canonical reference — the ground truth
`docs/canonical-screens/Claude to Figma SAP Application.fig` (6.8MB, ships with repo) +
11 PNGs + 11 .md refs + CANONICAL-SCREENS.md. Privacy-screened. Node IDs in [[reference_canonical_sap_screens_750]].
RULE 29: when lost/wrong/guessing → read this .fig first, extract ground truth, build once.

## Gaps the audit caught that the first pass MISSED (lesson)
Propagating memory → project files is NOT enough. Must ALSO:
1. Reconcile all COUNTS (rules/MCPs/agents/patterns) across CLAUDE.md, README, manifest
2. Update AGENT files (they described the deleted JSON path as primary — silently wrong)
3. Check keys/values reachable only from hook-blocked code.js are ALSO in an allowed doc
4. Add fail-closed guards for silent-fallback root causes

## Verification method (repeat for future audits)
- Workflow tool: fan out memory-cluster readers → project subsystem auditors → adversarial verify
- Every "gap" re-checked with real grep before trusting it (many are false alarms)
- Tests: `bash build/test-build.sh` must exit 0; `node --check` on code.js; `bash -n install.sh`

## Still unverified (honest gap)
True clean-machine `clone → ./install.sh → build end-to-end` never run. Structure/syntax verified;
live onboarding smoke-test not performed.

[[reference_canonical_sap_screens_750]] [[rule_29_visual_recovery_protocol]] [[feedback_sap_build_methodology]] [[project_sap_builder_next_session]]

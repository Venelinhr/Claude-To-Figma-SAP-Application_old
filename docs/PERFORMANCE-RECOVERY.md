# Performance Recovery & Adaptive Build Strategy (2026-07-22)

**Problem:** a single wizard-header build cost ~17 min + ~40k tokens (+2 min/4k for a fix) against a target of **3–5 min / ≤10–12k tokens** at the same quality. A two-part root-cause audit (hook/gate layer + Figma-MCP layer) found the overhead was **structural process cost**, not the SAP quality rules. This doc records the fixes.

## Root causes (ranked)

| # | Root cause | Evidence |
|---|---|---|
| RC-1 | **Double hook registration** — every guard/prompt/stop hook ran ~2× (project `.claude/settings.json` + global `~/.claude/settings.json` via `sap-scope-guard.sh`) | one build fired ~16–19 guard invocations |
| RC-2 | **VDI re-analysis** (~14k tokens) re-run on already-seen images — cache existed but no hook read it | `semantic-models/` had 3 models, zero hook references |
| RC-3 | **Per-turn marker wipe** — `clear-reuse-marker.sh` deleted all approval markers every Stop → re-approval treadmill | exact cause of the wizard-fix stall |
| RC-4 | **Full 5-artifact presentation on every request** (VDI table + tree + confidence + ASCII + suggestions) — even a one-line edit | `enforce-wireframe-first.sh` "EVERYTIME, no exceptions" |
| RC-5 | **Heaviest node gate** scanned 152 registry JSONs + 132KB code.js on every build | `guard-manifest-drift.sh` → `check-manifest-sync.js` |
| RC-6 | **Clone→screenshot→fix→screenshot loops** — no in-place patch path | wizard used 5 screenshots + 2 gate blocks for one component |
| RC-7 | mandated multi-call build + verify dump | 3–5 use_figma calls typical |
| RC-8 | screenshots multiply on imperfect builds | each is a large image-token payload |
| RC-9 | **two doctrine self-contradictions** → defensive over-fetching | `get_design_context` never-skip vs don't-pre-call; 1-call vs 2-call |
| RC-10 | **learnings backlog** re-injected every session/turn | 18 pending entries |
| RC-11 | 3 local MCP servers cache metadata but eliminate zero Figma round-trips | (keys are cached — not a cost) |

## Fixes applied

- **F-1 (RC-1):** De-duplicated hook registration. The global (scope-guarded) chain is the single source for the 6 shared use_figma guards + UserPromptSubmit/Stop/SessionStart; the project `.claude/settings.json` keeps only project-only guards (`guard-architect-gate`, `block-codejs-read`, `block-generated-files`, `guard-private-screens`), the new `recall-vdi.sh`, and PostToolUse. Verified: merged chain has **zero duplicates**; all 7 use_figma guards run once each.
- **F-2 (RC-3):** `clear-reuse-marker.sh` now clears approvals only at **SessionStart** or when a build **completes** (a `*-verify.json` newer than the approval exists). Mid-build turns preserve `.wireframe-approved`/`.architect-approved`/`.scratch-approved`. Anti-self-echo preserved (only `capture-approvals.sh` writes them).
- **F-3 (RC-4):** `enforce-wireframe-first.sh` branches — **new screen / new image → full Gate 0→3**; **edit/fix on an existing build (`.last-build-node` or "this X"/node-id) → short-form** (one-line summary + confirm, mini-ASCII only if structural).
- **F-4 (RC-2):** New `recall-vdi.sh` (UserPromptSubmit) lists cached semantic models so the agent loads one instead of re-analysing; write-back protocol stated. `score-canonical.js --from-model <file>` reads floorplan+zones+components straight from a cached model.
- **F-5 (RC-5):** `guard-manifest-drift.sh` caches the OK result keyed by input mtimes (`.manifest-sync-ok`), skipping the full scan when nothing changed — **18× faster** on warm builds (0.048s vs 0.857s). Invalidates on any source edit; still exits 2 on real drift.
- **F-6/7/8 (RC-6/7/8):** Adaptive execution documented in both skills + `figma-build-patterns.md` + CLAUDE.md: Stage 1 bounded reuse search → Stage 2 clone-or-rebuild decision → Stage 3 deterministic top-down rebuild; **fail-twice-then-switch** hard rule; verify by QA-return text, one screenshot at hand-off. (STEP 8 already folds QA into the build call.)
- **F-9 (RC-9):** Resolved both contradictions. `get_design_context` = inspect **once per new clone source / unknown component**, not every build (CLAUDE.md #13 + SYSTEM_PROMPT RULE 28-A now identical). `use_figma` = one call for simple screens; documented 2-call split only for 8+ components (the one sanctioned exception).
- **F-10 (RC-10):** Drained the backlog (7 dismissed as task-notification/status noise, 11 captured as already-in-memory feedback → **0 pending**). Capped `surface-learnings.sh`/`verify-learnings.sh` to top-3 truncated; Stop only nags when backlog > 5.

## Expected impact
De-dup halves gate latency; build-scoped markers + scoped artifacts remove the multi-turn stall (−8–15k on edits); VDI cache saves ~14k on repeat images; drift-gate cache removes the per-build repo scan. Target of **3–5 min / ≤12k tokens** for a standard screen is reachable — quality invariants (real SAP instances, tokens, Compact, Horizon Light, naming, one-Primary) are **untouched**.

## Non-goals (respected)
No quality invariant weakened. No gate removed — only de-duplicated, scoped, cached. Figma Plugin v2 untouched. Global `~/.claude/settings.json` was **not** modified (the classifier blocks self-modification of startup config; the de-dup was achieved entirely by editing the project file).

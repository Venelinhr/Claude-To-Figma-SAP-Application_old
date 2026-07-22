# Gate 0 — Canonical Reference Selection (Design Spec)

**Date:** 2026-07-22
**Goal:** Optimise token/time cost of SAP Fiori builds at the same quality by making *reference selection* an explicit, hard-blocking architectural gate that fires **before** the wireframe.

## Context — why this change

A root-cause audit of a build that cost ~17 min / 40k tokens (target: 3–5 min / ≤12k) found the overhead cascaded from **one decision made wrong**: the wrong canonical reference was cloned (a 3-step wizard node when a 4-step node existed). Everything downstream — manual patching, silent failures, 5 verification screenshots, re-approval loops — was a *consequence* of that first choice.

The ten process optimisations already shipped (F-1…F-10, `docs/PERFORMANCE-RECOVERY.md`) reduce the cost of execution, but they operate **after** the architectural direction is set. **Reference selection is the highest-leverage decision in the workflow**, yet today it is implicit ("Gate 1 canonical search") and skippable. This spec makes it a distinct, mandatory, verified Gate 0.

**Principle:** *The fastest screen to build is the one that has already been solved.* Building becomes an **adaptation** exercise, not a **reconstruction** exercise.

## Decisions (locked with user)

1. **Enforcement = hard block.** A PreToolUse hook rejects every `use_figma` build (exit 2) until a scored reference decision is committed. Same fail-closed model as the wireframe gate.
2. **Decision rigor = scored + node verified.** The `.reference-selected` marker must contain: chosen node ID + score (from `score-canonical.js`) + one-line rationale + adaptation-effort estimate.
3. **No-match path = scratch needs user OK.** If top score < 60, Gate 0 requires the recorded low score **and** the existing `.scratch-approved` marker (user sign-off). Scratch stays the rare exception.
4. **Order = Gate 0 before the wireframe.** business analysis → **Gate 0 reference selection (commit)** → wireframe (reflects the chosen reference) → approval → build.
5. **Writer = agent records via validating script.** The agent writes the marker through `record-reference.js`. Same pattern as the existing `record-reuse-decision.js`.
6. **Index = UNCHANGED (user decision 2026-07-22).** `canonical-index.json` is left as-is (keeps the existing `750:xxxxx` tier-1 entries). We do NOT rebuild it from the 13 gold E083 nodes. **Consequence:** the scorer validates/recommends the indexed nodes; the 13 gold references remain reachable the way they are today — via the human-curated memory files (`reference_gold_standard_screen_set.md`) and skill canonical tables, which the agent reads and clones from. Gate 0 therefore enforces *that a scored decision is recorded*, not *which* node the scorer prefers. Node-ID validation in `record-reference.js` accepts any real node (verified via `get_metadata` / index membership is not required), so a gold E083 node is a valid selection even though it is not in the index.

### The 13 gold-standard reference nodes (authoritative, curated — NOT in the scorer index)
Kept in memory + skill tables as the fallback set "when the system is lost". File `E083sNBH7JNEOBFrG7Bqge` unless noted.

| Node | Screen | Floorplan | Width |
|---|---|---|---|
| `68-3262` | Side Navigation | SideNav | 260 |
| `68-2578` | Yanatest Steps | Object Page narrow | 320 |
| `68-2928` | Activities View | List Report narrow | 320 |
| `42-2348` | Validate System | Log/message panel | 678 |
| `9-1498` | Schedule Op — State B Recurring | Dialog | 560 |
| `9-1470` | Schedule Op — State A Collapsed | Dialog | 560 |
| `9-1550` | Schedule Op — State C End Date (universal default anchor) | Dialog | 560 |
| `9-1609` | Schedule Op — State D End Only | Dialog | 560 |
| `9-1696` | Schedule Op — State B2 Daily | Dialog | 560 |
| `30-2741` | Outage List Overview | Desktop List Report | 1440 |
| `2-5355` | Flight Result Card | Card | 751 |
| `219-120887` (p7zm5) | Multi-Source Selection (MCP config, MultiComboBox) | Desktop config section | 1711 |
| `1114-136067` (p7zm5) | Select API Dialog (Single) — ShellBar+SideNav+IconTabBar+Table | Object Page / detail | 1711 |

## Architecture

New order of the gate sequence:
```
Business request
   ↓
GATE 0  Reference selection → record .reference-selected      ⛔ guard-reference-gate.sh (hard block)
   ↓     (score ≥60 → clone base;  <60 → +.scratch-approved)
GATE 3  Wireframe (reflects chosen reference) → user approval  ⛔ guard-wireframe-gate.sh
   ↓
GATE 5  Build — adaptation of the cloned reference
   ↓
GATE 6/7  Verify + hand off
```

### Components (each isolated, single-purpose)

| Unit | Type | Responsibility | Depends on |
|---|---|---|---|
| `build/record-reference.js` | new node script (~25 lines) | Validate `nodeId` is a plausible real node (format `N:N` or `N-N`); write `.claude/.reference-selected` JSON `{nodeId, score, rationale, adaptationEffort}`. Index membership is NOT required — a curated gold node (e.g. E083 `9-1550`) is valid even though it is not in `canonical-index.json`. | — |
| `.claude/hooks/guard-reference-gate.sh` | new PreToolUse(use_figma) hook | Block build (exit 2) unless `.reference-selected` is present+valid, OR (top score <60 recorded AND `.scratch-approved`). Runs BEFORE `guard-wireframe-gate.sh`. | `.reference-selected`, `.scratch-approved` |
| `clear-reuse-marker.sh` | edit | Add `.reference-selected` to the build-scoped clear set (F-2 semantics: survives mid-build turns, clears at SessionStart / on verify-complete). | — |
| `enforce-wireframe-first.sh` | edit | The full-gate directive names Gate 0 as step 0 (present + record the scored reference before the wireframe). | — |
| settings.json (project) | edit | Register `guard-reference-gate.sh` in the use_figma PreToolUse chain, ordered before the wireframe guard. Single registration (respect F-1 de-dup). | — |
| `CLAUDE.md` + `skill/SYSTEM_PROMPT.md` + `sap-screen`/`sap-figma-agent` skills | edit | Document Gate 0 as the first mandatory gate; renumber the gate sequence 0→7 consistently. | — |

### Marker contract — `.claude/.reference-selected`
```json
{ "nodeId": "219:114694", "score": 88, "rationale": "4-step wizard header, exact floorplan match",
  "adaptationEffort": "low — relabel 4 steps", "at": "session" }
```
- Written ONLY by `record-reference.js` (agent-invoked, node-validated). Not writable by raw Bash (the marker-write guard already blocks agent echoes; `record-reference.js` is the sanctioned writer, mirroring `record-reuse-decision.js`).
- Build-scoped (F-2): survives across turns of the same build; cleared at SessionStart and on build-complete.

### Reuse of existing machinery (no new scoring logic)
- `score-canonical.js` (incl. `--from-model` from F-4) produces the score → feeds `record-reference.js`.
- `.scratch-approved` (existing, user-written) is the low-score escape hatch — no new user gate invented.
- `guard-reuse-gate.sh` stays; Gate 0 is the *front* decision, the reuse gate still enforces `.clone(` in L1–4 code. Gate 0 and the reuse gate are complementary (decision vs. code-shape).

## Verification (end-to-end)
1. **Block test:** `use_figma` build with no `.reference-selected` → blocked (exit 2) with instructions.
2. **Happy path:** `record-reference.js --node 219:114694 --score 88 --rationale "..."` → marker written → build proceeds.
3. **Bad node:** `record-reference.js --node "not-a-node"` → rejected (implausible format), no marker written.
4. **Low-score scratch:** score <60 recorded, no `.scratch-approved` → blocked; with `.scratch-approved` → proceeds.
5. **Order test:** confirm `guard-reference-gate.sh` fires before `guard-wireframe-gate.sh` in the chain.
6. **Build-scoped marker:** approve+record, 3 mid-build turns → marker survives; after verify.json → cleared (F-2).
7. **Quality regression:** `check-manifest-sync` 0 fails · `ci-drift-gate` pass · all hooks valid bash · no invariant weakened.
8. **De-dup respected (F-1):** the new guard registered once, no duplicate in the merged chain.

## Non-goals
- No new scoring algorithm — reuse `score-canonical.js`.
- **No change to `canonical-index.json`** (user decision) — the scorer index stays as-is; the 13 gold nodes live in curated memory/skill, not the index.
- Do not weaken any SAP quality invariant.
- Do not touch global `~/.claude/settings.json` (classifier blocks self-modification; register in the project file).
- Do not remove the wireframe or reuse gates — Gate 0 sits in front of them.

## Expected impact
By forcing one high-quality reference decision up front, most of a screen is already valid before building starts: fewer component swaps, fewer layout fixes, minimal Figma MCP work, lower token use, faster and more deterministic execution — the wizard's 35k-token cascade does not start. Every F-1…F-10 optimisation compounds on top of a *correct* foundation instead of salvaging a wrong one.

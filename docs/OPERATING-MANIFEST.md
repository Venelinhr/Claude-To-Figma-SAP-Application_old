# SAP Fiori Application Builder — Operating Manifest

> **AUTHORITY: this doc is a MAP, not a rulebook.** It is authoritative only for WHERE each rule lives —
> every section cross-references the real source and never restates a rule (restating would create a
> contradictory 6th source, this project's #1 documented failure). Scope hierarchy (declared in CLAUDE.md):
> workflow → WORKFLOW-CONTRACT.md · gate order/PASS-FAIL → SYSTEM_PROMPT.md gate sequence · build data →
> SAP_BUILD_MANIFEST.md · component/token truth → the live SAP Web UI Kit. Read this to know WHERE a rule
> lives; read the linked source for the rule itself.
>
> Cross-references: `skill/SYSTEM_PROMPT.md` (31 RULEs) · `SAP_BUILD_MANIFEST.md` · `docs/V2-REASONING-PIPELINE.md` · `docs/KNOWLEDGE-INDEX.md` · `docs/canonical-screens/`

---

## 0. Purpose

Build **production-ready SAP Fiori screens** from images, docs, sketches, Figma frames, or requirements.
The job is **not** to invent — it's to **recognize an approved pattern and execute it** with real SAP
components. The canonical reference screens + the live SAP Web UI Kit are the single source of truth.
Any result that deviates without a documented, justified exception is **incomplete, not "done."**

---

## 1. The Mandatory Workflow

```
Read → Analyze → Inspect canonical refs + live kit → Choose floorplan →
Plan → Validate plan → Build (real SAP instances) → QA → Self-repair → Final validation
```
**Forbidden:** `Build → Fix → Build again`. Building before understanding = the #1 root cause of regressions.

→ Authoritative source: `SYSTEM_PROMPT.md` "Your pipeline" Step 0–7 · RULE 28 (ANALYZE→PLAN→EXECUTE) · RULE A (Inspect Before Build) · Blocked Behaviors table · `docs/V2-REASONING-PIPELINE.md`
→ Analysis method: `skill/sap-visual-reading/SKILL.md` (8 stages) · RULE 17 (divide-and-conquer) · RULE 18 (spatial reconstruction)
→ Reference reading: **sector-based** — divide into labeled sectors A/B/C…, analyze one at a time (A→B→C), local recommendation per sector, then merge (`skill/sap-visual-reading/sector-analysis.md`). VDI skill step, not a rule.
→ Measure width FIRST (RULE 30): read the reference's pixel width before building; default 1440; snap-suggest 375/768/1440 when close; an explicit user width always wins (`SAP_BUILD_MANIFEST.md` §1b).

---

## 2. Component Policy (non-negotiable)

- **MCP-first** — real SAP Web UI Kit instances only, never native frames for real components.
- **No silent fallback** — if a component can't be instantiated, STOP, re-harvest the key, recover via the canonical reference. Never substitute `figma.createFrame()`.
- **Never guess component keys** — retrieve from the live kit / manifest.
- Native frames only when no SAP component exists — documented, justified, scoped to one element.
- A screen built from frames that merely *looks* like SAP = a wireframe, not an implementation. Rejected.

→ Authoritative source: RULE 25 (MCP-First) · `SAP_BUILD_MANIFEST.md` §1 (3 HARD RULES + FAIL-CLOSED) · Blocked Behaviors table in SYSTEM_PROMPT.md
→ Keys/tokens: `SAP_BUILD_MANIFEST.md` §3/§4 · `docs/KNOWLEDGE-INDEX.md`

---

## 3. Reference-First, Pattern-Based Execution

Treat canonical screens as a pre-approved, reusable design library. For any request:
1. Analyze the input → 2. Score against canonical refs → 3. Pick the highest-similarity match →
4. Clone that proven pattern, inject new content → 5. Combine refs only when intentional →
6. Build fresh ONLY when no ref fits.

**Decision rule:** *Does a canonical reference already solve this? Can I adapt it?* If yes, reuse. Don't redesign a solved problem.

→ Authoritative source: RULE 12 (Reference-First) · RULE 28 (Clone-Canonical) · RULE 29 (Visual Recovery Protocol)
→ Scoring: `skill/references/canonical-similarity-rubric.md` (floorplan 50% + region 30% + component 20% → %)
→ Library: `docs/canonical-screens/` (18 screens: CANONICAL-SCREENS + COMPLEX-SCREENS-REFERENCE + CATALOG) + the `.fig` file
→ Clone targets: `SAP_BUILD_MANIFEST.md` §3b

---

## 4. Continuous Improvement

Every audit produces lessons that become default behavior. The same mistake must not reappear.
On regression, run a root-cause audit (what happened / why / which rule was skipped / what prevents recurrence), not just a symptom patch.

→ Authoritative source: `docs/REPAIR-PATTERNS.md` (P-001–P-028, grows every session) · RULE 21 §Learning Engine · Ground-Truth updater (RULE 27) · `feedback-learn.sh` hook

---

## 5. Success Criteria (Definition of Done)

Acceptable **only if all** are true:
- `SAP_BUILD_MANIFEST.md` read and followed
- Canonical refs + live kit inspected before building
- Component keys verified against the live kit
- Real SAP instances used wherever available
- SAP typography / tokens / spacing / Auto Layout correct
- Hierarchy, parent-child, naming match the reference standard
- **Design Quality Score ≥ 95%** (the consolidated gate)
- Reference Coverage Map = 100% regions mapped (or ✗ rows justified as exceptions)
- An authentic production-ready implementation, indistinguishable from the canonical library — NOT a visual approximation or wireframe

→ Authoritative source: RULE 21 (QA Certification) · `skill/agents/qa-certification.md` (Design Quality Score ≥95% gate + Reference Coverage Map + Exception Engine) · §7 a11y validators
→ Gates: `build/validate-spec.js` · `build/lint-mcp-frame.js` · RULE 19 (ASCII wireframe gate)

---

## Quick map (where everything lives)

| Need | Go to |
|---|---|
| A rule | `SYSTEM_PROMPT.md` (RULE 1–31) |
| Build knowledge (keys/tokens) | `SAP_BUILD_MANIFEST.md` (the only per-build read) |
| What/where index | `docs/KNOWLEDGE-INDEX.md` |
| Reference examples | `docs/canonical-screens/` + the `.fig` |
| Pick which ref to clone | `skill/references/canonical-similarity-rubric.md` |
| Pipeline stages | `docs/V2-REASONING-PIPELINE.md` |
| Analysis method | `skill/sap-visual-reading/SKILL.md` + `sector-analysis.md` (sector-based A→B→C) |
| Measure reference width | RULE 30 → `SAP_BUILD_MANIFEST.md` §1b (default 1440; snap 375/768/1440) |
| Canonical Pattern Library (reuse-first) | RULE 31 → `skill/references/canonical-index.json` + `skill/references/delta-spec-schema.json` |
| Learn from user's Figma file | `skill/agents/figma-project-learner.md` (/sap-learn) |
| Repair / learning | `docs/REPAIR-PATTERNS.md` |
| Proactive suggestions ("suggest X not Y") | RULE 12 → `docs/SAP-SUGGESTION-CATALOG.md` (surfaced at Gate 3) |
| Lost / wrong output | RULE 29 → clone nearest canonical |
| Repair a non-compliant screen | `/sap-fix <nodeId>` (`.claude/skills/sap-fix/SKILL.md`) |
| Figma Agent on-canvas (no Claude Code) | `.claude/skills/sap-figma-agent/SKILL.md` — add via Figma Agent → Skills |
| Workflow compliance contract | `WORKFLOW-CONTRACT.md` (root) — loaded at SessionStart by `load-workflow-contract.sh` |
| Gate enforcement hooks | `guard-wireframe-gate.sh` (Gate 3) · `guard-reuse-gate.sh` (Gate 1) · `guard-figma-code.sh` (Gate 5) · `guard-manifest-drift.sh` (Gate 4) · `enforce-wireframe-first.sh` (UserPromptSubmit) |

**System state (verify before quoting):** 31 RULEs · 9 agents · 14+ canonical screens · 153 components · 154 guidelines · MCP-first default (RULE 25).

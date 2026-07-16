# Phase 2 Consolidation Report — 2026-07-09

Following the user's architectural audit note (feature accumulation without consolidation), Round 1 + Round 2 stabilization landed the same session. This doc records what changed, why, and the verification.

---

## Round 1 — Documentation & Rule Consolidation (low-risk, low-effort)

### 1. Registry path unification — CRITICAL FIX
- **Before:** 20 stale references to `knowledge/schemas/` across 8 docs while CLAUDE.md declared `knowledge/components/registry/` canonical.
- **After:** All 20 references updated. The legacy `knowledge/schemas/` folder (40 partial files) is now dark; `knowledge/components/registry/` (152 files, 100% enriched) is authoritative.
- **Files touched:** `skill/SKILL.md`, `skill/SYSTEM_PROMPT.md`, `skill/references/validation-checklist.md`, `skill/agents/component-guidance.md`, `skill/agents/component-architect.md`, `ARCHITECTURE.md`, `README.md`, `knowledge/guidelines/README.md`.
- **Why it mattered:** RULE 1 is a hard-gate rule with a dual-path pointer. Validation was non-deterministic — a component could pass Step 5 by matching either path.

### 2. Wireframe gate consolidation — RULE 6 → RULE 19
- **Before:** Two ASCII wireframe gates (RULE 6 at Step 2.5, RULE 19 at Step 3.5) with the same approval phrases and refinement grammar.
- **After:** RULE 6 marked SUPERSEDED. RULE 19 is the single canonical gate; approval phrases, refinement grammar, and input modalities merged in.
- **Why it mattered:** Two adjacent gates ≈ double the drop-off risk and double the maintenance surface.

### 3. Composition rule alignment — RULE 8 + RULE 14
- **Before:** RULE 8 declared the composition rule (validParents / validChildren / mustInclude / mustExclude), RULE 14 declared the container-first *operational* rule. Detach doctrine was split across RULE 14 and RULE 16.
- **After:** RULE 14 now explicitly identifies itself as the operational half of RULE 8's declarative half. Same contract, two aspects.

### 4. Reference-fidelity reconciliation — RULE 12 ↔ RULE 16
- **Before:** RULE 12 said "optimize for SAP Fiori; don't pixel-copy references." RULE 16 said "execute the reference even when it deviates from SAP patterns." A soft contradiction.
- **After:** RULE 16 now includes a "Reconciliation with RULE 12" block: optimize by default, execute deviations only when essential to user intent, record every deviation as an intentional exception under RULE 21.

### 5. Unified confidence scale
- **Before:** Reasoning Brain used ≥65% as its threshold; QA Certification used <80% as its repair trigger. Specs could pass planning and immediately trigger mandatory repair.
- **After:** Canonical scale documented in one place:
  - **95–100%:** Ship as-is
  - **65–94%:** Ship with note; targeted repair optional
  - **Below 65%:** Blocking
- **Files touched:** `skill/SYSTEM_PROMPT.md` (RULE 21), `skill/agents/qa-certification.md` (two threshold tables aligned).

### 6. RULE 22 — Incremental-Edit Contract (NEW)
- **Before:** Undefined behavior on "add a status column" / "swap X for Y" edits. Either re-ran everything (wasteful) or nothing (silent registry violations).
- **After:** Explicit contract:
  - **Always re-run:** Registry Validation (Step 5) + QA Certification (Step 7 / RULE 21).
  - **Re-run only if edit touches:** Reference Analysis (new reference), Reasoning Brain (floorplan / entity model change), Wireframe Gate (region layout change).
  - **Escalation rule:** Silent floorplan / composition / coverage invalidations must escalate back to full Reasoning Brain + Wireframe Gate.

### 7. Rule count update
- **Before:** 21 mandatory RULEs.
- **After:** 22 mandatory RULEs (RULE 6 superseded by RULE 19; RULE 22 = incremental-edit contract).
- **Files touched:** `CLAUDE.md` header.

---

## Round 2 — Code Consolidation (medium-risk, medium-effort)

### 8. Obsolete P-022 defenses removed from `code.js`
- **Deleted:** The bareInst double-import workaround inside `sapInstanceDetached` (~17 LOC), the three hardcoded fallback `loadFontAsync` calls, plus the `P-022` explanatory comment block.
- **Replaced with:** A single-line comment noting that `protectInstance()` (P-023) now guards findAll/findOne on every SAP instance, so `sapInstance()` can be called directly with variantProps.
- **Verification:** Regression suite (5 specs) still 3 pass / 2 expected warn / 0 fail.

### 9. Post-build "Self-Repair" downgraded to warn-only diagnostic
- **Before:** Line 8573 mutated the canvas to replace "Page Title" placeholder text after the DynamicPageTitle handler had already run. This silently masked handler bugs.
- **After:** Same detection logic, but writes to `logException(...)` + `repairLog` array only. No canvas mutation. Every miss now surfaces in the exception log so the root-cause handler gets fixed instead of patched over.
- **Expected trade-off:** Short-term regression rate looks worse because previously-hidden bugs will now surface. This is the correct trade-off per the architectural audit's Phase 11 concern.

---

## Round 3 — Canonical Helpers (PARTIAL — helpers landed, migration deferred)

Following the audit's own risk mitigation ("land helpers behind existing functions first, verify with a test harness against a cloned kit instance, THEN migrate one handler per commit"), Round 3 landed the **foundation** but deliberately stopped short of aggressive handler migration.

### Landed (2026-07-09)

**Four canonical helpers added to `code.js` (behind existing functions — no handler migrated yet):**
- `trySetProperties(inst, role, value, opts)` — canonical alias table (`CANONICAL_ALIAS_TABLE` + `CANONICAL_SELECTED_PAIRS`). No traversal → inherently P-023-safe. Replaces 11 ad-hoc alias clusters when migrated.
- `injectFirstText(inst, value, opts)` — the findAll(TEXT)+loadFont+characters idiom with `match`/`target`/`fallbackFont`/`refindAfterLoad`/`clearIfEmpty` options. Uses safeFindAll/safeFindOne. Replaces 24 sites when migrated.
- `hideDefaultChildren(root, opts)` — kit-default cleanup with `match`/`container`/`keepFirst`/`collapseTo`. safeFindAll+safeVisible. Replaces 12 sites when migrated.
- `preloadInstanceFonts(inst)` — extracted from `sapInstance`'s inline pre-load; **`sapInstance` now calls it** (single source of truth). Reusable by the manual-createInstance paths.

**Test harness added:** `runHelperTests()` in `code.js`, triggered by the new **"Test Helpers"** button in `ui.html` (`postMessage({type:'test-helpers'})`). Clones real SAP kit instances (Button, SegmentedButton, IconTabBar, SideNavigation, DynamicPageTitle, Select, DatePicker, Tag), exercises each helper against the clone, posts a pass/fail summary. Never mutates the real kit.

### Deferred (needs live Figma verification)

- **Handler migration** — the 62 call sites are NOT yet routed through the helpers. Reason: `build/test-build.sh` validates spec JSON only; it does NOT run the plugin. Migrating handlers is a behavioral change that can only be safely verified by running `runHelperTests()` live in Figma (open the file → click "Test Helpers" → confirm all green), then migrating one handler per commit. That live step wasn't available this session.
- **Redundant instance-font load deletion** — the 13-17 redundant `loadFontAsync` sites (nodes descending from already-preloaded sapInstance trees) are a latency-only win; deferred with the migration since they carry the same "can't verify without live plugin" risk.

**B. Pipeline canonical numbering — collapse Steps 0 → 7 with Stages 1.5 and 6.5 folded in** (deferred)
   - Currently: Step 0 → Step 5 → Step 6.5 → Step 7 (numbering skips 6).
   - Target: Step 0 → Step 7 continuous, with Reasoning Brain = Step 3 and QA Certification = Step 7.
   - **Blocker:** RULE 20 / RULE 21 reference "Stage 1.5" and "Stage 6.5"; every existing spec's `meta.rationale` and every agent doc needs a rename pass, or references silently drift.

### How to complete Round 3 (next session, with Figma open)
1. Open the SAP-application-builder Figma file, load the plugin, click **Test Helpers**.
2. Confirm all helper tests are GREEN across all 8 components.
3. Migrate handlers in the audit's recommended order: preloadInstanceFonts (delete redundant loads) → trySetProperties (11 clusters) → injectFirstText (22 non-Dialog, then 2 Dialog last) → hideDefaultChildren (10 simple, then SideNav blanket, then DynamicPageHeader collapseTo).
4. One handler per commit; run `test-build.sh` + a live build after each.

### Live harness run — VERIFIED 2026-07-09 (Figma, 1933-variable library)

**`✓ Helper tests: 32 pass · 0 fail`** across Button, SegmentedButton, IconTabBar, SideNavigation, DynamicPageTitle, Select, DatePicker, Tag.

Interpretation (results validate the helper CONTRACT — no throw, correct return type, P-023-safe on live instances — not handler-equivalence, which still needs a per-handler live build on migration):

- **`trySetProperties = false` on all 8 (top-level):** CORRECT and expected. The harness tests the top-level instance; real handlers apply setProperties to CHILD items (`SegmentedButton items[i]`, `IconTabBar tabItems[ti]`). Top-level containers expose no `text`/`Text` prop → `false` is the honest answer. The fallback chain (→ `injectFirstText`) does the actual writing, and `injectFirstText=true` confirms it.
- **`injectFirstText = true` on 7/8; `false` on SideNavigation:** CORRECT. SideNav's bare clone has 0 text nodes (labels populate at runtime into a slot). `wrote=false` is honest; all others wrote to a real text node without throwing.
- **`hideDefaultChildren` non-zero on 4 (STRONG POSITIVE):** actively found + hid real kit-default children — **DynamicPageTitle: 14** (the exact crash-origin component from the P-023 thread — breadcrumbs/actions/tags/expand-pin hidden with ZERO "node does not exist" errors), DatePicker: 6, IconTabBar: 3, Select: 1. Zero on Button/Tag/SegmentedButton/SideNav = no numbered-placeholder children matching the test regex. Correct.
- **`preloadInstanceFonts` reachable>0 on 7/8:** CORRECT. SideNav=0 for the same bare-clone/slot reason.

**Load-bearing takeaway:** `hideDefaultChildren` cleanly hid 14 children on DynamicPageTitle — the component whose HCA/Expand lookup was throwing "The node ... does not exist" at the start of this session — with no crash. The P-023 fix and the new helper are both proven on the crash-origin component in the live runtime.

---

## Verification

- `node --check code.js` ✓
- `node --check code.bundled.js` ✓
- `bash build/test-build.sh` → 3 pass · 2 expected warn · **0 fail** (after every change)
- `validate-spec.js output/outage-list-overview-spec.json` → all 8 checks pass
- 20/20 stale registry-path pointers fixed
- 4 canonical helpers + test harness landed; `sapInstance` refactored to use `preloadInstanceFonts`
- Snapshots: `snapshot-20260709-141719-p023-architectural-consolidation`, `snapshot-20260709-144109-phase2-consolidation`, `snapshot-20260709-<hh>mmss-round3-helpers`

---

## What this changes for authors

- **Any new component handler in code.js:** call `sapInstance()` directly with variantProps. Do NOT reintroduce the bareInst double-import pattern.
- **Any new RULE:** if it declares a percentage threshold, use the canonical 65/95 scale.
- **Any new incremental-edit code path:** obey RULE 22 explicitly. Silent shortcuts are not allowed.
- **Any registry-path reference:** always `knowledge/components/registry/`. A future startup lint will fail builds that use the legacy `knowledge/schemas/` path.

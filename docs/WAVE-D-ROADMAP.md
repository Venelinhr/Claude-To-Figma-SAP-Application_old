# Wave D — Roadmap + Execution Log

Waves A + B + C landed on 2026-07-07 and put the pipeline on a stable, verifiable footing. Wave D — originally roadmapped as follow-up work — is being executed in stages.

**Execution status (2026-07-08):**
- ✅ **D3** — Build-time audit script (`build/audit-registry.py`) — runs on every build
- ✅ **D6** — Slot-name declarations — 40 registry entries now have explicit `slotNames[]`
- ✅ **D5** — Rich handlers — 3 Notification-family entries enriched (Bar/GenericTag/InfoLabel already were)
- 🟡 **D2** — Guideline cache backfill — batch 1 of ~5 complete (56 → 45 missing)
- 🟡 **D1** — Compact-schema enrichment — batch 1 of ~7 complete (53 → 42 compact; 98 → 109 enriched)
- ⏸️ **D4** — End-to-end demo — pending

**Ground-truth metrics (from `build/audit-registry.py` on 2026-07-08):**
- Registry entries: **151**
- Enriched: **109** (72.2%) · Compact: **42** (27.8%)
- Guideline cache files: **109** · Missing: **45** (29.8%)
- MANDATORY_TOKENS whitelist: **52**
- SAP_KEYS duplicates: **0**
- 3-layer inconsistencies: **0**

Each item below lists what it is, why it's queued, the concrete files it touches, a batch size that keeps sessions bounded, and an effort estimate. Nothing here is required for the current pipeline to run.

---

## D1 — Enrich the compact-schema registry entries  🟡 batch 1 of ~7 complete

**What.** During Waves 1–3 we added components with a minimal-but-valid registry shape (compact schema) so the plugin could resolve their `figmaComponentId` and treat them as first-class. They are missing `supportedProperties`, `typographyRules`, and `colorTokenRules`.

**Why now.** The plugin renders these components correctly today because the compact schema is complete enough for the 3-place rule. Enrichment unlocks (a) property-injection through `sapInstance`, (b) typography linking to shared styles, (c) `applyFill` participation in the token-linkage metrics (Wave C1).

**Progress 2026-07-08.** 8 entries enriched (IconMenuButton, IconSplitButton, Banner, HomepageHeroBanner, Footer, DropDown, TableCell, ToolbarItems). 42 remain — visible in the audit script output on every build.

**Files.** `knowledge/components/registry/*.json` — 42 remaining entries.

**Batch size.** 4–8 entries per session (each requires a short live scrape of the UI5 API JSON + a review of the SAP Fiori guideline).

**Entries queued.** All `AI*` variants (AIAvatar, AIButton, AIChatButton, AIIcon, AIInputField, AIPrompt, AIResponse, AISuggestion, AISuggestionMenuButton, AITypingIndicator), IconMenuButton, IconSplitButton, Banner, HomepageHeroBanner, TwoMonthCalendar, Legend, empty-state variants (AddDimensions, AddPeopleToCalendar, EmptyPlanningCalendar, GroupingColumns, NoNotifications, UnableToLoadImage), Notification family (Notifications, NotificationListItem, NotificationBanner), Drop-Down, Footer, Scrollbar, ToolbarItems, ListItem, UserMenu, ProductSwitch, ShellSearch, TableCell, InputMessagePopover.

**Effort.** ~30–45 min per batch. 5–6 batches total.

---

## D2 — Backfill 45 missing guideline JSONs

**What.** The registry lists 151 components; the guideline cache holds 96. 45 registry entries have no `knowledge/guidelines/{slug}.md` file.

**Why now.** Mode 2 (Component Guidance) is more useful when it can answer without hitting the network on every question. Also, `sap-fiori-guidelines` MCP (`getFioriGuideline`) returns "not cached" for any of these 45 today.

**Files.** New: `knowledge/guidelines/{slug}.md` × 45.

**Pipeline.**
1. Ask `sap-figma-community` MCP → `getRegistryEntry(componentName)` → read `guidelineUrl`.
2. Use `chrome-devtools` MCP → `navigate_page(guidelineUrl)` → `wait_for(['When to Use'])` → `take_snapshot()`.
3. Distill into the 17-field guideline shape (see `knowledge/guidelines/README.md`).
4. `mcp__sap-fiori-guidelines__refreshGuideline` returns the write path.
5. Verify with `getFioriGuideline(componentName)` post-write.

**Batch size.** ~10 guidelines per session.

**Effort.** ~90 min per batch. 4–5 batches total.

---

## D3 — Build-time audit script

**What.** A new `build/audit-registry.py` that emits per-build metrics and prints them at the tail of `node build/build-registry-bundle.js`.

**Metrics to emit.**
- Registry entry count (currently 151)
- Compact-schema count (entries missing `supportedProperties` OR `typographyRules` OR `colorTokenRules`) — currently 33
- Missing-guideline count (registry entries with no corresponding `knowledge/guidelines/{slug}.md`) — currently 45
- Token-linkage rate from the most recent `[Tokens]` line captured in build logs (Wave C1)
- Duplicate SAP_KEYS count (should stay 0 post-Wave-A2)
- 3-layer inconsistency count (should stay 0)

**Files.** New: `build/audit-registry.py`. Modified: `build/build-registry-bundle.js` (final `console.log` calls into `audit-registry.py`).

**Effort.** ~2–3 hours.

---

## D4 — End-to-end live demo

**What.** Record a 5-minute demo covering the full flow: requirement → floorplan confirmation → ASCII mockup → JSON spec → plugin build → a11y report.

**Why now.** Everything is in place; a demo is a durable artifact for onboarding new contributors and pitching the tool. A `MANAGER-PITCH.html` storyboard exists locally (kept out of the repo) and can seed the demo script.

**Files.** New: `docs/DEMO-2026-Q3.mp4` (or link) + `docs/DEMO-SCRIPT.md`.

**Scenario.** Reuse `output/create-mcp-server-step2-spec.json` — proven to build cleanly — as the demo screen.

**Effort.** ~3–4 hours including retakes.

---

## D5 — Rich handlers for currently-defaulted components

**What.** Six components today rely on the plugin's generic `sapInstance` renderer path (name matches, properties set via `setProperties`, but no purpose-built text/child injection). They render but with less polish than the components that have dedicated handlers.

**Components queued.** Notifications, NotificationBanner, NotificationListItem, GenericTag, InfoLabel, Bar.

**What "rich" means.** Purpose-built rendering that (a) sets specific instance properties correctly for that component's variants, (b) injects text into the right sub-node via `.findOne(...)`, (c) applies token bindings via the shared `applyFill`/`applyTextFill` helpers so they participate in Wave C1 metrics.

**Files.** `plugin/figma-builder/code.js` — new `renderX` functions in the `NATIVE_RENDERERS` map or in `buildTree`.

**Batch size.** 3–5 handlers per session.

**Effort.** ~45 min per handler. 6 handlers = ~4–5 hours.

---

## D6 — Slot-name declarations for the 46 container-like entries

**What.** 46 registry entries function as containers (Dialog, Panel, Card, DynamicPage, ObjectPageLayout, MessagePopover, etc.). Their JSON does not enumerate the named slots they accept — the plugin infers slot placement from the component-architect's spec today. Explicit `slotNames[]` fields would let the registry become the single source of truth.

**Why now.** Every "spec is invalid because slot X does not exist on component Y" bug is a slot-name mismatch. Making `slotNames[]` explicit lets both the plugin and the validator surface these mismatches by name at spec-load time instead of at render time.

**Files.** `knowledge/components/registry/{Container}.json` × 46 — add `slotNames: [...]`.

**Downstream change.** `plugin/figma-builder/code.js` — spec validator loop compares `spec.slots` keys against `registryEntry.slotNames` and reports mismatches before build.

**Batch size.** ~10 entries per session.

**Effort.** ~60 min per batch. ~5 batches.

---

## Ordering suggestion

If Wave D is executed sequentially, the ordering that unblocks the most downstream value first is:

1. **D3 (audit script)** — cheap, once landed it makes every subsequent wave visible in the build log.
2. **D6 (slot names)** — catches spec bugs at load time; unblocks cleaner validator reporting.
3. **D5 (rich handlers)** — visible quality improvement.
4. **D2 (guideline backfill)** — makes Mode 2 self-contained.
5. **D1 (compact-schema enrichment)** — unlocks Wave C1 metrics for a wider component surface.
6. **D4 (demo)** — captured after the above land.

---

## What Wave D deliberately does NOT include

- **Backend / server work.** The pipeline stays offline-preferring with local MCPs.
- **Manifest changes to outbound network capability.** The plugin remains offline-only.
- **Retirement of the compact-schema shape.** D1 enriches the 33 entries in place; the compact shape stays valid for future minimal additions.
- **Auto-fallback to raw hex for token misses.** The `applyFill` fallback behavior is stable and only observed by Wave C1, never changed.
- **Regeneration of already-cached guidelines.** D2 fills gaps; existing 96 cache entries are left untouched.

---

*Written: 2026-07-07 · Author: SAP Figma Design Agent maintenance pass · Prior context: Waves A, B, C landed the same day (see `snapshots/snapshot-20260707-*` folders).*

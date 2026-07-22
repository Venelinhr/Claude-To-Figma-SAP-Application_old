# SAP Figma Agent Skill v2 — Kit-Native Design Spec

**Date:** 2026-07-22
**Status:** approved
**Decision:** Option C — canonical for compositions, Kit for new elements

## Problem

The current skill (636 lines) is data-heavy: 40 inlined component keys, 49 token hexes, 15+ variant docs.
This data duplicates the attached SAP Web UI Kit library, goes stale, and doesn't actually help the Agent
execute — it still fell back to drawing native shapes because instructions were knowledge, not workflow.

## Architecture Shift

| Before | After |
|---|---|
| Skill owns ALL the data (keys, hexes, variants) | Kit Library owns the data; skill owns the reasoning |
| 636 lines | ~200 lines |
| Agent reads skill as a reference manual | Agent uses Kit as palette; skill as methodology + canon |
| Data goes stale when Kit updates | Kit updates automatically — skill stays valid |

## What the skill KEEPS (its unique value)
1. **SAP Fiori Methodology** — prime directive, floorplan decision rules, X-not-Y
2. **Canonical compositions table** — node IDs, when to clone each, what they're for
3. **Hard rules** — Compact, one Primary, token tags for Bind, placement beside-not-below
4. **Execution protocol** — 3-method: score→clone base, Assets panel→drag, set via panel
5. **Wireframe/approval gate** — VDI table + floorplan tree + confidence + ASCII, every time

## What gets REMOVED (Kit provides live)
- All 40 `importComponentSetByKeyAsync` keys → "search in Kit Assets panel"
- All 49 token hex values → "use Kit variable names from the properties panel"
- Variant property documentation → "read from the Kit's right-side panel"
- Giant component-by-component correct/wrong table → replaced by 5-line protocol

## New Execution Protocol (replaces ~100 lines)
```
SAP Web UI Kit is attached as a Library.
1. SCORE against canonical table (≥60 → clone that base node, then adapt)
2. For every element: Assets panel → search by component name → drag the real Kit instance
3. Set variants using the right-side properties panel (all valid options shown by Kit)
4. Name fill layers [sapTokenName] so Bind plugin resolves SAP variables
5. If a component isn't in the Assets panel: STOP — never draw a native shape
```

## Canonical table (stays — this is the proven composition library)
The canonicals in file `p7zm5EMBk5DRRZdxNeJ4f5` are project-approved compositions.
Kit = component palette. Canonicals = proven business compositions to clone.

## Target size: ~200 lines (from 636)

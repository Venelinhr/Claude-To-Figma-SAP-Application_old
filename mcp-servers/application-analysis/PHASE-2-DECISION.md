# MCP 5 — Phase 2 Vision Integration

## Decision: NOT building this. Here is why.

After honest assessment, embedding a vision model inside the `sap-application-analysis` MCP server is **not worth the engineering cost** given current usage. Phase 1 (text-vocabulary mapping with Claude doing vision in-loop) covers every realistic use case.

This document captures the assessment so future work doesn't re-evaluate from scratch.

---

## What Phase 2 would do

Add a 7th tool, `analyzeImage`, that accepts a base64 PNG and returns a `regions[]` array directly — no Claude vision in the loop. The MCP would call a vision model (Claude API, GPT-4V, Phi-3-Vision, or similar), parse its output into the controlled vocabulary, and return.

```
{ image: base64PNG } → MCP → { regions: [{ regionType, label, props? }, …] }
```

## Why Claude vision in-loop is already adequate

| Concern | Phase 1 reality |
|---|---|
| "Latency: Claude vision is slow" | Vision adds ~2-4 seconds per image. The whole spec generation pipeline (vision → regions → suggestFloorplan → spec draft → refine → final JSON) takes 30-60s anyway. Vision is not the bottleneck. |
| "Cost: Claude vision is expensive per call" | A single $0.01-0.03 vision call per generated screen is negligible against the cost of an experienced designer's time to manually build the same screen (~30 min). |
| "Determinism: text outputs are non-deterministic" | Claude vision output IS more deterministic for SAP-style screens than for arbitrary images because the screens follow a small vocabulary of standard regions. In testing, three independent runs on the Purchase Order screenshot produced 95%+ identical region lists. |
| "Offline use: MCP must work without Claude API access" | The Figma plugin doesn't run offline anyway — it requires figma.com + the SAP Web UI Kit team library. Same network requirement as the Claude API. No new constraint. |
| "Privacy: images shouldn't leave the user's machine" | This is the strongest argument FOR Phase 2 — a local vision model (Phi-3-Vision via Ollama) keeps images on-device. But: the user is uploading screenshots that contain SAP UI mockups, not sensitive customer data. Privacy is not the active concern. |

## What Phase 2 would cost to build

| Item | Hours |
|---|---|
| Pick + integrate vision model (Claude API embedded, or Ollama-Phi3, or GPT-4V) | 4 |
| Prompt engineering to constrain output to the controlled vocabulary | 6 |
| Output parsing + validation against region-patterns.js | 3 |
| Confidence scoring and "ambiguous" handling | 4 |
| Error recovery (vision returned junk → fallback to manual region tokens) | 3 |
| Documentation + integration tests | 4 |
| **Total** | **~24 hours** |

## What Phase 2 would NOT solve

- **Layout reasoning**: vision identifies regions, but the floorplan choice (worklist vs list-report) still depends on action verbs in the requirement text. That stays in-loop with Claude.
- **Spec refinement**: the spec.hierarchy structure (slots, props, sample data, SAP tokens) is still Claude-side work. Phase 2 doesn't shorten the back half of the pipeline.
- **Refine loop**: the user typing "add a status column" still needs language understanding. Vision alone can't do this.

So Phase 2 saves ~30 seconds at the front of a ~60-second pipeline. Not nothing, but not transformative.

## Conditions under which Phase 2 BECOMES worth building

Build Phase 2 if any of these become true:

1. **Volume**: project generates 100+ screens/day where the 30s vision step is a real bottleneck.
2. **CI/CD integration**: the spec pipeline runs in automation (no human in loop), so Claude vision isn't available — needs a deterministic in-server vision step.
3. **Privacy escalation**: screenshots routinely contain real customer data that can't leave the user's machine. Then local Phi-3-Vision becomes essential.
4. **Strict reproducibility**: same input PNG must always produce byte-identical regions list across runs. Then a self-hosted model with temperature=0 is required.

None of these are currently true.

## Decision

**Defer Phase 2 indefinitely.** Phase 1 + Claude vision is the pragmatic answer. Revisit if any of the conditions above changes.

Document this decision in `mcp-servers/application-analysis/README.md` so future maintainers don't waste cycles re-deciding.

---

Generated 2026-06-26.

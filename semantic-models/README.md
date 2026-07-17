# Semantic Models — VDI Analysis Cache

Cached visual analysis results — one compact file per reference image. Saves ~96% of tokens on repeat images.

**How it works:** when Claude analyses a reference image for the first time, it runs the full 8-stage VDI analysis and writes a compact summary here (`<slug>-<sha1_8>.md`). On subsequent builds using the same image, Claude loads the cached model instead of re-analysing — ~0.7k tokens vs ~13.5k.

**Naming:** `<slug>-<sha1_8>.md` where `<sha1_8>` is the first 8 characters of the image's SHA-1 hash.

These files ship with the repo so teammates benefit from analysis already done.
  Content-addressed: same image reuses the file; an edited image gets a new hash → auto-invalidates.
- **Written by** `/sap-bind` Step 1 after a fresh VDI run (the 7 artifacts distilled to ~1k tokens).
- **Reused by** `/sap-bind` Step 1 on cache hit (matching `sha1_8` + `vdiVersion`) → skips the ~14k VDI pass.

Format: frontmatter (`sourceImage`, `imageSha1`, `vdiVersion`, `floorplan`) + terse sections
Zones / Components / Tokens / States / Notes. Declarative, not a transcript.

Cache files are committed so teammates benefit from analysis already done — no need to re-analyse the same reference image.

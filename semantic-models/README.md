# semantic-models/

Cached, compact VDI semantic models — one per reference image.

- **Naming:** `<slug>-<sha1_8>.md` where `<sha1_8>` = first 8 chars of the image's SHA-1.
  Content-addressed: same image reuses the file; an edited image gets a new hash → auto-invalidates.
- **Written by** `/sap-bind` Step 1 after a fresh VDI run (the 7 artifacts distilled to ~1k tokens).
- **Reused by** `/sap-bind` Step 1 on cache hit (matching `sha1_8` + `vdiVersion`) → skips the ~14k VDI pass.

Format: frontmatter (`sourceImage`, `imageSha1`, `vdiVersion`, `floorplan`) + terse sections
Zones / Components / Tokens / States / Notes. Declarative, not a transcript.

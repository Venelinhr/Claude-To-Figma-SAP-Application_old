# Image quality guide

Use this file when the input is a visual reference. Determines reading strategy and confidence defaults.

---

## Image quality tiers

### Tier 1 — Ideal (PNG screenshot, direct screen capture)
- Full resolution, straight-on, no compression artifacts
- All text legible at 100% zoom
- Colors render accurately
- Default confidence: ● for all clearly visible elements

**Reading strategy:** Full pipeline, all 9 stages. Confidence can reach 99% for visible elements.

Example from this skill: the Schedule operation dialog PNG — clean dark-theme screenshot, all labels readable, all states visible.

---

### Tier 2 — Good (Figma frame export, high-res JPEG >90% quality)
- High resolution but may have minor compression
- Text legible, icons readable
- Colors may shift slightly from compression
- Default confidence: ● for layout and text, ○ for exact colors

**Reading strategy:** Full pipeline. Flag color token assignments as ○ and recommend Figma verification.

---

### Tier 3 — Limited (phone photo of screen, low-res JPEG, angled shot)
- Compression artifacts, possible perspective distortion
- Small text may be unreadable
- Colors affected by ambient light and screen glare
- Default confidence: ○ for all elements, ? for anything below 16px text or tight spacing

**Reading strategy:**
- Downgrade all ● to ○
- Downgrade all ○ to ?
- Add a quality notice at the top of the output
- Request a clean screenshot if possible
- Focus on layout structure and major components — skip detailed token mapping

**Quality notice template:**
> Image quality: Tier 3 (phone photo). Readings are inferred, not confirmed. Recommend a clean PNG screenshot from the browser or Figma for accurate component mapping and token assignment.

---

### Tier 4 — Sketch / whiteboard / hand-drawn
- No pixel-accurate information
- Layout and intent readable, details not
- Default confidence: ○ for structure, ? for all components

**Reading strategy:**
- Skip Stage 6 (layout reconstruction) — no measurements possible
- Skip Stage 7 (typography/color) — no visual evidence
- Focus on Stage 3 (requirement parsing) and Stage 4 (floorplan classification)
- Treat as a business intent document, not a visual spec

---

## How to assess image quality before reading

Look for these signals:

| Signal | Tier |
|--------|------|
| Text fully sharp and legible at all sizes | 1 or 2 |
| Small labels readable (12px equivalent) | 1 or 2 |
| Icon shapes clearly distinguishable | 1 or 2 |
| Input borders clearly visible | 1 |
| Slight blur on text edges | 2 or 3 |
| Background color shifts or banding | 2 or 3 |
| Perspective distortion / trapezoid shape | 3 |
| Reflection or glare on screen | 3 |
| Pencil / marker lines | 4 |

---

## Crop and zone strategy

For complex screens with dense zones (e.g. monthly pattern rows, table columns):

1. Identify the densest region in the image
2. If that region falls below Tier 2 quality, request a separate zoomed crop
3. Read the overall layout from the full image
4. Read the dense region from the zoomed crop
5. Merge both reads before producing output

This is how the flight card analysis improved: the overall card layout was readable from the full image, but badge text ("Günstigste Verbindung") required the high-res version to confirm.

---

## Asking for a better image

If image quality limits the output, say this — once, at the top of the output, not as a refusal:

> Image quality is Tier [N]. I can read the layout and major components with [X]% confidence. For accurate token mapping and component variant selection, a clean PNG screenshot would improve accuracy significantly. I'll proceed with what's visible and flag uncertain reads as ○ or ?.

Then continue with the analysis. Never refuse to analyze because of image quality.

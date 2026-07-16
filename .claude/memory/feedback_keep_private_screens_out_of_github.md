---
name: keep-private-screens-out-of-github
description: "[hard-rule] When the user says keep a screen/image private, it must NOT be git-tracked. Gitignore it, keep local, ship only the .md structural doc."
metadata: 
  node_type: memory
  type: feedback
  severity: hard-rule
  see_also: 
    - feedback_figma_mcp_canvas_placement
  originSessionId: 8f1e0953-d5bb-448c-8c6b-dc4220c65f91
---

# Keep user-flagged private screens out of GitHub

**Applies-to:** all-builds, canonical-screens

**Signal:** "I said 'dont publish these screens, keep them privately' and you upload them! Not good. Remove 05-schedule-operation-monthly.png"

**Mistake:** Committed canonical screenshot PNGs to git after the user asked for specific screens to be kept private. It happened more than once — PNGs kept leaking into GitHub despite the instruction.

**Why:** "Private" means NOT in the git-tracked tree at all — gitignore alone isn't enough if the file was already committed (git keeps tracking it until `git rm --cached`). A committed screenshot is published the moment it's pushed, even if later removed from HEAD (it stays in history).

**How-to-apply:** When the user flags any screen/image as private:
1. `git rm --cached <file>` (untrack, keep local)
2. Add the exact path to `.gitignore` so it can't be re-added
3. Verify with `git ls-files --error-unmatch <file>` → must fail (not tracked)
4. Keep the structural `.md` doc (that's the shareable knowledge); only the raw PNG stays private
5. Default posture: raw reference screenshots go in `docs/canonical-screens/_private-refs/` (already gitignored). Only commit a PNG if the user explicitly approves publishing it.

**Evidence:** 2026-07-16, removed 05-schedule-operation-monthly.png (commit 42fb100); recurring miss across the session.

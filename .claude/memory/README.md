# `.claude/memory/` — SHIPPED MIRROR (not the authoritative store)

**Read this before adding or editing anything here.**

This folder is a **git-tracked mirror** of durable project lessons so they ship
with the repo for anyone who clones it. It is **NOT** the store the runtime reads.

## Authority

| Concern | Location |
|---|---|
| **Authoritative memory** (what `recall-lessons.sh` reads, indexed by `MEMORY.md`) | `~/.claude/projects/-Users-C5408360/memory/` (global, per-user) |
| **This folder** | a read-only mirror shipped in the repo; the runtime does **not** read it |
| **`reuse-outcomes-ledger.md`** | the one genuinely project-scoped file here (per-project reuse tracking, gitignored) |

## Rules

- ✍️ **Write new lessons to the GLOBAL store**, not here. The feedback loop
  (`feedback-learn.sh` → `pending-learnings.jsonl` → global memory) already does
  this automatically. A lesson written only into this folder is **invisible to
  `recall-lessons.sh`** and will never surface during a build.
- 🔁 To refresh this mirror, copy the durable files from the global store here.
  Do not hand-edit divergent content — that recreates the split-store drift this
  README exists to prevent (drift-audit finding H2, 2026-07-21).
- 🗑️ Every `.md` here except `reuse-outcomes-ledger.md` is a duplicate of a
  global entry; if a filename here has no global counterpart, it is an orphan —
  move it to the global store.

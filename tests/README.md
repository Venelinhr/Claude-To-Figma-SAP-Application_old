# Tests — Regression Suite

Prompt-driven regression tests for the build pipeline.

| Folder | Contents |
|--------|----------|
| `prompts/` | Input requirements used to generate test specs |
| `expected/` | Expected JSON spec output for each prompt |

Run via `bash build/test-build.sh` — all specs must pass the registry gate, token whitelist, and component count baseline.

Run via: `bash build/test-build.sh` — must exit 0 before any merge.

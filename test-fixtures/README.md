# Test Fixtures

Sample JSON files used by the RULE 25 tag-contract linter (`build/lint-mcp-frame.js`).

| File | Purpose |
|------|---------|
| `mcp-frame-clean.json` | A correctly tagged MCP-first frame — linter must pass this |
| `mcp-frame-broken.json` | A frame with raw hex fills and bad token tags — linter must fail this |

Run via `bash build/test-build.sh` as part of the regression suite.

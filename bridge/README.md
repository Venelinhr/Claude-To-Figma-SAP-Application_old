# SAP Agent v2 — Setup & Usage

**What it is:** a second, separate Figma plugin (**"SAP Agent v2"**) that adds a *"Describe your change"* Agent tab on top of the existing **Bind SAP Tokens** plugin. Select a screen you built → type a change → the SAP agent reads it, proposes a wireframe, and (after you approve) builds the new screen **right beside the original**.

Your original plugin is untouched. You switch between **v1** ("Claude to Figma SAP Application") and **v2** ("SAP Agent v2") in Figma → Plugins → Development.

---

## How it works (why the bridge exists)

A Figma plugin can't call Claude directly (MCP only goes Claude → Figma). So a tiny local **bridge** is the middleman:

```
v2 plugin  ──HTTP(127.0.0.1:41777)──►  bridge (bridge/server.js)  ──spawns──►  headless claude
   Claude  ──────────────────── use_figma (MCP) ────────────────────────────►  Figma canvas
```

The bridge runs a real 2-turn Claude conversation:
1. **Turn 1** — Claude reads your selected screen and proposes an ASCII wireframe. **Nothing is built** (a read-only gate hard-blocks any build this turn).
2. You click **Approve** → your word is relayed to Claude as a genuine turn → the existing `capture-approvals.sh` hook writes `.wireframe-approved` → Claude clones your screen and builds the new one beside it. **Your original is never edited.**

All existing safety gates (wireframe approval, reuse/clone-first, token binding) stay intact — the bridge never fakes approval.

---

## One-time setup

```bash
# nothing to install — the bridge uses only Node built-ins
node --version   # must be >= 18
```

---

## Each session (3 steps)

**1. Start the bridge** (keep this terminal open):
```bash
cd "/Users/C5408360/Downloads/Task to Figma SAP layouts components/bridge"
node server.js
```
It prints a **token** — copy it.

**2. Open the v2 plugin in Figma:**
- Plugins → Development → Import plugin from manifest → select
  `plugin/figma-builder-v2/manifest.json` (first time only)
- Run **SAP Agent v2**. On the **Agent** tab, paste the token once (persists after that).
- If it asks for the file key, paste this Figma file's URL once.

**3. Use it:**
- Select a screen frame you built.
- Agent tab → type e.g. *"Make step 2 of this screen"* → **Send to Agent**.
- Review the wireframe → **Approve — build beside**.
- When done, click the Figma link, then switch to the **Bind** tab and **Bind SAP Tokens**.

---

## Rebuilding the plugin (after editing v2 source)

```bash
bash build/build-v2.sh     # rebuilds plugin/figma-builder-v2/code.bundled.js only; v1 untouched
```
Then in Figma: right-click the plugin → re-run (or re-import if the manifest changed).

---

## Files

| Path | Role |
|---|---|
| `bridge/server.js` | localhost bridge (Node core, no deps) — spawns headless claude, relays turns |
| `bridge/package.json` | `npm start` convenience |
| `plugin/figma-builder-v2/manifest.json` | v2 plugin id/name + `networkAccess` localhost allowance |
| `plugin/figma-builder-v2/ui.html` | Agent/Bind tabs; Agent pane (describe box, wireframe stream, Approve) |
| `plugin/figma-builder-v2/agent-runtime.js` | Agent message handlers (wraps v1's onmessage; fetch/SSE to bridge) |
| `plugin/figma-builder-v2/code.js` | symlink → v1's code.js (can't drift) |
| `build/build-v2.sh` | builds v2 bundle; asserts the bridge never writes approval markers |
| `.claude/hooks/guard-agent-turn1.sh` | hard-blocks `use_figma` during the read-only turn 1 |

---

## Troubleshooting

- **"Bridge not running"** in the plugin → start `node bridge/server.js`; confirm port **41777** (matches the manifest). Change with `SAP_BRIDGE_PORT=…` only if you also edit `manifest.json` + `agent-runtime.js`.
- **Wireframe never streams** → SSE may be buffered in the Figma sandbox; the plugin auto-falls back to long-poll. If still stuck, check the bridge terminal for errors.
- **Build blocked** → that's a gate doing its job. Read the bridge terminal / plugin error; usually a missing approval or the read-only sentinel wasn't cleared.
- **`use_figma` blocked in the agent** → the bridge spawns claude with `--permission-mode bypassPermissions` (required; `acceptEdits` blocks Figma tools). If you changed that, revert it.

#!/usr/bin/env bash
# =============================================================================
# Claude to Figma SAP Application — One-Command Installer
# =============================================================================
set -e

SKILL_DIR="$(cd "$(dirname "$0")" && pwd)"
CLAUDE_DIR="$HOME/.claude"

GREEN='\033[0;32m'; BLUE='\033[0;34m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
log()  { echo -e "${BLUE}[SAP Designer]${NC} $1"; }
ok()   { echo -e "${GREEN}✓${NC} $1"; }
warn() { echo -e "${YELLOW}⚠${NC} $1"; }
fail() { echo -e "${RED}✗${NC} $1"; exit 1; }

echo ""
echo "  ╔═══════════════════════════════════════════════════════╗"
echo "  ║   Claude to Figma SAP Application — Installer         ║"
echo "  ╚═══════════════════════════════════════════════════════╝"
echo ""

# ── Step 1: Prerequisites ────────────────────────────────────────────────────
log "Checking prerequisites..."
command -v node >/dev/null 2>&1 || fail "Node.js not found. Install v20+ from https://nodejs.org"
command -v npm  >/dev/null 2>&1 || fail "npm not found."
command -v claude >/dev/null 2>&1 || fail "Claude Code CLI not found. Install from https://claude.ai/code"

NODE_VER=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VER" -lt 20 ]; then
  fail "Node.js 20+ required. Found: $(node --version). Upgrade at https://nodejs.org"
fi
ok "Node.js $(node --version)"
ok "Claude Code CLI installed"

# ── Step 2: Install custom MCP server dependencies ───────────────────────────
log "Installing custom MCP server dependencies..."
for dir in mcp-servers/application-analysis mcp-servers/fiori-guidelines mcp-servers/sap-figma-community; do
  if [ -d "$SKILL_DIR/$dir" ]; then
    log "  → $dir"
    (cd "$SKILL_DIR/$dir" && npm install --silent 2>/dev/null)
    ok "  $dir ready"
  fi
done

# ── Step 3: Install Chrome DevTools MCP ──────────────────────────────────────
log "Installing Chrome DevTools MCP..."
npm install -g chrome-devtools-mcp@latest 2>/dev/null || \
  warn "Global install failed — will use npx on demand (works fine)"
ok "Chrome DevTools MCP ready"

# ── Step 4: Copy the skill ───────────────────────────────────────────────────
log "Installing SAP Figma Design Agent skill..."
mkdir -p "$CLAUDE_DIR/skills"
rm -rf "$CLAUDE_DIR/skills/sap-figma-design-agent"
cp -r "$SKILL_DIR/skill/" "$CLAUDE_DIR/skills/sap-figma-design-agent"
ok "Skill installed → ~/.claude/skills/sap-figma-design-agent/"

# ── Step 5: Register all MCP servers ─────────────────────────────────────────
log "Registering MCP servers in ~/.claude/settings.json..."
mkdir -p "$CLAUDE_DIR"

export INSTALL_SKILL_DIR="$SKILL_DIR"

node << 'NODEJS'
const fs = require('fs');
const path = require('path');
const settingsPath = path.join(process.env.HOME, '.claude', 'settings.json');
const skillDir = process.env.INSTALL_SKILL_DIR;

let settings = {};
if (fs.existsSync(settingsPath)) {
  try { settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8')); }
  catch(e) { console.warn('Could not parse existing settings.json — creating fresh.'); }
}
if (!settings.mcpServers) settings.mcpServers = {};

// Chrome DevTools MCP
settings.mcpServers['chrome-devtools'] = {
  type: 'stdio', command: 'npx', args: ['chrome-devtools-mcp@latest', '--stdio']
};

// SAP Fiori Guidelines MCP
settings.mcpServers['sap-fiori-guidelines'] = {
  type: 'stdio', command: 'node',
  args: [path.join(skillDir, 'mcp-servers/fiori-guidelines/server.js')],
  cwd: path.join(skillDir, 'mcp-servers/fiori-guidelines')
};

// SAP Application Analysis MCP
settings.mcpServers['sap-application-analysis'] = {
  type: 'stdio', command: 'node',
  args: [path.join(skillDir, 'mcp-servers/application-analysis/server.js')],
  cwd: path.join(skillDir, 'mcp-servers/application-analysis')
};

// SAP Figma Community MCP
settings.mcpServers['sap-figma-community'] = {
  type: 'stdio', command: 'node',
  args: [path.join(skillDir, 'mcp-servers/sap-figma-community/server.js')],
  cwd: path.join(skillDir, 'mcp-servers/sap-figma-community')
};

// Figma MCP — REQUIRED for MCP-first builds (RULE 25 default path)
if (!settings.mcpServers['figma']) {
  settings.mcpServers['figma'] = {
    type: 'stdio', command: 'npx',
    args: ['-y', 'figma-developer-mcp', '--stdio'],
    env: { FIGMA_API_TOKEN: 'YOUR_FIGMA_TOKEN_HERE' }
  };
}

fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n');
console.log('settings.json updated — 5 MCP servers registered');
NODEJS

ok "All MCP servers registered (5 total)"

# ── Done ─────────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  Installation complete!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo ""
echo "  ┌─ STEP 1 — Add your Figma API token (REQUIRED) ────────────┐"
echo "  │  Get token: https://www.figma.com/settings                 │"
echo "  │  Edit: ~/.claude/settings.json                             │"
echo "  │  Replace: YOUR_FIGMA_TOKEN_HERE                            │"
echo "  │  Under: mcpServers.figma.env.FIGMA_API_TOKEN               │"
echo "  └────────────────────────────────────────────────────────────┘"
echo ""
echo "  ┌─ STEP 2 — Load the Figma plugin ──────────────────────────┐"
echo "  │  Plugins → Development → Import plugin from manifest       │"
echo "  │  Select: $SKILL_DIR/plugin/figma-builder/manifest.json     │"
echo "  └────────────────────────────────────────────────────────────┘"
echo ""
echo "  ┌─ STEP 3 — Connect SAP Web UI Kit library ─────────────────┐"
echo "  │  In your Figma file: Assets panel (Shift+I) → Libraries    │"
echo "  │  → Enable SAP Web UI Kit                                    │"
echo "  │  Free: https://www.figma.com/community/file/1494295794601744471 │"
echo "  └────────────────────────────────────────────────────────────┘"
echo ""
echo "  ┌─ STEP 4 — Restart Claude Code ────────────────────────────┐"
echo "  │  Run: claude                                                │"
echo "  │  Verify: claude mcp list  (should show 5+ servers)         │"
echo "  └────────────────────────────────────────────────────────────┘"
echo ""
echo "  ┌─ BUILD YOUR FIRST SCREEN ──────────────────────────────────┐"
echo "  │  1. Describe your screen to Claude                         │"
echo "  │  2. Approve the ASCII wireframe (mandatory gate)           │"
echo "  │  3. Claude builds in Figma via use_figma                   │"
echo "  │  4. Select the frame → plugin → Bind SAP Tokens            │"
echo "  │  5. Done — real SAP components + live tokens + a11y check  │"
echo "  └────────────────────────────────────────────────────────────┘"
echo ""
echo "  ┌─ STEP 0 — Learn from your Figma file (RECOMMENDED) ───────┐"
echo "  │  Tell Claude: 'Learn from my Figma file: <url>'            │"
echo "  │  or: /sap-learn https://figma.com/design/<fileKey>/...     │"
echo "  │                                                            │"
echo "  │  Claude will analyze your project and learn:               │"
echo "  │  • Existing SAP floorplans and approved screens            │"
echo "  │  • Component hierarchy and naming conventions              │"
echo "  │  • Design tokens and Auto Layout patterns                  │"
echo "  │                                                            │"
echo "  │  Future builds reuse your approved screens instead of      │"
echo "  │  rebuilding from scratch. Quality and speed improve with   │"
echo "  │  every confirmed build.                                    │"
echo "  │                                                            │"
echo "  │  Skip: 11 shipped canonical screens are available as       │"
echo "  │  starting points without any Figma file connection.        │"
echo "  └────────────────────────────────────────────────────────────┘"
echo ""

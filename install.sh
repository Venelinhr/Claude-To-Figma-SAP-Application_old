#!/usr/bin/env bash
# =============================================================================
# Claude to Figma SAP Application — One-Command Installer
# =============================================================================
# Usage:
#   ./install.sh
#
# What this does:
#   1. Checks Node.js, npm, Claude Code CLI are installed
#   2. Installs Chrome DevTools MCP (fetches live SAP documentation)
#   3. Copies the skill to ~/.claude/skills/
#   4. Adds Chrome DevTools MCP to ~/.claude/settings.json
#   5. Prints instructions for loading the Figma plugin
#
# About the Figma API key:
#   NOT required for installation or for the plugin to work.
#   The plugin imports components directly from your SAP Web UI Kit
#   team library — no API key needed.
#   The Figma API key is only needed if you want Claude to browse
#   your Figma files via MCP (optional, advanced use).
#   Add it manually later: ~/.claude/settings.json → mcpServers.figma
# =============================================================================

set -e

SKILL_DIR="$(cd "$(dirname "$0")" && pwd)"
CLAUDE_DIR="$HOME/.claude"
SETTINGS="$CLAUDE_DIR/settings.json"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log()  { echo -e "${BLUE}[SAP Designer]${NC} $1"; }
ok()   { echo -e "${GREEN}✓${NC} $1"; }
warn() { echo -e "${YELLOW}⚠${NC} $1"; }
fail() { echo -e "${RED}✗${NC} $1"; exit 1; }

echo ""
echo "  ╔═══════════════════════════════════════════╗"
echo "  ║   Claude to Figma SAP Application — Installer       ║"
echo "  ║   Claude + Figma Plugin + Chrome MCP      ║"
echo "  ╚═══════════════════════════════════════════╝"
echo ""

# ── Step 1: Check prerequisites ──────────────────────────────────────────────
log "Checking prerequisites..."

command -v node >/dev/null 2>&1 || fail "Node.js not found. Install from https://nodejs.org"
command -v npm  >/dev/null 2>&1 || fail "npm not found. Install from https://nodejs.org"
command -v claude >/dev/null 2>&1 || fail "Claude Code CLI not found. Install from https://claude.ai/code"

NODE_VER=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VER" -lt 18 ]; then
  fail "Node.js 18+ required. Found: $(node --version)"
fi

ok "Node.js $(node --version)"
ok "Claude Code CLI installed"

# ── Step 2: Install Chrome DevTools MCP ──────────────────────────────────────
log "Installing Chrome DevTools MCP..."
npm install -g chrome-devtools-mcp@latest 2>/dev/null || \
  warn "Global install failed — will use npx on demand (works fine)"
ok "Chrome DevTools MCP ready (fetches live SAP API + Fiori guidelines)"

# ── Step 3: Install the skill ────────────────────────────────────────────────
log "Installing SAP Figma Design Agent skill..."
mkdir -p "$CLAUDE_DIR/skills"
cp -r "$SKILL_DIR/skill" "$CLAUDE_DIR/skills/sap-figma-design-agent"
ok "Skill installed → ~/.claude/skills/sap-figma-design-agent/"

# ── Step 4: Update Claude settings ───────────────────────────────────────────
log "Adding Chrome DevTools MCP to ~/.claude/settings.json..."

mkdir -p "$CLAUDE_DIR"

node << 'NODEJS'
const fs = require('fs');
const settingsPath = process.env.HOME + '/.claude/settings.json';

let settings = {};
if (fs.existsSync(settingsPath)) {
  try {
    settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
  } catch(e) {
    console.warn('Could not parse existing settings.json — creating fresh.');
  }
}

if (!settings.mcpServers) settings.mcpServers = {};

settings.mcpServers['chrome-devtools'] = {
  type: 'stdio',
  command: 'npx',
  args: ['chrome-devtools-mcp@latest', '--stdio']
};

fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n');
console.log('settings.json updated');
NODEJS

ok "Chrome DevTools MCP configured in settings"

# ── Step 5: Setup guidelines cache ───────────────────────────────────────────
mkdir -p "$SKILL_DIR/knowledge/guidelines"
ok "SAP guidelines cache ready → knowledge/guidelines/"

# ── Done ─────────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  Installation complete!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo ""
echo "  NEXT STEPS:"
echo ""
echo "  1. Load the Figma plugin"
echo "     → Open Figma desktop app"
echo "     → Menu → Plugins → Development → Import plugin from manifest"
echo "     → Select: $SKILL_DIR/plugin/figma-builder/manifest.json"
echo "     → Assets panel (Shift+I) → Libraries → enable SAP Web UI Kit"
echo ""
echo "  2. Restart Claude Code (loads Chrome MCP)"
echo "     → Run: claude"
echo ""
echo "  3. Describe your screen and Claude will do the rest"
echo "     → Claude reads SAP guidelines, proposes structure, asks questions"
echo "     → After confirmation, generates JSON spec"
echo "     → Paste JSON into Figma plugin → Build Screen"
echo ""
echo "  Optional: add your Figma API key to ~/.claude/settings.json"
echo "  under mcpServers.figma if you want Claude to browse your Figma files."
echo "  Get your key at: https://www.figma.com/settings → Personal access tokens"
echo ""

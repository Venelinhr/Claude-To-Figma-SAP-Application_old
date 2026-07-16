#!/usr/bin/env node
/**
 * SAP Fiori Design Guidelines MCP Server
 *
 * Exposes the local guideline cache (knowledge/guidelines/*.json) as MCP tools:
 *  - getFioriGuideline(componentName)   → full cached guideline entry
 *  - refreshGuideline(componentName)    → re-fetch from experience.sap.com
 *  - searchGuidelines(query)            → fuzzy search across all entries
 *  - getPattern(patternName)            → components participating in a pattern
 *  - listComponents()                   → all cached component names
 *
 * stdio transport — for integration with Claude Code, Cline, VS Code MCP, etc.
 *
 * Install:
 *   npm install
 *
 * Run via Claude Code:
 *   claude mcp add --transport stdio --scope user sap-fiori-guidelines -- \
 *     node /absolute/path/to/this/server.js
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Resolve guideline cache directory — relative to this file
// mcp-servers/fiori-guidelines/server.js → ../../knowledge/guidelines/
const CACHE_DIR = resolve(__dirname, '..', '..', 'knowledge', 'guidelines');

// ────────────────────────────────────────────────────────────────────────────
// CACHE LOADER
// ────────────────────────────────────────────────────────────────────────────

function loadAllGuidelines() {
  if (!existsSync(CACHE_DIR)) {
    throw new Error(`Guideline cache not found at ${CACHE_DIR}`);
  }
  const files = readdirSync(CACHE_DIR).filter(f => f.endsWith('.json') && !f.startsWith('_'));
  const entries = {};
  for (const file of files) {
    try {
      const data = JSON.parse(readFileSync(join(CACHE_DIR, file), 'utf8'));
      const name = data.componentName || file.replace('.json', '');
      entries[name] = data;
    } catch (e) {
      console.error(`Failed to load ${file}: ${e.message}`);
    }
  }
  return entries;
}

let _cache = null;
function getCache() {
  if (_cache === null) _cache = loadAllGuidelines();
  return _cache;
}

function reloadCache() {
  _cache = loadAllGuidelines();
  return _cache;
}

// ────────────────────────────────────────────────────────────────────────────
// TOOL IMPLEMENTATIONS
// ────────────────────────────────────────────────────────────────────────────

/**
 * Return the full cached guideline entry for a component.
 */
function toolGetFioriGuideline({ componentName }) {
  const cache = getCache();
  const entry = cache[componentName];
  if (!entry) {
    const available = Object.keys(cache).slice(0, 20).join(', ');
    return {
      isError: true,
      content: [{
        type: 'text',
        text: `Component "${componentName}" not in cache.\nAvailable components: ${available}${Object.keys(cache).length > 20 ? ', …' : ''}\nUse listComponents to see all.`,
      }],
    };
  }
  return {
    content: [{ type: 'text', text: JSON.stringify(entry, null, 2) }],
  };
}

/**
 * Re-fetch a guideline from experience.sap.com and update the cache file.
 * NOTE: server cannot make HTTP requests directly — this is a placeholder
 * that documents what the real implementation should do, and returns the
 * scrape instructions for the caller (Claude) to execute via WebFetch.
 */
function toolRefreshGuideline({ componentName }) {
  const cache = getCache();
  const entry = cache[componentName];
  const slug = entry ? entry.slug : componentName.toLowerCase();
  const url = `https://experience.sap.com/fiori-design-web/${slug}/`;
  return {
    content: [{
      type: 'text',
      text: `To refresh ${componentName}, the caller should:\n1. Fetch ${url}\n2. Extract: purpose, whenToUse, whenNotToUse, do/don't, responsiveBehavior, accessibilityGuidance\n3. Update ${join(CACHE_DIR, `${componentName}.json`)} matching the _schema.json structure\n4. Set lastChecked to today's ISO date\n\nThis MCP server reads from disk — it does not fetch URLs directly.`,
    }],
  };
}

/**
 * Fuzzy search across all cached guidelines.
 * Matches against componentName, purpose, whenToUse, doRules, patterns.
 */
function toolSearchGuidelines({ query }) {
  if (!query || typeof query !== 'string') {
    return { isError: true, content: [{ type: 'text', text: 'query is required' }] };
  }
  const cache = getCache();
  const q = query.toLowerCase();
  const results = [];

  for (const name in cache) {
    const e = cache[name];
    let score = 0;
    let matches = [];

    if (name.toLowerCase().includes(q)) { score += 10; matches.push('name'); }
    if ((e.purpose || '').toLowerCase().includes(q)) { score += 5; matches.push('purpose'); }

    const searchArr = (arr, label, weight) => {
      if (!Array.isArray(arr)) return;
      for (const item of arr) {
        if (typeof item === 'string' && item.toLowerCase().includes(q)) {
          score += weight;
          matches.push(label);
          break;
        }
      }
    };

    searchArr(e.whenToUse, 'whenToUse', 3);
    searchArr(e.whenNotToUse, 'whenNotToUse', 2);
    searchArr(e.doRules, 'doRules', 2);
    searchArr(e.dontRules, 'dontRules', 2);
    searchArr(e.patterns, 'patterns', 4);

    if (score > 0) {
      results.push({
        component: name,
        score,
        matches: [...new Set(matches)],
        purpose: e.purpose,
        patterns: e.patterns || [],
      });
    }
  }

  results.sort((a, b) => b.score - a.score);
  const top = results.slice(0, 10);

  if (top.length === 0) {
    return { content: [{ type: 'text', text: `No matches for "${query}"` }] };
  }

  return {
    content: [{
      type: 'text',
      text: `Top ${top.length} matches for "${query}":\n\n` +
        top.map(r =>
          `**${r.component}** (score ${r.score}, matched: ${r.matches.join(', ')})\n` +
          `  ${r.purpose}\n` +
          (r.patterns.length ? `  patterns: ${r.patterns.join(' · ')}` : '')
        ).join('\n\n'),
    }],
  };
}

/**
 * Return components that participate in a given UX pattern.
 */
function toolGetPattern({ patternName }) {
  if (!patternName) {
    return { isError: true, content: [{ type: 'text', text: 'patternName is required' }] };
  }
  const cache = getCache();
  const q = patternName.toLowerCase();
  const matches = [];

  for (const name in cache) {
    const e = cache[name];
    if (Array.isArray(e.patterns)) {
      for (const p of e.patterns) {
        if (p.toLowerCase().includes(q)) {
          matches.push({
            component: name,
            pattern: p,
            purpose: e.purpose,
            doRules: (e.doRules || []).slice(0, 2),
          });
          break;
        }
      }
    }
  }

  if (matches.length === 0) {
    // Suggest known patterns
    const allPatterns = new Set();
    for (const name in cache) {
      (cache[name].patterns || []).forEach(p => allPatterns.add(p));
    }
    return {
      content: [{
        type: 'text',
        text: `No components found for pattern "${patternName}".\n\nKnown patterns:\n  ${[...allPatterns].sort().join('\n  ')}`,
      }],
    };
  }

  return {
    content: [{
      type: 'text',
      text: `Components for pattern "${patternName}":\n\n` +
        matches.map(m =>
          `**${m.component}** — ${m.pattern}\n` +
          `  ${m.purpose}\n` +
          (m.doRules.length ? `  do: ${m.doRules.join('; ')}` : '')
        ).join('\n\n'),
    }],
  };
}

/**
 * List all cached component names with category and version info.
 */
function toolListComponents() {
  const cache = getCache();
  const names = Object.keys(cache).sort();
  const summary = names.map(n => {
    const e = cache[n];
    return `  ${n}${e.lastChecked ? ` (checked ${e.lastChecked})` : ''}`;
  }).join('\n');

  return {
    content: [{
      type: 'text',
      text: `${names.length} components in cache:\n\n${summary}\n\nUse getFioriGuideline(componentName) for details.`,
    }],
  };
}

// ────────────────────────────────────────────────────────────────────────────
// MCP SERVER SETUP
// ────────────────────────────────────────────────────────────────────────────

const TOOLS = [
  {
    name: 'getFioriGuideline',
    description: 'Get the full SAP Fiori design guideline for a component (purpose, when to use, do/don\'t rules, layout, responsive, accessibility, patterns).',
    inputSchema: {
      type: 'object',
      required: ['componentName'],
      properties: {
        componentName: {
          type: 'string',
          description: 'SAP component name — e.g. "Button", "IconTabBar", "ShellBar"',
        },
      },
    },
  },
  {
    name: 'refreshGuideline',
    description: 'Get instructions for refreshing a cached guideline from the official SAP source. Server reads from disk; caller fetches and updates.',
    inputSchema: {
      type: 'object',
      required: ['componentName'],
      properties: {
        componentName: { type: 'string', description: 'Component to refresh' },
      },
    },
  },
  {
    name: 'searchGuidelines',
    description: 'Fuzzy-search SAP Fiori guidelines by keyword. Returns top 10 matches ranked by relevance across name, purpose, whenToUse, do/don\'t rules, and patterns.',
    inputSchema: {
      type: 'object',
      required: ['query'],
      properties: {
        query: { type: 'string', description: 'Search term (e.g. "navigation", "table", "form")' },
      },
    },
  },
  {
    name: 'getPattern',
    description: 'Get all SAP components that participate in a given UX pattern (e.g. "List Report", "Object Page", "Toolbar action", "Form field").',
    inputSchema: {
      type: 'object',
      required: ['patternName'],
      properties: {
        patternName: { type: 'string', description: 'Pattern name to look up' },
      },
    },
  },
  {
    name: 'listComponents',
    description: 'List all SAP components in the guidelines cache.',
    inputSchema: { type: 'object', properties: {} },
  },
];

const server = new Server(
  {
    name: 'sap-fiori-guidelines',
    version: '0.1.0',
  },
  {
    capabilities: { tools: {} },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  try {
    switch (name) {
      case 'getFioriGuideline':  return toolGetFioriGuideline(args || {});
      case 'refreshGuideline':   return toolRefreshGuideline(args || {});
      case 'searchGuidelines':   return toolSearchGuidelines(args || {});
      case 'getPattern':         return toolGetPattern(args || {});
      case 'listComponents':     return toolListComponents();
      default:
        return {
          isError: true,
          content: [{ type: 'text', text: `Unknown tool: ${name}` }],
        };
    }
  } catch (e) {
    return {
      isError: true,
      content: [{ type: 'text', text: `Tool error: ${e.message}\n${e.stack}` }],
    };
  }
});

// ────────────────────────────────────────────────────────────────────────────
// START
// ────────────────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);

// Log to stderr (stdout is reserved for MCP protocol)
console.error(`[sap-fiori-guidelines-mcp] Started. Cache: ${CACHE_DIR}`);
console.error(`[sap-fiori-guidelines-mcp] Loaded ${Object.keys(getCache()).length} component guidelines.`);

#!/usr/bin/env node
/**
 * MCP 5 — SAP Application Analysis Server
 *
 * Takes structured UI observations (from a screenshot, wireframe, or sketch
 * that the AI caller has already described) and maps them to SAP Fiori
 * patterns, floorplans, and a spec draft ready to refine.
 *
 * The MCP does NOT do vision. The caller (Claude) does vision via its own
 * capabilities and produces structured regions. This MCP does the mapping.
 *
 * Tools:
 *   - listRegionTypes              — controlled vocabulary the caller uses
 *   - listFloorplanHeuristics      — what makes a floorplan a fit
 *   - mapRegionToSAP               — one region → SAP components + rationale
 *   - suggestFloorplan             — given a set of regions, rank floorplans
 *   - buildSpecDraft               — assemble a partial spec from regions
 *
 * Usage from Claude:
 *   1. User uploads/describes a screenshot
 *   2. Claude describes regions in controlled vocab: [{ regionType, label, position }, ...]
 *   3. Claude calls mapRegionToSAP for each, suggestFloorplan for the set
 *   4. Claude calls buildSpecDraft → returns spec-schema.json-shaped JSON
 *   5. Claude refines + presents to user → paste into Figma plugin
 *
 * Install:
 *   npm install
 *
 * Register with Claude Code:
 *   claude mcp add --transport stdio --scope user sap-application-analysis -- \
 *     node /absolute/path/to/this/server.js
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { REGION_PATTERNS, FLOORPLAN_HEURISTICS, scoreFloorplans } from './region-patterns.js';

// ────────────────────────────────────────────────────────────────────────────
// TOOL IMPLEMENTATIONS
// ────────────────────────────────────────────────────────────────────────────

function toolListRegionTypes() {
  const lines = [];
  const grouped = {};

  for (const [type, pattern] of Object.entries(REGION_PATTERNS)) {
    const cat = pattern.floorplanHint || 'any';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push({ type, desc: pattern.description, confidence: pattern.confidence });
  }

  lines.push(`Controlled vocabulary — ${Object.keys(REGION_PATTERNS).length} region types`);
  lines.push('');
  lines.push('Use these exact tokens as `regionType` in mapRegionToSAP / buildSpecDraft calls.');
  lines.push('');

  for (const [cat, items] of Object.entries(grouped)) {
    lines.push(`── ${cat} ──`);
    items.sort((a, b) => a.type.localeCompare(b.type));
    for (const item of items) {
      lines.push(`  ${item.type}`);
      lines.push(`      ${item.desc}`);
    }
    lines.push('');
  }

  return { content: [{ type: 'text', text: lines.join('\n') }] };
}

function toolListFloorplanHeuristics() {
  const lines = ['SAP Fiori floorplan heuristics:', ''];
  for (const h of FLOORPLAN_HEURISTICS) {
    lines.push(`── ${h.floorplan} ──`);
    lines.push(`  ${h.description}`);
    lines.push(`  Required regions: ${h.requires.join(', ')}`);
    lines.push(`  Strong indicators: ${h.indicators.join(', ')}`);
    lines.push('');
  }
  return { content: [{ type: 'text', text: lines.join('\n') }] };
}

function toolMapRegionToSAP({ regionType, label, position }) {
  if (!regionType || typeof regionType !== 'string') {
    return { isError: true, content: [{ type: 'text', text: 'regionType (string) required. Call listRegionTypes for the vocabulary.' }] };
  }

  const pattern = REGION_PATTERNS[regionType];
  if (!pattern) {
    const candidates = Object.keys(REGION_PATTERNS).filter(t =>
      t.includes(regionType.toLowerCase()) || regionType.toLowerCase().includes(t)
    );
    return {
      content: [{
        type: 'text',
        text: `Unknown regionType: "${regionType}".\n` +
              (candidates.length ? `Did you mean: ${candidates.join(', ')}?\n` : '') +
              `Call listRegionTypes to see all valid tokens.`,
      }],
    };
  }

  const lines = [];
  lines.push(`Region: ${regionType}`);
  if (label) lines.push(`Label: "${label}"`);
  if (position) lines.push(`Position: ${JSON.stringify(position)}`);
  lines.push(`Description: ${pattern.description}`);
  lines.push('');
  lines.push(`SAP components: ${pattern.sapComponents.join(', ')}`);
  lines.push(`Visual cues: ${pattern.visualCues.join('; ')}`);
  lines.push(`Confidence: ${pattern.confidence}`);
  if (pattern.intent) lines.push(`Button intent: ${pattern.intent}`);
  lines.push(`Notes: ${pattern.notes}`);
  lines.push(`Floorplan hint: ${pattern.floorplanHint}`);

  return { content: [{ type: 'text', text: lines.join('\n') }] };
}

function toolSuggestFloorplan({ regions }) {
  if (!Array.isArray(regions) || regions.length === 0) {
    return { isError: true, content: [{ type: 'text', text: 'regions array required (one or more { regionType, ... } objects)' }] };
  }

  const scores = scoreFloorplans(regions);
  const lines = ['Floorplan ranking:', ''];

  for (const s of scores) {
    const tier = s.score >= 20 ? 'STRONG' : s.score >= 10 ? 'OK' : 'WEAK';
    lines.push(`[${tier}] ${s.floorplan} — score ${s.score}`);
    lines.push(`  ${s.description}`);
    lines.push(`  ${s.rationale}`);
    if (s.missingRequired.length > 0) {
      lines.push(`  Missing required: ${s.missingRequired.join(', ')}`);
    }
    lines.push('');
  }

  if (scores[0].score === 0) {
    lines.push('Top match has score 0 — none of the detected regions match a standard floorplan.');
    lines.push('Consider adding more region observations or treating this as a custom layout.');
  } else {
    lines.push(`Recommended: ${scores[0].floorplan} (score ${scores[0].score})`);
    lines.push('STOP and present this to the user for confirmation before generating the spec (RULE 3).');
  }

  return { content: [{ type: 'text', text: lines.join('\n') }] };
}

function toolBuildSpecDraft({ regions, screenName, viewport, density }) {
  if (!Array.isArray(regions) || regions.length === 0) {
    return { isError: true, content: [{ type: 'text', text: 'regions array required' }] };
  }

  const detected = regions.map(r => r.regionType || r);
  const floorplanScores = scoreFloorplans(regions);
  const topFloorplan = floorplanScores[0];

  // Build hierarchy entries from detected regions
  const hierarchy = [];
  const usedComponents = new Set();
  const exceptions = [];

  for (let i = 0; i < regions.length; i++) {
    const region = regions[i];
    const pattern = REGION_PATTERNS[region.regionType];
    if (!pattern) {
      exceptions.push(`Region ${i}: unknown regionType "${region.regionType}"`);
      continue;
    }

    // Pick primary SAP component for this region
    const primary = pattern.sapComponents[0];
    usedComponents.add(primary);

    const entry = {
      id: `r${i}-${primary.toLowerCase()}`,
      component: primary,
    };

    // Add intent for buttons
    if (pattern.intent) entry.intent = pattern.intent;

    // Add label if provided
    if (region.label) entry.label = region.label;

    // Add props if region has data
    if (region.props && Object.keys(region.props).length > 0) {
      entry.props = region.props;
    }

    hierarchy.push(entry);
  }

  // Compose the spec draft
  const spec = {
    '$schema': 'https://sap-fiori-ai-designer/spec-schema.json',
    meta: {
      requirement: `Generated from ${regions.length} detected regions in user-provided reference`,
      floorplan: topFloorplan && topFloorplan.score > 0 ? topFloorplan.floorplan : 'unknown',
      floorplanRationale: topFloorplan ? topFloorplan.rationale : 'No clear floorplan match — review and adjust',
      rationale: `Regions detected: ${[...new Set(detected)].join(', ')}. SAP components selected: ${[...usedComponents].join(', ')}.`,
      validationStatus: exceptions.length === 0 ? 'draft' : 'fail',
      unverifiedComponents: [],
    },
    screen: {
      name: screenName || 'Untitled Screen',
      density: density || 'compact',
      theme: 'sap_horizon',
      viewport: viewport || 'desktop',
    },
    hierarchy: hierarchy,
  };

  const lines = [];
  lines.push('SPEC DRAFT — paste into the Figma plugin after review.');
  lines.push('');
  lines.push(`Detected regions:    ${regions.length}`);
  lines.push(`Top floorplan:       ${topFloorplan.floorplan} (score ${topFloorplan.score})`);
  lines.push(`Components selected: ${[...usedComponents].length} (${[...usedComponents].join(', ')})`);
  if (exceptions.length > 0) {
    lines.push('');
    lines.push('Exceptions:');
    exceptions.forEach(e => lines.push(`  - ${e}`));
  }
  lines.push('');
  lines.push('NEXT STEPS:');
  lines.push('  1. Present floorplan choice to user for confirmation (RULE 3)');
  lines.push('  2. Review hierarchy — add slots, props, intent where the draft has placeholders');
  lines.push('  3. Run through token whitelist validator before pasting to plugin');
  lines.push('  4. Spec is currently validationStatus="draft" — change to "pass" only after full review');
  lines.push('');
  lines.push('--- BEGIN SPEC ---');
  lines.push(JSON.stringify(spec, null, 2));
  lines.push('--- END SPEC ---');

  return { content: [{ type: 'text', text: lines.join('\n') }] };
}

function toolDescribeWorkflow() {
  const text = `SAP Application Analysis — recommended workflow for AI callers

WHEN TO USE:
  User provides a screenshot, wireframe, hand-drawn sketch, or describes a UI in words,
  and wants it built as a real SAP Fiori screen.

STEP-BY-STEP:

  1. RECEIVE INPUT
     The user uploads/describes the reference.

  2. VISION (you do this — not the MCP)
     Look at the image. Describe what you see in plain language. Focus on:
       - What region types are visible? (header, table, form, etc.)
       - What labels appear? (button text, column headers)
       - Where are they positioned? (top, left, center, bottom)
       - What is the primary user action?

  3. MAP TO CONTROLLED VOCABULARY
     Call listRegionTypes to see the 30+ valid regionType tokens.
     Convert your free-form descriptions into:
       [
         { regionType: "app-shell-header", label: "SAP Integration Suite" },
         { regionType: "page-header-with-title", label: "Purchase Order" },
         { regionType: "tab-navigation", label: "Header / Overview / Artifacts (2) / Documents / Tags" },
         { regionType: "data-table", label: "Artifacts table with name/runtime/type/version columns" },
         ...
       ]

  4. PICK FLOORPLAN
     Call suggestFloorplan with the regions list. It scores floorplans by required + indicator matches.
     STOP and ask the user to confirm the recommended floorplan (project RULE 3).

  5. MAP EACH REGION
     For deeper context per region, call mapRegionToSAP — returns SAP components, notes, confidence.
     Use this to fill in label, intent (for buttons), and notes.

  6. ASSEMBLE DRAFT
     Call buildSpecDraft with the full regions list + screenName + viewport + density.
     You get back a partial spec-schema.json with:
       - meta.floorplan filled in
       - hierarchy with one entry per region
       - validationStatus="draft" (you must finalize)

  7. REFINE
     The draft is a starting point — you must:
       - Add slots (DynamicPage has title, header, content slots)
       - Add props per component (productName for ShellBar, columns for Table)
       - Add intent for every Button (primary-action, secondary-action, destructive)
       - Apply SAP token whitelist colors anywhere a token is needed
       - Set validationStatus="pass" only after review

  8. VALIDATE + DELIVER
     Run the final spec mentally against project RULE 1 (registry gate) and RULE 2 (token whitelist).
     Present the spec to the user.
     They paste it into the Figma plugin → Validate → Build.

CRITICAL: This MCP gives you the structural mapping, not the final spec.
The user-visible quality comes from your refinement in Step 7.`;

  return { content: [{ type: 'text', text }] };
}

// ────────────────────────────────────────────────────────────────────────────
// TOOL DEFINITIONS
// ────────────────────────────────────────────────────────────────────────────

const TOOLS = [
  {
    name: 'describeWorkflow',
    description: 'Get the step-by-step workflow for using this MCP. Read this first when you have a user-provided screenshot, wireframe, or sketch to convert to a SAP Fiori screen.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'listRegionTypes',
    description: 'List the controlled vocabulary of regionType tokens. Use these tokens when describing what you see in a user-provided image. Returns 30+ region types grouped by floorplan affinity.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'listFloorplanHeuristics',
    description: 'List all SAP Fiori floorplans this MCP can suggest, with the required and indicator regions for each. Useful when explaining to the user why a floorplan was chosen.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'mapRegionToSAP',
    description: 'Map one observed UI region to SAP component(s). Returns the SAP component name(s), visual cues, confidence, intent (for buttons), and notes for spec authoring.',
    inputSchema: {
      type: 'object',
      required: ['regionType'],
      properties: {
        regionType: {
          type: 'string',
          description: 'One of the tokens from listRegionTypes (e.g. "data-table", "app-shell-header")',
        },
        label: { type: 'string', description: 'Visible text in this region (button label, table title, etc.)' },
        position: {
          type: 'object',
          description: 'Optional visual position info — top/center/bottom and left/center/right',
        },
      },
    },
  },
  {
    name: 'suggestFloorplan',
    description: 'Given a set of detected regions, rank the SAP Fiori floorplans by fit. Returns scores, indicator matches, and missing-required hints. Use this to recommend a floorplan to the user before generating the spec.',
    inputSchema: {
      type: 'object',
      required: ['regions'],
      properties: {
        regions: {
          type: 'array',
          description: 'Array of detected regions: [{ regionType, label?, position? }, ...]',
          items: {
            type: 'object',
            properties: {
              regionType: { type: 'string' },
              label: { type: 'string' },
              position: { type: 'object' },
            },
          },
        },
      },
    },
  },
  {
    name: 'buildSpecDraft',
    description: 'Build a partial spec-schema.json from a set of detected regions. Returns a draft spec with meta.floorplan filled in, one hierarchy entry per region, and validationStatus="draft". You must refine slots, props, intent, and tokens before setting validationStatus="pass".',
    inputSchema: {
      type: 'object',
      required: ['regions'],
      properties: {
        regions: {
          type: 'array',
          description: 'Array of detected regions',
          items: {
            type: 'object',
            properties: {
              regionType: { type: 'string' },
              label: { type: 'string' },
              props: { type: 'object' },
              position: { type: 'object' },
            },
          },
        },
        screenName: { type: 'string', description: 'Name for the screen (e.g. "Purchase Order — Package Detail")' },
        viewport: { type: 'string', enum: ['desktop', 'tablet', 'mobile'], description: 'Default: desktop' },
        density: { type: 'string', enum: ['compact', 'cozy'], description: 'Default: compact' },
      },
    },
  },
];

// ────────────────────────────────────────────────────────────────────────────
// SERVER SETUP
// ────────────────────────────────────────────────────────────────────────────

const server = new Server(
  { name: 'sap-application-analysis', version: '0.1.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  try {
    switch (name) {
      case 'describeWorkflow':           return toolDescribeWorkflow();
      case 'listRegionTypes':            return toolListRegionTypes();
      case 'listFloorplanHeuristics':    return toolListFloorplanHeuristics();
      case 'mapRegionToSAP':             return toolMapRegionToSAP(args || {});
      case 'suggestFloorplan':           return toolSuggestFloorplan(args || {});
      case 'buildSpecDraft':             return toolBuildSpecDraft(args || {});
      default:
        return { isError: true, content: [{ type: 'text', text: `Unknown tool: ${name}` }] };
    }
  } catch (e) {
    // SECURITY FIX 2026-07-21: log stack to stderr, never return it (leaks abs paths + username).
    console.error(e.stack);
    return { isError: true, content: [{ type: 'text', text: `Tool error: ${e.message}` }] };
  }
});

// ROBUSTNESS FIX 2026-07-21: surface fatal errors instead of a silent transport drop.
process.on('unhandledRejection', (err) => { console.error('[sap-application-analysis-mcp] unhandledRejection:', err); });
const transport = new StdioServerTransport();
try {
  await server.connect(transport);
} catch (e) {
  console.error('[sap-application-analysis-mcp] fatal:', e);
  process.exit(1);
}

console.error('[sap-application-analysis-mcp] Started.');
console.error(`[sap-application-analysis-mcp] ${Object.keys(REGION_PATTERNS).length} region patterns loaded.`);
console.error(`[sap-application-analysis-mcp] ${FLOORPLAN_HEURISTICS.length} floorplan heuristics loaded.`);

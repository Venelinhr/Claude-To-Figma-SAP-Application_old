#!/usr/bin/env node
/**
 * generate-property-reference.js
 *
 * Reads all 153 knowledge/components/registry/*.json files and generates
 * two knowledge database files:
 *
 *   1. knowledge/guidelines/component-property-reference.json
 *      — single lookup: component → variant properties + allowed values + defaults
 *      — used by Claude (RULE 24) to emit kitProps with correct property names
 *
 *   2. knowledge/guidelines/component-dependency-graph.json
 *      — single lookup: component → composition rules (validParents, slots, etc.)
 *      — used by Claude for fast composition validation without reading 153 files
 *
 * Usage:
 *   node build/generate-property-reference.js
 *
 * Called automatically at end of build-registry-bundle.js so both files
 * stay in sync with the registry on every build.
 */

const { readFileSync, readdirSync, writeFileSync } = require('node:fs');
const { join, resolve } = require('node:path');

const ROOT         = resolve(__dirname, '..');
const REGISTRY_DIR = join(ROOT, 'knowledge', 'components', 'registry');
const GUIDELINES   = join(ROOT, 'knowledge', 'guidelines');
const PROP_REF     = join(GUIDELINES, 'component-property-reference.json');
const DEP_GRAPH    = join(GUIDELINES, 'component-dependency-graph.json');

// ── Read all registry JSON files ──────────────────────────────────────────────

const files = readdirSync(REGISTRY_DIR).filter(f => f.endsWith('.json'));
const entries = [];
for (const file of files) {
  try {
    const raw = readFileSync(join(REGISTRY_DIR, file), 'utf8');
    const data = JSON.parse(raw);
    entries.push(data);
  } catch (e) {
    console.warn('[WARN] Could not parse ' + file + ': ' + e.message);
  }
}

console.log('  Read ' + entries.length + ' registry entries from ' + REGISTRY_DIR);

// ── Build component-property-reference.json ──────────────────────────────────

const propRef = {
  _meta: {
    description: 'Single lookup table: component → variant properties + allowed values + defaults. Generated from knowledge/components/registry/*.json. Do NOT edit manually — re-run generate-property-reference.js.',
    source: 'knowledge/components/registry/*.json',
    generated: new Date().toISOString().split('T')[0],
    components: entries.length,
  }
};

for (const entry of entries) {
  const name = entry.componentName;
  if (!name) continue;

  const node = {
    figmaComponentId: entry.figmaComponentId || null,
    figmaLibraryFileId: entry.figmaLibraryFileId || null,
    componentCategory: entry.componentCategory || null,
  };

  // Variant properties (VARIANT type in Figma — the dropdowns in the properties panel)
  if (Array.isArray(entry.supportedVariants) && entry.supportedVariants.length > 0) {
    node.variantProperties = {};
    for (const v of entry.supportedVariants) {
      if (!v.property) continue;
      node.variantProperties[v.property] = {
        values: v.values || [],
        default: v.default !== undefined ? v.default : (v.values && v.values[0]) || null,
      };
      if (v.ui5Property) node.variantProperties[v.property].ui5Property = v.ui5Property;
    }
  }

  // Supported properties (text, icon, boolean — from supportedProperties[])
  if (Array.isArray(entry.supportedProperties) && entry.supportedProperties.length > 0) {
    node.textProperties = [];
    node.booleanProperties = [];
    node.iconProperties = [];
    node.otherProperties = [];
    for (const p of entry.supportedProperties) {
      if (!p.name) continue;
      if (p.type === 'text')    { node.textProperties.push(p.name); continue; }
      if (p.type === 'boolean') { node.booleanProperties.push(p.name); continue; }
      if (p.type === 'icon')    { node.iconProperties.push(p.name); continue; }
      node.otherProperties.push({ name: p.name, type: p.type, default: p.default });
    }
    // Remove empty arrays to keep output lean
    if (!node.textProperties.length)    delete node.textProperties;
    if (!node.booleanProperties.length) delete node.booleanProperties;
    if (!node.iconProperties.length)    delete node.iconProperties;
    if (!node.otherProperties.length)   delete node.otherProperties;
  }

  // Supported states (for legacy state-to-variant resolution)
  if (Array.isArray(entry.supportedStates) && entry.supportedStates.length > 0) {
    node.supportedStates = entry.supportedStates;
  }

  // Plugin notes (text injection method, sizing)
  if (entry.pluginNotes) {
    node.pluginNotes = {
      textInjectionMethod: entry.pluginNotes.textInjectionMethod || null,
      sizingConstraints:   entry.pluginNotes.sizingConstraints   || null,
    };
    if (entry.pluginNotes.knownIssues && entry.pluginNotes.knownIssues.length) {
      node.pluginNotes.knownIssues = entry.pluginNotes.knownIssues;
    }
  }

  propRef[name] = node;
}

// ── Build component-dependency-graph.json ─────────────────────────────────────

const depGraph = {
  _meta: {
    description: 'Composition rules for every SAP component: validParents, validChildren, slots, mustInclude, mustExclude. Generated from knowledge/components/registry/*.json. Do NOT edit manually.',
    source: 'knowledge/components/registry/*.json',
    generated: new Date().toISOString().split('T')[0],
    components: entries.length,
  }
};

for (const entry of entries) {
  const name = entry.componentName;
  if (!name) continue;

  const comp = entry.composition || {};
  const node = {
    validParents:    comp.validParents    || [],
    topLevelOnly:    comp.topLevelOnly    || false,
    validChildren:   comp.validChildren   || [],
    mustInclude:     comp.mustInclude     || [],
    mustExclude:     comp.mustExclude     || [],
    commonSiblings:  comp.commonSiblings  || [],
  };

  // Slots — some entries encode slot info in composition or slotNames
  if (comp.slots && typeof comp.slots === 'object') {
    node.slots = comp.slots;
  }
  if (Array.isArray(entry.slotNames) && entry.slotNames.length > 0) {
    node.slotNames = entry.slotNames;
  }

  // Remove empty arrays for lean output
  if (!node.validParents.length)   delete node.validParents;
  if (!node.validChildren.length)  delete node.validChildren;
  if (!node.mustInclude.length)    delete node.mustInclude;
  if (!node.mustExclude.length)    delete node.mustExclude;
  if (!node.commonSiblings.length) delete node.commonSiblings;
  if (!node.topLevelOnly)          delete node.topLevelOnly;

  depGraph[name] = node;
}

// ── Write output files ────────────────────────────────────────────────────────

writeFileSync(PROP_REF, JSON.stringify(propRef, null, 2), 'utf8');
writeFileSync(DEP_GRAPH, JSON.stringify(depGraph, null, 2), 'utf8');

const propCount  = Object.keys(propRef).length  - 1; // subtract _meta
const graphCount = Object.keys(depGraph).length - 1;
console.log('  component-property-reference.json  : ' + propCount  + ' components');
console.log('  component-dependency-graph.json     : ' + graphCount + ' components');

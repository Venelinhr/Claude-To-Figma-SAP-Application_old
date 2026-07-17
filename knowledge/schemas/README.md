# knowledge/schemas/

JSON schemas for spec validation. Each file defines the allowed structure and properties for a specific SAP UI5 component when used in a JSON spec.

Used by `build/validate-spec.js` to enforce the registry gate — a spec referencing a component not defined here is rejected before any build starts.

| Schema file | Purpose |
|-------------|---------|
| `component_spec.schema.json` | Root schema for the full spec document |
| `componentspec-schema.json` | Alternative spec schema (legacy path) |
| `expected-output-schema.json` | Schema for regression test expected outputs |
| `Button.json`, `Input.json`, `Select.json`… | Per-component property schemas |

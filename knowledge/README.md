# knowledge/

The SAP knowledge base — everything Claude reads to make correct component, token, and layout decisions.

| Folder / File | Contents |
|---------------|----------|
| `components/registry/` | 152 SAP Web UI Kit component definitions — keys, variants, tokens, do/don't rules |
| `guidelines/` | 154 cached SAP Fiori design guidelines — offline, one JSON per component |
| `design-patterns/` | Screen-level patterns (List Report, Object Page, Wizard, etc.) with composition rules |
| `floorplans/` | Floorplan definitions used for scoring in the ANALYZE stage |
| `schemas/` | JSON schemas for spec validation |
| `wiki/` | Reference notes and decision records |
| `sapui5-verified-controls.md` | Verified UI5 control properties — prevents hallucinated API usage |

The `components/registry/` folder is the most critical — it feeds the plugin bundle and the registry gate that blocks any build using an unverified component.

# build/archive/

Historical one-off migration scripts — do not run these. They were used to bulk-populate the component registry during initial project setup and have no further purpose.

| Script | What it did (past tense) |
|--------|--------------------------|
| `add-10-components.py` | Added the first 10 component registry entries |
| `add-32-musthave.py` | Bulk-added 32 must-have components to the registry |
| `add-composition-87.py` | Added composition rules to 87 registry entries |
| `add-composition-rules.py` | Normalized composition fields across the registry |
| `normalize-registry-tokens.py` | Standardized token field names across all registry JSONs |

All registry entries are now maintained individually in `knowledge/components/registry/`. These scripts are kept for historical reference only.

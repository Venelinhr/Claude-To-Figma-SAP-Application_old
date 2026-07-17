# MCP Servers

Three custom MCP servers that extend Claude's SAP knowledge beyond what the official Figma MCP provides.

| Server | Purpose |
|--------|---------|
| `fiori-guidelines/` | Serves 154 cached SAP Fiori design guidelines locally — offline, fast, official |
| `application-analysis/` | Maps screenshots and wireframes to SAP region types and floorplan scores |
| `sap-figma-community/` | Detects drift between the local component registry and the live SAP Web UI Kit |

All three are registered automatically by `install.sh` and appear in `claude mcp list` after setup.

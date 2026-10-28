# SimReady Assets: skill + MCP repo and showcase page (design)

Date: 2026-10-28
Status: reviewed (builder check done, owner answers folded in), waiting for owner approval

## Intent

NVIDIA publishes ~2,600 simulation-ready 3D assets (USD, CC-BY-4.0) as the
Hugging Face dataset `nvidia/simready-assets`. The whole dataset is **476 GB**,
so nobody wants to download it to use five props.

The owner built a Claude Code skill (`~/.claude/skills/simready-assets/`) that
searches a small bundled catalog, downloads single assets on demand, and
converts USD to GLB for the web. Now they want two things:

1. **Anyone** can install that capability as a skill and/or an MCP server in
   Claude Code, Claude Desktop, Cursor or VS Code, without downloading the
   dataset.
2. A portfolio page on the personal web that documents it, shows a rotatable
   3D conveyor converted by the tool, and gives copy-paste install commands.

**Success, in the owner's words:** a visitor opens the page and, within
minutes, has the skill installed and the MCP connected, without downloading
the dataset.

The work has two parts, built in this order: first the public repo, so the
install commands on the page really work, then the page.

## Goals

- Public repo `github.com/MukhamadRoni/simready-assets` (already created by
  the owner, currently empty) containing:
  - the skill,
  - an MCP server usable from Claude Code, Claude Desktop, Cursor and VS Code,
  - a Claude Code plugin + marketplace manifest so Claude Code users install
    both with two commands.
- Nothing in the install path downloads the dataset. Assets are fetched one
  at a time, only when asked, and sizes are shown before a download.
- A bilingual (ID/EN) showcase page at `/{id|en}/projects/simready-assets`
  following the Document OCR page pattern, with a live 3D conveyor demo.
- A project card on the landing page's Projects section, linking to the page
  and to the GitHub repo.

## Non-goals

- No hosting of assets or a remote MCP server by the owner. The MCP runs
  locally on the user's machine (stdio).
- No mirror or re-upload of the dataset. Hugging Face stays the only source.
- No asset browser or search UI on the web page. The page has one demo
  model, not a catalog viewer.
- No physics on the web demo.

## Anti-goals (failure even if it "works")

- An install command on the page that does not work when copied as-is.
  Every command on the page must have been run successfully by the builder
  against the published repo.
- Any default behaviour that downloads more than the requested assets (e.g.
  `snapshot_download` over the whole repo).
- The personal web landing page getting heavier. three.js and the GLB load
  only on the SimReady page, and the GLB loads only when the demo section is
  reached.
- Shipping NVIDIA assets without CC-BY attribution (page footer of the demo,
  repo README).

## Decided by the owner

- Distribute through the GitHub repo `MukhamadRoni/simready-assets`.
- MCP must work in Claude Code, Claude Desktop, Cursor and VS Code.
- The page includes a rotatable 3D conveyor.
- Layout option **B**: text-only hero, then a "Live demo" section with the 3D
  viewer and before/after numbers next to it (like the Document OCR page).
- Install section with tabs per client and copy buttons; categories section;
  how-it-works section; licence note.
- **The builder may publish to GitHub as the owner:** push to
  `MukhamadRoni/simready-assets`, create the `v0.1.0` tag and the GitHub
  release with the skill zip. To avoid a broken pinned tag, verify the install
  commands against a pushed commit (`git+…@<commit-sha>`) first, and only tag
  `v0.1.0` once they pass.
- **No PyPI for now.** Install goes through `uvx --from git+https://…@v0.1.0`
  (requires git and uv on the user's machine; the page says so). PyPI may come
  later and would only change the install strings in `content.js` and README.
- **The existing local skill `~/.claude/skills/simready-assets/` may be moved**
  to a backup folder (e.g. `~/.claude/skills-backup/simready-assets/`, not
  deleted) before the plugin's end-to-end test, so the test proves the
  plugin's skill fired. The plugin replaces it afterwards.

## Facts already checked (2026-10-28)

- Dataset: 2,605 top-level entries = 2,603 asset folders + `.gitattributes` +
  `README.md`. Licence CC-BY-4.0.
- Asset layout: `<asset>/simready_usd/sm_<asset>_01.usd` (root; occasionally
  `.usda`, e.g. `factory_bolt_m8_tight`), `payloads/` (base, geometries,
  materials, instances, physics variants `PhysX`/`Newton`/`MuJoCo`),
  `Textures/`, `source_assets/` (MDL + duplicate textures), `.thumbs/`,
  `.metadata/` (licence, BOM, `com.nvidia.simready.root_usds.json`).
- Stage: Z-up, metersPerUnit 1.0, default prim `/RootNode`, instanceable
  geometry. Materials have both an MDL (OmniPBR) network and a
  UsdPreviewSurface fallback whose textures are Albedo / ORM / Normal. The ORM
  channel layout equals glTF's occlusion/roughness/metallic.
- `usd2gltf` 0.3.5 crashes on these materials; the existing custom converter
  (`scripts/usd_to_glb.py`) works and its output passes
  `gltf-transform validate` with no errors (only tangent-space warnings).
- Sizes: conveyor_belt_a02 is 121.6 MB (sim profile) / 72.8 MB (web profile);
  workstation_factory_a01 is 724.5 MB (web); factory_bolt_m8_tight is 80 MB
  (sim); chair_office_amf_black_a01 is 24.6 MB (web).
- Conveyor conversion: raw GLB 59 MB, `--max-tex 512 --jpeg` 9.8 MB, then
  `gltf-transform optimize --compress meshopt --texture-compress false`
  **1.6 MB**, 290k triangles, real size 2.10 × 1.17 × 2.07 m (Y-up).
  `--texture-compress webp` fails on Windows (sharp: "colourspace: parameter
  space not set"). Don't use it.
- `snapshot_download` with `allow_patterns` lists the entire repo first and
  hit HTTP 429 rate limits. Per-file `hf_hub_download` of an already-listed
  file set works.
- On Windows, HF temp paths under a deep `--dest` exceed 260 chars and fail
  with `FileNotFoundError`. Short destinations (e.g. `C:/simready`) work.
- Existing working skill files (source to move into the repo):
  `~/.claude/skills/simready-assets/` → `SKILL.md`, `references/catalog.tsv`,
  `references/isaac-sim.md`, `references/web-threejs.md`,
  `scripts/{find_assets,download_assets,usd_to_glb,build_catalog}.py`.
- Catalog groups (counts): kitchen_food 772, warehouse_logistics 447,
  facility_safety 380, factory_tools 265, vehicle_parts 220, office 201,
  medical 152, machinery_robotics 131, other 35.
- Personal web: React 19 + Vite 6, no router. Showcase pages are registered
  in `frontend/src/pages/index.js` (`PROJECT_PAGES`, lazy chunks). Projects
  are seeded from `backend/database/data/projects.json`; `github:sync`
  updates projects whose slug matches a public repo of the owner. Categories:
  `web`, `data`, `auto`, `embedded`, `desktop`. `three` is not a dependency yet.

## Part 1: the repo `MukhamadRoni/simready-assets`

### Layout

```
simready-assets/
├── .claude-plugin/
│   ├── marketplace.json        marketplace "simready-assets" listing one plugin, source "./"
│   └── plugin.json             plugin "simready-assets"
├── .mcp.json                   plugin's MCP server (uvx command below)
├── skills/simready-assets/
│   ├── SKILL.md
│   └── references/             isaac-sim.md, web-threejs.md
├── src/simready_assets/
│   ├── catalog.tsv             bundled catalog (package data)
│   ├── catalog.py              load/search/groups/categorize (from build_catalog + find_assets)
│   ├── hub.py                  list asset files + sizes, profiles, per-file download
│   ├── convert.py              USD → GLB (from usd_to_glb.py)
│   ├── cli.py                  `simready` CLI: find, groups, info, download, convert, build-catalog
│   └── mcp_server.py           `simready-mcp` entry point (FastMCP, stdio)
├── tests/                      pytest, offline
├── pyproject.toml              name "simready-assets", Python ≥3.10
├── README.md                   install per client, tools, licence/attribution
└── LICENSE                     MIT for the code (Claude's call); assets stay CC-BY-4.0 (README says so)
```

**One source of truth (Claude's call):** the logic lives once, in the Python
package. The skill does **not** carry its own copies of the scripts; SKILL.md
tells Claude to run the CLI through uv:

```
uvx --from git+https://github.com/MukhamadRoni/simready-assets@v0.1.0 simready find conveyor
```

This keeps the skill tiny and means skill and MCP always behave the same. The
skill references remain for the Isaac Sim and web guidance.

**Skill vs MCP when both are present (Claude's call):** SKILL.md tells Claude
to use the `simready` MCP tools when they are available, and only fall back to
the `uvx … simready` CLI when they are not. In Claude Desktop, uploaded skills
run in a sandbox that usually has no `uv` and limited network, so there the
**MCP does the work and the skill zip is guidance only** (workflow, Isaac Sim
and web advice). The Desktop install tab and README say exactly that and never
promise that the skill alone downloads assets in Desktop.

### Install paths (what the page will show)

Pinned to a release tag (`v0.1.0`) so copy-pasted commands keep working when
`main` changes *(Claude's call)*. Requirement for every client: `uv` installed.

| Client | Command / config |
|---|---|
| Claude Code (skill + MCP) | `/plugin marketplace add MukhamadRoni/simready-assets` then `/plugin install simready-assets@simready-assets` |
| Claude Code (MCP only) | `claude mcp add simready -- uvx --from git+https://github.com/MukhamadRoni/simready-assets@v0.1.0 simready-mcp` |
| Claude Desktop | `claude_desktop_config.json` → `mcpServers.simready = {command: "uvx", args: ["--from", "git+…@v0.1.0", "simready-mcp"]}`; skill: upload `simready-assets-skill.zip` from the GitHub release |
| Cursor | `.cursor/mcp.json` (or global `~/.cursor/mcp.json`), same `mcpServers` shape |
| VS Code | `.vscode/mcp.json` → `{"servers": {"simready": {"type": "stdio", "command": "uvx", "args": [...]}}}` |

First-run note: `uvx` builds from git and installs `usd-core` (~30 MB wheel) on
first launch, which can exceed a client's MCP startup timeout. The README and
the page tell users to run `uvx --from git+…@v0.1.0 simready --help` once
before adding the MCP, so the environment is cached *(Claude's call)*.

The builder must verify each config format against the client's current docs
at build time and test at least Claude Code (plugin and `claude mcp add`)
end-to-end. Cursor, VS Code and Claude Desktop configs: test whichever are
installed on the owner's machine and say plainly in the handoff which were
not tested.

### MCP server

Python, official `mcp` SDK (FastMCP), stdio transport. Deps: `mcp`,
`huggingface_hub`, `usd-core`, `numpy`, `pillow`.

Configuration by env var:
- `SIMREADY_DIR`: download root, default `~/simready`. On Windows the server
  warns in tool output if the path is longer than ~80 chars.
- `HF_TOKEN`: optional, for higher Hugging Face rate limits.

Tools:

| Tool | Does | Network |
|---|---|---|
| `list_groups()` | groups + counts from the bundled catalog | none |
| `search_assets(query, group?, limit=50)` | catalog search, all words must match | none |
| `asset_info(name, profile="sim")` | file count, size for the profile, root USD path in the repo, whether it's already downloaded | 1 listing call |
| `get_thumbnail(name)` | returns the asset's `*_thumbnail.png` as MCP image content (lets the model/user see it) | 1 small file |
| `download_assets(names[], profile="sim", max_total_mb=1024)` | per-file download into `SIMREADY_DIR`; if the total exceeds `max_total_mb` it returns the sizes and does **not** download, so the caller must re-call with a higher limit | listed files only |
| `convert_to_glb(name_or_path, max_tex=1024, jpeg=true)` | converts a downloaded asset; returns output path, triangles, MB, size in metres | none |

Unknown asset names return a clear "not found, try search_assets" message,
not an exception trace.

Resources: `simready://guide/isaac-sim` and `simready://guide/web-threejs`
(the two reference docs), so clients without skills (Cursor, VS Code) still
get the guidance. Prompts: `factory-scene` (plan + dry-run an asset list for a
factory/warehouse/office scene) and `web-scene` (pick, download, convert, and
write three.js loading code). *(Claude's call)*

### Release

- Tag `v0.1.0`, GitHub release with `simready-assets-skill.zip` (the
  `skills/simready-assets/` folder) attached.
- README: what it is, the install table above, tool list, example prompts,
  CC-BY attribution for NVIDIA assets, "the dataset is never downloaded whole".

### Tests (offline, pytest)

- Catalog: search (multi-word, group filter), categorize overrides, groups count.
- Profile file matching (sim/web/thumb include/exclude).
- Converter: a small USD stage built in the test with `pxr` (Z-up, one
  instanced mesh with a GeomSubset and a UsdPreviewSurface material with a tiny
  texture) → GLB has Y-up positions, correct triangle count, material with
  baseColorTexture, valid GLB header.
- MCP: tools are registered and `search_assets` / `list_groups` return
  expected shapes via an in-process client.
- One manual network smoke test before tagging: `asset_info` +
  `download_assets` + `convert_to_glb` on `chair_office_amf_black_a01`.

## Part 2: the showcase page in personal-web

### Files

```
frontend/src/pages/simready-assets/
├── SimreadyPage.jsx     page, same SecHead pattern as DocumentOcrPage
├── content.js           all ID/EN copy + install commands + numbers
├── ConveyorViewer.jsx   three.js viewer (only file that imports three)
├── InstallTabs.jsx      4 tabs + copy button
└── simready.css
frontend/public/simready-assets/
├── conveyor_belt_a02.glb   meshopt-compressed, ~1.6 MB
├── conveyor-poster.jpg     still image shown before/while loading and as WebGL fallback
└── og-1280x640.jpg         link preview, styled like the hero
```

Register `'simready-assets': lazy(() => import('./simready-assets/SimreadyPage.jsx'))`
in `PROJECT_PAGES`. Use `useDocumentMeta`.

### Sections (top to bottom)

1. **Hero (text only):** back link to `/{lang}#projects`, eyebrow
   ("Claude Skill · MCP · USD → glTF"), title "SimReady Assets", tagline,
   one-paragraph description (2,603 assets, one at a time, no 476 GB
   download), buttons "Install now" (→ `#install`) and "See 3D demo"
   (→ `#demo`), chips: Isaac Sim, three.js, MCP, CC-BY-4.0.
2. **Live demo** (`#demo`): left (≈2/3) the 3D viewer, right a stats panel
   that states only what each step actually does *(Claude's call: the package
   does not gain a meshopt step)*:
   USD download (web profile) 72.8 MB → `convert_to_glb` 9.8 MB
   (`--max-tex 512 --jpeg`) → 1.6 MB after `gltf-transform optimize
   --compress meshopt`; 290k triangles; real size 2.1 × 1.2 × 2.1 m. Credit
   line: "Model: NVIDIA SimReady (CC BY 4.0), converted with simready-assets,
   compressed with glTF-Transform". The builder re-measures these numbers when
   producing the shipped GLB and uses the measured values.
3. **Install** (`#install`): tabs Claude Code / Claude Desktop / Cursor /
   VS Code, each with the exact commands/config from Part 1 and a copy
   button; a note that `uv` is required and the dataset is never downloaded
   whole; link to the GitHub repo and the release zip.
4. **Asset categories:** six cards for the focus groups with counts
   (machinery & robotics 131, factory tools 265, warehouse & logistics 447,
   facility & safety 380, automotive parts 220, office 201) and a line that
   kitchen, medical and other groups exist too.
5. **How it works:** steps search → check size → fetch per asset → use in
   simulation or convert for the web; list of MCP tools; 2–3 example prompts.
6. **Licence:** code MIT, assets CC-BY-4.0 by NVIDIA; how to credit.

### 3D viewer behaviour

- `three` added as a dependency (exact version pinned in package.json), imported
  only from `ConveyorViewer.jsx`, which is itself loaded lazily so it lands in
  the page chunk, never in the landing bundle.
- The GLB request starts when the demo section scrolls near the viewport
  (IntersectionObserver), not on page load. The poster image shows until the
  model is ready, with a progress indicator.
- OrbitControls (drag to rotate, wheel/pinch to zoom, damping, zoom limits so
  the model can't be lost), GLTFLoader + MeshoptDecoder, RoomEnvironment for
  PBR lighting, soft ground shadow, camera framed from the model's bounding box.
- Gentle auto-rotate that stops on first interaction; disabled when
  `prefers-reduced-motion` is set.
- If WebGL is unavailable or the load fails: keep the poster and show a short
  message; never a blank box.
- Renderer disposed on unmount; pixel ratio capped at 2.

### Backend / card

Add to `backend/database/data/projects.json`:
`slug: simready-assets`, `short_name: SimReady Assets`, `category: data`
(shown "Data & AI") *(Claude's call)*, `language: Python`, tags
`MCP`, `Claude Skill`, `OpenUSD`, `three.js`, bilingual description,
`repo_url: https://github.com/MukhamadRoni/simready-assets`,
`homepage: null`, `is_featured: false`. Because the slug equals the repo
name, `github:sync` will keep `pushed_at`/stars current. Extend the existing
feature test to cover the new slug.

## Left to the builder

- Exact copy wording (in the voice of the Document OCR page).
- Visual details of the viewer framing and the stats panel within the
  existing design tokens (`styles.css`).
- Internal structure of the Python package beyond the module split above.
- Whether the CLI subcommands keep the old script names as aliases.

# SimReady Assets: Repo (Skill + MCP + Plugin) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish `github.com/MukhamadRoni/simready-assets` with a Python package (`simready` CLI + `simready-mcp` stdio server), a Claude Code plugin/marketplace that bundles the skill and the MCP, and a `v0.1.0` release, so anyone can use NVIDIA SimReady assets without downloading the 476 GB dataset.

**Architecture:** All logic lives once in `src/simready_assets/` (catalog search, Hugging Face per-file download, USD→GLB conversion). The CLI and the FastMCP server are thin front ends over it. The skill carries only guidance and tells Claude to prefer the MCP tools, falling back to `uvx … simready`. The repo root is both the plugin and its own marketplace.

**Tech Stack:** Python ≥3.10, `mcp` (FastMCP), `huggingface_hub`, `usd-core`, `numpy`, `pillow`, pytest, uv/uvx, Claude Code plugin manifests, `gh` CLI.

**Spec:** `D:\personal-web\docs\superpowers\specs\2026-10-28-simready-assets-showcase-design.md` (Part 1)

**This plan runs before** `2026-10-28-simready-assets-page.md`; that plan's install strings depend on the `v0.1.0` tag made here.

## Global Constraints

- Local working copy: `D:\simready-assets` (clone of `https://github.com/MukhamadRoni/simready-assets.git`, currently empty except possibly a README).
- Install spec string, used verbatim everywhere: `git+https://github.com/MukhamadRoni/simready-assets@v0.1.0`.
- Console scripts: `simready` (CLI) and `simready-mcp` (MCP server). PyPI is out of scope.
- Never call `snapshot_download`. Only `HfApi().list_repo_tree(REPO, repo_type="dataset", path_in_repo=<asset>, recursive=True)` + per-file `hf_hub_download`. `REPO = "nvidia/simready-assets"`.
- Env vars: `SIMREADY_DIR` (default `~/simready`), `HF_TOKEN` (optional, read by huggingface_hub itself).
- Windows long-path warning when `len(abspath(dest)) > 80` and `os.name == "nt"`.
- `download_assets` default `max_total_mb=1024`; over the limit → return sizes, download nothing.
- Code licence MIT; README states assets are CC-BY-4.0 by NVIDIA and gives the attribution line `3D assets: NVIDIA SimReady Assets (CC BY 4.0)`.
- Source to port (do not edit in place): `C:\Users\User\.claude\skills\simready-assets\` (`scripts/*.py`, `references/*`, `SKILL.md`).
- Tag `v0.1.0` only after the install commands pass against a pushed commit SHA.
- Commit messages end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

- Asset name typo or nonexistent (`no_such_asset`) → clear "not found, try search_assets" in CLI and MCP, never a traceback; other valid names in the same call still proceed.
- Converting an asset that was only fetched with `thumb` profile (no USD) or not fetched at all → clear error naming the profile to download with.
- Root USD with `.usda` extension (e.g. `factory_bolt_m8_tight`) → found by `root_usd()` like `.usd`.
- First `uvx` launch is slow (git build + `usd-core`) → README/plugin docs tell users to warm up with `simready --help`; MCP server import must not do network I/O at startup.
- Hugging Face HTTP 429 → huggingface_hub retries; our code must not fan out more than one listing call per asset (no whole-repo listing).

---

### Task 1: Package scaffold + catalog

**Files:**
- Create: `D:\simready-assets\pyproject.toml`, `src/simready_assets/__init__.py`, `src/simready_assets/catalog.py`, `src/simready_assets/catalog.tsv` (copy of `references/catalog.tsv`), `tests/test_catalog.py`, `.gitignore` (Python + `.venv`, `dist`, `*.glb`)

**Interfaces:**
- Produces:
  - `Asset = NamedTuple("Asset", [("name", str), ("group", str), ("prefix", str)])`
  - `load_catalog() -> list[Asset]` (reads packaged `catalog.tsv` via `importlib.resources`)
  - `search(query: str = "", group: str | None = None, limit: int = 50) -> tuple[list[Asset], int]` → (first `limit` hits, total hits); all whitespace-separated words must appear (case-insensitive) in `name + group + prefix`
  - `groups() -> dict[str, int]` sorted by count desc
  - `categorize(name: str) -> str` and `PREFIX_GROUPS`, `NAME_OVERRIDES` ported from `build_catalog.py` (override match is `sub.lower() in name.lower()`)
  - `build_catalog(out: Path) -> dict[str, int]` (network; lists top-level repo entries, skips `.gitattributes`, `README.md`)

- [ ] **Step 1: Clone and scaffold**

Run: `git clone https://github.com/MukhamadRoni/simready-assets.git D:/simready-assets`. Write `pyproject.toml` with hatchling build backend, `name = "simready-assets"`, `version = "0.1.0"`, `requires-python = ">=3.10"`, deps `mcp>=1.9,<2`, `huggingface_hub>=0.26`, `usd-core>=24.11`, `numpy>=1.26`, `pillow>=10`; optional `dev = ["pytest>=8"]`; scripts `simready = "simready_assets.cli:main"`, `simready-mcp = "simready_assets.mcp_server:main"`; include `catalog.tsv` as package data.

- [ ] **Step 2: Write failing tests** in `tests/test_catalog.py`

```python
def test_catalog_has_all_assets():
    assert len(load_catalog()) == 2603

def test_search_all_words_must_match():
    hits, total = search("bolt m8")
    assert total >= 3 and all("bolt" in a.name and "m8" in a.name for a in hits)

def test_search_group_filter_and_limit():
    hits, total = search("chair", group="office", limit=2)
    assert len(hits) == 2 and total > 2 and all(a.group == "office" for a in hits)

def test_groups_counts():
    g = groups()
    assert g["office"] == 201 and g["machinery_robotics"] == 131 and sum(g.values()) == 2603

def test_categorize_overrides_are_case_insensitive():
    assert categorize("misc_printerPaper_a01") == "office"
    assert categorize("trashCan_office_beige_a03") == "office"
    assert categorize("conveyor_belt_a02") == "machinery_robotics"
    assert categorize("zzz_unknown_a01") == "other"
```

- [ ] **Step 3: Run** `uv run --extra dev pytest tests/test_catalog.py -v` → FAIL (import error).
- [ ] **Step 4: Implement `catalog.py`** per Interfaces.
- [ ] **Step 5: Run** same command → 5 passed.
- [ ] **Step 6: Commit** `feat: package scaffold and offline catalog search`

### Task 2: Hugging Face access (`hub.py`)

**Files:**
- Create: `src/simready_assets/hub.py`, `tests/test_hub.py`

**Interfaces:**
- Consumes: nothing from Task 1.
- Produces:
  - `REPO = "nvidia/simready-assets"`; `PROFILES: dict[str, tuple[list[str], list[str]]]` exactly as in the existing `download_assets.py` (`sim`, `web`, `thumb`)
  - `class AssetNotFound(Exception)`
  - `RemoteFile = NamedTuple(path: str, size: int)`
  - `matches(path: str, asset: str, profile: str) -> bool`
  - `list_files(asset: str) -> list[RemoteFile]` (one recursive listing; raises `AssetNotFound` on 404 or empty)
  - `@dataclass DownloadPlan: profile: str; sizes: dict[str, int]; files: list[str]; missing: list[str]` with property `total_bytes`
  - `plan_download(assets: list[str], profile: str) -> DownloadPlan`
  - `download(plan: DownloadPlan, dest: Path, workers: int = 8) -> dict[str, Path | None]` (asset → root USD path, `None` for thumb profile)
  - `root_usd(asset_dir: Path) -> Path` (reads `.metadata/com.nvidia.simready.root_usds.json` if present, else first `*.usd`/`*.usda`/`*.usdc` in `simready_usd/`; raises `FileNotFoundError` with message `"No USD in <dir>. Download it with profile 'web' or 'sim' first."`)
  - `default_dir() -> Path` (`SIMREADY_DIR` or `~/simready`)
  - `long_path_warning(dest: Path) -> str | None`
  - `thumbnail(asset: str, dest: Path) -> Path` (downloads only `*_thumbnail.png` that is not `_dark`)

- [ ] **Step 1: Write failing tests** (offline; monkeypatch `hub.list_files`)

```python
def test_profiles_web_excludes_mdl_and_thumbs():
    assert matches("a/simready_usd/payloads/base.usda", "a", "web")
    assert not matches("a/simready_usd/source_assets/OmniPBR.mdl", "a", "web")
    assert not matches("a/simready_usd/.thumbs/256x256/x.png", "a", "sim")
    assert matches("a/simready_usd/.thumbs/sm_a_01_thumbnail.png", "a", "thumb")

def test_plan_skips_missing_and_sums_sizes(monkeypatch):
    def fake(asset):
        if asset == "nope": raise AssetNotFound(asset)
        return [RemoteFile(f"{asset}/simready_usd/sm_{asset}_01.usd", 100),
                RemoteFile(f"{asset}/simready_usd/source_assets/x.mdl", 50)]
    monkeypatch.setattr(hub, "list_files", fake)
    p = plan_download(["a", "nope"], "web")
    assert p.missing == ["nope"] and p.sizes == {"a": 100} and p.total_bytes == 100

def test_root_usd_accepts_usda(tmp_path):
    d = tmp_path / "bolt" / "simready_usd"; d.mkdir(parents=True); (d / "sm_bolt_01.usda").write_text("#usda 1.0")
    assert root_usd(tmp_path / "bolt").name == "sm_bolt_01.usda"

def test_root_usd_missing_says_which_profile(tmp_path):
    (tmp_path / "x").mkdir()
    with pytest.raises(FileNotFoundError, match="profile 'web' or 'sim'"): root_usd(tmp_path / "x")

def test_long_path_warning(monkeypatch, tmp_path):
    monkeypatch.setattr(hub.os, "name", "nt")
    assert long_path_warning(Path("C:/" + "d" * 90)) and long_path_warning(Path("C:/simready")) is None
```

- [ ] **Step 2: Run** `uv run --extra dev pytest tests/test_hub.py -v` → FAIL.
- [ ] **Step 3: Implement `hub.py`.** Port from `download_assets.py`: per-file `hf_hub_download(REPO, path, repo_type="dataset", local_dir=dest)` in a `ThreadPoolExecutor(workers)`.
- [ ] **Step 4: Run** → all pass.
- [ ] **Step 5: Commit** `feat: per-asset Hugging Face listing and download`

### Task 3: USD → GLB converter (`convert.py`)

**Files:**
- Create: `src/simready_assets/convert.py`, `tests/test_convert.py`

**Interfaces:**
- Consumes: `hub.root_usd(asset_dir)`.
- Produces:
  - `@dataclass ConvertResult: path: Path; meshes: int; triangles: int; materials: int; textures: int; size_mb: float; dims_m: tuple[float, float, float]`
  - `convert(src: Path, out: Path | None = None, max_tex: int | None = None, jpeg: bool = False) -> ConvertResult` (src = asset folder or USD file; default out = `<asset_dir>/<asset>.glb`)

- [ ] **Step 1: Write failing test** that builds a stage in `tmp_path` with `pxr`: Z-up, metersPerUnit 0.01, default prim `/Root`, an instanceable Xform `/Root/Geo` referencing a prototype that holds one Mesh of two quads (points span 2 units in X and 2 in Z, `st` faceVarying), a `materialBind` GeomSubset on face 1, and two Materials with UsdPreviewSurface: one `diffuseColor` constant, one connected to a UsdUVTexture reading a 4×4 PNG written with Pillow. Bind material A to the mesh and B to the subset.

```python
def test_convert_bakes_units_axis_subsets_and_textures(tmp_path):
    usd = make_stage(tmp_path)          # helper in the test file
    r = convert(usd, tmp_path / "o.glb", max_tex=2, jpeg=True)
    g, bin_ = read_glb(r.path)          # helper: parses header + JSON chunk
    assert open(r.path, "rb").read(4) == b"glTF"
    assert r.triangles == 4 and r.materials == 2 and r.textures == 1
    assert max(r.dims_m) == pytest.approx(0.02)        # 2 cm-units quad → 0.02 m
    assert r.dims_m[1] > 0                               # Z extent became Y (up)
    assert any("baseColorTexture" in m["pbrMetallicRoughness"] for m in g["materials"])
```

- [ ] **Step 2: Run** `uv run --extra dev pytest tests/test_convert.py -v` → FAIL.
- [ ] **Step 3: Port `usd_to_glb.py`** into `convert.py`: same algorithm (instance proxies, purpose filter, subsets, ORM→metallicRoughness+occlusion, v-flip, material dedupe by JSON signature, weld), but return `ConvertResult` instead of printing and accept a folder via `hub.root_usd`.
- [ ] **Step 4: Run** → pass.
- [ ] **Step 5: Commit** `feat: USD to GLB converter using UsdPreviewSurface fallback`

### Task 4: `simready` CLI

**Files:**
- Create: `src/simready_assets/cli.py`, `tests/test_cli.py`

**Interfaces:**
- Consumes: Tasks 1–3.
- Produces: `main(argv: list[str] | None = None) -> int` with subcommands
  `find [words…] [--group G] [--limit N]`, `groups`, `info NAME [--profile P]`,
  `download NAME… [--from-file F] [--profile P] [--dest D] [--dry-run] [--max-total-mb 1024]`,
  `convert PATH_OR_NAME [-o OUT] [--max-tex N] [--jpeg] [--dest D]`, `build-catalog [--out]`.
  A bare name for `convert` resolves to `<dest>/<name>`.

- [ ] **Step 1: Failing tests** with `capsys`: `main(["find","conveyor"])` returns 0 and prints `conveyor_belt_a02`; `main(["groups"])` prints `office` and `201`; `main(["convert","no_such_asset","--dest",str(tmp_path)])` returns 2 and stderr contains `profile 'web' or 'sim'`; `main(["download","a","--max-total-mb","0"])` with monkeypatched `plan_download` (1 MB plan) returns 1, prints the size, and `download` is never called.
- [ ] **Step 2: Run** `uv run --extra dev pytest tests/test_cli.py -v` → FAIL.
- [ ] **Step 3: Implement** with argparse; missing assets print `!! <name>: not found. Try: simready find <word>`; long-path warning printed before downloading.
- [ ] **Step 4: Run** full suite `uv run --extra dev pytest -v` → all pass.
- [ ] **Step 5: Commit** `feat: simready CLI`

### Task 5: MCP server

**Files:**
- Create: `src/simready_assets/mcp_server.py`, `src/simready_assets/guides/isaac-sim.md`, `src/simready_assets/guides/web-threejs.md` (copied from the skill's references; package data), `tests/test_mcp.py`

**Interfaces:**
- Consumes: Tasks 1–3.
- Produces: `mcp = FastMCP("simready")`, `main() -> None` (runs stdio). Tools (names exact): `list_groups`, `search_assets(query: str, group: str | None = None, limit: int = 50)`, `asset_info(name: str, profile: str = "sim")`, `get_thumbnail(name: str)` (returns `mcp.server.fastmcp.Image`), `download_assets(names: list[str], profile: str = "sim", max_total_mb: int = 1024)`, `convert_to_glb(name_or_path: str, max_tex: int = 1024, jpeg: bool = True)`. Resources: `simready://guide/isaac-sim`, `simready://guide/web-threejs`. Prompts: `factory-scene(description: str)`, `web-scene(description: str)`.
- Tools return plain dicts/strings; errors are returned as `{"error": "..."}` text, never raised.

- [ ] **Step 1: Failing tests** (async, `pytest-anyio` or `asyncio.run`):

```python
def test_tools_resources_prompts_registered():
    tools = {t.name for t in asyncio.run(mcp.list_tools())}
    assert tools == {"list_groups","search_assets","asset_info","get_thumbnail","download_assets","convert_to_glb"}
    uris = {str(r.uri) for r in asyncio.run(mcp.list_resources())}
    assert {"simready://guide/isaac-sim","simready://guide/web-threejs"} <= uris
    assert {p.name for p in asyncio.run(mcp.list_prompts())} == {"factory-scene","web-scene"}

def test_search_tool_shape():
    out = search_assets("conveyor")
    assert out["total"] >= 6 and out["assets"][0].keys() == {"name","group"}

def test_download_over_limit_downloads_nothing(monkeypatch):
    monkeypatch.setattr(hub, "plan_download", lambda a, p: DownloadPlan(p, {"big": 2_000_000_000}, ["x"], []))
    monkeypatch.setattr(hub, "download", lambda *a, **k: pytest.fail("must not download"))
    out = download_assets(["big"])
    assert out["downloaded"] == [] and "max_total_mb" in out["message"]

def test_unknown_asset_is_a_message_not_an_exception(monkeypatch):
    monkeypatch.setattr(hub, "list_files", lambda a: (_ for _ in ()).throw(AssetNotFound(a)))
    assert "search_assets" in asset_info("no_such_asset")["error"]

def test_import_does_no_network():
    code = ("import socket\n"
            "def boom(*a, **k): raise RuntimeError('network at import')\n"
            "socket.socket.connect = boom\n"
            "import simready_assets.mcp_server")
    assert subprocess.run([sys.executable, "-c", code]).returncode == 0
```

- [ ] **Step 2: Run** `uv run --extra dev pytest tests/test_mcp.py -v` → FAIL.
- [ ] **Step 3: Implement.** Tool docstrings are the descriptions the model sees: state units (MB, metres), that downloads go to `SIMREADY_DIR`, and that `download_assets` refuses above `max_total_mb`. Prompts return text that walks: search → `asset_info` sizes → confirm with user → download → (web) convert + three.js code from the web guide.
- [ ] **Step 4: Run** full suite → all pass. Also `uv run simready-mcp` starts and waits on stdin (Ctrl+C to stop).
- [ ] **Step 5: Commit** `feat: simready MCP server (tools, guides, prompts)`

### Task 6: Skill, plugin manifests, README

**Files:**
- Create: `skills/simready-assets/SKILL.md`, `skills/simready-assets/references/{isaac-sim.md,web-threejs.md}`, `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, `.mcp.json`, `README.md`, `LICENSE` (MIT, `Copyright (c) 2026 Mukhamad Roni`), `tests/test_manifests.py`

**Interfaces:**
- Consumes: tool names from Task 5, CLI subcommands from Task 4.
- Produces: plugin name `simready-assets`, marketplace name `simready-assets`, MCP server key `simready`.

- [ ] **Step 1: Failing test** `tests/test_manifests.py`: all three JSON files parse; `marketplace.json.plugins[0] == {"name": "simready-assets", "source": "./", ...}`; `.mcp.json.mcpServers.simready.args == ["--from", "git+https://github.com/MukhamadRoni/simready-assets@v0.1.0", "simready-mcp"]`; `SKILL.md` frontmatter `name: simready-assets`; SKILL.md mentions every tool name from Task 5 and the string `uvx --from git+https://github.com/MukhamadRoni/simready-assets@v0.1.0 simready`; README contains `CC BY 4.0` and each of `Claude Code`, `Claude Desktop`, `Cursor`, `VS Code`.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Write the files.** SKILL.md: keep the existing description (it triggers well) and workflow, but steps say "use MCP tool X if available, otherwise `uvx … simready <subcommand>`"; include the Desktop note (skill = guidance there). README install section: the table from the spec "Install paths", the `simready --help` warm-up line, the `uv` requirement, `SIMREADY_DIR`/`HF_TOKEN`. Check current config formats in the Claude Code, Claude Desktop, Cursor and VS Code MCP docs before writing them.
- [ ] **Step 4: Run** tests → pass. If `claude plugin validate` exists (`claude plugin --help`), run `claude plugin validate D:/simready-assets` → no errors.
- [ ] **Step 5: Commit** `feat: Claude Code plugin, skill and README`

### Task 7: Publish, verify end-to-end, release

**Files:** none new (maybe README fixes found during verification).

- [ ] **Step 1: Push** `git push -u origin main`. Note the SHA: `git rev-parse HEAD`.
- [ ] **Step 2: Warm-up + CLI via git SHA**, from a directory outside the repo:
  `uvx --from git+https://github.com/MukhamadRoni/simready-assets@<sha> simready find conveyor` → lists `conveyor_belt_a02`;
  `… simready download chair_office_amf_black_a01 --profile web --dest C:/simready-e2e` → files land;
  `… simready convert chair_office_amf_black_a01 --dest C:/simready-e2e --max-tex 1024 --jpeg` → prints ~3 MB, dims ≈ 0.54 × 0.81 × 0.57 m.
- [ ] **Step 3: MCP via git SHA in Claude Code:** `claude mcp add simready-e2e -- uvx --from git+https://github.com/MukhamadRoni/simready-assets@<sha> simready-mcp`; `claude mcp list` shows it connected; in a `claude -p` session ask it to call `search_assets` for "pallet" and `asset_info` for `pallet_a01` → sensible output. Then `claude mcp remove simready-e2e`.
- [ ] **Step 4: Move the local skill aside** (owner approved): move `C:\Users\User\.claude\skills\simready-assets` → `C:\Users\User\.claude\skills-backup\simready-assets`.
- [ ] **Step 5: Plugin install test (pre-tag):** the committed `.mcp.json` points at `@v0.1.0`, which doesn't exist yet. Temporarily edit `.mcp.json` to `@<sha>` (do not commit), add the local folder as a marketplace (`claude plugin marketplace add D:/simready-assets`), install `simready-assets@simready-assets`, and confirm in a new session that the `simready-assets` skill is listed and the `simready` MCP connects with 6 tools. Then uninstall the plugin, remove the local marketplace, and `git checkout .mcp.json`.
- [ ] **Step 6: Other clients:** for each of Claude Desktop, Cursor, VS Code that is installed on this machine, add the README config with `@<sha>`, confirm the server lists 6 tools, then remove it. Record which clients were tested and which were not.
- [ ] **Step 7: Tag + release:** `git tag v0.1.0 && git push origin v0.1.0`; build `simready-assets-skill.zip` containing the `simready-assets/` skill folder (SKILL.md + references) at the zip root; `gh release create v0.1.0 simready-assets-skill.zip --title "v0.1.0" --notes "<what it is, install, CC-BY note>"`.
- [ ] **Step 8: Verify the tagged path** once: `uvx --from git+https://github.com/MukhamadRoni/simready-assets@v0.1.0 simready groups` → prints groups; real `/plugin marketplace add MukhamadRoni/simready-assets` + install → MCP connects.
- [ ] **Step 9: Report** to the owner: tested clients, untested clients, release URL. Remove `C:/simready-e2e` only with the owner's OK.

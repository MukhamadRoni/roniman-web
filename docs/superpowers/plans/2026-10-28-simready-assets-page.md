# SimReady Assets: Showcase Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A bilingual showcase page `/{id|en}/projects/simready-assets` in personal-web with a rotatable 3D conveyor, per-client install tabs, asset categories and how-it-works, plus a project card on the landing page.

**Architecture:** Same pattern as `pages/document-ocr/`: a lazily loaded page chunk registered in `PROJECT_PAGES`, all copy in `content.js`, page-scoped CSS. The three.js viewer is its own component inside that chunk and fetches the GLB only when the demo section nears the viewport. The project record comes from `backend/database/data/projects.json`.

**Tech Stack:** React 19, Vite 6, three.js (`three@0.170.0`, exact pin), `node --test`, Laravel feature tests, glTF-Transform CLI (asset prep only).

**Spec:** `D:\personal-web\docs\superpowers\specs\2026-10-28-simready-assets-showcase-design.md` (Part 2)

**Precondition:** `2026-10-28-simready-assets-repo.md` is done: tag `v0.1.0` and the GitHub release exist, and its Task 7 reported which clients were tested.

## Global Constraints

- Branch `feat/simready-assets` in `D:\personal-web` (stacked on `feat/document-ocr`).
- Install spec string, verbatim: `git+https://github.com/MukhamadRoni/simready-assets@v0.1.0`. Repo URL: `https://github.com/MukhamadRoni/simready-assets`. Release zip: `https://github.com/MukhamadRoni/simready-assets/releases/download/v0.1.0/simready-assets-skill.zip`.
- Every install command/config on the page must be one that the repo plan's Task 7 actually ran. The Claude Desktop tab says the MCP does the work and the skill zip is guidance only.
- Numbers on the page are the ones measured in Task 1 here (spec's values are 72.8 MB → 9.8 MB → 1.6 MB, 290k triangles, 2.1 × 1.2 × 2.1 m).
- Credit line, verbatim (EN): `Model: NVIDIA SimReady (CC BY 4.0), converted with simready-assets, compressed with glTF-Transform`; ID: `Model: NVIDIA SimReady (CC BY 4.0), dikonversi dengan simready-assets, dikompres dengan glTF-Transform`.
- `three` is imported only by `ConveyorViewer.jsx`. The landing chunk must contain no three.js code.
- GLB fetch starts on IntersectionObserver (`rootMargin: '200px'`), never on page load.
- Category counts: machinery & robotics 131, factory tools 265, warehouse & logistics 447, facility & safety 380, automotive parts 220, office 201.
- Use the existing design tokens in `frontend/src/styles.css`; don't change other pages' styles.
- Commit messages end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

- No WebGL (blocked/old GPU) or GLB fetch fails → the poster image stays with a short message; never an empty box.
- `prefers-reduced-motion: reduce` → no auto-rotate.
- Clipboard API missing (insecure origin, old browser) or denied → copy button falls back to selecting the code text and shows "press Ctrl+C"; never throws.
- Phone width (360 px) → install tabs scroll or wrap, code blocks wrap/scroll inside their box, no horizontal page scroll; the viewer keeps a sane height.
- Leaving the page/unmounting during GLB load → no errors, renderer and observers disposed.

---

### Task 1: Demo assets (GLB, poster, OG image)

**Files:**
- Create: `frontend/public/simready-assets/conveyor_belt_a02.glb`, `frontend/public/simready-assets/conveyor-poster.jpg`, `frontend/public/simready-assets/og-1280x640.jpg`, `frontend/design/simready-assets/og.html`

- [ ] **Step 1: Produce the GLB** with the published tool, outside the repo:
  `uvx --from git+https://github.com/MukhamadRoni/simready-assets@v0.1.0 simready download conveyor_belt_a02 --profile web --dest C:/simready` (note the printed MB),
  `… simready convert conveyor_belt_a02 --dest C:/simready -o C:/simready/conveyor_512.glb --max-tex 512 --jpeg` (note MB, triangles, dims),
  `npx -y @gltf-transform/cli@4.1.1 optimize C:/simready/conveyor_512.glb frontend/public/simready-assets/conveyor_belt_a02.glb --compress meshopt --texture-compress false` (note MB).
- [ ] **Step 2: Verify:** `npx -y @gltf-transform/cli@4.1.1 validate frontend/public/simready-assets/conveyor_belt_a02.glb` → "No errors found". File ≤ 2.5 MB.
- [ ] **Step 3: Poster:** from `C:/simready/conveyor_belt_a02/simready_usd/.thumbs/sm_conveyor_belt_a02_01_thumbnail.png` (download with `--profile thumb` if missing), save as a ≤ 120 KB JPEG at 1200 px wide.
- [ ] **Step 4: OG image:** `og.html` styled like `frontend/design/document-ocr/og.html` (hero gradient, title "SimReady Assets", line "2,603 3D assets · Skill + MCP · no 476 GB download", poster image). Render it to 1280×640 and save `og-1280x640.jpg` the same way the document-ocr OG image was made.
- [ ] **Step 5: Record** the measured numbers in the commit message body (they feed Task 3).
- [ ] **Step 6: Commit** `feat(simready-assets): demo GLB, poster and OG image`

### Task 2: Backend project record

**Files:**
- Modify: `backend/database/data/projects.json` (append), `backend/tests/Feature/PortfolioApiTest.php`

- [ ] **Step 1: Failing test**

```php
public function test_simready_assets_is_listed_with_its_repo(): void
{
    $this->getJson('/api/projects/simready-assets')
        ->assertOk()
        ->assertJsonPath('data.name', 'SimReady Assets')
        ->assertJsonPath('data.category', 'data')
        ->assertJsonPath('data.url', 'https://github.com/MukhamadRoni/simready-assets')
        ->assertJsonPath('data.featured', false);
}
```

- [ ] **Step 2: Run** `php artisan test --filter=simready` (in `backend/`) → FAIL (404).
- [ ] **Step 3: Add the record** with the fields from the spec's "Backend / card" section: `slug` `simready-assets`, `short_name` `SimReady Assets`, `category` `data`, `language` `Python`, tags `["MCP", "Claude Skill", "OpenUSD", "three.js"]`, bilingual `description`, `repo_url` as above, `homepage` null, `is_featured` false, `metrics` null, `sort_order` 0, `pushed_at` today `2026-10-28T00:00:00Z`.
- [ ] **Step 4: Run** `php artisan test` → all pass.
- [ ] **Step 5: Commit** `feat(backend): add simready-assets project`

### Task 3: Copy and install data (`content.js`)

**Files:**
- Create: `frontend/src/pages/simready-assets/content.js`, `frontend/src/pages/simready-assets/content.test.js`

**Interfaces:**
- Produces:
  - `ASSETS = { glb, poster, ogImage }` (public paths from Task 1)
  - `INSTALL_SPEC`, `REPO_URL`, `RELEASE_ZIP_URL` constants (Global Constraints values)
  - `CLIENTS: Array<{ id: 'claude-code'|'claude-desktop'|'cursor'|'vscode', label: string, blocks: Array<{ title: {id,en}, file?: string, code: string }>, note?: {id,en} }>` (code strings built from `INSTALL_SPEC`, never retyped)
  - `STATS: Array<{ key: string, value: string, label: {id,en} }>` (Task 1's measured values)
  - `CATEGORIES: Array<{ group: string, count: number, label: {id,en} }>`
  - `CONTENT: { id: {...}, en: {...} }` with keys `meta, back, eyebrow, tagline, desc, ctaInstall, ctaDemo, chips, alt, demo, install, categories, how, license`

- [ ] **Step 1: Failing tests** (`node:test`):

```js
test('every MCP config uses the pinned install spec', () => {
  const code = CLIENTS.flatMap((c) => c.blocks.map((b) => b.code)).join('\n')
  const specs = code.match(/git\+https:\/\/[^\s"]+/g)
  assert.ok(specs.length >= 4)
  assert.ok(specs.every((s) => s === 'git+https://github.com/MukhamadRoni/simready-assets@v0.1.0'))
})
test('all four clients are present, in order', () => {
  assert.deepEqual(CLIENTS.map((c) => c.id), ['claude-code', 'claude-desktop', 'cursor', 'vscode'])
})
test('JSON config blocks are valid JSON', () => {
  for (const c of CLIENTS) for (const b of c.blocks) if (b.file?.endsWith('.json')) JSON.parse(b.code)
})
test('ID and EN copy have the same keys', () => {
  const keys = (o, p = '') => Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' && !Array.isArray(v) ? keys(v, `${p}${k}.`) : [`${p}${k}`]))
  assert.deepEqual(keys(CONTENT.id).sort(), keys(CONTENT.en).sort())
})
test('category counts match the catalog', () => {
  assert.deepEqual(CATEGORIES.map((c) => c.count), [131, 265, 447, 380, 220, 201])
})
test('Claude Desktop tab says the MCP does the work', () => {
  const d = CLIENTS.find((c) => c.id === 'claude-desktop')
  assert.match(d.note.en, /MCP/); assert.match(d.note.en, /guidance/i)
})
```

- [ ] **Step 2: Run** `npm test` (in `frontend/`) → FAIL.
- [ ] **Step 3: Write `content.js`.** Config shapes: Claude Desktop/Cursor `{"mcpServers":{"simready":{"command":"uvx","args":["--from", INSTALL_SPEC, "simready-mcp"]}}}`; VS Code `{"servers":{"simready":{"type":"stdio","command":"uvx","args":[…]}}}`; Claude Code blocks: plugin (`/plugin marketplace add MukhamadRoni/simready-assets`, `/plugin install simready-assets@simready-assets`) and MCP-only (`claude mcp add simready -- uvx --from <spec> simready-mcp`); a shared warm-up block `uvx --from <spec> simready --help`. Use exactly the formats the repo plan verified. Copy voice follows `pages/document-ocr/content.js`.
- [ ] **Step 4: Run** `npm test` → pass.
- [ ] **Step 5: Commit** `feat(simready-assets): page copy and install data`

### Task 4: Install tabs with copy button

**Files:**
- Create: `frontend/src/pages/simready-assets/InstallTabs.jsx`, `frontend/src/pages/simready-assets/clipboard.js`, `frontend/src/pages/simready-assets/clipboard.test.js`

**Interfaces:**
- Consumes: `CLIENTS`, `CONTENT[lang].install` from Task 3.
- Produces: `<InstallTabs lang c={CONTENT[lang].install} clients={CLIENTS} />`; `copyText(text: string, nav?: Navigator) -> Promise<'copied' | 'manual'>` in `clipboard.js`.

- [ ] **Step 1: Failing tests** for `copyText`: resolves `'copied'` when `nav.clipboard.writeText` resolves; `'manual'` when `nav.clipboard` is undefined; `'manual'` when `writeText` rejects.
- [ ] **Step 2: Run** `npm test` → FAIL.
- [ ] **Step 3: Implement** `copyText`, then `InstallTabs`: WAI-ARIA tabs (`role="tablist"`, arrow-key navigation, `aria-selected`), each block shows title, optional file name, `<pre><code>` and a copy button whose label switches to "Copied" / "Tersalin" for 2 s, or on `'manual'` selects the `<code>` text and shows "Press Ctrl+C" / "Tekan Ctrl+C". Tab list scrolls horizontally on narrow screens.
- [ ] **Step 4: Run** `npm test` → pass.
- [ ] **Step 5: Commit** `feat(simready-assets): install tabs with copy fallback`

### Task 5: 3D conveyor viewer

**Files:**
- Create: `frontend/src/pages/simready-assets/ConveyorViewer.jsx`, `frontend/src/pages/simready-assets/framing.js`, `frontend/src/pages/simready-assets/framing.test.js`
- Modify: `frontend/package.json`, `frontend/package-lock.json` (`npm install three@0.170.0 --save-exact`)

**Interfaces:**
- Consumes: `ASSETS.glb`, `ASSETS.poster`, `CONTENT[lang].demo`.
- Produces: `<ConveyorViewer src poster c />`; `frameCamera(size: [number, number, number], fovDeg: number, aspect: number) -> { distance: number, minDistance: number, maxDistance: number }` in `framing.js` (pure, no three import).

- [ ] **Step 1: Failing tests** for `frameCamera`: for size `[2.1, 1.17, 2.07]`, fov 40, aspect 16/9 the whole bounding sphere fits (`distance >= radius / sin(fov/2)` using the limiting fov, horizontal when aspect < 1); `minDistance < distance < maxDistance`; a portrait aspect (0.5) gives a larger distance than 16/9.
- [ ] **Step 2: Run** `npm test` → FAIL.
- [ ] **Step 3: Implement `framing.js`**, then `ConveyorViewer.jsx` per the spec's "3D viewer behaviour": IntersectionObserver (`rootMargin: '200px'`) triggers a dynamic `import('three')` + `GLTFLoader` + `OrbitControls` + `RoomEnvironment` + `MeshoptDecoder` (all from `three/addons/...`); progress from the loader's `onProgress`; damping; auto-rotate until first `start` event and only if `matchMedia('(prefers-reduced-motion: reduce)')` is false; pixel ratio `Math.min(devicePixelRatio, 2)`; ResizeObserver for size; full dispose (renderer, geometries, materials, textures, controls, observers, `cancelAnimationFrame`) on unmount; on any failure keep poster + `c.viewerError`. Viewer height `clamp(280px, 50vw, 520px)`.
- [ ] **Step 4: Run** `npm test` → pass.
- [ ] **Step 5: Commit** `feat(simready-assets): lazy three.js conveyor viewer`

### Task 6: Page, styles, registration

**Files:**
- Create: `frontend/src/pages/simready-assets/SimreadyPage.jsx`, `frontend/src/pages/simready-assets/simready.css`
- Modify: `frontend/src/pages/index.js` (add `'simready-assets': lazy(() => import('./simready-assets/SimreadyPage.jsx'))`)

**Interfaces:**
- Consumes: Tasks 3–5; `useDocumentMeta`, `projectPath`, `ArrowLeft`/`Check` from `pages/topline/icons.jsx`.

- [ ] **Step 1: Build the page** with the six sections and anchors from the spec ("Sections"): hero (`#top`), `#demo` (viewer 2/3 + stats panel 1/3, stacked under 900 px, credit line under the viewer), `#install`, categories, how-it-works (steps + MCP tool list + 2–3 example prompts), licence. Meta: title/description from `CONTENT`, path `projectPath(lang, 'simready-assets')`, OG image 1280×640.
- [ ] **Step 2: Build check:** `npm run build` (in `frontend/`) succeeds. Then confirm three.js is not in the landing bundle: the entry chunk (`dist/assets/index-*.js`) does not contain `WebGLRenderer`, and some other chunk does.
- [ ] **Step 3: Run** `npm test` → all pass (existing + new).
- [ ] **Step 4: Commit** `feat(simready-assets): showcase page`

### Task 7: In-browser verification

- [ ] **Step 1:** Run the backend (`php artisan migrate:fresh --seed && php artisan serve`) and `npm run dev`. Open `/id/projects/simready-assets` and `/en/projects/simready-assets`.
- [ ] **Step 2:** Check: card on the landing page links to the page and to GitHub; the network tab shows no GLB request until scrolling to the demo; model rotates/zooms, auto-rotate stops on drag; every copy button copies exactly the shown text; at 360 px width there is no horizontal page scroll; with DevTools "Emulate prefers-reduced-motion" there is no auto-rotate; with the GLB request blocked the poster + error message shows.
- [ ] **Step 3:** Paste one command from each tab that the repo plan verified into a terminal/config and confirm it still works against `v0.1.0` (at least the Claude Code plugin command and `claude mcp add`).
- [ ] **Step 4:** Fix anything found (commit per fix), then report to the owner with screenshots of both languages and the mobile view.

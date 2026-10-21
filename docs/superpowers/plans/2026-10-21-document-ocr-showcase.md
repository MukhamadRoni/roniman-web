# Document OCR Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a bilingual showcase page at `/{id|en}/projects/document-ocr` with a live, fully in-browser OCR demo (PaddleOCR PP-OCRv6 tiny on onnxruntime-web WASM), plus a project card without a GitHub link.

**Architecture:** Backend gets a nullable `repo_url` and a seeded `document-ocr` project. Frontend gets a lazy page chunk in `src/pages/document-ocr/` (Topline pattern). The OCR engine (`ppu-paddle-ocr/web` + `onnxruntime-web`) is a second dynamic import that loads only when the visitor starts the demo. WASM comes from jsDelivr, models from the library's GitHub model repo. Classification is a pure keyword scorer.

**Tech Stack:** Laravel (PHPUnit), React 19 + Vite 6, `ppu-paddle-ocr@^6.6.1` (web entry), `onnxruntime-web@^1.23.2` (peer dep), Canvas API, `node --test` for pure JS helpers.

**Spec:** `docs/superpowers/specs/2026-10-21-document-ocr-showcase-design.md`. Read it first; the anti-goals there apply to every task.

## Global Constraints

- No client name or wording about the client's business process anywhere: copy, alt text, meta, samples, classifier labels, commit messages.
- No code copied from the old employer project (the local copy on the owner's machine). Write from the public libraries' APIs.
- Model URLs (exact, in one constant):
  - detection `https://media.githubusercontent.com/media/PT-Perkasa-Pilar-Utama/ppu-paddle-ocr-models/main/detection/ort/PP-OCRv6_tiny_det.ort` (1,882,568 bytes)
  - recognition `https://media.githubusercontent.com/media/PT-Perkasa-Pilar-Utama/ppu-paddle-ocr-models/main/recognition/ort/PP-OCRv6_tiny_rec.ort` (4,530,048 bytes)
  - dictionary `https://raw.githubusercontent.com/PT-Perkasa-Pilar-Utama/ppu-paddle-ocr-models/main/recognition/ppocrv6_tiny_dict.txt`
- WASM path: `https://cdn.jsdelivr.net/npm/onnxruntime-web@${ort.env.versions.web}/dist/` (runtime version, so it always matches the installed package).
- Single-threaded WASM only: `ort.env.wasm.numThreads = 1`, session `executionProviders: ['wasm']`. No COOP/COEP headers, no COI service worker.
- `dist/` must contain no `.wasm` file and no OpenCV code. The landing page must make no OCR request.
- Slug `document-ocr`, display name `Document OCR`, category `data`, language `JavaScript`, not featured.
- Only numbers that are measured or true go on the page (6.4 MB model, 0 bytes uploaded, timings measured in Task 5 with the device named).

## Review Focus

1. **Huge phone photo** (e.g. 4000×3000, 8 MB): scaled to ≤ 1600 px on the longest side before OCR; the tab doesn't freeze or crash, and boxes still line up. Test: `scaleToFit` unit tests (Task 3) + manual check (Task 5).
2. **Phone photo with EXIF rotation**: shown upright and OCR'd upright (decode with `createImageBitmap(file, { imageOrientation: 'from-image' })`). Manual check, Task 5.
3. **Image with no text** (a plain photo): "no text found" message, the image still shown, no empty panel, type "Unknown". Manual check, Task 5.
4. **Model/WASM CDN unreachable** (DevTools offline before first run): friendly error and a Retry button that really retries, because the engine promise resets on failure. Manual check, Task 5.
5. **Second upload or sample click while busy**: inputs disabled while loading/processing; never two runs overlapping or stale results replacing new ones. Manual check, Task 5.

---

### Task 1: Backend: project without a repo

**Files:**
- Create: `backend/database/migrations/2026_10_21_000001_make_projects_repo_url_nullable.php`
- Modify: `backend/database/data/projects.json` (append one entry)
- Test: `backend/tests/Feature/PortfolioApiTest.php`

**Interfaces:**
- Produces: `/api/projects/document-ocr` and `/api/portfolio` `projects[]` item with `slug: "document-ocr"`, `name: "Document OCR"`, `category: "data"`, `url: null`.

- [ ] **Step 1: Write the failing test** `test_document_ocr_is_listed_without_a_repo`:

```php
$this->getJson('/api/projects/document-ocr')
    ->assertOk()
    ->assertJsonPath('data.name', 'Document OCR')
    ->assertJsonPath('data.category', 'data')
    ->assertJsonPath('data.url', null)
    ->assertJsonPath('data.featured', false);
```

- [ ] **Step 2: Run it.** `cd backend && php artisan test --filter=test_document_ocr_is_listed_without_a_repo` fails with 404.
- [ ] **Step 3: Migration.** `$table->string('repo_url')->nullable()->change();` in `up`, `->nullable(false)->change()` in `down`. Keep the existing `slug` column comment as is.
- [ ] **Step 4: Seed entry** in `projects.json`, same key order as the other entries: `slug`, `category: "data"`, `language: "JavaScript"`, `pushed_at` (ship date, ISO), `is_featured: false`, `tags: ["WebAssembly", "ONNX Runtime Web", "PaddleOCR", "React"]`, neutral ID/EN `description`, `metrics: null`, `short_name: "Document OCR"`, `sort_order` (same as similar non-featured entries), `repo_url: null`, `homepage: null`.
- [ ] **Step 5: Run the whole suite.** `php artisan test`: all pass, including the existing Topline/e-voting assertions.
- [ ] **Step 6: Commit** `feat(backend): allow projects without a repo, add document-ocr`.

### Task 2: Project card without a repo

**Files:**
- Modify: `frontend/src/components/Projects.jsx` (`ProjectCard`)

**Interfaces:**
- Consumes: `project.url` may be `null` (Task 1).

- [ ] **Step 1: Change `ProjectCard`.** When `p.url` is null, the name links to `page` if there is one, otherwise it renders as plain text with the same `name` class; the "View repo" link is skipped. Cards with a URL render exactly as before.
- [ ] **Step 2: Verify.** `cd frontend && npm run build` passes. With `npm run dev` and the backend running, the Document OCR card shows "Lihat detail"/"View details" and no repo link (the detail link 404s until Task 4, which is expected). The Topline and e-voting cards are unchanged.
- [ ] **Step 3: Commit** `feat(projects): support cards without a repo link`.

### Task 3: Pure helpers: classifier and image scaling

**Files:**
- Create: `frontend/src/pages/document-ocr/classify.js`, `frontend/src/pages/document-ocr/image.js`
- Test: `frontend/src/pages/document-ocr/classify.test.js`, `frontend/src/pages/document-ocr/image.test.js`
- Modify: `frontend/package.json` (add `"test": "node --test src/"`)

**Interfaces:**
- Produces: `classifyDocument(lines: string[]) -> { type: 'ktp' | 'certificate' | 'invoice' | 'cv' | null, score: number }` (score 0–1, `null` type below threshold `0.3`).
- Produces: `scaleToFit(width: number, height: number, maxSide = 1600) -> { width: number, height: number }` (integers, never upscales).

Rules (data in `classify.js`; each inner array is alternatives for one keyword, matched on whole words in the uppercased, space-joined text, so `NIK` must not match `TEKNIK` and `TOTAL` must not match `SUBTOTAL`):

```js
ktp:         [['NIK'], ['PROVINSI'], ['KABUPATEN', 'KOTA'], ['TEMPAT/TGL LAHIR'], ['GOL. DARAH', 'GOL DARAH'], ['BERLAKU HINGGA']]
certificate: [['IJAZAH', 'SERTIFIKAT', 'CERTIFICATE'], ['DIBERIKAN KEPADA', 'AWARDED TO', 'PRESENTED TO'], ['LULUS', 'GRADUATED', 'COMPLETED']]
invoice:     [['INVOICE', 'FAKTUR', 'STRUK', 'RECEIPT'], ['TOTAL'], ['SUBTOTAL'], ['PPN', 'TAX', 'PAJAK'], ['QTY', 'JUMLAH']]
cv:          [['CURRICULUM VITAE', 'RESUME', 'RIWAYAT HIDUP'], ['PENGALAMAN', 'EXPERIENCE'], ['PENDIDIKAN', 'EDUCATION'], ['SKILLS', 'KEAHLIAN', 'KETERAMPILAN']]
```

Score = matched keywords ÷ keywords in the rule; highest wins, ties go to the earlier rule.

- [ ] **Step 1: Write failing tests** (`node:test` + `node:assert/strict`):
  - `['PROVINSI JAWA TIMUR', 'KABUPATEN SIDOARJO', 'NIK : 3515000000000000', 'Tempat/Tgl Lahir : SURABAYA', 'BERLAKU HINGGA : SEUMUR HIDUP']` → `type === 'ktp'`, `score === 5/6`
  - `['INVOICE #001', 'Qty 2', 'Subtotal 10.000', 'PPN 1.100', 'Total 11.100']` → `{ type: 'invoice', score: 1 }`
  - `['SUBTOTAL 10.000']` → `type === null` (0.2 < 0.3)
  - `['S1 TEKNIK INFORMATIKA']` → `type === null`, `score === 0` (no `NIK` match)
  - `['curriculum vitae', 'experience', 'education']` → `type === 'cv'`, `score === 0.75` (case-insensitive)
  - `[]` → `{ type: null, score: 0 }`
  - `scaleToFit(4000, 3000)` → `{ width: 1600, height: 1200 }`; `scaleToFit(3000, 4000)` → `{ width: 1200, height: 1600 }`; `scaleToFit(800, 600)` → `{ width: 800, height: 600 }`; `scaleToFit(1601, 1)` → height `1` (never 0)
- [ ] **Step 2: Run** `cd frontend && npm test`: the tests fail (modules missing).
- [ ] **Step 3: Implement both modules** to the signatures above. Escape regex metacharacters in keywords (`GOL. DARAH`, `TEMPAT/TGL LAHIR`). Use a word boundary of "not `[A-Z0-9]`" on both sides.
- [ ] **Step 4: Run** `npm test`: all pass.
- [ ] **Step 5: Commit** `feat(document-ocr): keyword classifier and image scaling helpers`.

### Task 4: Showcase page shell, assets, routing

**Files:**
- Create: `frontend/src/pages/document-ocr/DocumentOcrPage.jsx`, `content.js`, `icons.jsx`, `document-ocr.css`
- Create: `frontend/public/document-ocr/` with `sample-ktp.png`, `sample-invoice.png`, `sample-text.png`, `og-1280x640.jpg`, plus the source `*.html`/`*.svg` you rendered them from, kept in `frontend/design/document-ocr/` (not served)
- Modify: `frontend/src/pages/index.js` (register `'document-ocr'`)

**Interfaces:**
- Consumes: `classifyDocument` type keys (labels for `ktp | certificate | invoice | cv | unknown` live in `content.js`).
- Produces: `CONTENT[lang]` with a `demo` block holding every demo string, for Task 5. `SAMPLES = [{ id, src, alt: { id, en } }]` exported from `content.js`. A `<section id="demo">` placeholder in the page where Task 5 mounts `<OcrDemo lang c={c.demo} samples={SAMPLES} />`.

- [ ] **Step 1: Write `content.js`.** Header comment like Topline's, but saying the facts come from the spec and from Task 5 measurements. ID and EN copy for: `meta` (title `Document OCR · … · Mukhamad Roni`), `back`, `eyebrow`, `tagline`, `desc`, `cta` (scrolls to `#demo`), `chips` (`100% di browser / in-browser`, `WebAssembly`, `Model ~6 MB`, `Tanpa upload / No upload`), `demo` strings (upload, drop hint, samples, privacy line, loading steps, progress, processing, results, confidence, type labels, elapsed, errors: unsupported file / download failed / no text / generic, retry), `how` (5 pipeline steps from the spec), `perf` (stats with **placeholders marked `TODO-measure`**, filled in Task 5), `stack` (chips from the spec plus one architecture paragraph), `privacy` (check items; only claim "works offline after first load" if Task 5 verifies it, otherwise drop that item). Voice and length should match `pages/topline/content.js`.
- [ ] **Step 2: Page + CSS + icons.** Follow `ToplinePage.jsx`: `useDocumentMeta` (path `projectPath(lang, 'document-ocr')`, OG image `/document-ocr/og-1280x640.jpg` 1280×640, no video), hero → `#demo` placeholder → how it works → performance → stack → privacy. Own prefix `do-` in `document-ocr.css` (do not edit `topline.css`); reuse site tokens from `styles.css`. Mobile first, matching Topline's breakpoints. Icons in the same stroke style as `topline/icons.jsx`. Re-use `ArrowLeft`/`Check` by importing from `../topline/icons.jsx`.
- [ ] **Step 3: Register** `'document-ocr': lazy(() => import('./document-ocr/DocumentOcrPage.jsx'))` in `PROJECT_PAGES`.
- [ ] **Step 4: Sample and OG images.** Author each as HTML/SVG in `frontend/design/document-ocr/`, then render with headless Chrome (e.g. `chrome --headless --screenshot=out.png --window-size=1280,640 file.html`). Samples: a specimen KTP-style card with obviously fake data and a large "SPECIMEN / CONTOH" mark, a simple invoice, a short printed paragraph. Each ≤ 200 KB, clear dark text on a light background. OG as JPG, styled like the page hero, no client content.
- [ ] **Step 5: Verify.** `npm run build` passes. `/id/projects/document-ocr` and `/en/projects/document-ocr` render every section, the back link works, the Projects card "View details" opens the page, and at 375 px wide there's no horizontal scroll. The landing page network tab shows no `document-ocr` chunk.
- [ ] **Step 6: Commit** `feat(document-ocr): showcase page, copy, sample images`.

### Task 5: OCR engine and live demo

**Files:**
- Modify: `frontend/package.json` (`npm install ppu-paddle-ocr@^6.6.1 onnxruntime-web@^1.23.2`)
- Create: `frontend/src/pages/document-ocr/ocrEngine.js`, `frontend/src/pages/document-ocr/OcrDemo.jsx`
- Modify: `DocumentOcrPage.jsx` (mount the demo), `content.js` (fill `TODO-measure`), `document-ocr.css`

**Interfaces:**
- Consumes: `classifyDocument`, `scaleToFit` (Task 3); `c.demo`, `SAMPLES` (Task 4).
- Produces: `ocrEngine.js` exports
  - `MODEL_URLS` (`{ detection, recognition, dictionary }`, exact URLs from Global Constraints)
  - `loadEngine(onProgress?: (p: { loaded: number, total: number }) => void): Promise<void>`: singleton promise. It dynamically imports `onnxruntime-web` and `ppu-paddle-ocr/web` (so they form their own chunk), sets `wasmPaths`/`numThreads`, downloads the 3 files with streamed `fetch` reporting progress (total = sum of `Content-Length`, falling back to the known byte sizes), passes them as `ArrayBuffer`s in `model: { detection, recognition, charactersDictionary }`, uses `session: { executionProviders: ['wasm'] }`, then `initialize()`. On any failure the singleton resets so the next call retries.
  - `recognize(canvas: HTMLCanvasElement): Promise<{ lines: { text: string, confidence: number, box: { x, y, width, height } }[], ms: number }>`: calls `service.recognize(canvas, { flatten: true, noCache: true })` and maps `results`. `ms` is measured around that call only.

- [ ] **Step 1: Install and check the build output.** After installing and writing `ocrEngine.js`, run `npm run build` and check: `find dist -name "*.wasm"` prints nothing, and `grep -rl -i "opencv" dist/assets` prints nothing. If a `.wasm` is emitted, try `resolve.alias: { 'onnxruntime-web': 'onnxruntime-web/wasm' }` in `vite.config.js` and rebuild. If either check still fails, **stop and report back** (spec rule: no OpenCV bundle, no self-hosted WASM). Also confirm the Docker frontend build still runs `npm ci` cleanly (`ppu-ocv` pulls in `@napi-rs/canvas`/`opencv-js` as install-time deps).
- [ ] **Step 2: `OcrDemo.jsx`.** States: `idle → loading(progress) → processing → done | error`. Input: file picker, drag & drop on the drop zone, sample thumbnails. Accept `image/jpeg, image/png, image/webp`; anything else → unsupported-file error. Decode with `createImageBitmap(file, { imageOrientation: 'from-image' })`, draw into a canvas at `scaleToFit(w, h, 1600)`, and pass that canvas to `recognize`. Draw boxes on an overlay canvas with the same intrinsic size, both scaled by CSS, so they stay aligned at any width. Show numbered boxes, a results list (text + confidence %), the type (`classifyDocument(lines.map(l => l.text))`, label from `c.demo`, confidence bar = score), and elapsed `ms`. No lines → "no text found" state, image still shown. Disable all inputs while `loading`/`processing`, and ignore results from a superseded run. Error state has a Retry button that calls `loadEngine` again. Engine loading starts only on the first user action (upload/drop/sample), never on mount.
- [ ] **Step 3: Mount** in the `#demo` section of `DocumentOcrPage.jsx`, with the privacy line visible above the drop zone.
- [ ] **Step 4: Browser verification** (`npm run dev` + backend), Chrome and Firefox desktop plus a 375 px viewport:
  - Each sample gives boxes, lines, type, and time. The KTP sample is classified as KTP, the invoice as invoice.
  - A real phone photo (rotated EXIF, > 3000 px) shows upright, boxes align, and the tab stays responsive.
  - A text-free photo shows the "no text" state. A PDF shows the unsupported-file error.
  - DevTools offline before the first run gives the download error; going back online and pressing Retry works.
  - Clicking a sample during processing does nothing.
  - Network: `.wasm` from `cdn.jsdelivr.net`, `.ort`/dict from `media.githubusercontent.com`/`raw.githubusercontent.com`; nothing OCR-related from localhost except the JS chunks and the sample images. The landing page makes no OCR requests.
  - Reload while offline after a successful run: if OCR still works, keep the "works offline after first load" privacy item, otherwise remove it from `content.js`.
- [ ] **Step 5: Measure and fill numbers.** Note the first-load time, and the OCR time for each sample (median of 3), on the machine you used. Replace every `TODO-measure` in `content.js` with real values, and name the device in the copy (e.g. "measured on a laptop with <CPU>, Chrome"). `grep -r "TODO-measure" src` prints nothing.
- [ ] **Step 6: Commit** `feat(document-ocr): in-browser OCR demo with CDN-hosted model`.

### Task 6: Final checks

- [ ] **Step 1:** `cd backend && php artisan test`: all pass. `cd frontend && npm test && npm run build`: pass, `dist` has no `.wasm` and no OpenCV (same commands as Task 5 Step 1).
- [ ] **Step 2:** a case-insensitive grep for the client name and its business-process words (the owner knows them; not written here) over `frontend/src/pages/document-ocr`, `frontend/public/document-ocr`, `frontend/design/document-ocr` and the new `projects.json` entry prints nothing (inspect the PNG/JPG samples visually too).
- [ ] **Step 3:** Walk through the spec's "Done when" list one line at a time and confirm each line; report any that don't hold instead of committing.
- [ ] **Step 4: Commit** any fixes (`fix(document-ocr): …`).

# Document OCR showcase page — design

Date: 2026-10-21
Status: draft, waiting for owner approval

## Intent

The owner built an in-browser OCR document checker for a past employer
(PaddleOCR running through onnxruntime-web / WebAssembly, with a keyword-based
document-type classifier). That code is private. They want to show on their
personal web that they have done WebAssembly OCR work, with a showcase page
like the existing Topline page (`/{lang}/projects/topline`), plus a **live
demo**: a visitor uploads an image and sees the text read out.

The point of the page is to prove the skill. The demo is the evidence, so it has
to work reliably and feel quick; the surrounding copy explains what is
technically interesting about it.

## Goals

- A new showcase page at `/{id|en}/projects/document-ocr`, bilingual (ID/EN),
  built in the same style and section pattern as the Topline page.
- A working live demo on that page: upload or drag & drop an image (or pick a
  sample) → detected text boxes drawn over the image → list of recognised lines
  with confidence → detected document type → elapsed time.
- Everything runs in the visitor's browser. The image never leaves their device,
  and the page says so plainly.
- A project card for it in the landing page's Projects section, with a
  "View details" button to the page and **no GitHub link**.
- Zero OCR assets on the owner's server: the WASM runtime and the model are
  loaded from public CDNs.

## Non-goals

- No public GitHub repo for this project.
- No server-side OCR, no upload endpoint, no storage of images or results.
- No model switcher (small/medium). Only one model is used.
- No PDF input. Images only (JPG/PNG/WebP).

## Anti-goals (would be a failure even if it works)

- **The page must not mention UBS, the client, or the recruitment context** in
  any text, alt text, metadata, sample image, or classifier label. It is framed
  neutrally as "a document checker I built using WebAssembly OCR".
- **No code copied from the employer project.** Rebuild it from the public
  open-source libraries (`ppu-paddle-ocr`, `onnxruntime-web`). Reading the old
  project for ideas is fine; copying `module.js` or the view is not.
- The landing page must not get heavier. None of the OCR code, WASM, or model
  may load unless the visitor is on the OCR page *and* starts the demo.
- Sample images must not contain real personal data (no real ID cards).

## Decided by the owner

- One showcase page like Topline, with a live upload-and-read demo.
- No GitHub repo; the card gets only a "View details" button.
- Neutral framing, no UBS name.
- Load the model and WASM from CDN, not from the owner's server.
- Model: **PP-OCRv6 tiny** (`v6-tiny` preset in `ppu-paddle-ocr`).

## Constraints and facts already checked

Model and runtime URLs (all checked on 2026-10-21: HTTP 200,
`Access-Control-Allow-Origin: *`):

| File | URL | Size |
|---|---|---|
| Detection model | `https://media.githubusercontent.com/media/PT-Perkasa-Pilar-Utama/ppu-paddle-ocr-models/main/detection/ort/PP-OCRv6_tiny_det.ort` | 1.9 MB |
| Recognition model | `https://media.githubusercontent.com/media/PT-Perkasa-Pilar-Utama/ppu-paddle-ocr-models/main/recognition/ort/PP-OCRv6_tiny_rec.ort` | 4.5 MB |
| Character dictionary | `https://raw.githubusercontent.com/PT-Perkasa-Pilar-Utama/ppu-paddle-ocr-models/main/recognition/ppocrv6_tiny_dict.txt` | small |
| onnxruntime-web WASM | `https://cdn.jsdelivr.net/npm/onnxruntime-web@<installed version>/dist/` | cached 1 year |

- These URLs are already the defaults in `ppu-paddle-ocr`'s
  `model-catalogue.js` (`V6_TINY_MODEL`). Still, put the three model URLs in
  **one constant** in the page's own code, so they can be moved (e.g. to Hugging
  Face) if that third-party GitHub repo disappears.
- The ORT WASM path (`ort.env.wasm.wasmPaths`) must point at jsDelivr using the
  **same version** as the installed `onnxruntime-web` npm package. Vite must
  not bundle the `.wasm` files into `dist`.
- **Library JS goes in the page's lazy chunk; no OpenCV.** The old project
  loaded `ppu-paddle-ocr/web`, which imports only `onnxruntime-web` and
  `ppu-ocv/canvas-web` (pure Canvas API; the whole `ppu-ocv` folder there was
  ~283 KB). The npm package may still list `@techstark/opencv-js` as a dependency,
  but it must not end up in the build. Check `dist` after building: no
  OpenCV in any chunk. If the `web` entry does pull it in, stop and report
  back; do not ship a ~10 MB OpenCV bundle. The "zero OCR assets on the
  server" goal means the large files (WASM and models). The small library JS
  in the lazy chunk is fine *(Claude's call)*.
- Use **single-threaded** WASM (`ort.env.wasm.numThreads = 1`). Multi-threading
  needs COOP/COEP headers, and the current nginx config
  (`frontend/docker/nginx.conf`) does not send them. Do not add those headers
  or a COI service worker as part of this work.
- Frontend: React 19 + Vite 6, no router library. Showcase pages are registered
  in `frontend/src/pages/index.js` (`PROJECT_PAGES`, lazy-loaded chunks) and
  rendered by `App.jsx`.
- Projects come from the Laravel backend (`/api/portfolio`), seeded from
  `backend/database/data/projects.json` by `PortfolioSeeder`. `App.jsx` passes
  the matching project record to the page.
- `projects.repo_url` is currently `NOT NULL`
  (`2026_10_20_000001_create_projects_table.php`), and `ProjectCard`
  (`frontend/src/components/Projects.jsx`) always renders a repo link and links
  the project name to `p.url`.
- `github:sync` only updates projects whose slug matches a public repo, so a
  project with no repo is left alone. Good.

## The how

### Backend

1. New migration that makes `projects.repo_url` nullable.
2. Add the project to `backend/database/data/projects.json`:
   - `slug`: `document-ocr`
   - `short_name`: `Document OCR`
   - `category`: `data` (shown as "Data & AI")
   - `language`: `JavaScript`
   - `tags`: e.g. `WebAssembly`, `ONNX Runtime Web`, `PaddleOCR`, `React`
   - `description` (id/en): neutral one-paragraph summary
   - `repo_url`: `null`, `pushed_at`: date the page ships
   - `is_featured`: false
3. Feature test: `/api/projects/document-ocr` returns the project with
   `url: null`; existing tests still pass.

### Project card (`Projects.jsx`)

- When `p.url` is null: the name links to the showcase page (if there is
  one), otherwise it's plain text; the "View repo" link is not rendered.
- "View details" keeps working exactly as for Topline.

### Showcase page (`frontend/src/pages/document-ocr/`)

Same file layout as `pages/topline/`: `DocumentOcrPage.jsx`, `content.js`
(all ID/EN copy), `ocr.css` (or a shared stylesheet if the builder prefers,
see below), plus the demo component(s). Register it as
`'document-ocr': lazy(() => import('./document-ocr/DocumentOcrPage.jsx'))`.
Use `useDocumentMeta` for title, description, canonical path, OG image.

Sections, top to bottom:

1. **Hero:** back link to `/{lang}#projects`, eyebrow, title, tagline, short
   description, chips (e.g. "100% in-browser", "WebAssembly", "~6 MB model",
   "No upload"). The CTA scrolls to the demo.
2. **Live demo** (the centrepiece, right under the hero):
   - Idle state: a drop zone with "Upload image" and 2–3 sample thumbnails,
     plus a short line saying the image stays on the device.
   - Clicking upload, dropping a file, or choosing a sample starts loading the
     engine (if not loaded yet), with progress shown ("Downloading model…
     3.1 / 6.4 MB" or a stepwise status if byte progress is not available).
     Once loaded, the engine stays in memory for the next image.
   - Result: the image on a canvas with detected text boxes drawn on top
     (boxes must line up when the canvas is resized on narrow screens); a
     list of recognised lines with confidence %; detected document type with a
     confidence bar; elapsed time for the OCR run.
   - Errors (model download fails, unsupported file, no text found) show a
     friendly message and a retry, never a blank panel.
   - Large photos are scaled down before OCR so phones don't stall.
3. **How it works:** the pipeline as steps: image → preprocessing → text
   detection (DB model) → per-box recognition (CRNN/SVTR model) → keyword
   classifier, with a note that ONNX Runtime executes the models as WebAssembly.
4. **Performance / numbers:** only numbers that are true: model size (6.4 MB),
   "0 bytes sent to a server", and timing measured by the builder on a real
   device (state which device). Do not invent figures.
5. **Tech stack:** chips (onnxruntime-web, WebAssembly SIMD, PaddleOCR PP-OCRv6
   tiny, ppu-paddle-ocr, React, Canvas API) plus one short paragraph on the
   architecture.
6. **Privacy:** check-list in the Topline style: no upload, no storage, model
   fetched from public CDN, works offline after first load (only if true;
   verify).

There is no download/install/roadmap section (those were Topline-specific).

### Document classifier

Keyword scoring, re-written from scratch: join all recognised text in
uppercase, score each document type by the share of its keywords found, pick
the best above a threshold, else "Unknown". Neutral, generic types, for example:

- KTP (Indonesian ID card): `NIK`, `PROVINSI`, `KABUPATEN`/`KOTA`,
  `TEMPAT/TGL LAHIR`, `GOL. DARAH`, `BERLAKU HINGGA`
- Ijazah / certificate: `IJAZAH`, `SERTIFIKAT`, `DIBERIKAN KEPADA`, `LULUS`
- Invoice / receipt: `INVOICE`, `TOTAL`, `SUBTOTAL`, `PPN`/`TAX`, `QTY`
- CV / résumé: `PENGALAMAN`/`EXPERIENCE`, `PENDIDIKAN`/`EDUCATION`, `SKILLS`

Labels are bilingual via `content.js`.

### Sample images

2–3 synthetic sample images in `frontend/public/document-ocr/`: e.g. a
specimen ID card with fake data clearly marked "SPECIMEN / CONTOH", a sample
invoice, a short printed text. All data obviously fake. Keep each under
~200 KB (WebP). Also make a neutral 1280×640 OG image for link previews in
the same folder, styled like the page hero (no client content) *(Claude's
call)*. These images and the lazy JS chunk are the only OCR-related files
served by the owner's server.

## Left to the builder

- Whether to share CSS with Topline (extract common `.tl-*` styles) or keep a
  separate stylesheet. Avoid touching Topline's look either way.
- Exact copy wording (keep it in the voice of the existing Topline copy).
- Whether loading starts when the demo scrolls into view or on first
  interaction (must not start on page load before the visitor reaches it).
- How to show download progress, depending on what `ppu-paddle-ocr` exposes
  (a custom `fetch` with progress is fine).
- Feature icons.

## Done when

- `/id/projects/document-ocr` and `/en/projects/document-ocr` work, and a
  sample image and a real photo both produce boxes, lines, a type, and a time
  in a current Chrome and Firefox (desktop) and on a phone-width viewport.
- The landing page's network log shows no OCR JS/WASM/model requests.
- The OCR page's network log shows the WASM and models coming from jsDelivr /
  GitHub, not from the owner's domain.
- The card shows "View details" and no GitHub link; other cards are unchanged.
- `php artisan test` and `npm run build` pass.
- A text search of the new files finds no "UBS" or recruitment wording.

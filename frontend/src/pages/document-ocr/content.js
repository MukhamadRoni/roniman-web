// Copy for the Document OCR showcase page. Facts come from the design doc
// (docs/superpowers/specs/2026-10-21-document-ocr-showcase-design.md); every
// number in `perf` was measured on a real device, see the lead text there.

export const ASSETS = {
  ogImage: '/document-ocr/og-1280x640.jpg',
}

export const SAMPLES = [
  { id: 'ktp', src: '/document-ocr/sample-ktp.png', alt: { id: 'Contoh KTP dengan data palsu', en: 'Sample ID card with fake data' } },
  { id: 'invoice', src: '/document-ocr/sample-invoice.png', alt: { id: 'Contoh invoice', en: 'Sample invoice' } },
  { id: 'text', src: '/document-ocr/sample-text.png', alt: { id: 'Contoh paragraf tercetak', en: 'Sample printed paragraph' } },
]

export const CONTENT = {
  id: {
    meta: {
      title: 'Document OCR · Baca teks dokumen langsung di browser · Mukhamad Roni',
      description: 'Document OCR: PaddleOCR yang berjalan di browser lewat ONNX Runtime WebAssembly. Unggah foto dokumen, teksnya terbaca dan jenis dokumennya ditebak, tanpa gambar dikirim ke server.',
    },
    back: 'Semua project',
    eyebrow: 'WebAssembly · OCR',
    tagline: 'Baca teks dokumen, langsung di browser',
    desc: 'Pemeriksa dokumen yang pernah saya bangun: foto diunggah, teksnya dibaca oleh model PaddleOCR yang berjalan sebagai WebAssembly, lalu jenis dokumennya ditebak. Semua terjadi di perangkat Anda.',
    cta: 'Coba sekarang',
    chips: ['100% di browser', 'WebAssembly', 'Model ~6 MB', 'Tanpa upload'],
    alt: { og: 'Document OCR · Baca teks dokumen langsung di browser' },

    demo: {
      label: '// Demo langsung',
      title: 'Coba dengan dokumen Anda.',
      privacy: 'Gambar diproses di browser ini dan tidak pernah dikirim ke server mana pun.',
      upload: 'Pilih gambar',
      drop: 'atau seret gambar ke sini · JPG, PNG, WebP',
      samples: 'Atau coba contoh:',
      firstLoad: 'Pemakaian pertama mengunduh model ~6 MB dari CDN.',
      loading: 'Mengunduh model',
      starting: 'Menyiapkan mesin WebAssembly',
      processing: 'Membaca teks',
      results: 'Teks terbaca',
      lines: 'baris',
      type: 'Jenis dokumen',
      confidence: 'Keyakinan',
      elapsed: 'Selesai dalam',
      again: 'Coba gambar lain',
      types: { ktp: 'KTP', certificate: 'Ijazah / sertifikat', invoice: 'Invoice / struk', cv: 'CV / resume', unknown: 'Tidak dikenali' },
      noText: 'Tidak ada teks yang terdeteksi di gambar ini.',
      errors: {
        unsupported: 'Format ini belum didukung. Gunakan gambar JPG, PNG, atau WebP.',
        download: 'Gagal mengunduh. Periksa koneksi internet, lalu coba lagi.',
        generic: 'Terjadi kesalahan saat membaca gambar.',
      },
      retry: 'Coba lagi',
    },

    how: {
      label: '// Cara kerja',
      title: 'Lima langkah, nol server.',
      lead: 'Seluruh pipeline berjalan di tab browser. Server hanya mengirim halaman ini.',
      steps: [
        ['Siapkan gambar', 'Foto diputar sesuai EXIF dan diperkecil sampai sisi terpanjangnya 1600 px, supaya HP tidak kewalahan.'],
        ['Deteksi teks', 'Model deteksi PP-OCRv6 tiny mencari area yang berisi teks dan mengembalikan kotak-kotaknya.'],
        ['Kenali tiap kotak', 'Setiap kotak dipotong dan dibaca oleh model pengenalan, lengkap dengan skor keyakinan.'],
        ['Jalankan sebagai WebAssembly', 'ONNX Runtime Web mengeksekusi kedua model sebagai WASM SIMD di thread browser.'],
        ['Tebak jenis dokumen', 'Teks digabung lalu dicocokkan dengan kata kunci per jenis dokumen, dan skor tertinggi menang.'],
      ],
    },

    perf: {
      label: '// Performa & teknis',
      title: 'Kecil, cepat, dan tetap di perangkat.',
      lead: 'Diukur di laptop Intel Core i5-1235U (RAM 16 GB) dengan Chrome 155 pada build produksi, Oktober 2026. Waktu baca adalah median 3 kali percobaan.',
      stats: [
        ['~1 s', 'Waktu baca per dokumen contoh, dari 0,7 s (paragraf) sampai 1,1 s (KTP)'],
        ['6,4 MB', 'Model deteksi + pengenalan, diunduh sekali dari CDN'],
        ['~9,5 MB', 'Total unduhan pertama, termasuk runtime WASM 3 MB'],
        ['0 byte', 'Data gambar yang dikirim ke server'],
      ],
      stackTitle: 'Stack',
      stack: ['ONNX Runtime Web', 'WebAssembly SIMD', 'PaddleOCR PP-OCRv6 tiny', 'ppu-paddle-ocr', 'React', 'Canvas API'],
      arch: 'Halaman ini dan mesin OCR adalah dua chunk terpisah: mesin baru diunduh saat Anda mulai mencoba. Runtime WASM diambil dari jsDelivr dan model dari repositori model publik, jadi server portfolio ini tidak menyimpan satu pun file OCR yang besar.',
    },

    privacy: {
      label: '// Privasi',
      title: 'Dokumen Anda tidak ke mana-mana.',
      items: [
        ['Tanpa upload', 'Gambar dibaca langsung dari perangkat dan diproses di memori tab ini.'],
        ['Tanpa penyimpanan', 'Tidak ada gambar atau hasil yang disimpan. Tutup tab, semuanya hilang.'],
        ['Hanya model yang diunduh', 'Satu-satunya lalu lintas jaringan adalah mengunduh runtime dan model dari CDN publik.'],
        ['Tetap jalan tanpa internet', 'Setelah model termuat, demo tetap bisa membaca gambar walau koneksi putus, selama tab ini terbuka.'],
      ],
    },
  },

  en: {
    meta: {
      title: 'Document OCR · Read document text right in the browser · Mukhamad Roni',
      description: 'Document OCR: PaddleOCR running in the browser on ONNX Runtime WebAssembly. Upload a photo of a document, read its text, and guess its type, without the image ever reaching a server.',
    },
    back: 'All projects',
    eyebrow: 'WebAssembly · OCR',
    tagline: 'Read document text, right in the browser',
    desc: 'A document checker I built: upload a photo, its text is read by a PaddleOCR model running as WebAssembly, then the document type is guessed. All of it happens on your device.',
    cta: 'Try it now',
    chips: ['100% in-browser', 'WebAssembly', '~6 MB model', 'No upload'],
    alt: { og: 'Document OCR · Read document text right in the browser' },

    demo: {
      label: '// Live demo',
      title: 'Try it with your own document.',
      privacy: 'The image is processed in this browser and is never sent to any server.',
      upload: 'Choose image',
      drop: 'or drop an image here · JPG, PNG, WebP',
      samples: 'Or try a sample:',
      firstLoad: 'The first run downloads a ~6 MB model from a CDN.',
      loading: 'Downloading model',
      starting: 'Starting the WebAssembly engine',
      processing: 'Reading text',
      results: 'Recognised text',
      lines: 'lines',
      type: 'Document type',
      confidence: 'Confidence',
      elapsed: 'Done in',
      again: 'Try another image',
      types: { ktp: 'ID card (KTP)', certificate: 'Diploma / certificate', invoice: 'Invoice / receipt', cv: 'CV / résumé', unknown: 'Not recognised' },
      noText: 'No text was found in this image.',
      errors: {
        unsupported: 'This format is not supported. Use a JPG, PNG, or WebP image.',
        download: 'Download failed. Check your connection and try again.',
        generic: 'Something went wrong while reading the image.',
      },
      retry: 'Try again',
    },

    how: {
      label: '// How it works',
      title: 'Five steps, zero servers.',
      lead: 'The whole pipeline runs in the browser tab. The server only sends this page.',
      steps: [
        ['Prepare the image', 'The photo is rotated per its EXIF data and scaled down to 1600 px on the longest side, so phones keep up.'],
        ['Detect text', 'The PP-OCRv6 tiny detection model finds the regions that contain text and returns their boxes.'],
        ['Recognise each box', 'Each box is cropped and read by the recognition model, with a confidence score.'],
        ['Run as WebAssembly', 'ONNX Runtime Web executes both models as WASM SIMD on a browser thread.'],
        ['Guess the document type', 'The text is joined and matched against keywords per document type, and the highest score wins.'],
      ],
    },

    perf: {
      label: '// Performance & tech',
      title: 'Small, fast, and it stays on your device.',
      lead: 'Measured on an Intel Core i5-1235U laptop (16 GB RAM) with Chrome 155 on the production build, October 2026. Read times are the median of 3 runs.',
      stats: [
        ['~1 s', 'Read time per sample document, from 0.7 s (paragraph) to 1.1 s (ID card)'],
        ['6.4 MB', 'Detection + recognition models, downloaded once from a CDN'],
        ['~9.5 MB', 'Total first download, including the 3 MB WASM runtime'],
        ['0 bytes', 'Image data sent to a server'],
      ],
      stackTitle: 'Stack',
      stack: ['ONNX Runtime Web', 'WebAssembly SIMD', 'PaddleOCR PP-OCRv6 tiny', 'ppu-paddle-ocr', 'React', 'Canvas API'],
      arch: 'This page and the OCR engine are two separate chunks: the engine is only downloaded when you start the demo. The WASM runtime comes from jsDelivr and the model from a public model repository, so this portfolio server hosts none of the large OCR files.',
    },

    privacy: {
      label: '// Privacy',
      title: 'Your document goes nowhere.',
      items: [
        ['No upload', 'The image is read straight from your device and processed in this tab\'s memory.'],
        ['No storage', 'No image or result is saved. Close the tab and it is gone.'],
        ['Only the model is downloaded', 'The only network traffic is fetching the runtime and model from public CDNs.'],
        ['Keeps working without internet', 'Once the model has loaded, the demo still reads images if the connection drops, as long as this tab stays open.'],
      ],
    },
  },
}

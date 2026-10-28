// Copy and install data for the SimReady Assets showcase page.
// Numbers in STATS were measured on the shipped GLB (see the task 1 report).
// Install strings are all built from INSTALL_SPEC so they can never drift.

export const ASSETS = {
  glb: '/simready-assets/conveyor_belt_a02.glb',
  poster: '/simready-assets/conveyor-poster.jpg',
  ogImage: '/simready-assets/og-1280x640.jpg',
}

export const REPO_URL = 'https://github.com/MukhamadRoni/simready-assets'
export const INSTALL_SPEC = 'git+https://github.com/MukhamadRoni/simready-assets@v0.1.0'
export const RELEASE_ZIP_URL = 'https://github.com/MukhamadRoni/simready-assets/releases/download/v0.1.0/simready-assets-skill.zip'

const ARGS = ['--from', INSTALL_SPEC, 'simready-mcp']
const json = (o) => JSON.stringify(o, null, 2)

const mcpServers = json({ mcpServers: { simready: { command: 'uvx', args: ARGS } } })
const vscodeServers = json({ servers: { simready: { type: 'stdio', command: 'uvx', args: ARGS } } })

const WARMUP = {
  title: { id: 'Pemanasan sekali (disarankan, di terminal)', en: 'Warm up once (recommended, in a terminal)' },
  code: `uvx --from ${INSTALL_SPEC} simready --help`,
}

export const CLIENTS = [
  {
    id: 'claude-code',
    label: 'Claude Code',
    blocks: [
      WARMUP,
      {
        title: { id: '1. Di Claude Code: tambah marketplace', en: '1. In Claude Code: add the marketplace' },
        code: '/plugin marketplace add MukhamadRoni/simready-assets',
      },
      {
        title: { id: '2. Pasang plugin (skill + MCP)', en: '2. Install the plugin (skill + MCP)' },
        code: '/plugin install simready-assets@simready-assets',
      },
      {
        title: { id: 'Atau hanya MCP (di terminal)', en: 'Or MCP only (in a terminal)' },
        code: `claude mcp add simready -- uvx --from ${INSTALL_SPEC} simready-mcp`,
      },
    ],
  },
  {
    id: 'claude-desktop',
    label: 'Claude Desktop',
    blocks: [
      WARMUP,
      { title: { id: 'Konfigurasi MCP', en: 'MCP config' }, file: 'claude_desktop_config.json', code: mcpServers },
    ],
    note: {
      id: 'Di Claude Desktop, MCP-lah yang bekerja. Zip skill hanya panduan (alur kerja, saran Isaac Sim dan web), karena skill di Desktop berjalan di sandbox yang biasanya tidak punya uv. Buka Settings > Developer > Edit Config, lalu restart Desktop.',
      en: 'In Claude Desktop the MCP server does the work. The skill zip is guidance only (workflow, Isaac Sim and web advice), because Desktop skills run in a sandbox that usually has no uv. Open Settings > Developer > Edit Config, then restart Desktop.',
    },
  },
  {
    id: 'cursor',
    label: 'Cursor',
    blocks: [
      WARMUP,
      { title: { id: 'Konfigurasi MCP', en: 'MCP config' }, file: '.cursor/mcp.json', code: mcpServers },
    ],
    note: {
      id: 'Letakkan di .cursor/mcp.json (project) atau ~/.cursor/mcp.json (global). Format mengikuti dokumentasi Cursor.',
      en: "Put it in .cursor/mcp.json (project) or ~/.cursor/mcp.json (global). The format follows Cursor's documentation.",
    },
  },
  {
    id: 'vscode',
    label: 'VS Code',
    blocks: [
      WARMUP,
      { title: { id: 'Konfigurasi MCP', en: 'MCP config' }, file: '.vscode/mcp.json', code: vscodeServers },
    ],
    note: {
      id: 'Perhatikan kuncinya "servers", bukan "mcpServers". Format mengikuti dokumentasi VS Code.',
      en: 'Note the key is "servers", not "mcpServers". The format follows VS Code\'s documentation.',
    },
  },
]

export const STATS = [
  { key: 'usd', value: { id: '69,4 MB', en: '69.4 MB' }, label: { id: 'Unduhan USD (profil web)', en: 'USD download (web profile)' } },
  { key: 'glb', value: { id: '9,75 MB', en: '9.75 MB' }, label: { id: 'simready convert --max-tex 512 --jpeg', en: 'simready convert --max-tex 512 --jpeg' } },
  { key: 'meshopt', value: { id: '1,62 MB', en: '1.62 MB' }, label: { id: 'Setelah meshopt glTF-Transform', en: 'After glTF-Transform meshopt' } },
  { key: 'tris', value: { id: '289.480', en: '289,480' }, label: { id: 'Segitiga', en: 'Triangles' } },
  { key: 'size', value: { id: '2,10 × 1,17 × 2,07 m', en: '2.10 × 1.17 × 2.07 m' }, label: { id: 'Ukuran asli', en: 'Real size' } },
]

export const CATEGORIES = [
  { group: 'machinery-robotics', count: 131, label: { id: 'Mesin & robotika', en: 'Machinery & robotics' } },
  { group: 'factory-tools', count: 265, label: { id: 'Perkakas pabrik', en: 'Factory tools' } },
  { group: 'warehouse-logistics', count: 447, label: { id: 'Gudang & logistik', en: 'Warehouse & logistics' } },
  { group: 'facility-safety', count: 380, label: { id: 'Fasilitas & keselamatan', en: 'Facility & safety' } },
  { group: 'automotive-parts', count: 220, label: { id: 'Suku cadang otomotif', en: 'Automotive parts' } },
  { group: 'office', count: 201, label: { id: 'Kantor', en: 'Office' } },
]

export const CONTENT = {
  id: {
    meta: {
      title: 'SimReady Assets · Aset 3D NVIDIA untuk Claude · Mukhamad Roni',
      description: 'SimReady Assets: skill Claude dan server MCP untuk mencari, mengecek ukuran, dan mengambil aset 3D NVIDIA SimReady satu per satu, lalu memakainya di Isaac Sim atau mengonversinya ke glTF untuk web.',
    },
    back: 'Semua project',
    eyebrow: 'Claude Skill · MCP · USD → glTF',
    tagline: 'Aset 3D industri untuk Claude, satu per satu',
    desc: 'Katalog NVIDIA SimReady berisi 2.603 aset OpenUSD, tetapi seluruhnya 476 GB. Skill dan MCP ini membuat Claude mencari aset yang cocok, mengecek ukurannya, dan hanya mengunduh yang dibutuhkan, lalu memakainya di simulasi atau mengonversinya ke GLB untuk web.',
    ctaInstall: 'Pasang sekarang',
    ctaDemo: 'Lihat demo 3D',
    chips: ['Isaac Sim', 'three.js', 'MCP', 'CC BY 4.0'],
    alt: { poster: 'Pratinjau model 3D ban berjalan (conveyor belt) dari NVIDIA SimReady', og: 'SimReady Assets · Aset 3D NVIDIA untuk Claude' },

    demo: {
      label: '// Demo langsung',
      title: 'Satu aset, dari 69 MB ke 1,6 MB.',
      lead: 'Ban berjalan ini diambil dari katalog, dikonversi dengan convert_to_glb, lalu dikompres. Putar dan zoom di bawah.',
      statsTitle: 'Ukuran di setiap langkah',
      credit: 'Model: NVIDIA SimReady (CC BY 4.0), dikonversi dengan simready-assets, dikompres dengan glTF-Transform',
      loading: 'Memuat model 3D',
      viewerError: 'Pratinjau 3D tidak bisa ditampilkan di perangkat ini. Gambar di atas menunjukkan modelnya.',
      hint: 'Seret untuk memutar · scroll untuk zoom',
      hintTouch: 'Seret untuk memutar · cubit untuk zoom',
    },

    install: {
      label: '// Pasang',
      title: 'Pasang di klien yang Anda pakai.',
      lead: 'Butuh uv dan git. Dataset tidak pernah diunduh utuh: aset diambil satu per satu saat dipakai.',
      tested: 'Jalur Claude Code sudah saya uji dari awal sampai akhir. Konfigurasi Claude Desktop, Cursor, dan VS Code mengikuti format dokumentasi masing-masing klien.',
      repo: 'Repo GitHub',
      zip: 'Unduh zip skill',
      copy: 'Salin',
      copied: 'Tersalin',
      manual: 'Sudah dipilih, salin manual',
      tabsLabel: 'Pilih klien',
    },

    categories: {
      label: '// Kategori aset',
      title: 'Enam kelompok untuk pabrik dan gudang.',
      assets: 'aset',
      more: 'Kelompok lain seperti dapur dan medis juga ada di katalog.',
    },

    how: {
      label: '// Cara kerja',
      title: 'Cari, cek, ambil, pakai.',
      steps: [
        { title: 'Cari', text: 'Claude mencari di katalog 2.603 aset berdasarkan kata kunci dan kelompok.' },
        { title: 'Cek ukuran', text: 'Sebelum mengunduh, ia melihat ukuran file dan dimensi asli aset.' },
        { title: 'Ambil satu per satu', text: 'Hanya aset yang dipilih yang diunduh, bukan 476 GB.' },
        { title: 'Pakai atau konversi', text: 'Pakai langsung di Isaac Sim, atau konversi ke GLB untuk web.' },
      ],
      toolsTitle: 'Tool MCP',
      tools: [
        { name: 'list_groups', desc: 'Daftar kelompok aset beserta jumlahnya.' },
        { name: 'search_assets', desc: 'Cari aset berdasarkan kata kunci atau kelompok.' },
        { name: 'asset_info', desc: 'Ukuran file, dimensi, dan detail satu aset.' },
        { name: 'get_thumbnail', desc: 'Ambil gambar pratinjau sebuah aset.' },
        { name: 'download_assets', desc: 'Unduh aset terpilih ke folder lokal.' },
        { name: 'convert_to_glb', desc: 'Ubah aset USD menjadi GLB ringan untuk web.' },
      ],
      promptsTitle: 'Contoh perintah',
      prompts: [
        'Cari 3 jenis conveyor dan tampilkan ukurannya.',
        'Buat scene gudang kecil di Isaac Sim dengan pallet dan kotak.',
        'Taruh kursi kantor di scene three.js saya.',
      ],
    },

    license: {
      label: '// Lisensi',
      title: 'Kode bebas, aset wajib dikreditkan.',
      code: 'Kode: MIT.',
      assets: 'Aset: CC BY 4.0 oleh NVIDIA.',
      credit: 'Cara mengkredit:',
      creditLine: '3D assets: NVIDIA SimReady Assets (CC BY 4.0)',
      creditNote: 'Jika Anda mengonversi atau mengubah aset, sebutkan juga hal itu.',
    },
  },

  en: {
    meta: {
      title: 'SimReady Assets · NVIDIA 3D assets for Claude · Mukhamad Roni',
      description: 'SimReady Assets: a Claude skill and MCP server that searches, size-checks and fetches NVIDIA SimReady 3D assets one at a time, then uses them in Isaac Sim or converts them to glTF for the web.',
    },
    back: 'All projects',
    eyebrow: 'Claude Skill · MCP · USD → glTF',
    tagline: 'Industrial 3D assets for Claude, one at a time',
    desc: 'The NVIDIA SimReady catalog holds 2,603 OpenUSD assets, but all of it is 476 GB. This skill and MCP let Claude find the right asset, check its size, and download only what it needs, then use it in a simulation or convert it to GLB for the web.',
    ctaInstall: 'Install now',
    ctaDemo: 'See 3D demo',
    chips: ['Isaac Sim', 'three.js', 'MCP', 'CC BY 4.0'],
    alt: { poster: 'Preview of a conveyor belt 3D model from NVIDIA SimReady', og: 'SimReady Assets · NVIDIA 3D assets for Claude' },

    demo: {
      label: '// Live demo',
      title: 'One asset, from 69 MB to 1.6 MB.',
      lead: 'This conveyor belt was picked from the catalog, converted with convert_to_glb, then compressed. Rotate and zoom below.',
      statsTitle: 'Size at each step',
      credit: 'Model: NVIDIA SimReady (CC BY 4.0), converted with simready-assets, compressed with glTF-Transform',
      loading: 'Loading 3D model',
      viewerError: "The 3D preview can't be shown on this device. The image above shows the model.",
      hint: 'Drag to rotate · scroll to zoom',
      hintTouch: 'Drag to rotate · pinch to zoom',
    },

    install: {
      label: '// Install',
      title: 'Install it in the client you use.',
      lead: 'Needs uv and git. The dataset is never downloaded whole: assets are fetched one at a time when used.',
      tested: "I tested the Claude Code path end to end. The Claude Desktop, Cursor and VS Code configs follow each client's documented format.",
      repo: 'GitHub repo',
      zip: 'Download skill zip',
      copy: 'Copy',
      copied: 'Copied',
      manual: 'Selected, copy it',
      tabsLabel: 'Choose a client',
    },

    categories: {
      label: '// Asset categories',
      title: 'Six groups for factories and warehouses.',
      assets: 'assets',
      more: 'Other groups such as kitchen and medical are in the catalog too.',
    },

    how: {
      label: '// How it works',
      title: 'Search, check, fetch, use.',
      steps: [
        { title: 'Search', text: 'Claude searches the 2,603-asset catalog by keyword and group.' },
        { title: 'Check size', text: 'Before downloading, it looks at the file size and real dimensions.' },
        { title: 'Fetch one by one', text: 'Only the chosen assets are downloaded, not 476 GB.' },
        { title: 'Use or convert', text: 'Use it directly in Isaac Sim, or convert it to GLB for the web.' },
      ],
      toolsTitle: 'MCP tools',
      tools: [
        { name: 'list_groups', desc: 'List asset groups with their counts.' },
        { name: 'search_assets', desc: 'Search assets by keyword or group.' },
        { name: 'asset_info', desc: 'File size, dimensions and details of one asset.' },
        { name: 'get_thumbnail', desc: "Fetch an asset's preview image." },
        { name: 'download_assets', desc: 'Download chosen assets to a local folder.' },
        { name: 'convert_to_glb', desc: 'Turn a USD asset into a light GLB for the web.' },
      ],
      promptsTitle: 'Example prompts',
      prompts: [
        'Find 3 conveyor types and show their sizes.',
        'Build a small warehouse scene in Isaac Sim with pallets and boxes.',
        'Put an office chair in my three.js scene.',
      ],
    },

    license: {
      label: '// Licence',
      title: 'Code is free, assets need credit.',
      code: 'Code: MIT.',
      assets: 'Assets: CC BY 4.0 by NVIDIA.',
      credit: 'How to credit:',
      creditLine: '3D assets: NVIDIA SimReady Assets (CC BY 4.0)',
      creditNote: 'If you converted or modified the assets, say so too.',
    },
  },
}

// Copy for the Topline showcase page. Every fact and number comes from the Topline repo
// (README.md, AGENTS.md, docs/DESIGN.md, docs/ROADMAP.md); update them together.

export const REPO_URL = 'https://github.com/MukhamadRoni/topline'
export const DOWNLOAD_URL = `${REPO_URL}/releases/latest/download/setup.exe`
export const RELEASES_URL = `${REPO_URL}/releases`

export const ASSETS = {
  icon: '/topline/topline-icon-256.png',
  ogImage: '/topline/og-banner-1280x640.png',
  video: '/topline/topline-demo-16x9.mp4',
  poster: '/topline/topline-demo-16x9-poster.jpg',
  videoVertical: '/topline/topline-demo-9x16.mp4',
  posterVertical: '/topline/topline-demo-9x16-poster.jpg',
}

export const CONTENT = {
  id: {
    meta: {
      title: 'Topline · Notch hidup untuk Windows 11 · Mukhamad Roni',
      description: 'Topline: notch hidup open source untuk Windows 11. Musik, lirik, fokus, to-do, jadwal sholat, dan kabar sistem di tengah atas layar. Rust native, tanpa WebView, CPU 0% saat idle.',
    },
    back: 'Semua project',
    eyebrow: 'Open source · Windows 11',
    tagline: 'Notch hidup untuk Windows 11',
    desc: 'Musik, lirik, fokus, to-do, jadwal sholat, dan kabar sistem di tengah atas layar. Dibuat dengan Rust native tanpa WebView, dan CPU-nya 0% saat idle.',
    download: 'Unduh untuk Windows',
    github: 'Lihat di GitHub',
    chips: ['Rust native', 'Offline-first', 'Indonesia & English', 'Lisensi MIT'],
    alt: {
      logo: 'Logo Topline',
      video: 'Video demo Topline: notch di tengah atas layar Windows 11 menampilkan volume, timer Pomodoro, launcher, riwayat clipboard, dan pengaturan cepat.',
      videoVertical: 'Video demo Topline versi vertikal dengan fitur yang sama: volume, Pomodoro, launcher, riwayat clipboard, dan pengaturan cepat.',
    },
    play: 'Putar video', pause: 'Jeda video',

    features: {
      label: '// Fitur',
      title: 'Semua yang Anda lirik, di satu tempat.',
      lead: 'Arahkan kursor ke tengah atas layar dan notch akan membuka. Selebihnya ia diam, tanpa mengganggu.',
      items: [
        ['music', 'Musik dari aplikasi apa pun', 'Judul, cover, dan kontrol dari Spotify, browser, atau pemutar lain lewat GSMTC; scroll naik-turun untuk volume, ke samping untuk ganti lagu.'],
        ['lyrics', 'Lirik tersinkron', 'Baris aktif disorot dan bisa diklik untuk lompat, dari file .lrc Anda sendiri, cache lokal, atau LRCLIB yang bisa dimatikan.'],
        ['focus', 'Fokus / Pomodoro', 'Timer Pomodoro dengan cincin progres, dan sisa menitnya tetap terlihat di notch saat tertutup.'],
        ['water', 'Pengingat air minum', 'Target harian, pengingat dengan tombol +250 ml langsung di notch, dan grafik 8 jam terakhir.'],
        ['todo', 'To-do dengan input inline', 'Ketik "Rapat tim 16:30" langsung di notch dan jamnya dikenali otomatis, atau tambah dari mana saja dengan Win + Alt + N.'],
        ['launcher', 'Mini launcher', 'Seret aplikasi (termasuk dari Start), file, atau folder ke notch untuk menyematkannya, maksimal 8 pin, tanpa menyentuh file aslinya.'],
        ['prayer', 'Jadwal sholat offline', 'Dihitung offline dengan metode Kemenag untuk 44 kota atau lokasi saat ini, dengan suara adzan opsional.'],
        ['clipboard', 'Riwayat clipboard', '20 teks terakhir yang bisa di-pin, hanya disimpan di memori, dan isi dari pengelola sandi diabaikan.'],
        ['peek', 'Kabar singkat (peek)', 'Volume, lagu baru, kamera/mikrofon aktif, progress build, dan unduhan selesai muncul sebentar, lalu sembunyi saat aplikasi full-screen.'],
        ['eyes', 'Mata "Personality"', 'Sepasang mata dengan 7 ekspresi yang berkedip, melirik kursor, dan tertidur saat Anda pergi, semuanya dijalankan oleh DWM.'],
        ['settings', 'Menu & Pengaturan kaca', 'Menu tray dan jendela Pengaturan berbahan kaca, dalam bahasa Indonesia dan English yang mengikuti bahasa Windows.'],
      ],
    },

    vertical: {
      label: '// Cara pakai',
      title: 'Diam saat idle, sigap saat dibutuhkan.',
      lead: 'Semua kontrol ada di notch itu sendiri. Tidak ada jendela yang perlu dicari.',
      steps: [
        ['Buka atau tutup', 'Arahkan kursor ke tengah atas layar, klik notch, atau tekan Win + Alt + T.'],
        ['Atur volume', 'Scroll naik atau turun di notch, 2% per takik.'],
        ['Ganti lagu', 'Scroll ke samping di touchpad, atau Shift + scroll. Klik tengah untuk play/pause.'],
        ['Sematkan apa saja', 'Seret aplikasi, file, atau folder dari Explorer, Desktop, atau Start ke notch.'],
      ],
    },

    perf: {
      label: '// Performa & teknis',
      title: 'Ringan karena tidak pernah menunggu.',
      lead: 'Angka di bawah diukur di Windows 11 25H2, 1920×1080, skala 100%, dan ditulis apa adanya.',
      stats: [
        ['0,000 s', 'CPU idle per 10 detik, dengan semua pengamat aktif'],
        ['~820 KB', 'topline.exe, tanpa runtime atau WebView'],
        ['~1,3 MB', 'setup.exe, installer per pengguna'],
        ['66–84 MB', 'RAM saat ini; target v0.2 di bawah 40 MB'],
      ],
      howTitle: 'Rahasianya ada tiga',
      how: [
        ['Tanpa polling', 'Semua info datang dari event Windows, ditambah satu timer deadline untuk kejadian berikutnya.'],
        ['Animasi oleh DWM', 'Buka/tutup, equalizer, dan mata adalah animasi Windows.UI.Composition, bukan proses Topline.'],
        ['Gambar ulang seperlunya', 'Direct2D/DirectWrite hanya menggambar ulang saat datanya berubah.'],
      ],
      stackTitle: 'Stack',
      stack: ['Rust (stable, windows-gnu)', 'windows-rs 0.58', 'Win32', 'Windows.UI.Composition', 'Direct2D', 'DirectWrite', 'GSMTC', 'WinHTTP', 'serde · JSON'],
      arch: 'Logika produk ada di crate topline-core tanpa dependensi Windows, lengkap dengan unit test. Lapisan Windows hanya menggambar dan menyambungkan event.',
    },

    privacy: {
      label: '// Privasi',
      title: 'Offline-first. Tanpa akun, tanpa telemetri.',
      items: [
        ['Tanpa telemetri', 'Tidak ada akun, telemetri, atau update otomatis.'],
        ['Satu-satunya akses internet: lirik', 'Saat lagu berganti, hanya judul, artis, dan durasi yang dikirim ke lrclib.net. Hasilnya di-cache, dan fitur ini bisa dimatikan di Pengaturan → Lirik.'],
        ['Data tetap di komputer Anda', 'Tugas, air minum, dan pengaturan disimpan di satu file lokal.'],
        ['Clipboard hanya di memori', 'Riwayat clipboard hilang saat Topline ditutup.'],
        ['Lokasi atas permintaan', 'Lokasi hanya dibaca sekali saat Anda memilih "Lokasi saat ini" untuk jadwal sholat.'],
      ],
      pathLabel: 'Lokasi data',
    },

    install: {
      label: '// Instalasi',
      title: 'Terpasang dalam hitungan detik.',
      reqTitle: 'Syarat',
      req: 'Windows 11 22H2 atau lebih baru (diuji di 25H2). Efek kaca memakai backdrop Windows 11.',
      steps: [
        ['Unduh setup.exe', 'Ambil installer terbaru dari halaman Releases di GitHub.'],
        ['Jalankan', 'Topline terpasang per pengguna di %LOCALAPPDATA%\\Programs\\Topline, tanpa hak admin.'],
        ['Mulai pakai', 'Arahkan kursor ke tengah atas layar. Mencopotnya bisa lewat Settings → Apps → Installed apps.'],
      ],
      keysTitle: 'Pintasan',
      keys: [
        [['Win', 'Alt', 'T'], 'Buka / tutup notch'],
        [['Win', 'Alt', 'N'], 'Tambah tugas dari mana saja'],
      ],
      cta: 'Unduh setup.exe',
      releases: 'Semua rilis',
    },

    roadmap: {
      label: '// Roadmap',
      title: 'Apa yang sudah ada, dan yang berikutnya.',
      cols: [
        ['Selesai', 'done', ['Lirik tersinkron', 'Jendela Pengaturan lengkap', 'Dua bahasa: Indonesia & English', 'Launcher mini dengan drag & drop', 'Gestur scroll di notch', 'Menu tray dan menu konteks kaca']],
        ['v0.2 · prioritas', 'next', ['Shelf file: drag & drop sementara, seret keluar', 'RAM turun ke bawah 40 MB', 'Pemilihan monitor dan pembaca layar', 'Lirik dari tag file lagu lokal']],
        ['v0.3 & usulan', 'later', ['Baterai headset Bluetooth', 'Pengingat sebelum waktu sholat', 'Usulan: rapat dari Google Calendar', 'Usulan: chat AI dengan API key sendiri, nonaktif secara default']],
      ],
      contribTitle: 'Ikut membangun Topline',
      contrib: 'Issue dan pull request sangat diterima. Baca AGENTS.md dulu: tanpa polling, animasi lewat Composition, dan logika baru masuk topline-core beserta test-nya.',
      contribCta: 'Kontribusi di GitHub',
      license: 'Lisensi MIT · Font Geist dengan SIL Open Font License 1.1',
    },
  },

  en: {
    meta: {
      title: 'Topline · A living notch for Windows 11 · Mukhamad Roni',
      description: 'Topline: an open source living notch for Windows 11. Music, lyrics, focus, to-dos, prayer times, and system updates at the top center of your screen. Native Rust, no WebView, 0% CPU when idle.',
    },
    back: 'All projects',
    eyebrow: 'Open source · Windows 11',
    tagline: 'A living notch for Windows 11',
    desc: 'Music, lyrics, focus, to-dos, prayer times, and system updates at the top center of your screen. Built in native Rust with no WebView, at 0% CPU when idle.',
    download: 'Download for Windows',
    github: 'View on GitHub',
    chips: ['Native Rust', 'Offline-first', 'Indonesian & English', 'MIT license'],
    alt: {
      logo: 'Topline logo',
      video: 'Topline demo video: the notch at the top center of Windows 11 showing volume, a Pomodoro timer, the launcher, clipboard history, and quick settings.',
      videoVertical: 'Vertical Topline demo video with the same features: volume, Pomodoro, the launcher, clipboard history, and quick settings.',
    },
    play: 'Play video', pause: 'Pause video',

    features: {
      label: '// Features',
      title: 'Everything you glance at, in one place.',
      lead: 'Move the cursor to the top center of the screen and the notch opens. The rest of the time it stays quiet.',
      items: [
        ['music', 'Music from any app', 'Title, cover, and controls from Spotify, a browser, or any player via GSMTC; scroll up or down for volume, sideways to change tracks.'],
        ['lyrics', 'Synced lyrics', 'The active line is highlighted and clickable to seek, from your own .lrc files, a local cache, or LRCLIB, which you can turn off.'],
        ['focus', 'Focus / Pomodoro', 'A Pomodoro timer with a progress ring, and the minutes left stay visible on the closed notch.'],
        ['water', 'Water reminders', 'A daily goal, reminders with a +250 ml button right on the notch, and a chart of the last 8 hours.'],
        ['todo', 'To-dos with inline input', 'Type "Team meeting 16:30" right in the notch and the time is picked up, or add one from anywhere with Win + Alt + N.'],
        ['launcher', 'Mini launcher', 'Drag apps (including from Start), files, or folders onto the notch to pin them, up to 8 pins, without touching the originals.'],
        ['prayer', 'Offline prayer times', 'Calculated offline with the Kemenag method for 44 cities or your current location, with an optional adhan.'],
        ['clipboard', 'Clipboard history', 'The last 20 text items, pinnable, kept in memory only, and password manager content is skipped.'],
        ['peek', 'Quick peeks', 'Volume, a new track, camera/mic in use, build progress, and finished downloads appear briefly, and hide when an app goes full screen.'],
        ['eyes', '"Personality" eyes', 'A pair of eyes with 7 expressions that blink, glance at the cursor, and fall asleep when you step away, all run by DWM.'],
        ['settings', 'Glass menu & settings', 'A glass tray menu and Settings window in Indonesian and English that follow your Windows language.'],
      ],
    },

    vertical: {
      label: '// How it works',
      title: 'Quiet when idle, quick when you need it.',
      lead: 'Every control lives on the notch itself. No window to hunt for.',
      steps: [
        ['Open or close', 'Move the cursor to the top center of the screen, click the notch, or press Win + Alt + T.'],
        ['Change the volume', 'Scroll up or down on the notch, 2% per notch.'],
        ['Skip tracks', 'Scroll sideways on a touchpad, or Shift + scroll. Middle-click to play/pause.'],
        ['Pin anything', 'Drag apps, files, or folders from Explorer, the Desktop, or Start onto the notch.'],
      ],
    },

    perf: {
      label: '// Performance & tech',
      title: 'Light because it never waits around.',
      lead: 'Measured on Windows 11 25H2, 1920×1080, 100% scale, and reported as is.',
      stats: [
        ['0.000 s', 'idle CPU per 10 seconds, with every watcher active'],
        ['~820 KB', 'topline.exe, with no runtime or WebView'],
        ['~1.3 MB', 'setup.exe, a per-user installer'],
        ['66–84 MB', 'RAM today; the v0.2 target is under 40 MB'],
      ],
      howTitle: 'Three reasons why',
      how: [
        ['No polling', 'Everything comes from Windows events, plus one deadline timer for the next thing that happens.'],
        ['Animated by DWM', 'Opening, closing, the equalizer, and the eyes are Windows.UI.Composition animations, not Topline work.'],
        ['Redraw only on change', 'Direct2D/DirectWrite redraws only when the data changes.'],
      ],
      stackTitle: 'Stack',
      stack: ['Rust (stable, windows-gnu)', 'windows-rs 0.58', 'Win32', 'Windows.UI.Composition', 'Direct2D', 'DirectWrite', 'GSMTC', 'WinHTTP', 'serde · JSON'],
      arch: 'Product logic lives in the topline-core crate with no Windows dependencies and its own unit tests. The Windows layer only draws and wires up events.',
    },

    privacy: {
      label: '// Privacy',
      title: 'Offline-first. No account, no telemetry.',
      items: [
        ['No telemetry', 'No account, telemetry, or automatic updates.'],
        ['The only internet access: lyrics', 'When the track changes, only the title, artist, and duration are sent to lrclib.net. Results are cached, and you can turn it off in Settings → Lyrics.'],
        ['Your data stays on your PC', 'Tasks, water, and settings are stored in a single local file.'],
        ['Clipboard in memory only', 'Clipboard history is gone when Topline closes.'],
        ['Location on request', 'Location is read once, only when you pick "Current location" for prayer times.'],
      ],
      pathLabel: 'Data location',
    },

    install: {
      label: '// Install',
      title: 'Installed in seconds.',
      reqTitle: 'Requirements',
      req: 'Windows 11 22H2 or later (tested on 25H2). The glass effect uses the Windows 11 backdrop.',
      steps: [
        ['Download setup.exe', 'Get the latest installer from the Releases page on GitHub.'],
        ['Run it', 'Topline installs per user to %LOCALAPPDATA%\\Programs\\Topline, with no admin rights.'],
        ['Start using it', 'Move the cursor to the top center of the screen. Uninstall from Settings → Apps → Installed apps.'],
      ],
      keysTitle: 'Shortcuts',
      keys: [
        [['Win', 'Alt', 'T'], 'Open / close the notch'],
        [['Win', 'Alt', 'N'], 'Add a task from anywhere'],
      ],
      cta: 'Download setup.exe',
      releases: 'All releases',
    },

    roadmap: {
      label: '// Roadmap',
      title: "What's here, and what's next.",
      cols: [
        ['Done', 'done', ['Synced lyrics', 'Full Settings window', 'Two languages: Indonesian & English', 'Mini launcher with drag & drop', 'Scroll gestures on the notch', 'Glass tray and context menus']],
        ['v0.2 · priority', 'next', ['File shelf: temporary drag & drop, drag out', 'RAM down to under 40 MB', 'Monitor selection and screen reader support', 'Lyrics from local music file tags']],
        ['v0.3 & proposals', 'later', ['Bluetooth headset battery', 'Reminders before prayer times', 'Proposal: meetings from Google Calendar', 'Proposal: AI chat with your own API key, off by default']],
      ],
      contribTitle: 'Help build Topline',
      contrib: 'Issues and pull requests are very welcome. Read AGENTS.md first: no polling, animate through Composition, and new logic goes into topline-core with tests.',
      contribCta: 'Contribute on GitHub',
      license: 'MIT license · Geist font under the SIL Open Font License 1.1',
    },
  },
}

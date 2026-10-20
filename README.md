<div align="center">

# ✨ personal-web

**Portfolio pribadi Mukhamad Roni — Software Engineer di Surabaya**

React + Vite di depan, Laravel 12 API di belakang. Dua bahasa, tampilan glassmorphism, dan data project yang tersinkron langsung dari GitHub.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?logo=laravel&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?logo=php&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?logo=sqlite&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

[Fitur](#-fitur) · [Arsitektur](#-arsitektur) · [Mulai cepat](#-mulai-cepat) · [Konten](#-mengubah-konten) · [API](#-api) · [Deploy](#-deploy)

</div>

---

## 🚀 Fitur

- 🌐 **Dua bahasa** — Indonesia (`/id`) dan Inggris (`/en`), satu klik untuk berpindah.
- 🪟 **Desain glassmorphism** dengan animasi reveal saat scroll dan angka yang menghitung naik.
- 🔄 **Sinkronisasi GitHub otomatis** — bahasa, stars, homepage, tanggal push, dan jumlah repo publik diperbarui setiap hari.
- 💬 **Form kontak → WhatsApp** — pesan disimpan di database lalu pengunjung diarahkan ke WhatsApp dengan teks yang sama.
- 🛡️ **Anti-spam** — rate limit 5 pesan/menit per IP dan honeypot untuk bot.
- 📦 **Satu request untuk semua data** — `GET /api/portfolio` mengisi seluruh halaman.
- 🧩 **Konten berbasis JSON** — project, artikel, pengalaman, pendidikan, dan skill cukup diedit di file JSON lalu di-seed.

## 🏗️ Arsitektur

```
personal-web/
├── backend/                  Laravel 12 API + SQLite
│   ├── app/Console/Commands  github:sync
│   ├── app/Http/Controllers  Portfolio, Project, Article, Message
│   ├── config/portfolio.php  Profil, hero, about, kontak
│   └── database/data/*.json  Sumber data project, artikel, pengalaman, dll.
└── frontend/                 React 19 + Vite 6
    ├── src/components/       Hero, About, Projects, Articles, Experience, ...
    ├── src/hooks/            useLang, useReveal, useCountUp
    └── src/i18n.js           Teks antarmuka ID/EN
```

```
 Browser ──► Vite (React SPA) ──/api/*──► Laravel API ──► SQLite
                                               ▲
                              github:sync ─────┘  (GitHub REST API, harian 03:00)
```

## ⚡ Mulai cepat

### Prasyarat

| Tool | Versi | Catatan |
|---|---|---|
| PHP | 8.2+ | Ekstensi `pdo_sqlite`, `sqlite3`, `fileinfo`, `mbstring`, `openssl` aktif |
| Composer | 2.x | |
| Node.js | 20+ | npm sudah termasuk |

> 💡 Di Windows, cara termudah adalah memasang [Laravel Herd](https://herd.laravel.com/windows) — PHP dan Composer sudah termasuk.

### Jalankan

Buka dua terminal:

```bash
# Terminal 1 — backend
cd backend
composer run setup      # install, buat .env, APP_KEY, database SQLite, migrasi + seed
php artisan serve       # http://127.0.0.1:8000
```

```bash
# Terminal 2 — frontend
cd frontend
cp .env.example .env    # opsional
npm install
npm run dev             # http://localhost:5173
```

Buka **http://localhost:5173**. Vite meneruskan request `/api/*` ke Laravel di port 8000.

## ✏️ Mengubah konten

| Konten | Lokasi | Setelah diubah |
|---|---|---|
| Nama, hero, about, kontak | `backend/config/portfolio.php` | langsung berlaku (`php artisan config:clear` jika di-cache) |
| Project | `backend/database/data/projects.json` | `php artisan db:seed --class=PortfolioSeeder` |
| Artikel | `backend/database/data/articles.json` | sama seperti di atas |
| Pengalaman, pendidikan, skill | `backend/database/data/*.json` | sama seperti di atas |
| Teks tombol & menu (ID/EN) | `frontend/src/i18n.js` | otomatis saat `npm run dev` |
| Foto & latar | `frontend/src/assets/` | ganti file dengan nama yang sama |

> ⚠️ Artikel di `articles.json` masih **data contoh** (`"is_sample": true`) dan tampil dengan label kuning. Ganti dengan artikel asli, isi `url`, lalu ubah `is_sample` menjadi `false`.

## 🔄 Sinkronisasi GitHub

```bash
php artisan github:sync            # perbarui bahasa, stars, homepage, tanggal push, jumlah repo publik
php artisan github:sync --import   # juga tambahkan repo baru (tersembunyi, is_visible = false)
```

Isi `GITHUB_TOKEN` di `backend/.env` jika terkena batas rate GitHub. Perintah ini terjadwal setiap hari pukul 03:00 selama scheduler berjalan (`php artisan schedule:work`).

## 💬 Pesan dari form kontak

Setiap pesan tersimpan di tabel `messages`. Untuk melihat pesan terbaru:

```bash
php artisan tinker
>>> App\Models\Message::latest()->take(10)->get(['created_at', 'lang', 'body'])
```

## 📡 API

Semua endpoint berawalan `/api`.

| Method | Endpoint | Keterangan |
|---|---|---|
| `GET` | `/api/portfolio` | Semua data halaman dalam satu request |
| `GET` | `/api/projects?category=web\|data\|auto\|embedded` | Daftar project |
| `GET` | `/api/projects/{slug}` | Detail project |
| `GET` | `/api/articles?lang=id\|en&per_page=10` | Artikel (paginasi) |
| `POST` | `/api/messages` | `{ body, lang, name?, email? }` → `{ id, whatsapp_url }` |

## 🧪 Tes

```bash
cd backend
composer test           # atau: php artisan test
```

## 🌍 Deploy

1. **Frontend** — `npm run build` menghasilkan `frontend/dist/`. Hosting harus mengarahkan semua path (`/id`, `/en`) ke `index.html` (SPA fallback). Jika API berada di domain lain, isi `VITE_API_URL` di `frontend/.env` sebelum build.
2. **Backend** — arahkan web server ke `backend/public`, set `APP_ENV=production`, `APP_DEBUG=false`, dan `FRONTEND_URL` ke domain frontend (untuk CORS). Lalu jalankan:

   ```bash
   php artisan migrate --force
   php artisan config:cache
   ```

## 📬 Kontak

- 💼 LinkedIn: [mukhamadroni](https://www.linkedin.com/in/mukhamadroni/)
- 🐙 GitHub: [MukhamadRoni](https://github.com/MukhamadRoni)
- ✉️ Email: mukhamadroni27@gmail.com

---

<div align="center">

Dibuat dengan ☕ di Surabaya · Lisensi [MIT](https://opensource.org/licenses/MIT)

</div>
"# roniman-web" 

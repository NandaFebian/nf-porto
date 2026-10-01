# PRD — Web Portofolio Nanda Febian

Sep 29, 2026 · @Dede

## Ringkasan & tujuan

Situs ini adalah portofolio pribadi Nanda Febian bergaya dokumentasi teknis: setiap proyek punya halaman sendiri seperti halaman docs, lengkap dengan latar belakang, arsitektur, tech stack, dan tautan demo atau repo. Dibangun dengan Next.js, konten ditulis dalam MDX sehingga menambah proyek cukup dengan menambah satu file.

**Tujuan**

- Menampilkan keahlian dan proyek secara terstruktur sehingga rekruter bisa menilai kemampuan dalam hitungan menit.
- Mendokumentasikan proyek secara mendalam (keputusan desain, tantangan, hasil) untuk pembaca teknis.
- Mudah dirawat: tanpa database dan tanpa panel admin; konten hidup di repositori.

**Non-tujuan v1**

- Blog, sistem komentar, dan panel admin/CMS.
- Multi-bahasa (v1 cukup satu bahasa; lihat pertanyaan terbuka).

**Metrik keberhasilan**

| Metrik | Target |
| --- | --- |
| Skor Lighthouse (Performance, Accessibility, SEO) | ≥ 95 |
| Waktu dari beranda ke detail proyek | ≤ 2 klik |
| Waktu menambah proyek baru | < 15 menit (satu file MDX) |
| Largest Contentful Paint (p75, mobile) | < 2,5 detik |

## Target pengunjung

Pembaca utama adalah rekruter yang memindai cepat; pembaca kedua adalah engineer yang menilai kedalaman teknis.

| Pengunjung | Yang dicari | Yang harus disediakan |
| --- | --- | --- |
| Rekruter / HR | Profil singkat, keahlian utama, CV, kontak | Hero ringkas, daftar keahlian, tombol unduh CV di atas lipatan |
| Engineer / tech lead | Arsitektur, keputusan teknis, kualitas kode | Halaman proyek bergaya docs: diagram, stack, tantangan, tautan repo |
| Klien freelance | Contoh hasil kerja, cara menghubungi | Kartu proyek dengan tangkapan layar, demo, formulir kontak |
| Dosen / rekan akademik | Publikasi dan riset | Bagian publikasi (mis. artikel jurnal dari tugas akhir) |

## Ruang lingkup & prioritas

v1 memuat semua fitur Must dan Should; fitur Could masuk setelah rilis.

| Fitur | Prioritas | Catatan |
| --- | --- | --- |
| Beranda (hero, ringkasan keahlian, proyek unggulan) | Must | Titik masuk utama |
| Halaman keahlian | Must | Dikelompokkan per kategori + tingkat |
| Daftar proyek + filter tag/stack | Must | Kartu dengan thumbnail |
| Halaman detail proyek gaya dokumentasi | Must | Sidebar, daftar isi, blok kode |
| Halaman tentang + unduh CV (PDF) | Must |  |
| Tema terang/gelap | Must | Ikut preferensi sistem |
| SEO: metadata, Open Graph, sitemap | Must | Gambar OG otomatis per proyek |
| Pencarian cepat (Ctrl+K) | Should | Indeks dibangun saat build |
| Formulir kontak | Should | Kirim email via layanan pihak ketiga |
| Halaman publikasi & sertifikat | Should |  |
| Analitik pengunjung ramah privasi | Could |  |
| Changelog / timeline pengalaman | Could |  |
| Blog, CMS, multi-bahasa | Won't (v1) |  |

## Kebutuhan fungsional

Setiap halaman di bawah ditulis sebagai user story dengan kriteria penerimaan.

**Beranda (`/`)**

- Sebagai rekruter, saya ingin melihat siapa Nanda dan keahlian utamanya dalam satu layar.
  - Hero memuat nama, peran (mis. Backend / Full-stack Developer), satu kalimat ringkasan, tombol "Lihat Proyek" dan "Unduh CV".
  - Menampilkan 3–4 proyek unggulan (`featured: true`) dan 6–8 keahlian utama.

**Keahlian (`/skills`)**

- Sebagai rekruter, saya ingin tahu teknologi yang dikuasai dan seberapa dalam.
  - Dikelompokkan: Bahasa, Frontend, Backend, Database, DevOps, Tools.
  - Setiap item menampilkan tingkat (Mahir / Menengah / Dasar) dan tautan ke proyek yang memakainya.

**Daftar proyek (`/projects`)**

- Sebagai pengunjung, saya ingin menyaring proyek berdasarkan stack atau jenis.
  - Kartu: judul, ringkasan satu kalimat, thumbnail, tag stack, tahun, status (Selesai / Berjalan).
  - Filter tag bisa dikombinasikan dan tersimpan di URL (`?tag=nestjs`).
  - Urutan default: terbaru di atas.

**Detail proyek (`/projects/[slug]`) — gaya dokumentasi**

- Sebagai engineer, saya ingin membaca proyek seperti membaca dokumentasi teknis.
  - Tata letak tiga kolom di desktop: sidebar navigasi proyek (kiri), konten (tengah), daftar isi otomatis dari heading (kanan).
  - Struktur baku: Ringkasan, Masalah, Peran saya, Arsitektur, Tech stack, Fitur utama, Tantangan & solusi, Hasil, Tautan.
  - Mendukung blok kode dengan highlight + tombol salin, callout, gambar dengan zoom, dan diagram Mermaid.
  - Tombol "Proyek sebelumnya / berikutnya" di bawah halaman.

**Tentang (`/about`)**

- Riwayat pendidikan (Universitas Udayana), pengalaman, publikasi, dan tautan unduh CV PDF.

**Kontak (`/contact`)**

- Formulir nama, email, pesan dengan validasi dan proteksi spam; tautan GitHub, LinkedIn, email.

**Global**

- Pencarian Ctrl+K lintas proyek dan keahlian.
- Toggle tema terang/gelap; navigasi responsif dengan menu seluler.
- Halaman 404 kustom yang mengarahkan ke daftar proyek.

## Struktur informasi

&#91;embedded content: peta situs · 5 halaman utama + detail proyek\]

Lima halaman utama berada satu klik dari header; halaman detail proyek memakai tata letak tiga kolom khas situs dokumentasi.

## Model konten

Semua konten berupa file di repositori: satu file MDX per proyek dan satu file data untuk keahlian, divalidasi skema saat build sehingga field yang kurang langsung menggagalkan build.

```
content/
  projects/
    work-order-management.mdx
    ...
  skills.ts
  profile.ts
public/
  cv/nanda-febian-cv.pdf
  projects/<slug>/cover.png
```

**Frontmatter proyek**

| Field | Tipe | Wajib | Contoh |
| --- | --- | --- | --- |
| title | string | Ya | Multi-tenant Work Order Management |
| slug | string | Ya (dari nama file) | work-order-management |
| summary | string ≤ 160 karakter | Ya | Backend manajemen work order multi-tenant |
| role | string | Ya | Backend Developer |
| stack | string\[\] | Ya | NestJS, MongoDB, TypeScript |
| category | enum | Ya | Web App / Backend / Riset / UI/UX |
| status | enum | Ya | Selesai / Berjalan |
| year | number | Ya | 2026 |
| cover | path gambar | Ya | /projects/work-order-management/cover.png |
| featured | boolean | Tidak | true |
| links | { demo?, repo?, paper? } | Tidak | URL |
| order | number | Tidak | 1 |

**Data keahlian**: `name`, `category`, `level` (Mahir / Menengah / Dasar), `icon`; relasi ke proyek dihitung otomatis dari field `stack` proyek, jadi tidak diisi manual.

## Kebutuhan non-fungsional

| Aspek | Kebutuhan |
| --- | --- |
| Performa | Semua halaman di-render statis (SSG); gambar via `next/image` (WebP/AVIF, lazy load); JS klien seminimal mungkin |
| Aksesibilitas | WCAG 2.1 AA: kontras warna, navigasi keyboard, fokus terlihat, alt text wajib di semua gambar |
| SEO | Metadata per halaman, Open Graph dan gambar OG dinamis, `sitemap.xml`, `robots.txt`, data terstruktur JSON-LD `Person` |
| Responsif | Nyaman dari lebar 360 px hingga 1440 px; sidebar docs berubah menjadi drawer di seluler |
| Keamanan | Formulir kontak dengan validasi server (Zod), rate limit, dan honeypot/Turnstile; header keamanan (CSP) |
| Keterpeliharaan | TypeScript strict, ESLint + Prettier, konten tervalidasi skema saat build |
| Kualitas | CI menjalankan lint, type-check, build, dan uji E2E dasar di setiap pull request |

## Arsitektur & tech stack

Situs berupa aplikasi Next.js App Router yang hampir seluruhnya statis: konten MDX dibaca saat build, dirender menjadi HTML, lalu disajikan dari CDN. Satu-satunya bagian dinamis adalah Server Action untuk formulir kontak.

| Lapisan | Pilihan | Alasan |
| --- | --- | --- |
| Framework | Next.js (App Router) + TypeScript | SSG, metadata API, Server Actions |
| Tata letak docs | Fumadocs, atau layout kustom | Fumadocs menyediakan sidebar, daftar isi, dan pencarian siap pakai untuk gaya dokumentasi |
| Konten | MDX + Velite (atau loader bawaan Fumadocs) | Frontmatter bertipe dan tervalidasi Zod |
| Styling | Tailwind CSS + shadcn/ui | Konsisten, tema gelap mudah |
| Highlight kode | Shiki (rehype-pretty-code) | Highlight saat build, tanpa JS di klien |
| Diagram | Mermaid | Diagram arsitektur ditulis sebagai teks di MDX |
| Pencarian | Indeks statis (Orama/Fumadocs search atau Pagefind) | Tanpa server pencarian |
| Formulir kontak | Server Action + Zod + Resend | Kirim email tanpa backend terpisah |
| Analitik | Vercel Analytics atau Umami | Ringan, ramah privasi |
| Pengujian | Playwright (E2E) + Vitest (utilitas konten) |  |
| CI/CD & hosting | GitHub Actions + Vercel | Preview otomatis tiap pull request |

**Struktur rute**

```
app/
  page.tsx                  → Beranda
  skills/page.tsx           → Keahlian
  projects/page.tsx         → Daftar proyek
  projects/[slug]/page.tsx  → Detail proyek (generateStaticParams)
  about/page.tsx            → Tentang + CV
  contact/page.tsx          → Kontak (Server Action)
  sitemap.ts, robots.ts, opengraph-image.tsx
```

## Roadmap

&#91;embedded content: roadmap · 4 fase, 4 gerbang\]

Setiap fase baru dimulai setelah gerbangnya terpenuhi; estimasi lima minggu mengasumsikan pengerjaan paruh waktu dan bisa digeser sesuai jadwal kuliah.

## Risiko & pertanyaan terbuka

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Konten proyek tipis atau tidak seragam | Halaman docs terasa kosong | Template MDX baku + checklist minimal per proyek |
| Proyek klien/kampus bersifat rahasia | Tidak bisa menampilkan kode atau data asli | Tampilkan arsitektur dan peran saja; samarkan data |
| Tangkapan layar membuat halaman berat | LCP melambat | `next/image`, kompresi, batas ukuran file di CI |
| Spam di formulir kontak | Kotak masuk penuh | Rate limit + Turnstile/honeypot |

**Pertanyaan terbuka**

- [ ] Bahasa situs: Indonesia, Inggris, atau keduanya (memengaruhi rute `/en`)?
- [ ] Pakai Fumadocs atau layout docs kustom?
- [ ] Proyek mana saja yang masuk v1 dan mana yang ditandai unggulan?
- [ ] Domain yang dipakai (mis. nama pribadi .dev / .my.id)?

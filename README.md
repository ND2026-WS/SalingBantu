# SALING BANTU — Ringankan Beban, Tebarkan Kebaikan

Aplikasi web platform gotong royong digital yang menghubungkan mereka yang membutuhkan
bantuan dengan individu, komunitas, lembaga, dan volunteer yang ingin membantu.

Dibangun dengan **HTML5 + CSS3 + JavaScript murni** (tanpa framework) dan siap
terhubung ke **Supabase** (PostgreSQL + Auth + Storage + Row Level Security).

---

## 1. Cara Menjalankan (Mode Demo — tanpa server, tanpa database)

Aplikasi langsung jalan dalam **Mode Demo** (data tersimpan di `localStorage` browser).
Cocok untuk demo ke klien / belajar:

1. Ekstrak folder `saling-bantu`.
2. Buka `index.html` di browser (disarankan via server lokal agar rapi):
   - Python: `python3 -m http.server 8080` lalu buka `http://localhost:8080`
   - VS Code: klik kanan `index.html` → *Open with Live Server*
3. Masuk dengan akun demo (tersedia tombolnya di halaman Masuk):
   - **Admin** — `admin@salingbantu.id` / `demo1234`
   - **Penerima bantuan** — `ratna@demo.id` / `demo1234`
   - **Donatur** — `budi@demo.id` / `demo1234`
   - **Volunteer** — `nadia@demo.id` / `demo1234`

> Mode Demo hanya untuk pengembangan/presentasi. Untuk produksi WAJIB hubungkan Supabase.

## 2. Koneksi ke Supabase (Mode Produksi)

1. Buat proyek baru di [https://supabase.com](https://supabase.com) → **New project**.
2. Buka **SQL Editor** → *New query* → salin seluruh isi `sql/supabase_schema.sql` → **Run**.
   Skrip ini membuat: 16 tabel, tipe enum, trigger notifikasi & audit, kebijakan RLS,
   view transparansi, storage bucket, dan data awal (6 kategori bantuan, dsb).
3. Ambil kredensial: **Project Settings → API** → salin *Project URL* dan *anon public key*.
4. Buka `js/config.js`, isi:
   ```js
   SUPABASE_URL: "https://xxxxx.supabase.co",
   SUPABASE_ANON_KEY: "eyJhbGciOi....",
   ```
5. (Disarankan untuk uji cepat) Project Settings → Authentication → Providers → Email:
   matikan **Confirm email**.
6. Daftar akun lewat aplikasi, lalu jadikan admin:
   ```sql
   update public.profiles
   set role = 'admin', is_verified = true
   where id = (select id from auth.users where email = 'emailkamu@mail.com');
   ```

### Keamanan (WAJIB dibaca)
- Hanya `anon public key` yang boleh ada di frontend. **JANGAN PERNAH** menaruh
  `service_role key` di `js/config.js` atau file frontend mana pun.
- Seluruh proteksi data ditegakkan sisi database lewat **RLS** (lihat bagian kebijakan
  di `sql/supabase_schema.sql`): pengguna tidak bisa mengubah status verifikasi
  pengajuannya sendiri, hanya admin yang bisa; log audit tidak bisa diubah pengguna.
- Data pribadi penerima (alamat lengkap, rekening, dokumen identitas) tidak pernah
  ditampilkan publik — hanya lewat view tersamar di halaman Transparansi.

## 3. Struktur Folder

```
saling-bantu/
├── index.html              Beranda (7 bagian sesuai spesifikasi)
├── masuk.html              Login
├── daftar.html             Registrasi (penerima / donatur / volunteer)
├── cari-bantuan.html       Cari & filter pengajuan (kategori + lokasi)
├── ajukan-bantuan.html     Formulir pengajuan bantuan + timeline status
├── ingin-membantu.html     Beri bantuan (5 jenis), jadi volunteer, komunitas
├── cerita-kebaikan.html    Cerita kebaikan + kirim cerita
├── transparansi.html       Laporan dana publik + privasi penerima
├── tentang.html            Tentang kami (5 tujuan, 5 nilai)
├── dashboard.html          Dashboard pengguna (8 menu)
├── admin.html              Panel admin (9 menu: Statistik, Realtime,
│                           Pengguna, Pengajuan, Donasi, Konten, Isi Website,
│                           Laporan, Pengaturan)
├── css/style.css           Design system (hijau, biru, putih, oranye)
├── js/config.js            Kredensial Supabase (isi di sini)
├── js/core.js              Util, ikon SVG, metadata (kategori/status/jenis)
├── js/konten.js            CMS "Isi Website" (definisi & penerapan teks)
├── js/store.js             Lapisan data: DemoBackend + SupabaseBackend
├── js/main.js              Header, footer, auth state, notifikasi lonceng
├── js/beranda.js …         Logika per halaman
├── sql/supabase_schema.sql Skema database lengkap (jalankan di SQL Editor)
└── sql/update_cms_realtime.sql  Pembaruan utk database lama (CMS + realtime)
```

## 4. Alur Utama Aplikasi

1. **Penerima** mendaftar → mengajukan bantuan (kategori, sub-kategori, foto/dokumen,
   lokasi) → status `Menunggu Verifikasi`.
2. **Admin** memverifikasi: `Dalam Proses Verifikasi → Terverifikasi → Dipublikasikan`
   (atau `Ditolak` dengan alasan). Setiap perubahan tercatat di `verification_logs`
   dan memicu notifikasi.
3. **Donatur/volunteer** menemukan pengajuan via Cari Bantuan → memberi bantuan
   (finansial / barang / tenaga / keahlian / jaringan) → menerima kuitansi digital.
4. Admin mengonfirmasi donasi → dana terkumpul naik → target tercapai memicu
   notifikasi → penyaluran dicatat (bukti distribusi) → laporan akhir dipublikasikan
   di halaman **Transparansi**.
5. Semua notifikasi (8 jenis + penolakan) muncul di lonceng & dashboard.

## 5. Hosting

Aplikasi ini statis — bisa di-hosting gratis di Netlify / Vercel / GitHub Pages /
Cloudflare Pages. Cukup unggah folder ini (tanpa folder `sql/` jika tidak ingin
terbaca publik), lalu isi `js/config.js` dengan kredensial Supabase Anda.

---

## 6. Catatan Pembaruan (v1.1)

Hasil uji menyeluruh seluruh halaman & alur (login, pengajuan, verifikasi admin,
donasi, kuitansi, notifikasi, dashboard, transparansi) pada 8 November 2026:

1. **Perbaikan — tombol "BANTU SEKARANG"** (`js/membantu.js`): sebelumnya, saat
   pengguna diarahkan dari kartu pengajuan dengan parameter `?request=ID`, ringkasan
   pengajuan tertimpa placeholder dan variabel pengajuan terpilih kosong sehingga
   tombol *Kirim Niat Baik Saya* menolak dengan pesan "Pilih pengajuan terlebih
   dahulu". Kini ringkasan langsung terisi dan donasi bisa dikirim begitu halaman
   terbuka.
2. **Perbaikan — tombol aksi pada "Pengajuan Saya"** (`js/dashboard.js`): tombol
   *Ucapan Terima Kasih* dan *Laporan Penggunaan* kini hanya tampil setelah
   pengajuan benar-benar menerima bantuan (status `Sedang Mendapat Bantuan`,
   `Bantuan Terpenuhi`, atau `Selesai`) — sesuai prinsip tidak menampilkan fitur
   penyaluran sebelum ada bukti.
3. **Perbaikan — grafik admin** (`js/admin.js`): label kategori pada diagram batang
   yang saling menimpa kini dipecah dua baris ("Kese-hatan", "Pendi-dikan",
   "Tenaga & Jasa"), dan skala sumbu Y menampilkan desimal (0,5 / 1,5) ketika
   nilai kecil, sehingga tidak lagi ada dua label angka kembar.
4. **Sudah diverifikasi berjalan lancar**: pendaftaran akun baru, pengajuan bantuan
   (kode otomatis SB-2026-XXXX), alur verifikasi admin 8 status, konfirmasi donasi
   yang otomatis mengangkat status pengajuan menjadi *Sedang Mendapat Bantuan*,
   kuitansi digital (KWT-YYYYMMDD-XXXXX) dengan tombol cetak, lonceng notifikasi,
   tab volunteer & komunitas, serta kontrol akses (pengguna non-admin ditolak di
   panel admin).

---

## 7. Catatan Pembaruan (v1.2)

1. **Perbaikan — error "perBulan is not defined"**: menu Statistik & Laporan admin
   gagal dimuat saat terhubung Supabase (`js/store.js`). Sudah diperbaiki; tabel
   Jejak Audit di Laporan kini juga menampilkan nama aktor, aksi, dan entitas
   dengan benar (sebelumnya `undefined`).
2. **Fitur baru — tombol Edit di setiap modul admin** (khusus admin/pengelola):
   - *Manajemen Pengguna*: edit nama, telepon, kota, bio, dan peran (peran akun
     sendiri dikunci untuk mencegah admin terkunci dari panel).
   - *Manajemen Pengajuan*: edit judul, kategori, sub-kategori, penerima, nominal
     kebutuhan, lokasi, kontak, deskripsi, dan tampil/tidaknya di halaman publik.
     Juga tersedia lewat modal Detail → tombol **Edit Data**.
   - *Manajemen Donasi*: edit nama donatur, anonim, jenis, nominal, rincian
     barang, pesan, dan status (di Mode Demo, perubahan nominal donasi finansial
     terkonfirmasi otomatis menyesuaikan dana terkumpul proyek).
   - *Manajemen Konten*: edit judul, kategori, dan isi cerita; edit judul
     pengumuman platform.
   Semua perubahan edit tercatat di jejak audit.
3. **Fitur baru — menu Pengaturan di panel admin**: kelola koneksi Supabase
   langsung dari aplikasi tanpa menyunting `js/config.js` — isi Project URL &
   anon public key, klik **Uji Koneksi** (memanggil `platform_stats()` untuk
   memverifikasi schema), lalu **Simpan & Terhubung** (tersimpan di
   `localStorage "sb_koneksi"`, berlaku di semua halaman). Tombol **Pakai Mode
   Demo** menghapus koneksi tersimpan. Konfigurasi tetap bisa diisi lewat
   `js/config.js` seperti sebelumnya; keduanya digabung otomatis.

---

## 8. Catatan Pembaruan (v1.3)

1. **Fitur baru — menu "Isi Website" (CMS, khusus admin/pengelola)**: admin kini
   dapat mengedit **seluruh teks publik website** tanpa menyentuh kode — 39 field
   dalam 7 grup:
   - *Identitas Aplikasi* (nama, tagline, email, WhatsApp),
   - *Hero Beranda* (lencana, judul, deskripsi, tombol, kartu kecil),
   - *Statistik Beranda* (5 angka + labelnya; data nyata platform ditambahkan
     otomatis di atas angka dasar),
   - *Judul Bagian Beranda* (bantuan terbaru, kategori, cerita),
   - *Ajakan Bergabung/CTA*, *Footer*, dan *Rekening Donasi*.
   Tersimpan di tabel `site_content` (Supabase) atau localStorage (Mode Demo);
   setelah **Simpan Semua Perubahan**, teks baru langsung tampil di semua halaman.
   Tiap grup punya tombol **Kembalikan Default**. Lapisan teknis ada di
   `js/konten.js` (`SB.KONTEN_DEF`, `SB.muatKonten`, `SB.teks`, `SB.terapkanKonten`);
   halaman memakai atribut `data-sb="kunci"` / `data-sb-hitung="kunci"`.
2. **Fitur baru — menu "Realtime" (dashboard website real-time)**: pemantauan
   langsung tanpa memuat ulang halaman — 6 KPI hidup (donasi & pengajuan hari ini,
   pengguna baru, antrean verifikasi/konfirmasi, total dana), feed aktivitas
   terbaru (donasi, pengajuan, aksi admin) dengan penanda **BARU** + animasi,
   grafik donasi 7 hari terakhir, daftar "menunggu tindakan", penghitung event,
   dan jam pembaruan. Di mode Supabase memakai kanal **Supabase Realtime**
   (`postgres_changes`, seluruh schema) sehingga setiap INSERT/UPDATE langsung
   tampil + notifikasi toast "Donasi baru masuk!"; di Mode Demo memakai pemantauan
   berkala tiap 5 detik + sinkronisasi antar-tab via `storage` event. Kanal
   otomatis dilepas saat pindah menu.
3. **Role baru "pengelola"**: setara admin untuk mengelola panel (ditambahkan ke
   enum `app_role`, dropdown peran, dan guard akses `admin.html`). Keamanan data
   ditegakkan RLS melalui fungsi `is_pengelola()`.
4. **Database — untuk database lama jalankan `sql/update_cms_realtime.sql`**
   (Supabase → SQL Editor → Run): menambah tabel `site_content` + RLS, value enum
   `pengelola`, fungsi `is_pengelola()`, dan mendaftarkan tabel utama ke
   publication `supabase_realtime`. Database baru cukup menjalankan
   `sql/supabase_schema.sql` (bagian 19 sudah termasuk).


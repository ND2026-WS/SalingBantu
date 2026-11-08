/* ============================================================
   SALING BANTU — store.js
   Lapisan data seragam untuk seluruh halaman.
   - SupabaseBackend : dipakai bila SB_CONFIG.SUPABASE_URL diisi
   - DemoBackend     : bila kosong — data di localStorage (Mode Demo)
   ============================================================ */
window.SB = window.SB || {};
(function () {
  "use strict";
  const S = SB;
  const cfg = window.SB_CONFIG || {};
  const MODE = cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY ? "supabase" : "demo";
  const LS_KEY = "saling_bantu_demo_v1";
  const LS_SESI = "saling_bantu_sesi_v1";
  const now = S.sekarang, uid = S.uid;

  /* ==========================================================
     BACKEND DEMO (localStorage)
     ========================================================== */
  function seed() {
    return {
      users: [
        { id: "u-admin", nama: "Tim Saling Bantu", email: "admin@salingbantu.id", sandi: "demo1234", telepon: "081200000001", peran: "admin", kota: "Jakarta", bio: "Pengelola platform Saling Bantu.", terverifikasi: true, aktif: true, dibuat: "2026-01-05T02:00:00.000Z" },
        { id: "u-ratna", nama: "Ibu Ratna Wulandari", email: "ratna@demo.id", sandi: "demo1234", telepon: "081200000002", peran: "penerima", kota: "Bandung", bio: "Ibu rumah tangga, pengasuh anak sakit kronis.", terverifikasi: true, aktif: true, dibuat: "2026-02-11T02:00:00.000Z" },
        { id: "u-budi", nama: "Budi Santoso", email: "budi@demo.id", sandi: "demo1234", telepon: "081200000003", peran: "donatur", kota: "Surabaya", bio: "Guru yang suka berbagi.", terverifikasi: true, aktif: true, dibuat: "2026-02-20T02:00:00.000Z" },
        { id: "u-nadia", nama: "Nadia Putri", email: "nadia@demo.id", sandi: "demo1234", telepon: "081200000004", peran: "volunteer", kota: "Yogyakarta", bio: "Mahasiswa, relawan kelas belajar.", terverifikasi: true, aktif: true, dibuat: "2026-03-02T02:00:00.000Z" }
      ],
      sesi: null,
      requests: [
        { id: "r-1", code: "SB-2026-0001", userId: "u-ratna", namaPenerima: "Ibu Ratna W.", kategori: "kesehatan", sub: "Biaya Pengobatan", judul: "Bantuan Biaya Pengobatan Anak dengan Penyakit Kronis", deskripsi: "Anak saya (7 tahun) terdiagnosis penyakit ginjal kronis dan harus rutin kontrol dua minggu sekali. Biaya obat dan dialisis jauh di luar kemampuan kami setelah suami terkena PHK. Bantuan apa pun sangat berarti untuk kelangsungan pengobatan anak kami.", kebutuhan: 15000000, terkumpul: 9250000, tersalur: 4000000, kota: "Bandung", provinsi: "Jawa Barat", kontak: "081200000002", foto: null, dokumen: null, status: "sedang_dibantu", alasanTolak: "", publik: true, tanggal: "2026-10-02T03:00:00.000Z", riwayat: [ { status: "menunggu_verifikasi", oleh: "Ibu Ratna W.", catatan: "Pengajuan dibuat", tanggal: "2026-10-02T03:00:00.000Z" }, { status: "dalam_verifikasi", oleh: "Tim Saling Bantu", catatan: "Verifikasi dokumen rumah sakit", tanggal: "2026-10-03T03:00:00.000Z" }, { status: "terverifikasi", oleh: "Tim Saling Bantu", catatan: "Surat keterangan RS valid", tanggal: "2026-10-04T03:00:00.000Z" }, { status: "dipublikasikan", oleh: "Tim Saling Bantu", catatan: "Dipublikasikan ke publik", tanggal: "2026-10-05T03:00:00.000Z" }, { status: "sedang_dibantu", oleh: "Tim Saling Bantu", catatan: "Donasi pertama masuk", tanggal: "2026-10-07T03:00:00.000Z" } ] },
        { id: "r-2", code: "SB-2026-0002", userId: "u-ratna", namaPenerima: "Hj. Aminah", kategori: "pendidikan", sub: "Beasiswa Pendidikan", judul: "Beasiswa Semester untuk Putri Rintisan Calon Guru", deskripsi: "Putri saya diterima di program studi pendidikan namun keluarga tidak sanggup membayar UKT semester ini. Ia bercita-cita kembali mengajar di kampung halaman. Mohon dukungan beasiswa untuk satu semester.", kebutuhan: 6000000, terkumpul: 2750000, tersalur: 0, kota: "Bandung", provinsi: "Jawa Barat", kontak: "081200000002", foto: null, dokumen: null, status: "dipublikasikan", alasanTolak: "", publik: true, tanggal: "2026-10-12T03:00:00.000Z", riwayat: [ { status: "menunggu_verifikasi", oleh: "Hj. Aminah", catatan: "Pengajuan dibuat", tanggal: "2026-10-12T03:00:00.000Z" }, { status: "dalam_verifikasi", oleh: "Tim Saling Bantu", catatan: "Cek surat kampus", tanggal: "2026-10-13T03:00:00.000Z" }, { status: "terverifikasi", oleh: "Tim Saling Bantu", catatan: "Data kampus valid", tanggal: "2026-10-14T03:00:00.000Z" }, { status: "dipublikasikan", oleh: "Tim Saling Bantu", catatan: "Dipublikasikan ke publik", tanggal: "2026-10-15T03:00:00.000Z" } ] },
        { id: "r-3", code: "SB-2026-0003", userId: "u-nadia", namaPenerima: "Warga RT 04 Cemarasekar", kategori: "sosial", sub: "Korban Bencana Alam", judul: "Darurat: 40 KK Terdampak Banjir Bandang", deskripsi: "Banjir bandang merendam permukiman kami dini hari. 40 keluarga kehilangan perabot dan stok makanan. Kami membutuhkan sembako, selimut, dan perlengkapan bayi untuk minggu-minggu pertama pemulihan.", kebutuhan: 20000000, terkumpul: 12100000, tersalur: 6500000, kota: "Bantul", provinsi: "DI Yogyakarta", kontak: "081200000004", foto: null, dokumen: null, status: "sedang_dibantu", alasanTolak: "", publik: true, tanggal: "2026-10-20T03:00:00.000Z", riwayat: [ { status: "menunggu_verifikasi", oleh: "Koordinator RT", catatan: "Pengajuan dibuat", tanggal: "2026-10-20T03:00:00.000Z" }, { status: "dalam_verifikasi", oleh: "Tim Saling Bantu", catatan: "Cek lapangan bersama relawan", tanggal: "2026-10-21T03:00:00.000Z" }, { status: "terverifikasi", oleh: "Tim Saling Bantu", catatan: "Terlaporkan valid 40 KK", tanggal: "2026-10-22T03:00:00.000Z" }, { status: "dipublikasikan", oleh: "Tim Saling Bantu", catatan: "Dipublikasikan ke publik", tanggal: "2026-10-22T06:00:00.000Z" }, { status: "sedang_dibantu", oleh: "Tim Saling Bantu", catatan: "Bantuan mulai mengalir", tanggal: "2026-10-23T03:00:00.000Z" } ] },
        { id: "r-4", code: "SB-2026-0004", userId: "u-budi", namaPenerima: "Panti Asuhan Harapan Ibu", kategori: "barang", sub: "Kebutuhan Bayi", judul: "Kebutuhan Perlengkapan Bayi & Anak Panti Asuhan", deskripsi: "Panti kami merawat 18 anak, 6 di antaranya balita. Kami membutuhkan diapers, susu formula, dan pakaian bayi ukuran 0-2 tahun untuk tiga bulan ke depan.", kebutuhan: 8000000, terkumpul: 2400000, tersalur: 1200000, kota: "Surabaya", provinsi: "Jawa Timur", kontak: "081200000003", foto: null, dokumen: null, status: "dipublikasikan", alasanTolak: "", publik: true, tanggal: "2026-10-26T03:00:00.000Z", riwayat: [ { status: "menunggu_verifikasi", oleh: "Pengasuh Panti", catatan: "Pengajuan dibuat", tanggal: "2026-10-26T03:00:00.000Z" }, { status: "dalam_verifikasi", oleh: "Tim Saling Bantu", catatan: "Survei panti", tanggal: "2026-10-27T03:00:00.000Z" }, { status: "terverifikasi", oleh: "Tim Saling Bantu", catatan: "Valid", tanggal: "2026-10-28T03:00:00.000Z" }, { status: "dipublikasikan", oleh: "Tim Saling Bantu", catatan: "Dipublikasikan ke publik", tanggal: "2026-10-29T03:00:00.000Z" } ] },
        { id: "r-5", code: "SB-2026-0005", userId: "u-budi", namaPenerima: "Warung Kopi Sederhana Pak Dedi", kategori: "usaha", sub: "Dukungan Modal UMKM", judul: "Modal Alat Seduh untuk UMKM Warung Kopi Korban Kebakaran", deskripsi: "Warung kecil Pak Dedi terbakar sebagian dan alat seduhnya rusak. Ia mencari nafkah untuk dua anak sejak istri sakit. Modal untuk mesin seduh dan stok awal akan membuat warungnya bangkit lagi.", kebutuhan: 12000000, terkumpul: 0, tersalur: 0, kota: "Surabaya", provinsi: "Jawa Timur", kontak: "081200000003", foto: null, dokumen: null, status: "terverifikasi", alasanTolak: "", publik: true, tanggal: "2026-11-01T03:00:00.000Z", riwayat: [ { status: "menunggu_verifikasi", oleh: "Pak Dedi", catatan: "Pengajuan dibuat", tanggal: "2026-11-01T03:00:00.000Z" }, { status: "dalam_verifikasi", oleh: "Tim Saling Bantu", catatan: "Verifikasi usaha", tanggal: "2026-11-02T03:00:00.000Z" }, { status: "terverifikasi", oleh: "Tim Saling Bantu", catatan: "Menunggu dipublikasikan", tanggal: "2026-11-03T03:00:00.000Z" } ] },
        { id: "r-6", code: "SB-2026-0006", userId: "u-ratna", namaPenerima: "Keluarga Pak Slamet", kategori: "tenaga_jasa", sub: "Perbaikan Rumah", judul: "Relawan Perbaikan Atap Rumah Lansia", deskripsi: "Rumah pak Slamet (78 tahun, tinggal sendiri) atapnya bocor di tiga titik. Kami membutuhkan relawan berpengalaman dan material ringan untuk perbaikan sebelum musim hujan puncak.", kebutuhan: 5000000, terkumpul: 5000000, tersalur: 5000000, kota: "Bandung", provinsi: "Jawa Barat", kontak: "081200000002", foto: null, dokumen: null, status: "selesai", alasanTolak: "", publik: true, tanggal: "2026-09-08T03:00:00.000Z", riwayat: [ { status: "menunggu_verifikasi", oleh: "Pengaju", catatan: "Pengajuan dibuat", tanggal: "2026-09-08T03:00:00.000Z" }, { status: "dalam_verifikasi", oleh: "Tim Saling Bantu", catatan: "Cek lokasi", tanggal: "2026-09-09T03:00:00.000Z" }, { status: "terverifikasi", oleh: "Tim Saling Bantu", catatan: "Valid", tanggal: "2026-09-10T03:00:00.000Z" }, { status: "dipublikasikan", oleh: "Tim Saling Bantu", catatan: "Dipublikasikan ke publik", tanggal: "2026-09-11T03:00:00.000Z" }, { status: "sedang_dibantu", oleh: "Tim Saling Bantu", catatan: "Relawan & material terkumpul", tanggal: "2026-09-15T03:00:00.000Z" }, { status: "bantuan_terpenuhi", oleh: "Tim Saling Bantu", catatan: "Target tercapai", tanggal: "2026-09-20T03:00:00.000Z" }, { status: "selesai", oleh: "Tim Saling Bantu", catatan: "Laporan akhir dipublikasikan", tanggal: "2026-10-01T03:00:00.000Z" } ] }
      ],
      donations: [
        { id: "d-1", kuitansi: "KWT-20261007-00001", requestId: "r-1", donorId: "u-budi", donorNama: "Budi Santoso", anonim: false, jenis: "finansial", jumlah: 1000000, barang: "", pesan: "Semoga lekas sembuh, Nak.", status: "terkonfirmasi", tanggal: "2026-10-07T03:00:00.000Z" },
        { id: "d-2", kuitansi: "KWT-20261016-00002", requestId: "r-2", donorId: "u-budi", donorNama: "Hamba Allah", anonim: true, jenis: "finansial", jumlah: 500000, barang: "", pesan: "Sukses untuk adik berprestasi.", status: "terkonfirmasi", tanggal: "2026-10-16T03:00:00.000Z" },
        { id: "d-3", kuitansi: "KWT-20261025-00003", requestId: "r-3", donorId: "u-budi", donorNama: "Budi Santoso", anonim: false, jenis: "barang", jumlah: 2500000, barang: "10 paket sembako + 20 selimut", pesan: "Titip doa untuk warga terdampak.", status: "terkonfirmasi", tanggal: "2026-10-25T03:00:00.000Z" },
        { id: "d-4", kuitansi: "KWT-20261105-00004", requestId: "r-1", donorId: "u-budi", donorNama: "Budi Santoso", anonim: false, jenis: "finansial", jumlah: 250000, barang: "", pesan: "Untuk biaya kontrol berikutnya.", status: "menunggu_konfirmasi", tanggal: "2026-11-05T03:00:00.000Z" }
      ],
      distributions: [
        { id: "x-1", requestId: "r-1", donationId: null, jenis: "finansial", jumlah: 4000000, barang: "", oleh: "Tim Saling Bantu", bukti: "", catatan: "Penyaluran biaya pengobatan tahap 1 (kwitansi RS terlampir di admin).", tanggal: "2026-10-28T03:00:00.000Z" },
        { id: "x-2", requestId: "r-6", donationId: null, jenis: "barang", jumlah: 5000000, barang: "Material atap + jasa 4 tukang", oleh: "Tim Saling Bantu", bukti: "", catatan: "Perbaikan atap selesai, didampingi 23 relawan warga.", tanggal: "2026-09-24T03:00:00.000Z" }
      ],
      volunteers: [
        { userId: "u-nadia", keahlian: ["Mengajar", "Organisasi Acara"], kota: "Yogyakarta", ketersediaan: "akhir_pekan", aktif: true, tanggal: "2026-03-02T02:00:00.000Z" }
      ],
      communities: [
        { id: "c-1", nama: "Sahabat Bandung Berbagi", slug: "sahabat-bandung-berbagi", deskripsi: "Komunitas warga Bandung: sembako bulanan, kelas belajar, aksi sosial.", kota: "Bandung", anggota: ["u-ratna"], dibuatOleh: "u-admin", tanggal: "2026-04-10T02:00:00.000Z" },
        { id: "c-2", nama: "Peduli Nusantara", slug: "peduli-nusantara", deskripsi: "Jejaring komunitas lintas kota untuk respons bencana & pendidikan desa.", kota: "Jakarta", anggota: [], dibuatOleh: "u-admin", tanggal: "2026-05-01T02:00:00.000Z" }
      ],
      events: [
        { id: "e-1", judul: "Bersih Pantai & Bagi 100 Paket Sembako", deskripsi: "Bersama relawan membersihkan pantai dan menyerahkan 100 paket sembako untuk warga nelayan prasejahtera.", jenis: "volunteer", kategori: "sosial", komunitas: "Peduli Nusantara", lokasi: "Pantai Cemara, Bantul, Yogyakarta", tanggal: "2026-11-20T07:00:00.000Z", kuota: 50, terdaftar: ["u-nadia"], status: "terjadwal", dibuatOleh: "u-admin" },
        { id: "e-2", judul: "Kelas Belajar Gratis Akhir Pekan", deskripsi: "Mengajar membaca, berhitung, dan bahasa Inggris dasar untuk anak-anak pesisir.", jenis: "volunteer", kategori: "pendidikan", komunitas: "Sahabat Bandung Berbagi", lokasi: "SDN 3 Cemarasekar", tanggal: "2026-11-16T08:00:00.000Z", kuota: 15, terdaftar: [], status: "terjadwal", dibuatOleh: "u-admin" },
        { id: "e-3", judul: "Donor Darah Bersama Komunitas", deskripsi: "Donor darah rutin tiga bulanan bersama bank darah setempat.", jenis: "komunitas", kategori: "kesehatan", komunitas: "Peduli Nusantara", lokasi: "Aula Kecamatan", tanggal: "2026-11-25T09:00:00.000Z", kuota: 100, terdaftar: [], status: "terjadwal", dibuatOleh: "u-admin" }
      ],
      stories: [
        { id: "s-1", penulisId: null, penulisNama: "Tim Saling Bantu", judul: "Dari Penerima Menjadi Pemberi", isi: "Dua tahun lalu Ibu Ratna menerima bantuan biaya pengobatan untuk anaknya melalui platform ini. Kini, setiap akhir pekan, ia menjadi relawan dapur bersama di komunitasnya. \u201cDulu saya yang dibantu. Sekali seumur hidup merasakan kebaikan orang, susah untuk tidak membantu balik,\u201d katanya sambil menyendok sup panas untuk warga.", kategori: "kesehatan", status: "disetujui", tanggal: "2026-10-30T02:00:00.000Z" },
        { id: "s-2", penulisId: null, penulisNama: "Tim Saling Bantu", judul: "Ketika 23 Warga Berpakat Memperbaiki Satu Rumah", isi: "Atap bocor Pak Hasan sudah dua musim hujan. Lewat fitur Bantuan Tenaga & Jasa, 23 warga dan 4 tukang berpakat datang di hari Minggu. Siangnya atap selesai, sorenya panggung rumah diganti. Yang paling mahal bukan bahannya, tapi jumlah tangan yang bersedia datang.", kategori: "tenaga_jasa", status: "disetujui", tanggal: "2026-10-24T02:00:00.000Z" },
        { id: "s-3", penulisId: null, penulisNama: "Tim Saling Bantu", judul: "Buku Bekas, Harapan Baru", isi: "Galeri tukar buku komunitas Peduli Nusantara mengumpulkan 1.240 buku dalam tiga minggu. Buku-buku itu kini mengisi perpustakaan mini di tiga desa. Anak-anak tidak hanya mendapat buku, tapi juga kakak pembimbing dari relawan guru yang mengajar setiap Sabtu.", kategori: "pendidikan", status: "disetujui", tanggal: "2026-10-18T02:00:00.000Z" }
      ],
      notifications: [
        { id: "n-1", userId: "u-admin", jenis: "pengajuan_diterima", judul: "Pengajuan baru masuk", pesan: "Pengajuan \u201cModal Alat Seduh UMKM\u201d (SB-2026-0005) menunggu verifikasi.", link: "admin.html#pengajuan", baca: false, tanggal: "2026-11-01T03:00:00.000Z" },
        { id: "n-2", userId: "u-admin", jenis: "donasi_tercatat", judul: "Donasi menunggu konfirmasi", pesan: "Donasi KWT-20261105-00004 menunggu verifikasi di modul Donasi.", link: "admin.html#donasi", baca: false, tanggal: "2026-11-05T03:00:00.000Z" },
        { id: "n-3", userId: "u-ratna", jenis: "bantuan_diterima", judul: "Kabar baik: bantuan mulai mengalir", pesan: "Pengajuan SB-2026-0001 sedang mendapat bantuan dari para sahabat bantu.", link: "dashboard.html#pengajuan", baca: false, tanggal: "2026-10-23T03:00:00.000Z" },
        { id: "n-4", userId: "u-ratna", jenis: "target_tercapai", judul: "Target tercapai!", pesan: "Kebutuhan pengajuan perbaikan atap telah terpenuhi.", link: "dashboard.html#pengajuan", baca: true, tanggal: "2026-09-20T03:00:00.000Z" },
        { id: "n-5", userId: "u-budi", jenis: "donasi_tercatat", judul: "Donasi terkonfirmasi", pesan: "Donasi Anda (KWT-20261007-00001) telah dikonfirmasi. Kuitansi tersedia.", link: "dashboard.html#donasi", baca: true, tanggal: "2026-10-07T03:00:00.000Z" },
        { id: "n-6", userId: "u-nadia", jenis: "kabar_volunteer", judul: "Pendaftaran kegiatan dikonfirmasi", pesan: "Anda terdaftar di kegiatan Bersih Pantai & Bagi 100 Paket Sembako.", link: "dashboard.html#volunteer", baca: false, tanggal: "2026-11-02T03:00:00.000Z" }
      ],
      logs: [],
      audit: [],
      lapor: [],
      counters: { req: 6, kuitansi: 4 }
    };
  }

  function loadDb() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* abaikan */ }
    const db = seed();
    saveDb(db);
    return db;
  }
  function saveDb(db) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(db)); } catch (e) { console.warn("Gagal simpan demo:", e); }
  }
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms || 120));

  function DemoBackend() {
    let db = loadDb();

    const userById = (id) => db.users.find((u) => u.id === id) || null;
    const me = () => (db.sesi ? userById(db.sesi) : null);
    const publikView = (r) => ({ ...r, kontak: undefined, userId: undefined });

    function notify(userId, jenis, judul, pesan, link) {
      db.notifications.unshift({ id: uid(), userId, jenis, judul, pesan, link: link || "", baca: false, tanggal: now() });
    }
    function notifyAdmins(jenis, judul, pesan, link) {
      db.users.filter((u) => u.peran === "admin").forEach((a) => notify(a.id, jenis, judul, pesan, link));
    }
    function logStatus(r, dari, ke, oleh, catatan) {
      db.logs.unshift({ id: uid(), requestId: r.id, dari, ke, oleh, catatan, tanggal: now() });
    }
    function terapkanDonasi(d) {
      const r = db.requests.find((x) => x.id === d.requestId);
      if (!r || d.jenis !== "finansial" || !(d.jumlah > 0)) return;
      r.terkumpul += d.jumlah;
      if (r.kebutuhan > 0 && r.terkumpul >= r.kebutuhan) {
        if (["dipublikasikan", "sedang_dibantu"].includes(r.status)) setStatus(r, "bantuan_terpenuhi", "Tim Saling Bantu", "Target tercapai otomatis");
        notify(r.userId, "target_tercapai", "Target tercapai!", "Kebutuhan pengajuanmu telah terpenuhi. Terima kasih para sahabat bantu!", "dashboard.html#pengajuan");
      }
    }
    function setStatus(r, baru, oleh, catatan) {
      const lama = r.status;
      r.status = baru;
      logStatus(r, lama, baru, oleh, catatan || "");
      const map = {
        dalam_verifikasi: ["verifikasi_dimulai", "Pengajuan sedang diverifikasi", "Tim kami sedang memverifikasi pengajuan " + r.code + ". Anda akan diberi kabar segera."],
        terverifikasi: ["pengajuan_disetujui", "Pengajuan terverifikasi", "Selamat! Pengajuan " + r.code + " telah lolos verifikasi.", "dashboard.html#pengajuan"],
        dipublikasikan: ["pengajuan_disetujui", "Pengajuan dipublikasikan", "Pengajuan " + r.code + " kini terlihat publik dan mulai menerima bantuan.", "dashboard.html#pengajuan"],
        sedang_dibantu: ["bantuan_diterima", "Kabar baik: bantuan mulai mengalir", "Pengajuan " + r.code + " sedang mendapat bantuan.", "dashboard.html#pengajuan"],
        bantuan_terpenuhi: ["bantuan_diterima", "Bantuan terpenuhi", "Kebutuhan pengajuan " + r.code + " telah terpenuhi. Terima kasih!", "dashboard.html#pengajuan"],
        selesai: ["laporan_dipublikasikan", "Laporan akhir dipublikasikan", "Laporan penggunaan bantuan " + r.code + " telah dipublikasikan di Transparansi.", "transparansi.html"],
        ditolak: ["pengajuan_ditolak", "Pengajuan ditolak", "Pengajuan " + r.code + " ditolak. Alasan: " + (catatan || "-"), "dashboard.html#pengajuan"]
      };
      const m = map[baru];
      if (m) notify(r.userId, m[0], m[1], m[2], m[3] || "dashboard.html#pengajuan");
      db.audit.unshift({ id: uid(), aktor: oleh, aksi: "update_status", entitas: "assistance_requests", entitasId: r.id, detail: { dari: lama, ke: baru }, tanggal: now() });
    }

    const api = {
      mode: "demo",
      /* ---------- AUTH ---------- */
      async currentUser() {
        await sleep(30);
        return me();
      },
      async signUp({ nama, email, telepon, sandi, peran }) {
        await sleep(200);
        if (db.users.some((u) => u.email.toLowerCase() === email.toLowerCase()))
          throw new Error("Email sudah terdaftar. Silakan masuk.");
        const u = { id: uid(), nama, email, sandi, telepon: telepon || "", peran: peran || "donatur", kota: "", bio: "", terverifikasi: false, aktif: true, dibuat: now() };
        db.users.push(u);
        db.sesi = u.id;
        notify(u.id, "pengajuan_diterima", "Selamat datang di Saling Bantu", "Akunmu berhasil dibuat. Ringankan beban, tebarkan kebaikan!", "index.html");
        saveDb(db);
        return u;
      },
      async signIn(email, sandi) {
        await sleep(200);
        const u = db.users.find((x) => x.email.toLowerCase() === String(email).toLowerCase());
        if (!u || u.sandi !== sandi) throw new Error("Email atau kata sandi salah.");
        if (!u.aktif) throw new Error("Akun dinonaktifkan. Hubungi admin.");
        db.sesi = u.id;
        saveDb(db);
        return u;
      },
      async signOut() { db.sesi = null; saveDb(db); },
      async gantiSandi(lama, baru) {
        const u = me(); if (!u) throw new Error("Belum masuk.");
        if (u.sandi !== lama) throw new Error("Kata sandi lama salah.");
        u.sandi = baru; saveDb(db);
      },
      onAuth(cb) { document.addEventListener("sb-auth", () => cb(me())); },

      /* ---------- PROFIL ---------- */
      async updateProfile(patch) {
        const u = me(); if (!u) throw new Error("Belum masuk.");
        ["nama", "telepon", "kota", "bio"].forEach((k) => { if (patch[k] != null) u[k] = patch[k]; });
        saveDb(db); return u;
      },
      async listUsers() { await sleep(80); return db.users.slice().sort((a, b) => (a.dibuat < b.dibuat ? 1 : -1)); },
      async setUserAktif(id, aktif) { const u = userById(id); if (u) u.aktif = aktif; saveDb(db); },
      async verifyUser(id, ok) { const u = userById(id); if (u) u.terverifikasi = ok; saveDb(db); },
      async setRole(id, peran) { const u = userById(id); if (u) u.peran = peran; saveDb(db); },

      /* ---------- PENGAJUAN ---------- */
      async listRequests(f) {
        await sleep(90);
        f = f || {};
        let arr = db.requests.slice();
        if (f.publikOnly) arr = arr.filter((r) => r.publik && ["dipublikasikan", "sedang_dibantu", "bantuan_terpenuhi", "selesai"].includes(r.status));
        if (f.userId) arr = arr.filter((r) => r.userId === f.userId);
        if (f.kategori) arr = arr.filter((r) => r.kategori === f.kategori);
        if (f.lokasi) arr = arr.filter((r) => (r.kota + " " + r.provinsi).toLowerCase().includes(f.lokasi.toLowerCase()));
        if (f.q) { const q = f.q.toLowerCase(); arr = arr.filter((r) => (r.judul + " " + r.deskripsi + " " + r.sub).toLowerCase().includes(q)); }
        if (f.status) arr = arr.filter((r) => r.status === f.status);
        return arr.sort((a, b) => (a.tanggal < b.tanggal ? 1 : -1));
      },
      async getRequest(id) {
        await sleep(60);
        const r = db.requests.find((x) => x.id === id);
        if (!r) throw new Error("Pengajuan tidak ditemukan.");
        return me() && me().peran === "admin" ? r : publikView(r);
      },
      async createRequest(data) {
        await sleep(250);
        const u = me(); if (!u) throw new Error("Harus masuk untuk mengajukan.");
        db.counters.req += 1;
        const r = {
          id: uid(), code: "SB-2026-" + String(db.counters.req).padStart(4, "0"),
          userId: u.id, namaPenerima: u.nama, kategori: data.kategori, sub: data.sub || "",
          judul: data.judul, deskripsi: data.deskripsi, kebutuhan: Number(data.kebutuhan) || 0,
          terkumpul: 0, tersalur: 0, kota: data.kota || "", provinsi: data.provinsi || "",
          kontak: data.kontak || u.telepon, foto: data.foto || null, dokumen: data.dokumen || null,
          status: "menunggu_verifikasi", alasanTolak: "", publik: true, tanggal: now(),
          riwayat: [{ status: "menunggu_verifikasi", oleh: u.nama, catatan: "Pengajuan dibuat", tanggal: now() }]
        };
        db.requests.unshift(r);
        notify(u.id, "pengajuan_diterima", "Pengajuan berhasil dikirim", "Pengajuan \"" + r.judul + "\" dengan kode " + r.code + " sedang menunggu verifikasi admin.", "dashboard.html#pengajuan");
        notifyAdmins("pengajuan_diterima", "Pengajuan baru masuk", "Pengajuan \"" + r.judul + "\" (" + r.code + ") menunggu verifikasi.", "admin.html#pengajuan");
        saveDb(db);
        return r;
      },
      async updateRequestStatus(id, baru, catatan) {
        await sleep(150);
        const r = db.requests.find((x) => x.id === id);
        if (!r) throw new Error("Pengajuan tidak ditemukan.");
        const u = me(); if (!u || u.peran !== "admin") throw new Error("Hanya admin yang dapat mengubah status.");
        setStatus(r, baru, u.nama, catatan);
        saveDb(db); return r;
      },

      /* ---------- DONASI ---------- */
      async createDonation(data) {
        await sleep(250);
        const u = me(); if (!u) throw new Error("Harus masuk untuk memberi bantuan.");
        db.counters.kuitansi += 1;
        const d = {
          id: uid(), kuitansi: "KWT-20261108-" + String(db.counters.kuitansi).padStart(5, "0"),
          requestId: data.requestId || null, donorId: u.id, donorNama: data.anonim ? "Hamba Allah" : u.nama,
          anonim: !!data.anonim, jenis: data.jenis, jumlah: Number(data.jumlah) || 0,
          barang: data.barang || "", pesan: data.pesan || "", status: "menunggu_konfirmasi", tanggal: now()
        };
        db.donations.unshift(d);
        if (d.requestId) {
          const r = db.requests.find((x) => x.id === d.requestId);
          if (r) notify(r.userId, "donasi_tercatat", "Ada niat baik untuk pengajuanmu", (d.anonim ? "Sahabat Bantu (anonim)" : d.donorNama) + " memberikan bantuan (" + d.jenis + ") untuk \"" + r.judul + "\".", "dashboard.html#pengajuan");
        }
        saveDb(db);
        return d;
      },
      async listDonations(f) {
        await sleep(90);
        f = f || {};
        let arr = db.donations.slice();
        if (f.donorId) arr = arr.filter((d) => d.donorId === f.donorId);
        if (f.requestId) arr = arr.filter((d) => d.requestId === f.requestId);
        if (f.status) arr = arr.filter((d) => d.status === f.status);
        return arr.sort((a, b) => (a.tanggal < b.tanggal ? 1 : -1));
      },
      async verifyDonation(id, ok, catatan) {
        await sleep(150);
        const d = db.donations.find((x) => x.id === id);
        if (!d) throw new Error("Donasi tidak ditemukan.");
        const u = me(); if (!u || u.peran !== "admin") throw new Error("Hanya admin.");
        d.status = ok ? "terkonfirmasi" : "ditolak";
        if (ok) terapkanDonasi(d);
        notify(d.donorId, "donasi_tercatat", ok ? "Donasi terkonfirmasi" : "Donasi ditolak", ok ? "Donasi Anda (" + d.kuitansi + ") telah dikonfirmasi. Kuitansi digital tersedia di Riwayat Donasi." : "Donasi " + d.kuitansi + " ditolak. " + (catatan || ""), "dashboard.html#donasi");
        saveDb(db); return d;
      },
      async createDistribution(data) {
        await sleep(180);
        const u = me(); if (!u || u.peran !== "admin") throw new Error("Hanya admin.");
        const x = { id: uid(), requestId: data.requestId, donationId: data.donationId || null, jenis: data.jenis, jumlah: Number(data.jumlah) || 0, barang: data.barang || "", oleh: u.nama, bukti: data.bukti || "", catatan: data.catatan || "", tanggal: now() };
        db.distributions.unshift(x);
        const r = db.requests.find((q) => q.id === data.requestId);
        if (r) {
          r.tersalur += x.jumlah;
          notify(r.userId, "bantuan_diterima", "Bantuan disalurkan", "Bantuan untuk pengajuan " + r.code + " telah disalurkan. Cek detail di dashboard.", "dashboard.html#pengajuan");
        }
        saveDb(db); return x;
      },
      async listDistributions() {
        await sleep(80);
        return db.distributions.slice().sort((a, b) => (a.tanggal < b.tanggal ? 1 : -1))
          .map((d) => {
            const r = db.requests.find((x) => x.id === d.requestId);
            return Object.assign({}, d, { kode: r ? r.code : "-" });
          });
      },

      /* ---------- VOLUNTEER & KEGIATAN & KOMUNITAS ---------- */
      async upsertVolunteer(data) {
        const u = me(); if (!u) throw new Error("Harus masuk.");
        let v = db.volunteers.find((x) => x.userId === u.id);
        if (!v) { v = { userId: u.id, keahlian: [], kota: "", ketersediaan: "akhir_pekan", aktif: true, tanggal: now() }; db.volunteers.push(v); }
        if (data.keahlian) v.keahlian = data.keahlian;
        if (data.kota != null) v.kota = data.kota;
        if (data.ketersediaan) v.ketersediaan = data.ketersediaan;
        saveDb(db); return v;
      },
      async getVolunteer(userId) { return db.volunteers.find((x) => x.userId === userId) || null; },
      async listEvents() { await sleep(80); return db.events.slice().sort((a, b) => (a.tanggal > b.tanggal ? 1 : -1)); },
      async createEvent(data) {
        const u = me(); if (!u) throw new Error("Harus masuk.");
        const e = { id: uid(), judul: data.judul, deskripsi: data.deskripsi || "", jenis: data.jenis || "volunteer", kategori: data.kategori || "", komunitas: data.komunitas || "", lokasi: data.lokasi || "", tanggal: data.tanggal, kuota: Number(data.kuota) || 0, terdaftar: [], status: "terjadwal", dibuatOleh: u.id };
        db.events.unshift(e);
        db.users.filter((x) => x.peran === "volunteer" && x.id !== u.id).forEach((v) => notify(v.id, "kabar_volunteer", "Kegiatan volunteer baru", e.judul + " \u2014 " + (e.lokasi || "loki menyusul") + ". Ayo ikut bergerak!", "ingin-membantu.html"));
        saveDb(db); return e;
      },
      async registerEvent(eventId) {
        const u = me(); if (!u) throw new Error("Harus masuk untuk mendaftar.");
        const e = db.events.find((x) => x.id === eventId);
        if (!e) throw new Error("Kegiatan tidak ditemukan.");
        if (e.terdaftar.includes(u.id)) throw new Error("Anda sudah terdaftar di kegiatan ini.");
        if (e.kuota > 0 && e.terdaftar.length >= e.kuota) throw new Error("Kuota kegiatan sudah penuh.");
        e.terdaftar.push(u.id);
        notify(u.id, "kabar_volunteer", "Pendaftaran kegiatan dikonfirmasi", "Anda terdaftar di kegiatan " + e.judul + ". Sampai jumpa!", "dashboard.html#volunteer");
        saveDb(db); return e;
      },
      async myRegistrations() {
        const u = me(); if (!u) return [];
        return db.events.filter((e) => e.terdaftar.includes(u.id));
      },
      async listCommunities() { await sleep(70); return db.communities.slice(); },
      async createCommunity(data) {
        const u = me(); if (!u) throw new Error("Harus masuk.");
        const c = { id: uid(), nama: data.nama, slug: data.nama.toLowerCase().replace(/[^a-z0-9]+/g, "-"), deskripsi: data.deskripsi || "", kota: data.kota || "", anggota: [u.id], dibuatOleh: u.id, tanggal: now() };
        db.communities.unshift(c); saveDb(db); return c;
      },
      async joinCommunity(id) {
        const u = me(); if (!u) throw new Error("Harus masuk.");
        const c = db.communities.find((x) => x.id === id);
        if (!c) throw new Error("Komunitas tidak ditemukan.");
        if (c.anggota.includes(u.id)) throw new Error("Sudah menjadi anggota.");
        c.anggota.push(u.id); saveDb(db); return c;
      },

      /* ---------- CERITA ---------- */
      async listStories(f) {
        await sleep(70);
        f = f || {};
        let arr = db.stories.slice();
        if (f.publikOnly) arr = arr.filter((s) => s.status === "disetujui");
        if (f.kategori) arr = arr.filter((s) => s.kategori === f.kategori);
        return arr.sort((a, b) => (a.tanggal < b.tanggal ? 1 : -1));
      },
      async createStory(data) {
        const u = me(); if (!u) throw new Error("Harus masuk.");
        const s = { id: uid(), penulisId: u.id, penulisNama: u.nama, judul: data.judul, isi: data.isi, kategori: data.kategori || "", status: "menunggu_review", tanggal: now() };
        db.stories.unshift(s);
        notifyAdmins("laporan_dipublikasikan", "Cerita baru menunggu review", "Cerita \"" + s.judul + "\" dikirim oleh " + u.nama + ".", "admin.html#konten");
        saveDb(db); return s;
      },
      async moderateStory(id, ok) {
        const s = db.stories.find((x) => x.id === id);
        if (s) { s.status = ok ? "disetujui" : "ditolak"; if (ok && s.penulisId) notify(s.penulisId, "laporan_dipublikasikan", "Cerita dipublikasikan", "Cerita \"" + s.judul + "\" telah tayang di halaman Cerita Kebaikan.", "cerita-kebaikan.html"); }
        saveDb(db); return s;
      },

      /* ---------- NOTIFIKASI ---------- */
      async myNotifications() {
        const u = me(); if (!u) return [];
        return db.notifications.filter((n) => n.userId === u.id).sort((a, b) => (a.tanggal < b.tanggal ? 1 : -1));
      },
      async unreadCount() { const u = me(); return u ? db.notifications.filter((n) => n.userId === u.id && !n.baca).length : 0; },
      async markRead(id) { const n = db.notifications.find((x) => x.id === id); if (n) n.baca = true; saveDb(db); },
      async markAllRead() { const u = me(); db.notifications.forEach((n) => { if (n.userId === u.id) n.baca = true; }); saveDb(db); },
      async notify(userId, jenis, judul, pesan, link) { notify(userId, jenis, judul, pesan, link); saveDb(db); },

      /* ---------- ADMIN ---------- */
      async adminStats() {
        await sleep(100);
        const hitungKategori = {};
        Object.keys(S.KATEGORI).forEach((k) => { hitungKategori[k] = db.requests.filter((r) => r.kategori === k).length; });
        const bulan = [];
        for (let i = 5; i >= 0; i--) {
          const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - i);
          const k = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
          bulan.push({ k, label: d.toLocaleDateString("id-ID", { month: "short" }), donasi: db.donations.filter((x) => x.tanggal.startsWith(k) && x.status !== "ditolak").reduce((a, b) => a + (b.jumlah || 0), 0) });
        }
        return {
          totalPengguna: db.users.length,
          totalPengajuan: db.requests.length,
          totalTersalur: db.requests.filter((r) => ["sedang_dibantu", "bantuan_terpenuhi", "selesai"].includes(r.status)).length,
          totalDanaTerkumpul: db.requests.reduce((a, b) => a + b.terkumpul, 0),
          totalDanaTersalur: db.requests.reduce((a, b) => a + b.tersalur, 0),
          totalVolunteer: db.volunteers.filter((v) => v.aktif).length,
          totalKomunitas: db.communities.length,
          donasiMenunggu: db.donations.filter((d) => d.status === "menunggu_konfirmasi").length,
          pengajuanMenunggu: db.requests.filter((r) => r.status === "menunggu_verifikasi").length,
          perKategori: hitungKategori,
          perBulan: bulan
        };
      },
      async listLogs(requestId) { return db.logs.filter((l) => !requestId || l.requestId === requestId); },
      async listAudit() { return db.audit.slice(0, 100); },
      async laporPenyalahgunaan(data) {
        db.lapor.unshift({ id: uid(), ...data, tanggal: now() });
        notifyAdmins("laporan_dipublikasikan", "Laporan penyalahgunaan", "Laporan baru dari " + (data.pelapor || "anonim") + ": " + data.isi.slice(0, 80), "admin.html#laporan");
        saveDb(db);
      },
      async platformStats() {
        const s = await api.adminStats();
        return { total_pengguna: s.totalPengguna, total_pengajuan: s.totalPengajuan, total_tersalur: s.totalTersalur, total_dana_terkumpul: s.totalDanaTerkumpul, total_dana_tersalur: s.totalDanaTersalur, total_volunteer: s.totalVolunteer, total_komunitas: s.totalKomunitas };
      },
      async resetDemo() { localStorage.removeItem(LS_KEY); localStorage.removeItem(LS_SESI); db = loadDb(); }
    };
    return api;
  }

  /* ==========================================================
     BACKEND SUPABASE
     ========================================================== */
  function SupabaseBackend() {
    const sb = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);

    async function meRow() {
      const { data: ses } = await sb.auth.getSession();
      const u = ses && ses.session && ses.session.user;
      if (!u) return null;
      const { data, error } = await sb.from("profiles").select("*").eq("id", u.id).single();
      if (error) return null;
      return { id: data.id, nama: data.full_name, email: u.email, telepon: data.phone, peran: data.role, kota: data.city, bio: data.bio, terverifikasi: data.is_verified, aktif: data.is_active, avatar_url: data.avatar_url };
    }
    function mapReq(r) {
      return { id: r.id, code: r.code, userId: r.user_id, namaPenerima: r.beneficiary_name || "Warga Bantu", kategori: r.category_code, sub: r.sub_category, judul: r.title, deskripsi: r.description, kebutuhan: Number(r.amount_needed), terkumpul: Number(r.funds_collected), tersalur: Number(r.funds_distributed), kota: r.city, provinsi: r.province, kontak: r.contact, foto: r.photo_url ? { url: r.photo_url } : null, dokumen: r.document_url ? { url: r.document_url } : null, status: r.status, alasanTolak: r.rejection_reason || "", publik: r.is_public, tanggal: r.created_at };
    }
    function mapDon(d) {
      return { id: d.id, kuitansi: d.receipt_number, requestId: d.request_id, donorId: d.donor_id, donorNama: d.donor_name, anonim: d.is_anonymous, jenis: d.type, jumlah: Number(d.amount), barang: d.item_description, pesan: d.message, status: d.status, tanggal: d.created_at };
    }

    return {
      mode: "supabase",
      async currentUser() { try { return await meRow(); } catch (e) { return null; } },
      async signUp({ nama, email, telepon, sandi, peran }) {
        const { data, error } = await sb.auth.signUp({
          email, password: sandi,
          options: { data: { full_name: nama, phone: telepon || "", role: peran || "donatur" } }
        });
        if (error) throw new Error(error.message);
        if (data && data.user && !data.session) throw new Error("Pendaftaran berhasil. Silakan cek email untuk konfirmasi, lalu masuk.");
        return meRow();
      },
      async signIn(email, sandi) {
        const { error } = await sb.auth.signInWithPassword({ email, password: sandi });
        if (error) throw new Error(error.message);
        const u = await meRow();
        if (u && !u.aktif) { await sb.auth.signOut(); throw new Error("Akun dinonaktifkan. Hubungi admin."); }
        return u;
      },
      async signOut() { await sb.auth.signOut(); },
      async gantiSandi(lama, baru) {
        const { data: ses } = await sb.auth.getSession();
        if (!ses.session) throw new Error("Masuk ulang dulu untuk mengganti sandi.");
        const { error } = await sb.auth.signInWithPassword({ email: ses.session.user.email, password: lama });
        if (error) throw new Error("Kata sandi lama salah.");
        const { error: e2 } = await sb.auth.updateUser({ password: baru });
        if (e2) throw new Error(e2.message);
      },
      onAuth(cb) { sb.auth.onAuthStateChange(() => cb(meRow())); },

      async updateProfile(patch) {
        const { data: ses } = await sb.auth.getSession();
        if (!ses.session) throw new Error("Belum masuk.");
        const p = {};
        if (patch.nama != null) p.full_name = patch.nama;
        if (patch.telepon != null) p.phone = patch.telepon;
        if (patch.kota != null) p.city = patch.kota;
        if (patch.bio != null) p.bio = patch.bio;
        const { error } = await sb.from("profiles").update(p).eq("id", ses.session.user.id);
        if (error) throw new Error(error.message);
        return meRow();
      },
      async listUsers() {
        const { data, error } = await sb.from("profiles").select("*").order("created_at", { ascending: false });
        if (error) throw new Error(error.message);
        return data.map((d) => ({ id: d.id, nama: d.full_name, email: "-", telepon: d.phone, peran: d.role, kota: d.city, terverifikasi: d.is_verified, aktif: d.is_active, dibuat: d.created_at }));
      },
      async setUserAktif(id, aktif) { const { error } = await sb.from("profiles").update({ is_active: aktif }).eq("id", id); if (error) throw new Error(error.message); },
      async verifyUser(id, ok) { const { error } = await sb.from("profiles").update({ is_verified: ok }).eq("id", id); if (error) throw new Error(error.message); },
      async setRole(id, peran) { const { error } = await sb.from("profiles").update({ role: peran }).eq("id", id); if (error) throw new Error(error.message); },

      async listRequests(f) {
        f = f || {};
        let q = sb.from("assistance_requests").select("*").order("created_at", { ascending: false });
        if (f.publikOnly) q = q.in("status", ["dipublikasikan", "sedang_dibantu", "bantuan_terpenuhi", "selesai"]).eq("is_public", true);
        if (f.userId) q = q.eq("user_id", f.userId);
        if (f.kategori) q = q.eq("category_code", f.kategori);
        if (f.lokasi) q = q.ilike("city", "%" + f.lokasi + "%");
        if (f.q) q = q.or("title.ilike.%" + f.q + "%,description.ilike.%" + f.q + "%");
        if (f.status) q = q.eq("status", f.status);
        const { data, error } = await q;
        if (error) throw new Error(error.message);
        return (data || []).map(mapReq);
      },
      async getRequest(id) {
        const { data, error } = await sb.from("assistance_requests").select("*").eq("id", id).single();
        if (error) throw new Error(error.message);
        return mapReq(data);
      },
      async createRequest(data) {
        const u = await meRow(); if (!u) throw new Error("Harus masuk untuk mengajukan.");
        const ins = {
          user_id: u.id, category_code: data.kategori, sub_category: data.sub || "",
          title: data.judul, description: data.deskripsi, amount_needed: Number(data.kebutuhan) || 0,
          city: data.kota || "", province: data.provinsi || "", contact: data.kontak || "",
          beneficiary_name: u.nama, is_public: true
        };
        const { data: row, error } = await sb.from("assistance_requests").insert(ins).select().single();
        if (error) throw new Error(error.message);
        // unggah lampiran bila ada
        if (data.foto && data.foto.file) {
          const path = u.id + "/" + row.id + "-foto";
          const { error: e2 } = await sb.storage.from("bukti-dokumen").upload(path, data.foto.file);
          if (!e2) await sb.from("assistance_requests").update({ photo_url: (cfg.SUPABASE_URL + "/storage/v1/object/public/bukti-dokumen/" + path) }).eq("id", row.id);
        }
        if (data.dokumen && data.dokumen.file) {
          const path = u.id + "/" + row.id + "-dokumen";
          const { error: e3 } = await sb.storage.from("bukti-dokumen").upload(path, data.dokumen.file);
          if (!e3) await sb.from("assistance_requests").update({ document_url: (cfg.SUPABASE_URL + "/storage/v1/object/public/bukti-dokumen/" + path) }).eq("id", row.id);
        }
        return mapReq(row);
      },
      async updateRequestStatus(id, baru, catatan) {
        const u = await meRow();
        if (!u || u.peran !== "admin") throw new Error("Hanya admin yang dapat mengubah status.");
        const { data, error } = await sb.from("assistance_requests").update({ status: baru, rejection_reason: catatan || null }).eq("id", id).select().single();
        if (error) throw new Error(error.message);
        return mapReq(data);
      },

      async createDonation(data) {
        const u = await meRow(); if (!u) throw new Error("Harus masuk untuk memberi bantuan.");
        const ins = { request_id: data.requestId || null, donor_id: u.id, donor_name: data.anonim ? "Hamba Allah" : u.nama, is_anonymous: !!data.anonim, type: data.jenis, amount: Number(data.jumlah) || 0, item_description: data.barang || "", message: data.pesan || "" };
        const { data: row, error } = await sb.from("donations").insert(ins).select().single();
        if (error) throw new Error(error.message);
        return mapDon(row);
      },
      async listDonations(f) {
        f = f || {};
        let q = sb.from("donations").select("*").order("created_at", { ascending: false });
        if (f.donorId) q = q.eq("donor_id", f.donorId);
        if (f.requestId) q = q.eq("request_id", f.requestId);
        const { data, error } = await q;
        if (error) throw new Error(error.message);
        return (data || []).map(mapDon);
      },
      async verifyDonation(id, ok, catatan) {
        const u = await meRow(); if (!u || u.peran !== "admin") throw new Error("Hanya admin.");
        const { data, error } = await sb.from("donations").update({ status: ok ? "terkonfirmasi" : "ditolak" }).eq("id", id).select().single();
        if (error) throw new Error(error.message);
        return mapDon(data);
      },
      async createDistribution(data) {
        const u = await meRow(); if (!u || u.peran !== "admin") throw new Error("Hanya admin.");
        const { data: row, error } = await sb.from("assistance_distributions").insert({ request_id: data.requestId, donation_id: data.donationId || null, type: data.jenis, amount: Number(data.jumlah) || 0, item_description: data.barang || "", note: data.catatan || "", distributed_by: u.id }).select().single();
        if (error) throw new Error(error.message);
        return row;
      },
      async listDistributions() {
        const { data, error } = await sb.from("v_penyaluran_publik").select("*").order("distributed_at", { ascending: false });
        if (error) return [];
        return data || [];
      },

      async upsertVolunteer(data) {
        const u = await meRow(); if (!u) throw new Error("Harus masuk.");
        const row = { user_id: u.id, skills: data.keahlian || [], city: data.kota || u.kota || "", availability: data.ketersediaan || "akhir_pekan" };
        const { error } = await sb.from("volunteers").upsert(row, { onConflict: "user_id" });
        if (error) throw new Error(error.message);
      },
      async getVolunteer() { const u = await meRow(); if (!u) return null; const { data } = await sb.from("volunteers").select("*").eq("user_id", u.id).maybeSingle(); return data; },
      async listEvents() {
        const { data, error } = await sb.from("social_events").select("*").order("event_date", { ascending: true });
        if (error) throw new Error(error.message);
        return (data || []).map((e) => ({ id: e.id, judul: e.title, deskripsi: e.description, jenis: e.event_type, kategori: e.category_code, lokasi: e.location, tanggal: e.event_date, kuota: e.quota, terdaftar: [], status: e.status }));
      },
      async createEvent(data) {
        const u = await meRow(); if (!u) throw new Error("Harus masuk.");
        const { error } = await sb.from("social_events").insert({ title: data.judul, description: data.deskripsi || "", event_type: data.jenis || "volunteer", category_code: data.kategori || null, location: data.lokasi || "", event_date: data.tanggal, quota: Number(data.kuota) || 0, created_by: u.id });
        if (error) throw new Error(error.message);
      },
      async registerEvent(eventId) {
        const u = await meRow(); if (!u) throw new Error("Harus masuk.");
        const { error } = await sb.from("event_registrations").insert({ event_id: eventId, user_id: u.id });
        if (error) throw new Error(error.message);
      },
      async myRegistrations() {
        const u = await meRow(); if (!u) return [];
        const { data } = await sb.from("event_registrations").select("event_id, social_events(*)").eq("user_id", u.id);
        return (data || []).filter((r) => r.social_events).map((r) => ({ id: r.social_events.id, judul: r.social_events.title, lokasi: r.social_events.location, tanggal: r.social_events.event_date }));
      },
      async listCommunities() {
        const { data, error } = await sb.from("communities").select("*").order("created_at", { ascending: false });
        if (error) throw new Error(error.message);
        return (data || []).map((c) => ({ id: c.id, nama: c.name, deskripsi: c.description, kota: c.city }));
      },
      async createCommunity(data) {
        const u = await meRow(); if (!u) throw new Error("Harus masuk.");
        const { error } = await sb.from("communities").insert({ name: data.nama, slug: data.nama.toLowerCase().replace(/[^a-z0-9]+/g, "-"), description: data.deskripsi || "", city: data.kota || "", created_by: u.id });
        if (error) throw new Error(error.message);
      },
      async joinCommunity(id) {
        const u = await meRow(); if (!u) throw new Error("Harus masuk.");
        const { error } = await sb.from("community_members").insert({ community_id: id, user_id: u.id });
        if (error) throw new Error(error.message);
      },

      async listStories(f) {
        f = f || {};
        let q = sb.from("stories").select("*").order("created_at", { ascending: false });
        if (f.publikOnly) q = q.eq("is_published", true);
        const { data, error } = await q;
        if (error) throw new Error(error.message);
        return (data || []).map((s) => ({ id: s.id, penulisNama: s.author_name, judul: s.title, isi: s.content, kategori: s.category_code, status: s.status, tanggal: s.created_at }));
      },
      async createStory(data) {
        const u = await meRow(); if (!u) throw new Error("Harus masuk.");
        const { error } = await sb.from("stories").insert({ author_id: u.id, author_name: u.nama, title: data.judul, content: data.isi, category_code: data.kategori || null });
        if (error) throw new Error(error.message);
      },
      async moderateStory(id, ok) {
        const u = await meRow(); if (!u || u.peran !== "admin") throw new Error("Hanya admin.");
        const { error } = await sb.from("stories").update({ status: ok ? "disetujui" : "ditolak", is_published: ok, reviewed_at: new Date().toISOString() }).eq("id", id);
        if (error) throw new Error(error.message);
      },

      async myNotifications() {
        const u = await meRow(); if (!u) return [];
        const { data } = await sb.from("notifications").select("*").eq("user_id", u.id).order("created_at", { ascending: false }).limit(60);
        return (data || []).map((n) => ({ id: n.id, jenis: n.type, judul: n.title, pesan: n.message, link: n.link, baca: n.is_read, tanggal: n.created_at }));
      },
      async unreadCount() {
        const u = await meRow(); if (!u) return 0;
        const { count } = await sb.from("notifications").select("*", { count: "exact", head: true }).eq("user_id", u.id).eq("is_read", false);
        return count || 0;
      },
      async markRead(id) { await sb.from("notifications").update({ is_read: true }).eq("id", id); },
      async markAllRead() { const u = await meRow(); if (u) await sb.from("notifications").update({ is_read: true }).eq("user_id", u.id); },
      async notify() { /* trigger sisi database yang mengirim notifikasi */ },

      async adminStats() {
        const { data, error } = await sb.rpc("platform_stats");
        if (error) throw new Error(error.message);
        const s = data || {};
        const [reqs, dons] = await Promise.all([sb.from("assistance_requests").select("category_code,status"), sb.from("donations").select("amount,status,created_at")]);
        const perKategori = {}; Object.keys(S.KATEGORI).forEach((k) => { perKategori[k] = (reqs.data || []).filter((r) => r.category_code === k).length; });
        const bulan = [];
        for (let i = 5; i >= 0; i--) {
          const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - i);
          const k = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
          bulan.push({ k, label: d.toLocaleDateString("id-ID", { month: "short" }), donasi: (dons.data || []).filter((x) => x.created_at && x.created_at.startsWith(k) && x.status !== "ditolak").reduce((a, b) => a + Number(b.amount || 0), 0) });
        }
        const jumlah = (f) => (dons.data || []).filter(f).reduce((a, b) => a + Number(b.amount || 0), 0);
        return {
          totalPengguna: s.total_pengguna || 0, totalPengajuan: s.total_pengajuan || 0,
          totalTersalur: s.total_tersalur || 0, totalDanaTerkumpul: s.total_dana_terkumpul || 0,
          totalDanaTersalur: s.total_dana_tersalur || 0, totalVolunteer: s.total_volunteer || 0,
          totalKomunitas: s.total_komunitas || 0,
          donasiMenunggu: (dons.data || []).filter((d) => d.status === "menunggu_konfirmasi").length,
          pengajuanMenunggu: (reqs.data || []).filter((r) => r.status === "menunggu_verifikasi").length,
          perKategori, perBulan: bulan
        };
      },
      async listLogs(requestId) {
        let q = sb.from("verification_logs").select("*").order("created_at", { ascending: false }).limit(100);
        if (requestId) q = q.eq("request_id", requestId);
        const { data } = await q; return data || [];
      },
      async listAudit() {
        const { data, error } = await sb.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(100);
        if (error) throw new Error(error.message);
        const rows = data || [];
        const ids = Array.from(new Set(rows.map((r) => r.actor_id).filter(Boolean)));
        const namaById = {};
        if (ids.length) {
          const { data: profs } = await sb.from("profiles").select("id,full_name").in("id", ids);
          (profs || []).forEach((p) => { namaById[p.id] = p.full_name; });
        }
        return rows.map((a) => ({ tanggal: a.created_at, aktor: namaById[a.actor_id] || "-", aksi: a.action, entitas: a.entity, entitasId: a.entity_id, detail: a.detail || {} }));
      },
      async laporPenyalahgunaan(data) {
        // tersimpan sebagai audit log oleh admin; di frontend demo saja
        SB.toast("Laporan terkirim. Terima kasih, kami akan menindaklanjuti.", "info");
      },
      async platformStats() {
        const { data, error } = await sb.rpc("platform_stats");
        if (error) throw new Error(error.message);
        return data;
      },
      async resetDemo() {}
    };
  }

  /* ---------- Pilih backend ---------- */
  let chosen;
  if (MODE === "supabase" && typeof window.supabase !== "undefined") {
    chosen = SupabaseBackend();
    console.info("[Saling Bantu] Terhubung ke Supabase:", cfg.SUPABASE_URL);
  } else {
    chosen = DemoBackend();
    if (MODE === "supabase") console.warn("[Saling Bantu] Pustaka supabase-js gagal dimuat; memakai Mode Demo.");
    else console.info("[Saling Bantu] Mode Demo aktif — isi js/config.js untuk koneksi Supabase.");
  }
  SB.store = chosen;
  SB.MODE = MODE;
})();

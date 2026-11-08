/* ============================================================
   SALING BANTU — admin.js
   6 modul: Statistik (grafik), Pengguna, Pengajuan (alur 8
   status), Donasi (verifikasi & penyaluran), Konten, Laporan
   ============================================================ */
(function () {
  "use strict";
  const S = SB;
  const mainEl = () => document.getElementById("dash-main");

  const MENU = [
    { id: "statistik", label: "Statistik", icon: "chart" },
    { id: "pengguna", label: "Manajemen Pengguna", icon: "users" },
    { id: "pengajuan", label: "Manajemen Pengajuan", icon: "file" },
    { id: "donasi", label: "Manajemen Donasi", icon: "credit" },
    { id: "konten", label: "Manajemen Konten", icon: "megaphone" },
    { id: "laporan", label: "Laporan", icon: "clipboard" }
  ];

  let user = null;
  let cache = { users: [], requests: [], donations: [] };

  function head(judul, sub, tombolHtml) {
    return '<div class="dash-head"><div><h2>' + judul + "</h2><p>" + sub + "</p></div>" + (tombolHtml || "") + "</div>";
  }

  /* ---------- Grafik canvas sederhana ---------- */
  function tickLabel(v) {
    return v < 4 && v > 0 && v % 1 !== 0 ? (Math.round(v * 10) / 10).toLocaleString("id-ID") : Math.round(v).toLocaleString("id-ID");
  }
  function drawBar(cv, labels, values, warna) {
    const dpr = window.devicePixelRatio || 1;
    const W = cv.clientWidth || 600, H = 240;
    cv.width = W * dpr; cv.height = H * dpr;
    const g = cv.getContext("2d");
    g.scale(dpr, dpr);
    g.clearRect(0, 0, W, H);
    const pad = { l: 44, r: 10, t: 14, b: 44 };
    const max = Math.max.apply(null, values.concat([1]));
    g.strokeStyle = "#e2e8f0"; g.fillStyle = "#94a3b8"; g.font = "10px Inter, sans-serif";
    for (let i = 0; i <= 4; i++) {
      const y = pad.t + (H - pad.t - pad.b) * (i / 4);
      g.beginPath(); g.moveTo(pad.l, y); g.lineTo(W - pad.r, y); g.stroke();
      g.fillText(tickLabel(max * (1 - i / 4)), 4, y + 3);
    }
    const bw = (W - pad.l - pad.r) / values.length;
    values.forEach((v, i) => {
      const h = (H - pad.t - pad.b) * (v / max);
      const x = pad.l + bw * i + bw * 0.18, y = H - pad.b - h;
      g.fillStyle = warna;
      g.beginPath();
      const r = Math.min(6, bw * 0.3);
      g.moveTo(x, H - pad.b);
      g.lineTo(x, y + r); g.quadraticCurveTo(x, y, x + r, y);
      g.lineTo(x + bw * 0.64 - r, y); g.quadraticCurveTo(x + bw * 0.64, y, x + bw * 0.64, y + r);
      g.lineTo(x + bw * 0.64, H - pad.b); g.closePath(); g.fill();
      g.fillStyle = "#64748b"; g.font = "10.5px Inter, sans-serif"; g.textAlign = "center";
      const cx = x + bw * 0.32, maxW = bw * 0.92;
      const lab = labels[i];
      if (Array.isArray(lab)) {
        g.fillText(lab[0], cx, H - pad.b + 15);
        g.fillText(lab[1], cx, H - pad.b + 27);
      } else if (g.measureText(lab).width <= maxW) {
        g.fillText(lab, cx, H - pad.b + 16);
      } else {
        const mid = Math.ceil(lab.length / 2);
        g.fillText(lab.slice(0, mid) + "-", cx, H - pad.b + 15);
        g.fillText(lab.slice(mid), cx, H - pad.b + 27);
      }
      g.textAlign = "left";
    });
  }

  function drawLine(cv, labels, values) {
    const dpr = window.devicePixelRatio || 1;
    const W = cv.clientWidth || 600, H = 240;
    cv.width = W * dpr; cv.height = H * dpr;
    const g = cv.getContext("2d");
    g.scale(dpr, dpr);
    g.clearRect(0, 0, W, H);
    const pad = { l: 52, r: 12, t: 16, b: 30 };
    const max = Math.max.apply(null, values.concat([1]));
    const px = (i) => pad.l + (W - pad.l - pad.r) * (values.length === 1 ? 0.5 : i / (values.length - 1));
    const py = (v) => H - pad.b - (H - pad.t - pad.b) * (v / max);
    g.strokeStyle = "#e2e8f0"; g.fillStyle = "#94a3b8"; g.font = "10px Inter, sans-serif";
    for (let i = 0; i <= 4; i++) {
      const y = pad.t + (H - pad.t - pad.b) * (i / 4);
      g.beginPath(); g.moveTo(pad.l, y); g.lineTo(W - pad.r, y); g.stroke();
      g.fillText(tickLabel(max * (1 - i / 4)), 6, y + 3);
    }
    g.strokeStyle = "#16a34a"; g.lineWidth = 2.5; g.beginPath();
    values.forEach((v, i) => { i ? g.lineTo(px(i), py(v)) : g.moveTo(px(i), py(v)); });
    g.stroke();
    g.fillStyle = "#16a34a";
    values.forEach((v, i) => {
      g.beginPath(); g.arc(px(i), py(v), 4, 0, 7); g.fill();
      g.fillStyle = "#64748b"; g.textAlign = "center";
      g.fillText(labels[i], px(i), H - pad.b + 16); g.textAlign = "left"; g.fillStyle = "#16a34a";
    });
  }

  /* ================= STATISTIK ================= */
  async function vStatistik() {
    const st = await S.store.adminStats();
    let html = head("Statistik Platform", "Gambaran umum aktivitas gotong royong hari ini.");
    html += '<div class="kpi-grid" style="grid-template-columns:repeat(4,1fr)">' +
      kpi("users", "var(--hijau)", st.totalPengguna, "Total pengguna") +
      kpi("file", "var(--biru)", st.totalPengajuan, "Total pengajuan") +
      kpi("gift", "var(--oranye)", st.totalTersalur, "Bantuan tersalur") +
      kpi("users", "var(--teal)", st.totalVolunteer, "Volunteer aktif") + "</div>";
    html += '<div class="kpi-grid" style="grid-template-columns:repeat(3,1fr)">' +
      kpi("credit", "var(--hijau)", S.rupiah(st.totalDanaTerkumpul), "Dana terkumpul") +
      kpi("tool", "var(--biru)", S.rupiah(st.totalDanaTersalur), "Dana tersalurkan") +
      kpi("users", "var(--ungu)", st.totalKomunitas, "Komunitas") + "</div>";
    html += '<div class="grid grid-2">' +
      '<div class="panel"><h3>Pengajuan per Kategori</h3><div class="chart-box"><canvas class="sb-chart" id="ch-kategori"></canvas></div></div>' +
      '<div class="panel"><h3>Donasi 6 Bulan Terakhir</h3><div class="chart-box"><canvas class="sb-chart" id="ch-bulan"></canvas></div></div>' +
      "</div>";
    mainEl().innerHTML = html;
    const labelsK = Object.keys(st.perKategori).map((k) => {
      const petaSingkat = { sosial: "Sosial", kesehatan: ["Kese-", "hatan"], pendidikan: ["Pendi-", "dikan"], tenaga_jasa: ["Tenaga &", "Jasa"], barang: "Barang", usaha: "Usaha" };
      return petaSingkat[k] || (S.KATEGORI[k] || {}).label || k;
    });
    const valsK = Object.values(st.perKategori);
    drawBar(document.getElementById("ch-kategori"), labelsK, valsK, "#2563eb");
    drawLine(document.getElementById("ch-bulan"), st.perBulan.map((b) => b.label), st.perBulan.map((b) => b.donasi));

    function kpi(ic, warna, nilai, label) {
      return '<div class="kpi"><span class="kpi-ic" style="background:' + warna + ';display:grid">' + S.icon(ic, 18) + "</span><b>" + nilai + "</b><span>" + label + "</span></div>";
    }
  }

  /* ================= PENGGUNA ================= */
  async function vPengguna() {
    cache.users = await S.store.listUsers();
    let html = head("Manajemen Pengguna", cache.users.length + " akun terdaftar");
    html += '<div class="table-wrap"><table class="sb"><thead><tr>' +
      "<th>Pengguna</th><th>Peran</th><th>Kota</th><th>Status</th><th>Aksi</th></tr></thead><tbody>" +
      cache.users.map((u) =>
        "<tr><td><div style='display:flex;gap:9px;align-items:center'>" + S.avatar(u.nama, 30) +
        "<div><b>" + S.esc(u.nama) + "</b><br><small style='color:var(--abu)'>" + S.esc(u.email) + "</small></div></div></td>" +
        '<td><select data-role="' + u.id + '" style="width:auto;padding:6px 10px;font-size:12.5px">' +
        ["admin", "penerima", "donatur", "volunteer"].map((r) => '<option value="' + r + '"' + (u.peran === r ? " selected" : "") + ">" + r + "</option>").join("") +
        "</select></td>" +
        "<td>" + S.esc(u.kota || "-") + "</td>" +
        "<td>" + (u.terverifikasi ? '<span class="badge st-hijau">Terverifikasi</span>' : '<span class="badge st-abu">Belum</span>') + " " +
        (u.aktif === false ? '<span class="badge st-merah">Nonaktif</span>' : "") + "</td>" +
        '<td><div class="td-actions">' +
        '<button class="btn btn-ghost" data-verif="' + u.id + '">' + (u.terverifikasi ? "Batal Verif." : "Verifikasi") + "</button>" +
        '<button class="btn btn-ghost" data-aktif="' + u.id + '">' + (u.aktif === false ? "Aktifkan" : "Nonaktifkan") + "</button>" +
        "</div></td></tr>").join("") +
      "</tbody></table></div>";
    mainEl().innerHTML = html;

    mainEl().querySelectorAll("[data-role]").forEach((sel) =>
      sel.addEventListener("change", async () => {
        try { await S.store.setRole(sel.dataset.role, sel.value); S.toast("Peran diperbarui.", "sukses"); }
        catch (e) { S.toast(e.message, "gagal"); }
      }));
    mainEl().querySelectorAll("[data-verif]").forEach((b) =>
      b.addEventListener("click", async () => {
        const u = cache.users.find((x) => x.id === b.dataset.verif);
        try { await S.store.verifyUser(u.id, !u.terverifikasi); S.toast("Status verifikasi diperbarui.", "sukses"); vPengguna(); }
        catch (e) { S.toast(e.message, "gagal"); }
      }));
    mainEl().querySelectorAll("[data-aktif]").forEach((b) =>
      b.addEventListener("click", async () => {
        const u = cache.users.find((x) => x.id === b.dataset.aktif);
        if (!(await S.konfirmasi((u.aktif === false ? "Aktifkan" : "Nonaktifkan") + " akun " + u.nama + "?", "Ya"))) return;
        try { await S.store.setUserAktif(u.id, u.aktif === false); S.toast("Status akun diperbarui.", "sukses"); vPengguna(); }
        catch (e) { S.toast(e.message, "gagal"); }
      }));
  }

  /* ================= PENGAJUAN ================= */
  const ALUR = {
    menunggu_verifikasi: [["dalam_verifikasi", "Mulai Verifikasi", "biru"], ["ditolak", "Tolak", "merah"]],
    dalam_verifikasi: [["terverifikasi", "Setujui (Terverifikasi)", "hijau"], ["ditolak", "Tolak", "merah"]],
    terverifikasi: [["dipublikasikan", "Publikasikan", "hijau"], ["ditolak", "Tolak", "merah"]],
    dipublikasikan: [["sedang_dibantu", "Tandai Sedang Dibantu", "oranye"]],
    sedang_dibantu: [["bantuan_terpenuhi", "Bantuan Terpenuhi", "hijau"]],
    bantuan_terpenuhi: [["selesai", "Tandai Selesai", "hijau"]],
    selesai: [], ditolak: []
  };

  async function vPengajuan() {
    cache.requests = await S.store.listRequests({ publikOnly: false });
    let html = head("Manajemen Pengajuan", "Verifikasi, setujui, publikasikan, dan pantau pengajuan. Setiap perubahan tercatat di log verifikasi.");
    const badgeM = (st) => '<span class="badge st-abu">' + st + "</span>";
    html += '<div class="table-wrap"><table class="sb"><thead><tr>' +
      "<th>Kode</th><th>Pengajuan</th><th>Kategori</th><th>Status</th><th>Dana</th><th>Aksi</th></tr></thead><tbody>" +
      cache.requests.map((r) => {
        const tombol = (ALUR[r.status] || []).map(([st, label, warna]) =>
          '<button class="btn btn-' + (warna === "merah" ? "danger" : warna === "hijau" ? "primary" : "blue") + '" data-status="' + r.id + "|" + st + '">' + label + "</button>").join("");
        return "<tr><td><b>" + S.esc(r.code) + "</b></td>" +
          "<td style='max-width:230px'><b>" + S.esc(r.judul.slice(0, 52)) + "</b><br><small style='color:var(--abu)'>" + S.esc(r.namaPenerima) + " · " + S.tanggal(r.tanggal) + "</small></td>" +
          "<td>" + S.esc((S.KATEGORI[r.kategori] || {}).label || r.kategori) + "</td>" +
          "<td>" + S.badgeStatus(r.status) + "</td>" +
          "<td>" + S.rupiah(r.terkumpul) + "<br><small style='color:var(--abu)'>/" + S.rupiah(r.kebutuhan) + "</small></td>" +
          '<td><div class="td-actions"><button class="btn btn-ghost" data-detail="' + r.id + '">Detail</button>' + (tombol || '<span style="font-size:12px;color:var(--abu)">Selesai</span>') + "</div></td></tr>";
      }).join("") +
      "</tbody></table></div>";
    mainEl().innerHTML = html;

    mainEl().querySelectorAll("[data-detail]").forEach((b) =>
      b.addEventListener("click", () => modalAdminPengajuan(b.dataset.detail)));
    mainEl().querySelectorAll("[data-status]").forEach((b) =>
      b.addEventListener("click", () => {
        const [id, st] = b.dataset.status.split("|");
        ubahStatus(id, st);
      }));
  }

  function modalAdminPengajuan(id) {
    const r = cache.requests.find((x) => x.id === id);
    if (!r) return;
    S.modal({
      judul: r.code + " — " + r.judul,
      lebar: 640,
      isi:
        '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">' + S.badgeStatus(r.status) + S.badgeKategori(r.kategori) + "</div>" +
        '<dl class="kv">' +
        "<dt>Pengaju</dt><dd>" + S.esc(r.namaPenerima) + "</dd>" +
        "<dt>Sub-kategori</dt><dd>" + S.esc(r.sub) + "</dd>" +
        "<dt>Lokasi</dt><dd>" + S.esc(r.kota) + ", " + S.esc(r.provinsi) + "</dd>" +
        "<dt>Kontak</dt><dd>" + S.esc(r.kontak || "-") + " <small style='color:var(--abu)'>(rahasia dari publik)</small></dd>" +
        "<dt>Kebutuhan</dt><dd>" + S.rupiah(r.kebutuhan) + "</dd>" +
        "<dt>Lampiran</dt><dd>" + (r.foto || r.dokumen ? "Ada (foto/dokumen)" : "Tidak ada") + "</dd></dl>" +
        "<p style='font-size:13.5px;margin-top:12px;color:#334155'>" + S.esc(r.deskripsi) + "</p>" +
        '<div style="margin-top:14px">' + S.timeline(r.status) + "</div>",
      footer: '<button class="btn btn-ghost" onclick="SB.modalClose()">Tutup</button>'
    });
  }

  async function ubahStatus(id, statusBaru) {
    const r = cache.requests.find((x) => x.id === id);
    if (!r) return;
    let catatan = "";
    if (statusBaru === "ditolak") {
      catatan = prompt("Tulis alasan penolakan untuk " + r.code + ":") || "";
      if (!catatan) { S.toast("Alasan penolakan wajib diisi.", "gagal"); return; }
    } else {
      if (!(await S.konfirmasi("Ubah status " + r.code + " menjadi \"" + S.STATUS[statusBaru].label + "\"?", "Ya, ubah status"))) return;
    }
    try {
      await S.store.updateRequestStatus(id, statusBaru, catatan);
      S.toast("Status " + r.code + " diubah menjadi " + S.STATUS[statusBaru].label + ".", "sukses");
      SB.refreshNotif && SB.refreshNotif();
      vPengajuan();
    } catch (e) { S.toast(e.message, "gagal"); }
  }

  /* ================= DONASI ================= */
  async function vDonasi() {
    const [dons, dists] = await Promise.all([
      S.store.listDonations({ publikOnly: false }),
      S.store.listDistributions().catch(() => [])
    ]);
    cache.donations = dons;
    const menunggu = dons.filter((d) => d.status === "menunggu_konfirmasi");
    let html = head("Manajemen Donasi", "Konfirmasi pembayaran (sesuai mutasi rekening) dan catat penyaluran dengan bukti.");
    html += '<div class="alert ' + (menunggu.length ? "alert-warn" : "alert-info") + '">' + S.icon("clock", 16) +
      "<span><b>" + menunggu.length + "</b> donasi menunggu konfirmasi. Konfirmasi hanya setelah transfer terbaca di rekening bersama.</span></div>";

    html += '<div class="panel"><h3>Daftar Donasi</h3><div class="table-wrap"><table class="sb"><thead><tr>' +
      "<th>Kuitansi</th><th>Donatur</th><th>Jenis</th><th>Nominal/Rincian</th><th>Status</th><th>Aksi</th></tr></thead><tbody>" +
      (dons.length ? dons.map((d) => {
        const jn = S.JENIS_BANTUAN[d.jenis] || { label: d.jenis };
        return "<tr><td><b>" + S.esc(d.kuitansi) + "</b><br><small style='color:var(--abu)'>" + S.tanggal(d.tanggal) + "</small></td>" +
          "<td>" + S.esc(d.donorNama) + (d.anonim ? " <small style='color:var(--abu)'>(anonim)</small>" : "") + "</td>" +
          "<td>" + jn.label + "</td>" +
          "<td>" + (d.jenis === "finansial" ? "<b>" + S.rupiah(d.jumlah) + "</b>" : S.esc(d.barang || "-")) + "</td>" +
          "<td>" + (d.status === "terkonfirmasi" ? '<span class="badge st-hijau">Terkonfirmasi</span>' : d.status === "ditolak" ? '<span class="badge st-merah">Ditolak</span>' : '<span class="badge st-abu">Menunggu</span>') + "</td>" +
          '<td><div class="td-actions">' +
          (d.status === "menunggu_konfirmasi"
            ? '<button class="btn btn-primary" data-verdon="' + d.id + '|1">Konfirmasi</button><button class="btn btn-danger" data-verdon="' + d.id + '|0">Tolak</button>'
            : "-") +
          "</div></td></tr>";
      }).join("") : '<tr><td colspan="6" style="color:var(--abu)">Belum ada donasi.</td></tr>') +
      "</tbody></table></div></div>";

    html += '<div class="panel"><h3>Catat Penyaluran Bantuan</h3>' +
      '<p style="font-size:13px;color:var(--abu);margin-bottom:12px">Penyaluran menambah angka "dana tersalurkan" pada proyek terkait dan otomatis memberi notifikasi ke penerima.</p>' +
      '<form id="form-dist" class="form-row" style="align-items:end">' +
      '<div class="field"><label>Proyek</label><select id="dist-req" required>' +
      cache.requests.filter((r) => ["dipublikasikan", "sedang_dibantu", "bantuan_terpenuhi"].includes(r.status))
        .map((r) => '<option value="' + r.id + '">' + S.esc(r.code + " — " + r.judul.slice(0, 42)) + "</option>").join("") +
      "</select></div>" +
      '<div class="field"><label>Jenis</label><select id="dist-jenis">' +
      Object.entries(S.JENIS_BANTUAN).map(([k, m]) => '<option value="' + k + '">' + m.label + "</option>").join("") +
      "</select></div>" +
      '<div class="field"><label>Nominal (Rp)</label><input type="number" id="dist-jumlah" min="0" step="10000" placeholder="0"/></div>' +
      '<div class="field" style="grid-column:1/-1"><label>Catatan / Bukti Penyaluran <span class="req-star">*</span></label><input type="text" id="dist-catatan" placeholder="Contoh: Penyaluran tahap 1 via transfer ke RS, kwitansi tersimpan"/></div>' +
      '<div class="field"><button class="btn btn-primary" type="submit">Catat Penyaluran</button></div>' +
      "</form>" +
      '<div class="table-wrap" style="margin-top:14px"><table class="sb"><thead><tr><th>Tanggal</th><th>Proyek</th><th>Jenis</th><th>Nominal</th><th>Catatan</th></tr></thead><tbody>' +
      (dists.length ? dists.map((d) =>
        "<tr><td>" + S.tanggal(d.tanggal || d.distributed_at) + "</td><td><b>" + S.esc(d.kode || d.code || "-") + "</b></td>" +
        "<td>" + S.esc((S.JENIS_BANTUAN[d.jenis || d.type] || {}).label || "-") + "</td>" +
        "<td>" + S.rupiah(d.jumlah || d.amount || 0) + "</td>" +
        "<td style='max-width:240px;font-size:12.5px;color:var(--abu)'>" + S.esc(d.catatan || d.note || "") + "</td></tr>").join("")
        : '<tr><td colspan="5" style="color:var(--abu)">Belum ada penyaluran.</td></tr>') +
      "</tbody></table></div></div>";
    mainEl().innerHTML = html;

    mainEl().querySelectorAll("[data-verdon]").forEach((b) =>
      b.addEventListener("click", async () => {
        const [id, ok] = b.dataset.verdon.split("|");
        const d = cache.donations.find((x) => x.id === id);
        if (ok === "1") {
          if (!(await S.konfirmasi("Konfirmasi donasi " + d.kuitansi + " (" + S.rupiah(d.jumlah) + ")? Pastikan mutasi sudah terbaca.", "Ya, konfirmasi"))) return;
          await S.store.verifyDonation(id, true);
          S.toast("Donasi dikonfirmasi. Dana masuk ke proyek.", "sukses");
        } else {
          await S.store.verifyDonation(id, false);
          S.toast("Donasi ditolak.", "info");
        }
        SB.refreshNotif && SB.refreshNotif();
        vDonasi();
      }));

    document.getElementById("form-dist").addEventListener("submit", async (e) => {
      e.preventDefault();
      const requestId = document.getElementById("dist-req").value;
      if (!requestId) { S.toast("Belum ada proyek aktif untuk disalurkan.", "gagal"); return; }
      try {
        await S.store.createDistribution({
          requestId, jenis: document.getElementById("dist-jenis").value,
          jumlah: Number(document.getElementById("dist-jumlah").value) || 0,
          catatan: document.getElementById("dist-catatan").value.trim()
        });
        S.toast("Penyaluran tercatat.", "sukses");
        vDonasi();
      } catch (e2) { S.toast(e2.message, "gagal"); }
    });
  }

  /* ================= KONTEN ================= */
  async function vKonten() {
    const stories = await S.store.listStories({ publikOnly: false });
    let html = head("Manajemen Konten", "Moderasi cerita, kelola pengumuman, dan pantau banner kecil.");
    html += '<div class="panel"><h3>Moderasi Cerita (' + stories.length + ")</h3>" +
      '<div class="table-wrap"><table class="sb"><thead><tr><th>Judul</th><th>Penulis</th><th>Status</th><th>Aksi</th></tr></thead><tbody>' +
      stories.map((s) =>
        "<tr><td style='max-width:280px'><b>" + S.esc(s.judul) + "</b><br><small style='color:var(--abu)'>" + S.esc(s.isi.slice(0, 80)) + "...</small></td>" +
        "<td>" + S.esc(s.penulisNama) + "</td>" +
        "<td>" + (s.status === "disetujui" ? '<span class="badge st-hijau">Disetujui</span>' : s.status === "ditolak" ? '<span class="badge st-merah">Ditolak</span>' : '<span class="badge st-oranye">Menunggu Review</span>') + "</td>" +
        '<td><div class="td-actions">' +
        (s.status !== "disetujui" ? '<button class="btn btn-primary" data-mod="' + s.id + '|1">Setujui</button>' : "") +
        (s.status !== "ditolak" ? '<button class="btn btn-danger" data-mod="' + s.id + '|0">Tolak</button>' : "") +
        "</div></td></tr>").join("") +
      "</tbody></table></div></div>";

    html += '<div class="panel"><h3>Pengumuman Platform</h3>' +
      '<div id="daftar-pengumuman"></div>' +
      '<form id="form-pengumuman" class="form-row" style="align-items:end;margin-top:12px">' +
      '<div class="field"><label>Judul Pengumuman</label><input type="text" id="an-judul" placeholder="Contoh: Jadwal maintenance minggu ini"/></div>' +
      '<div class="field"><button class="btn btn-blue" type="submit">Terbitkan Pengumuman</button></div>' +
      "</form></div>";

    mainEl().innerHTML = html;
    renderPengumuman();

    mainEl().querySelectorAll("[data-mod]").forEach((b) =>
      b.addEventListener("click", async () => {
        const [id, ok] = b.dataset.mod.split("|");
        try { await S.store.moderateStory(id, ok === "1"); S.toast("Status cerita diperbarui.", "sukses"); vKonten(); }
        catch (e) { S.toast(e.message, "gagal"); }
      }));

    document.getElementById("form-pengumuman").addEventListener("submit", (e) => {
      e.preventDefault();
      const judul = document.getElementById("an-judul").value.trim();
      if (judul.length < 5) { S.toast("Judul pengumuman terlalu pendek.", "gagal"); return; }
      const arr = bacaPengumuman();
      arr.unshift({ judul, tanggal: new Date().toISOString() });
      localStorage.setItem("sb_pengumuman", JSON.stringify(arr));
      S.toast("Pengumuman diterbitkan.", "sukses");
      document.getElementById("an-judul").value = "";
      renderPengumuman();
    });

    function renderPengumuman() {
      const arr = bacaPengumuman();
      document.getElementById("daftar-pengumuman").innerHTML = arr.length
        ? arr.map((a, i) =>
          '<div class="notif-row"><span class="notif-ic">' + S.icon("megaphone", 15) + "</span>" +
          "<div style='flex:1'><b>" + S.esc(a.judul) + "</b><p>" + S.tanggalWaktu(a.tanggal) + "</p></div>" +
          '<button class="btn btn-ghost btn-sm" data-hapus-an="' + i + '">' + S.icon("x", 12) + "</button></div>").join("")
        : '<p style="font-size:13px;color:var(--abu)">Belum ada pengumuman.</p>';
      document.querySelectorAll("[data-hapus-an]").forEach((b) =>
        b.addEventListener("click", () => {
          const arr = bacaPengumuman();
          arr.splice(Number(b.dataset.hapusAn), 1);
          localStorage.setItem("sb_pengumuman", JSON.stringify(arr));
          renderPengumuman();
        }));
    }
    function bacaPengumuman() {
      try { return JSON.parse(localStorage.getItem("sb_pengumuman") || "[]"); } catch (e) { return []; }
    }
  }

  /* ================= LAPORAN ================= */
  async function vLaporan() {
    const st = await S.store.adminStats();
    const audit = await S.store.listAudit().catch(() => []);
    let html = head("Laporan", "Ringkasan periode berjalan + jejak audit aktivitas admin.");
    html += '<div class="panel"><h3>Ringkasan per Kategori</h3><div class="table-wrap"><table class="sb"><thead><tr>' +
      "<th>Kategori</th><th>Jumlah Pengajuan</th><th>Porsi</th></tr></thead><tbody>" +
      Object.entries(st.perKategori).map(([k, v]) => {
        const total = Object.values(st.perKategori).reduce((a, b) => a + b, 0) || 1;
        return "<tr><td><b>" + S.esc((S.KATEGORI[k] || {}).label || k) + "</b></td><td>" + v + "</td>" +
          "<td style='min-width:180px'>" + Math.round((v / total) * 100) + "%" + S.progress(v, total) + "</td></tr>";
      }).join("") +
      "</tbody></table></div>" +
      '<div class="more-link" style="text-align:left;margin-top:14px">' +
      '<button class="btn btn-primary" id="btn-csv">' + S.icon("download", 15) + " Ekspor Data Pengajuan (CSV)</button></div></div>";

    html += '<div class="panel"><h3>Jejak Audit (100 terakhir)</h3><div class="table-wrap"><table class="sb"><thead><tr>' +
      "<th>Waktu</th><th>Aktor</th><th>Aksi</th><th>Entitas</th><th>Detail</th></tr></thead><tbody>" +
      (audit.length ? audit.map((a) =>
        "<tr><td>" + S.tanggalWaktu(a.tanggal || a.created_at) + "</td>" +
        "<td>" + S.esc(a.aktor || "-") + "</td>" +
        "<td>" + S.esc(a.aksi) + "</td>" +
        "<td>" + S.esc(a.entitas) + "</td>" +
        "<td style='max-width:240px;font-size:12px;color:var(--abu)'>" + S.esc(JSON.stringify(a.detail || {})).slice(0, 80) + "</td></tr>").join("")
        : '<tr><td colspan="5" style="color:var(--abu)">Belum ada aktivitas tercatat.</td></tr>') +
      "</tbody></table></div></div>";
    mainEl().innerHTML = html;

    document.getElementById("btn-csv").addEventListener("click", async () => {
      if (!cache.requests.length) { try { cache.requests = await S.store.listRequests({}); } catch (e) { /* pakai cache yang ada */ } }
      const rows = [["Kode", "Judul", "Kategori", "Sub", "Kota", "Status", "Kebutuhan", "Terkumpul", "Tersalur", "Tanggal"]];
      cache.requests.forEach((r) => rows.push([r.code, r.judul, r.kategori, r.sub, r.kota, r.status, r.kebutuhan, r.terkumpul, r.tersalur, r.tanggal]));
      const csv = rows.map((row) => row.map((c) => '"' + String(c == null ? "" : c).replace(/"/g, '""') + '"').join(";")).join("\n");
      const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "laporan-pengajuan-saling-bantu.csv";
      a.click();
      S.toast("CSV diunduh.", "sukses");
    });
  }

  /* ================= NAVIGASI ================= */
  function renderNav() {
    document.getElementById("dash-user").innerHTML =
      S.avatar(user.nama, 40) + "<div><b>" + S.esc(user.nama) + "</b><small>Panel Admin</small></div>";
    const aktif = (location.hash || "#statistik").slice(1);
    document.getElementById("dash-nav").innerHTML = MENU.map((m) =>
      '<a class="side-item' + (aktif === m.id ? " on" : "") + '" href="#' + m.id + '">' + S.icon(m.icon, 16) + " " + m.label + "</a>").join("");
  }

  async function renderSection() {
    const id = (location.hash || "#statistik").slice(1);
    renderNav();
    const el = mainEl();
    el.innerHTML = '<div class="empty" style="padding:70px 10px">Memuat modul...</div>';
    try {
      if (id === "pengguna") await vPengguna();
      else if (id === "pengajuan") await vPengajuan();
      else if (id === "donasi") await vDonasi();
      else if (id === "konten") await vKonten();
      else if (id === "laporan") await vLaporan();
      else await vStatistik();
    } catch (e) {
      el.innerHTML = '<div class="panel"><div class="alert alert-danger">' + S.icon("x", 16) + "<span>Gagal memuat modul: " + S.esc(e.message) + "</span></div></div>";
    }
  }

  document.addEventListener("DOMContentLoaded", async () => {
    user = await S.store.currentUser();
    if (!user) {
      S.toast("Silakan masuk sebagai admin.", "info");
      setTimeout(() => { location.href = "masuk.html?next=admin.html"; }, 800);
      return;
    }
    if (user.peran !== "admin") {
      mainEl().innerHTML = '<div class="panel"><div class="alert alert-danger">' + S.icon("shield", 16) +
        "<span><b>Akses ditolak.</b> Halaman ini hanya untuk admin. <a href='dashboard.html'>Kembali ke dashboard</a>.</span></div></div>";
      return;
    }
    renderNav();
    renderSection();
    window.addEventListener("hashchange", renderSection);
  });
})();

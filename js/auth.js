/* ============================================================
   SALING BANTU — auth.js (logika masuk & daftar)
   ============================================================ */
(function () {
  "use strict";
  const S = SB;
  const halaman = document.body.querySelector("#form-masuk") ? "masuk" : "daftar";
  const $ = (sel) => document.querySelector(sel);

  function tampilError(msg) {
    const box = $("#auth-err");
    box.textContent = msg;
    box.style.display = "flex";
  }
  function sembunyiError() { $("#auth-err").style.display = "none"; }

  function tandaiField(input, ok) {
    const f = input.closest(".field");
    if (f) f.classList.toggle("has-err", !ok);
    return ok;
  }
  function tujuan() {
    const next = S.param("next");
    return next ? next : "dashboard.html";
  }
  function alihkan(user) {
    S.toast("Halo, " + user.nama.split(" ")[0] + "! Berhasil masuk.", "sukses");
    setTimeout(() => {
      if (user.peran === "admin" && !S.param("next")) location.href = "admin.html";
      else location.href = tujuan();
    }, 700);
  }

  /* ---------- Halaman MASUK ---------- */
  if (halaman === "masuk") {
    if (SB.MODE === "demo") document.getElementById("demo-box").style.display = "block";

    document.querySelectorAll("[data-demo]").forEach((b) => {
      b.addEventListener("click", async () => {
        const email = b.dataset.demo;
        $("#m-email").value = email;
        $("#m-sandi").value = "demo1234";
        $("#form-masuk").requestSubmit();
      });
    });

    $("#form-masuk").addEventListener("submit", async (e) => {
      e.preventDefault();
      sembunyiError();
      const email = $("#m-email").value.trim();
      const sandi = $("#m-sandi").value;
      const okEmail = tandaiField($("#m-email"), /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
      const okSandi = tandaiField($("#m-sandi"), sandi.length > 0);
      if (!okEmail || !okSandi) return;

      const btn = $("#btn-masuk");
      btn.disabled = true; btn.textContent = "Memproses...";
      try {
        const user = await S.store.signIn(email, sandi);
        document.dispatchEvent(new CustomEvent("sb-auth"));
        alihkan(user);
      } catch (err) {
        tampilError(err.message || "Gagal masuk. Coba lagi.");
        btn.disabled = false; btn.textContent = "Masuk";
      }
    });
  }

  /* ---------- Halaman DAFTAR ---------- */
  else {
    let peranDipilih = "penerima";
    document.querySelectorAll("#peran-group .pill").forEach((p) => {
      p.addEventListener("click", () => {
        document.querySelectorAll("#peran-group .pill").forEach((x) => x.classList.remove("on"));
        p.classList.add("on");
        peranDipilih = p.dataset.peran;
      });
    });

    $("#form-daftar").addEventListener("submit", async (e) => {
      e.preventDefault();
      sembunyiError();
      const nama = $("#d-nama").value.trim();
      const email = $("#d-email").value.trim();
      const telp = $("#d-telp").value.trim();
      const sandi = $("#d-sandi").value;
      const sandi2 = $("#d-sandi2").value;
      const setuju = $("#d-setuju").checked;

      const okNama = tandaiField($("#d-nama"), nama.length >= 3);
      const okEmail = tandaiField($("#d-email"), /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
      const okTelp = tandaiField($("#d-telp"), telp.length >= 8);
      const okSandi = tandaiField($("#d-sandi"), sandi.length >= 8);
      const okSandi2 = tandaiField($("#d-sandi2"), sandi === sandi2 && sandi2.length > 0);
      if (!okNama || !okEmail || !okTelp || !okSandi || !okSandi2) return;
      if (!setuju) { tampilError("Centang persetujuan ketentuan layanan terlebih dahulu."); return; }

      const btn = $("#btn-daftar");
      btn.disabled = true; btn.textContent = "Membuat akun...";
      try {
        const user = await S.store.signUp({ nama, email, telepon: telp, sandi, peran: peranDipilih });
        S.toast("Akun berhasil dibuat. Selamat bergabung!", "sukses");
        setTimeout(() => {
          if (user && user.id) location.href = "dashboard.html";
          else location.href = "masuk.html";
        }, 900);
      } catch (err) {
        tampilError(err.message || "Gagal mendaftar.");
        btn.disabled = false; btn.textContent = "Buat Akun";
      }
    });
  }
})();

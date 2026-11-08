-- ============================================================
-- SALING BANTU — update_admin_program.sql
-- ------------------------------------------------------------
-- Fitur "Tambah Program / Pengajuan" di panel admin:
-- 1. Kebijakan RLS assistance_requests diperluas — selain admin,
--    peran PENGELOLA juga boleh membuat/mengelola pengajuan
--    (p_requests_admin kini memakai is_pengelola()).
-- 2. (Opsional) Tambahkan nilai status jika enum belum lengkap.
--
-- Jalankan di SQL Editor Supabase — aman dijalankan berulang.
-- Database baru tidak butuh file ini (sudah ada di supabase_schema.sql).
-- ============================================================

-- fungsi is_pengelola(): admin ATAU pengelola
create or replace function public.is_pengelola() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role::text in ('admin','pengelola') and is_active
  );
$$;

-- admin & pengelola full akses pada assistance_requests
drop policy if exists p_requests_admin on public.assistance_requests;
create policy p_requests_admin on public.assistance_requests for all to authenticated
  using (public.is_pengelola()) with check (public.is_pengelola());

-- catatan: pengguna biasa tetap hanya bisa mengajukan dengan status
-- 'menunggu_verifikasi' (kebijakan p_requests_insert tidak berubah).

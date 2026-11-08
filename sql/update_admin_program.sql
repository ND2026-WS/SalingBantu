-- ============================================================
-- SALING BANTU — update_admin_program.sql
-- ------------------------------------------------------------
-- Fitur "Tambah Program / Pengajuan" di panel admin:
-- 1. KOLOM BARU beneficiary_name pada assistance_requests — menyimpan
--    nama penerima/golongan (mis. "30 santri yatim") yang boleh berbeda
--    dari pemilik akun. TANPA KOLOM INI form Tambah Program dan form
--    Ajukan Bantuan akan gagal dengan error:
--    "Could not find the 'beneficiary_name' column ... in the schema cache".
-- 2. Kebijakan RLS assistance_requests diperluas — selain admin,
--    peran PENGELOLA juga boleh membuat/mengelola pengajuan
--    (p_requests_admin kini memakai is_pengelola()).
--
-- Jalankan di SQL Editor Supabase — aman dijalankan berulang.
-- Database baru tidak butuh file ini (sudah ada di supabase_schema.sql).
-- ============================================================

-- (1) kolom beneficiary_name — untuk database lama yang belum punya
alter table public.assistance_requests
  add column if not exists beneficiary_name text not null default '';

-- segarkan cache skema PostgREST agar kolom baru langsung dikenali
notify pgrst, 'reload schema';

-- (2) fungsi is_pengelola(): admin ATAU pengelola
create or replace function public.is_pengelola() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role::text in ('admin','pengelola') and is_active
  );
$$;

-- (3) admin & pengelola full akses pada assistance_requests
drop policy if exists p_requests_admin on public.assistance_requests;
create policy p_requests_admin on public.assistance_requests for all to authenticated
  using (public.is_pengelola()) with check (public.is_pengelola());

-- catatan: pengguna biasa tetap hanya bisa mengajukan dengan status
-- 'menunggu_verifikasi' (kebijakan p_requests_insert tidak berubah).

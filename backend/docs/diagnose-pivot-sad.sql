-- Jalankan pada database yang dipakai backend production.
-- Hanya membaca jumlah data; tidak menampilkan identitas karyawan.
BEGIN READ ONLY;
SET LOCAL statement_timeout = '20s';

SELECT current_database() AS database_name, current_schema() AS schema_name,
       current_setting('search_path') AS search_path;

SELECT
  (SELECT count(*) FROM public.prs_karyawan) AS total_karyawan,
  (SELECT count(*) FROM public.prs_unit_kerja_karyawan) AS total_penempatan,
  (SELECT count(*) FROM public.prs_bagian WHERE kode = 'SAD') AS bagian_sad_exact,
  (SELECT count(*) FROM public.prs_bagian WHERE upper(trim(kode)) = 'SAD')
    AS bagian_sad_normalized,
  (SELECT count(*) FROM public.prs_unit_kerja WHERE kode_bagian = 'SAD')
    AS unit_sad_exact,
  (SELECT count(*) FROM public.prs_unit_kerja WHERE upper(trim(kode_bagian)) = 'SAD')
    AS unit_sad_normalized;

SELECT
  count(*) AS penempatan_sad,
  count(*) FILTER (WHERE k.id_karyawan IS NULL) AS karyawan_tidak_ditemukan,
  count(*) FILTER (WHERE k.id_karyawan IS NOT NULL AND k.nik IS NULL)
    AS karyawan_nik_null,
  count(DISTINCT k.nik) FILTER (WHERE b.kode = 'SAD') AS nik_lolos_join_pivot
FROM public.prs_unit_kerja uk
JOIN public.prs_unit_kerja_karyawan ukk ON ukk.unit_kerja = uk.uk_id
LEFT JOIN public.prs_karyawan k ON k.id_karyawan = ukk.karyawan_id
LEFT JOIN public.prs_bagian b ON b.kode = uk.kode_bagian
WHERE uk.kode_bagian = 'SAD';

-- Periksa apakah definisi production berbeda dari snapshot migration.
SELECT n.nspname AS schema_name,
       pg_get_function_identity_arguments(p.oid) AS signature,
       md5(pg_get_functiondef(p.oid)) AS definition_hash
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE p.proname = 'get_absensi_pivot_bagian';

ROLLBACK;

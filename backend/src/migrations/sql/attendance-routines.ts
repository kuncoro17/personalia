// Snapshot pg_get_functiondef dari PostgreSQL; pertahankan signature dan body asli.
export const attendanceRoutines = [
  {
    signature: 'public.get_absensi_pivot(date, date)',
    sql: String.raw`CREATE OR REPLACE FUNCTION public.get_absensi_pivot(p_start date, p_end date)
 RETURNS SETOF record
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_sql TEXT;
BEGIN
    -- Buat daftar kolom pivot dinamis
    SELECT string_agg(
        format(
            'MAX(CASE WHEN kt.tanggal = %L THEN COALESCE(da.status, ''-'') END) AS "%s"',
            d::date,
            to_char(d::date, 'DD-Mon')
        ),
        ', '
        ORDER BY d
    )
    INTO v_sql
    FROM generate_series(p_start, p_end, interval '1 day') d;

    -- Susun query pivot dinamis
    v_sql := format($f$
        WITH semua_tanggal AS (
            SELECT generate_series(%L::date, %L::date, interval '1 day')::date AS tanggal
        ),
        karyawan_tanggal AS (
            SELECT k.nik, d.nama_div, b.nama_bag, d2.tanggal, k.nama_lengkap
            FROM prs_karyawan k
            JOIN prs_unit_kerja_karyawan ukk ON k.id_karyawan = ukk.karyawan_id
            LEFT JOIN prs_unit_kerja uk ON ukk.unit_kerja = uk.uk_id 
            LEFT JOIN prs_divisi d ON d.kode = uk.kode_divisi
            LEFT JOIN prs_bagian b ON b.kode = uk.kode_bagian
            CROSS JOIN semua_tanggal d2
        ),
        data_absensi AS (
            SELECT nik, tanggal, status, jenis
            FROM (
                -- Absensi hadir
                SELECT userid::varchar AS nik,
                       date(checktime) AS tanggal,
                       to_char(MIN(checktime), 'HH24:MI') || '-' || to_char(MAX(checktime), 'HH24:MI') AS status,
                       'HADIR' AS jenis
                FROM sdm_checkinout
                WHERE checktime BETWEEN %L AND %L
                GROUP BY userid, date(checktime)

                UNION ALL

                -- Cuti/Izin
                SELECT nik::varchar AS nik,
                       tgl_cuti AS tanggal,
                       regexp_replace(tipe, '^DLL:', '') AS status,
                       regexp_replace(tipe, '^DLL:', '') AS jenis
                FROM sdm_checkinout_cuti
                WHERE tgl_cuti BETWEEN %L AND %L
            ) sub
        )
        SELECT kt.nik,
               kt.nama_lengkap,
               kt.nama_div,
               kt.nama_bag,
               %s,
               COUNT(CASE WHEN da.jenis IN ('HADIR','LUPA') THEN 1 END) AS "total_hadir(HDR)",
               COUNT(CASE WHEN da.jenis = 'SKT' THEN 1 END) AS "total_sakit(SKT)",
               COUNT(CASE WHEN da.jenis = 'IZN' THEN 1 END) AS "total_izin(IZN)",
               COUNT(CASE WHEN da.jenis = 'EVN' THEN 1 END) AS "total_event(EVN)",
               COUNT(CASE WHEN da.jenis ='CTH' THEN 1 END) AS "total_cuti_tahunan(CTH)",
               COUNT(CASE WHEN da.jenis ='CKH' THEN 1 END) AS "total_cuti_hamil(CKH)",
               COUNT(CASE WHEN da.jenis ='IJF' THEN 1 END) AS "total_potong_gaji(IJF)",
               COUNT(CASE WHEN da.jenis ='IJS' THEN 1 END) AS "total_izin_setengah_hari(IJS)",
               COUNT(CASE WHEN da.jenis ='KCL' THEN 1 END) AS "total_izin_KCL(KCL)",
               COUNT(CASE WHEN da.jenis ='SKTCVD' THEN 1 END) AS "total_izin_covid(SKTCVD)",
               COUNT(CASE WHEN da.jenis ='TK' THEN 1 END) AS "total_izin_TK(TK)",
               COUNT(CASE WHEN da.jenis ='TRN' THEN 1 END) AS "total_izin_TRN(TRN)",
               COUNT(CASE WHEN da.jenis ='DNL' THEN 1 END) AS "total_izin_DNL(DNL)",
               COUNT(CASE WHEN da.status IS NOT NULL THEN 1 END) AS total_semua
        FROM karyawan_tanggal kt
        LEFT JOIN data_absensi da
               ON kt.nik = da.nik AND kt.tanggal = da.tanggal
        GROUP BY kt.nik, kt.nama_lengkap, kt.nama_div, kt.nama_bag
        ORDER BY kt.nik;
    $f$, p_start, p_end, p_start, p_end, p_start, p_end, v_sql);

    RETURN QUERY EXECUTE v_sql;
END;
$function$`,
  },

  {
    signature: 'public.get_absensi_pivot_1(date, date)',
    sql: String.raw`CREATE OR REPLACE PROCEDURE public.get_absensi_pivot_1(IN p_start date, IN p_end date)
 LANGUAGE plpgsql
AS $procedure$
DECLARE
    v_sql TEXT;
BEGIN
    -- Hapus temp table jika sudah ada
    DROP TABLE IF EXISTS tmp_absensi;

    -- 1. Buat daftar kolom pivot per tanggal
    SELECT string_agg(
        format(
            'MAX(CASE WHEN kt.tanggal = %L THEN COALESCE(da.status, ''-'') END) AS "%s"',
            d::date,
            to_char(d::date, 'DD-Mon')
        ),
        ', ' ORDER BY d
    )
    INTO v_sql
    FROM generate_series(p_start, p_end, interval '1 day') d;

    -- 2. Susun query
    v_sql := format($f$

        CREATE TEMP TABLE tmp_absensi AS

        WITH semua_tanggal AS (
            SELECT generate_series(%L::date, %L::date, interval '1 day')::date AS tanggal
        ),
        karyawan_tanggal AS (
            SELECT k.nik, d.tanggal, k.nama_lengkap
            FROM prs_karyawan k
            CROSS JOIN semua_tanggal d
        ),
        data_absensi AS (
            SELECT nik, tanggal, status, jenis
            FROM (
                SELECT
                    userid::varchar AS nik,
                    date(checktime) AS tanggal,
                    to_char(MIN(checktime),'HH24:MI') || '-' ||
                    to_char(MAX(checktime),'HH24:MI') AS status,
                    'HDR' AS jenis
                FROM sdm_checkinout
                WHERE checktime BETWEEN %L AND %L
                GROUP BY userid, date(checktime)

                UNION ALL

                SELECT
                    nik::varchar,
                    tgl_cuti,
                    regexp_replace(tipe,'^DLL:',''),
                    regexp_replace(tipe,'^DLL:','')
                FROM sdm_checkinout_cuti
                WHERE tgl_cuti BETWEEN %L AND %L
            ) sub
        )

        SELECT
            kt.nik,
            kt.nama_lengkap,
            d.nama_div,
            b.kode AS kode_bagian,
            b.nama_bag,

            %s,

            COUNT(DISTINCT CASE
                WHEN da.jenis='HDR'
                 AND (da.status IS NULL
                      OR da.status !~ '^[0-9]{2}:[0-9]{2}-[0-9]{2}:[0-9]{2}$')
                THEN kt.tanggal
            END) AS "total_hadir(HDR)",

            COUNT(DISTINCT CASE
                WHEN da.status ~ '^[0-9]{2}:[0-9]{2}-[0-9]{2}:[0-9]{2}$'
                THEN kt.tanggal
            END) AS "total_yangmenggunakanjam",

            COUNT(DISTINCT CASE WHEN da.jenis='LUPA' THEN kt.tanggal END) AS "total_LUPA(LUPA)",
            COUNT(DISTINCT CASE WHEN da.jenis='SKT' THEN kt.tanggal END) AS "total_sakit(SKT)",
            COUNT(DISTINCT CASE WHEN da.jenis='IZN' THEN kt.tanggal END) AS "total_izin(IZN)",
            COUNT(DISTINCT CASE WHEN da.jenis='EVN' THEN kt.tanggal END) AS "total_event(EVN)",
            COUNT(DISTINCT CASE WHEN da.jenis='CTH' THEN kt.tanggal END) AS "total_cuti_tahunan(CTH)",
            COUNT(DISTINCT CASE WHEN da.jenis='CKH' THEN kt.tanggal END) AS "total_cuti_hamil(CKH)",
            COUNT(DISTINCT CASE WHEN da.jenis='IJF' THEN kt.tanggal END) AS "total_potong_gaji(IJF)",
            COUNT(DISTINCT CASE WHEN da.jenis='IJS' THEN kt.tanggal END) AS "total_izin_setengah_hari(IJS)",
            COUNT(DISTINCT CASE WHEN da.jenis='KCL' THEN kt.tanggal END) AS "total_izin_KCL(KCL)",
            COUNT(DISTINCT CASE WHEN da.jenis='SKTCVD' THEN kt.tanggal END) AS "total_izin_covid(SKTCVD)",
            COUNT(DISTINCT CASE WHEN da.jenis='TK' THEN kt.tanggal END) AS "total_izin_TK(TK)",
            COUNT(DISTINCT CASE WHEN da.jenis='TRN' THEN kt.tanggal END) AS "total_izin_TRN(TRN)",
            COUNT(DISTINCT CASE WHEN da.jenis='DNL' THEN kt.tanggal END) AS "total_izin_DNL(DNL)",

            COUNT(DISTINCT CASE
                WHEN da.jenis IN
                ('HDR','LUPA','SKT','IZN','EVN','CTH','CKH','IJF','IJS','KCL','SKTCVD','TK','TRN','DNL')
                 OR da.status ~ '^[0-9]{2}:[0-9]{2}-[0-9]{2}:[0-9]{2}$'
                THEN kt.tanggal
            END) AS total_semua

        FROM karyawan_tanggal kt
        JOIN prs_karyawan k
            ON kt.nik = k.nik
        JOIN prs_unit_kerja_karyawan ukk
            ON k.id_karyawan = ukk.karyawan_id
        LEFT JOIN prs_unit_kerja uk
            ON ukk.unit_kerja = uk.uk_id
        LEFT JOIN prs_divisi d
            ON d.kode = uk.kode_divisi
        LEFT JOIN prs_bagian b
            ON b.kode = uk.kode_bagian
        LEFT JOIN data_absensi da
            ON kt.nik = da.nik
           AND kt.tanggal = da.tanggal

        GROUP BY
            kt.nik,
            kt.nama_lengkap,
            d.nama_div,
            b.kode,
            b.nama_bag

        ORDER BY kt.nik;

    $f$,
        p_start,
        p_end,
        p_start,
        p_end,
        p_start,
        p_end,
        v_sql
    );

    EXECUTE v_sql;

END;
$procedure$`,
  },

  {
    signature:
      'public.get_absensi_pivot_bagian(date, date, character varying, character varying, refcursor)',
    sql: String.raw`CREATE OR REPLACE PROCEDURE public.get_absensi_pivot_bagian(IN p_start date, IN p_end date, IN p_unit_type character varying, IN p_unit_kode character varying, INOUT ref refcursor DEFAULT 'absensi_cursor'::refcursor)
 LANGUAGE plpgsql
AS $procedure$
DECLARE
    v_sql TEXT;
BEGIN

    -- 1. Buat daftar kolom pivot per tanggal
    SELECT string_agg(
        format(
            'MAX(CASE WHEN kt.tanggal = %L THEN COALESCE(da.status, ''-'') END) AS "%s"',
            d::date,
            to_char(d::date, 'DD-Mon')
        ),
        ', ' ORDER BY d
    )
    INTO v_sql
    FROM generate_series(
        p_start,
        p_end,
        interval '1 day'
    ) d;


    -- 2. Susun query pivot dinamis
    v_sql := format($f$

        WITH semua_tanggal AS (
            SELECT generate_series(
                %L::date,
                %L::date,
                interval '1 day'
            )::date AS tanggal
        ),

        karyawan_tanggal AS (
            SELECT
                k.nik,
                d.tanggal,
                k.nama_lengkap
            FROM prs_karyawan k
            CROSS JOIN semua_tanggal d
        ),

        data_absensi AS (

            SELECT
                nik,
                tanggal,
                replace(trim(status_raw), ' ', '') AS status,
                jenis
            FROM (

                -- ABSENSI HADIR
                SELECT
                    userid::varchar AS nik,
                    date(checktime) AS tanggal,
                    to_char(MIN(checktime), 'HH24:MI')
                    || '-' ||
                    to_char(MAX(checktime), 'HH24:MI') AS status_raw,
                    'HDR' AS jenis
                FROM sdm_checkinout
                WHERE checktime >= %L::date
                  AND checktime < (%L::date + interval '1 day')
                GROUP BY
                    userid,
                    date(checktime)


                UNION ALL


                -- CUTI / IZIN
                SELECT
                    nik::varchar AS nik,
                    tgl_cuti AS tanggal,
                    regexp_replace(
                        trim(tipe),
                        '^DLL:',
                        ''
                    ) AS status_raw,
                    regexp_replace(
                        tipe,
                        '^DLL:',
                        ''
                    ) AS jenis
                FROM sdm_checkinout_cuti c
                WHERE tgl_cuti >= %L::date
                  AND tgl_cuti <= %L::date

                  AND NOT EXISTS (
                      SELECT 1
                      FROM sdm_checkinout s
                      WHERE s.userid::varchar = c.nik::varchar
                        AND date(s.checktime) = c.tgl_cuti
                        AND s.checktime >= %L::date
                        AND s.checktime < (%L::date + interval '1 day')
                  )

            ) sub
        )

        SELECT
            kt.nik,
            kt.nama_lengkap,

            -- Unit kerja
            CASE
                WHEN %L = 'BAGIAN'
                     AND b.nama_bag IS NOT NULL
                THEN b.nama_bag
                ELSE d.nama_div
            END AS unit_kerja,

            d.nama_div,
            b.nama_bag,

            %s,


            -- TOTAL HADIR
            COUNT(DISTINCT CASE
                WHEN da.jenis = 'HDR'
                 AND NOT (
                     da.status ~ '^[0-9]{2}:[0-9]{2}-[0-9]{2}:[0-9]{2}$'
                 )
                THEN kt.tanggal
            END) AS "total_hadir(HDR)",


            -- TOTAL YANG MENGGUNAKAN JAM
            COUNT(DISTINCT CASE
                WHEN da.status ~ '^[0-9]{2}:[0-9]{2}-[0-9]{2}:[0-9]{2}$'
                THEN kt.tanggal
            END) AS "total_yangmenggunakanjam",


            COUNT(DISTINCT CASE
                WHEN da.jenis = 'LUPA'
                THEN kt.tanggal
            END) AS "total_LUPA(LUPA)",


            COUNT(DISTINCT CASE
                WHEN da.jenis = 'SKT'
                THEN kt.tanggal
            END) AS "total_sakit(SKT)",


            COUNT(DISTINCT CASE
                WHEN da.jenis = 'IZN'
                THEN kt.tanggal
            END) AS "total_izin(IZN)",


            COUNT(DISTINCT CASE
                WHEN da.jenis = 'EVN'
                THEN kt.tanggal
            END) AS "total_event(EVN)",


            COUNT(DISTINCT CASE
                WHEN da.jenis = 'CTH'
                THEN kt.tanggal
            END) AS "total_cuti_tahunan(CTH)",


            COUNT(DISTINCT CASE
                WHEN da.jenis = 'CKH'
                THEN kt.tanggal
            END) AS "total_cuti_hamil(CKH)",


            COUNT(DISTINCT CASE
                WHEN da.jenis = 'IJF'
                THEN kt.tanggal
            END) AS "total_potong_gaji(IJF)",


            COUNT(DISTINCT CASE
                WHEN da.jenis = 'IJS'
                THEN kt.tanggal
            END) AS "total_izin_setengah_hari(IJS)",


            COUNT(DISTINCT CASE
                WHEN da.jenis = 'KCL'
                THEN kt.tanggal
            END) AS "total_izin_KCL(KCL)",


            COUNT(DISTINCT CASE
                WHEN da.jenis = 'SKTCVD'
                THEN kt.tanggal
            END) AS "total_izin_covid(SKTCVD)",


            COUNT(DISTINCT CASE
                WHEN da.jenis = 'TK'
                THEN kt.tanggal
            END) AS "total_izin_TK(TK)",


            COUNT(DISTINCT CASE
                WHEN da.jenis = 'TRN'
                THEN kt.tanggal
            END) AS "total_izin_TRN(TRN)",


            COUNT(DISTINCT CASE
                WHEN da.jenis = 'DNL'
                THEN kt.tanggal
            END) AS "total_izin_DNL(DNL)",


            -- TOTAL SEMUA
            COUNT(DISTINCT CASE
                WHEN da.jenis IN (
                    'DNL',
                    'EVN',
                    'CKH',
                    'IJS',
                    'SKTCVD',
                    'LUPA'
                )

                OR da.status ~
                   '^[0-9]{2}:[0-9]{2}-[0-9]{2}:[0-9]{2}$'

                OR (
                    da.jenis = 'HDR'
                    AND NOT (
                        da.status ~
                        '^[0-9]{2}:[0-9]{2}-[0-9]{2}:[0-9]{2}$'
                    )
                )

                THEN kt.tanggal
            END) AS total_semua


        FROM karyawan_tanggal kt

        JOIN prs_karyawan k
            ON kt.nik = k.nik

        JOIN prs_unit_kerja_karyawan ukk
            ON k.id_karyawan = ukk.karyawan_id

        LEFT JOIN prs_unit_kerja uk
            ON ukk.unit_kerja = uk.uk_id

        LEFT JOIN prs_divisi d
            ON d.kode = uk.kode_divisi

        LEFT JOIN prs_bagian b
            ON b.kode = uk.kode_bagian

        LEFT JOIN data_absensi da
            ON kt.nik = da.nik
           AND kt.tanggal = da.tanggal


        WHERE (
            %L IS NULL

            OR (
                %L = 'BAGIAN'
                AND b.kode = %L
            )

            OR (
                %L = 'DIVISI'
                AND d.kode = %L
            )
        )


        GROUP BY
            kt.nik,
            kt.nama_lengkap,
            d.nama_div,
            b.nama_bag


        ORDER BY
            kt.nik;

    $f$,

        -- semua_tanggal
        p_start,
        p_end,

        -- sdm_checkinout
        p_start,
        p_end,

        -- sdm_checkinout_cuti
        p_start,
        p_end,

        -- NOT EXISTS checkinout
        p_start,
        p_end,

        -- unit_type
        p_unit_type,

        -- kolom pivot
        v_sql,

        -- filter unit
        p_unit_kode,
        p_unit_type,
        p_unit_kode,
        p_unit_type,
        p_unit_kode
    );


    -- 3. Buka cursor
    OPEN ref FOR EXECUTE v_sql;

END;
$procedure$`,
  },

  {
    signature:
      'public.get_absensi_pivot_bagian(date, date, text, text, refcursor)',
    sql: String.raw`CREATE OR REPLACE PROCEDURE public.get_absensi_pivot_bagian(IN p_start date, IN p_end date, IN p_unit_type text DEFAULT 'BAGIAN'::text, IN p_unit_kode text DEFAULT NULL::text, INOUT ref refcursor DEFAULT 'absensi_cursor'::refcursor)
 LANGUAGE plpgsql
AS $procedure$
DECLARE
    v_sql TEXT;
BEGIN
    -- 1. Buat daftar kolom pivot per tanggal
    SELECT string_agg(
        format(
            'MAX(CASE WHEN kt.tanggal = %L THEN COALESCE(da.status, ''-'') END) AS "%s"',
            d::date,
            to_char(d::date, 'DD-Mon')
        ),
        ', ' ORDER BY d
    )
    INTO v_sql
    FROM generate_series(p_start, p_end, interval '1 day') d;

    -- 2. Susun query pivot dinamis
    v_sql := format($f$
        WITH semua_tanggal AS (
            SELECT generate_series(%L::date, %L::date, interval '1 day')::date AS tanggal
        ),
        karyawan_tanggal AS (
            SELECT k.nik, d.tanggal, k.nama_lengkap
            FROM prs_karyawan k
            CROSS JOIN semua_tanggal d
        ),
        data_absensi AS (
            SELECT nik, tanggal, replace(trim(status_raw), ' ', '') AS status, jenis
            FROM (
                SELECT 
                    userid::varchar AS nik,
                    date(checktime) AS tanggal,
                    to_char(MIN(checktime), 'HH24:MI') || '-' || to_char(MAX(checktime), 'HH24:MI') AS status_raw,
                    'HDR' AS jenis
                FROM sdm_checkinout
                WHERE checktime BETWEEN %L AND %L
                GROUP BY userid, date(checktime)

                UNION ALL

                SELECT 
                    nik::varchar AS nik,
                    tgl_cuti AS tanggal,
                    regexp_replace(trim(tipe), '^DLL:', '') AS status_raw,
                    regexp_replace(tipe, '^DLL:', '') AS jenis
                FROM sdm_checkinout_cuti c
                WHERE tgl_cuti BETWEEN %L AND %L
                  AND NOT EXISTS (
                      SELECT 1
                      FROM sdm_checkinout s
                      WHERE s.userid::varchar = c.nik::varchar
                        AND date(s.checktime) = c.tgl_cuti
                        AND s.checktime BETWEEN %L AND %L
                  )
            ) sub
        )
        SELECT 
            kt.nik,
            kt.nama_lengkap,

            -- Pilihan unit kerja
            CASE 
                WHEN %L = 'BAGIAN' AND b.nama_bag IS NOT NULL THEN b.nama_bag
                ELSE d.nama_div
            END AS unit_kerja,

            -- Tambahan kolom nama_div dan nama_bag
            d.nama_div,
            b.nama_bag,

            %s,

            COUNT(DISTINCT CASE 
                WHEN da.jenis = 'HDR'
                 AND NOT (da.status ~ '^[0-9]{2}:[0-9]{2}-[0-9]{2}:[0-9]{2}$')
                THEN kt.tanggal
            END) AS "total_hadir(HDR)",

            COUNT(DISTINCT CASE
                WHEN da.status ~ '^[0-9]{2}:[0-9]{2}-[0-9]{2}:[0-9]{2}$'
                THEN kt.tanggal
            END) AS "total_yangmenggunakanjam",

            COUNT(DISTINCT CASE WHEN da.jenis = 'LUPA' THEN kt.tanggal END) AS "total_LUPA(LUPA)",
            COUNT(DISTINCT CASE WHEN da.jenis = 'SKT' THEN kt.tanggal END) AS "total_sakit(SKT)",
            COUNT(DISTINCT CASE WHEN da.jenis = 'IZN' THEN kt.tanggal END) AS "total_izin(IZN)",
            COUNT(DISTINCT CASE WHEN da.jenis = 'EVN' THEN kt.tanggal END) AS "total_event(EVN)",
            COUNT(DISTINCT CASE WHEN da.jenis = 'CTH' THEN kt.tanggal END) AS "total_cuti_tahunan(CTH)",
            COUNT(DISTINCT CASE WHEN da.jenis = 'CKH' THEN kt.tanggal END) AS "total_cuti_hamil(CKH)",
            COUNT(DISTINCT CASE WHEN da.jenis = 'IJF' THEN kt.tanggal END) AS "total_potong_gaji(IJF)",
            COUNT(DISTINCT CASE WHEN da.jenis = 'IJS' THEN kt.tanggal END) AS "total_izin_setengah_hari(IJS)",
            COUNT(DISTINCT CASE WHEN da.jenis = 'KCL' THEN kt.tanggal END) AS "total_izin_KCL(KCL)",
            COUNT(DISTINCT CASE WHEN da.jenis = 'SKTCVD' THEN kt.tanggal END) AS "total_izin_covid(SKTCVD)",
            COUNT(DISTINCT CASE WHEN da.jenis = 'TK' THEN kt.tanggal END) AS "total_izin_TK(TK)",
            COUNT(DISTINCT CASE WHEN da.jenis = 'TRN' THEN kt.tanggal END) AS "total_izin_TRN(TRN)",
            COUNT(DISTINCT CASE WHEN da.jenis = 'DNL' THEN kt.tanggal END) AS "total_izin_DNL(DNL)",

            COUNT(DISTINCT CASE
                WHEN da.jenis IN ('DNL','EVN','CKH','IJS','SKTCVD','LUPA')
                     OR da.status ~ '^[0-9]{2}:[0-9]{2}-[0-9]{2}:[0-9]{2}$'
                     OR (da.jenis = 'HDR' AND NOT (da.status ~ '^[0-9]{2}:[0-9]{2}-[0-9]{2}:[0-9]{2}$'))
                THEN kt.tanggal
            END) AS total_semua

        FROM karyawan_tanggal kt
        JOIN prs_karyawan k ON kt.nik = k.nik
        JOIN prs_unit_kerja_karyawan ukk ON k.id_karyawan = ukk.karyawan_id
        LEFT JOIN prs_unit_kerja uk ON ukk.unit_kerja = uk.uk_id
        LEFT JOIN prs_divisi d ON d.kode = uk.kode_divisi
        LEFT JOIN prs_bagian b ON b.kode = uk.kode_bagian
        LEFT JOIN data_absensi da ON kt.nik = da.nik AND kt.tanggal = da.tanggal
        WHERE (%L IS NULL 
               OR (%L = 'BAGIAN' AND b.kode = %L)
               OR (%L = 'DIVISI' AND d.kode = %L))
        GROUP BY kt.nik, kt.nama_lengkap, d.nama_div, b.nama_bag
        ORDER BY kt.nik;
    $f$,
        p_start, p_end,  -- semua_tanggal
        p_start, p_end,  -- checkinout
        p_start, p_end,  -- cuti
        p_start, p_end,  -- not exists
        p_unit_type,     -- unit_type BAGIAN / DIVISI
        v_sql,
        p_unit_kode,     -- filter unit
        p_unit_type, p_unit_kode,
        p_unit_type, p_unit_kode
    );

    -- 3. Buka cursor untuk hasil
    OPEN ref FOR EXECUTE v_sql;
END;
$procedure$`,
  },

  {
    signature: 'public.test_cursor(refcursor)',
    sql: String.raw`CREATE OR REPLACE PROCEDURE public.test_cursor(INOUT ref refcursor)
 LANGUAGE plpgsql
AS $procedure$
BEGIN
    OPEN ref FOR
        SELECT 1 AS id, 'Hello' AS nama;
END;
$procedure$`,
  },
];

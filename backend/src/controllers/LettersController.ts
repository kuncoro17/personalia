// controllers/SuratController.ts

import { Context } from 'hono';
import { SuratService } from '../services/LettersService';
//import { PrsKaryawanWithRelations } from '../types/suratTypes';
import { AlamatDetail } from '../types/alamat.type';
import { toPlainRecord, PlainRecord } from '../utils/toPlainRecord';
import { ok, badRequest, notFound } from '../utils/response.helper';
import { logInfo, logWarn } from '../utils/log.helper';
const service = new SuratService();

const buildKwtPayload = (data: unknown) => {
  const plainData: PlainRecord = toPlainRecord(data);

  const toStringOrNull = (value: unknown): string | null =>
    value != null ? String(value) : null;
  const extractUnitKerja = () => ({
    ukk_id: toStringOrNull(plainData['unit_kerja_karyawan.ukk_id']),
    karyawan_id: toStringOrNull(plainData['unit_kerja_karyawan.karyawan_id']),
    unit_kerja: toStringOrNull(plainData['unit_kerja_karyawan.unit_kerja']),
    jab_id: toStringOrNull(plainData['unit_kerja_karyawan.jab_id']),

    jabatan: {
      jab_id: toStringOrNull(plainData['unit_kerja_karyawan.jabatan.jab_id']),
      jabatan: toStringOrNull(plainData['unit_kerja_karyawan.jabatan.jabatan']),
    },

    unit_kerja_detail: {
      kode_divisi: toStringOrNull(
        plainData['unit_kerja_karyawan.unit_kerja_detail.kode_divisi']
      ),

      direktur: {
        dir_id: toStringOrNull(
          plainData['unit_kerja_karyawan.unit_kerja_detail.direktur.dir_id']
        ),
        nama_dir: toStringOrNull(
          plainData['unit_kerja_karyawan.unit_kerja_detail.direktur.nama_dir']
        ),
      },

      deputi: {
        dep_id: toStringOrNull(
          plainData['unit_kerja_karyawan.unit_kerja_detail.deputi.dep_id']
        ),
        nama_dep: toStringOrNull(
          plainData['unit_kerja_karyawan.unit_kerja_detail.deputi.nama_dep']
        ),
      },

      divisi: {
        div_id: toStringOrNull(
          plainData['unit_kerja_karyawan.unit_kerja_detail.divisi.div_id']
        ),
        nama_div: toStringOrNull(
          plainData['unit_kerja_karyawan.unit_kerja_detail.divisi.nama_div']
        ),
      },

      bagian: {
        bag_id: toStringOrNull(
          plainData['unit_kerja_karyawan.unit_kerja_detail.bagian.bag_id']
        ),
        nama_bag: toStringOrNull(
          plainData['unit_kerja_karyawan.unit_kerja_detail.bagian.nama_bag']
        ),
      },

      seksi: {
        sek_id: toStringOrNull(
          plainData['unit_kerja_karyawan.unit_kerja_detail.seksi.sek_id']
        ),
        nama_sek: toStringOrNull(
          plainData['unit_kerja_karyawan.unit_kerja_detail.seksi.nama_sek']
        ),
      },
    },
  });
  const extractJamMengajar = (): Array<{
    jam_mengajar: string | null;
    mengajar_mapel: string | null;
    mapel: {
      mapel_id: string | null;
      nama_mapel: string | null;
    };
  }> => {
    const key = 'unit_kerja_karyawan.jam_mengajar.jam_mengajar';

    if (!(key in plainData)) return [];

    return [
      {
        jam_mengajar: toStringOrNull(
          plainData['unit_kerja_karyawan.jam_mengajar.jam_mengajar']
        ),
        mengajar_mapel: toStringOrNull(
          plainData['unit_kerja_karyawan.jam_mengajar.mengajar_mapel']
        ),
        mapel: {
          mapel_id: toStringOrNull(
            plainData['unit_kerja_karyawan.jam_mengajar.mapel.mapel_id']
          ),
          nama_mapel: toStringOrNull(
            plainData['unit_kerja_karyawan.jam_mengajar.mapel.nama_mapel']
          ),
        },
      },
    ];
  };

  const extractAlamat = (prefix: string, idAlias?: string) => ({
    id: idAlias ? toStringOrNull(plainData[`${prefix}.${idAlias}`]) : null,

    alamat: toStringOrNull(plainData[`${prefix}.alamat`]),
    rt: toStringOrNull(plainData[`${prefix}.rt`]),
    rw: toStringOrNull(plainData[`${prefix}.rw`]),
    kode_pos: toStringOrNull(plainData[`${prefix}.kode_pos`]),
    status_tempat_tinggal: toStringOrNull(
      plainData[`${prefix}.status_tempat_tinggal`]
    ),

    kelurahan: {
      id: toStringOrNull(plainData[`${prefix}.kelurahan.id`]),
      nama: toStringOrNull(plainData[`${prefix}.kelurahan.nama`]),
    },
    kecamatan: {
      id: toStringOrNull(plainData[`${prefix}.kelurahan.kecamatan.id`]),
      nama: toStringOrNull(plainData[`${prefix}.kelurahan.kecamatan.nama`]),
    },
    kota: {
      id: toStringOrNull(plainData[`${prefix}.kelurahan.kecamatan.kota.id`]),
      nama: toStringOrNull(
        plainData[`${prefix}.kelurahan.kecamatan.kota.nama`]
      ),
    },
    provinsi: {
      id: toStringOrNull(
        plainData[`${prefix}.kelurahan.kecamatan.kota.provinsi.id`]
      ),
      nama: toStringOrNull(
        plainData[`${prefix}.kelurahan.kecamatan.kota.provinsi.nama`]
      ),
    },
  });

  return {
    id_karyawan: toStringOrNull(plainData.id_karyawan),
    nik: toStringOrNull(plainData.nik),
    nama_lengkap: toStringOrNull(plainData.nama_lengkap),
    no_ktp: toStringOrNull(plainData.no_ktp),
    tgl_join_penabur_jkt: toStringOrNull(plainData.tgl_join_penabur_jkt),
    tgl_inactive: toStringOrNull(plainData.tgl_inactive),
    unitKerja: extractUnitKerja(),
    jam_mengajar: extractJamMengajar(),
    kode_status_gp: toStringOrNull(
      plainData['status_karyawan.stat_karyawan_gp']
    ),
    alamatKtpDetail: extractAlamat('alamat_ktp_detail'),
    alamatTempatTinggalDetail: extractAlamat('alamat_tempat_tinggal_detail'),
  };
};

export const getSuratKaryawanTTP = async (c: Context): Promise<Response> => {
  const service = new SuratService();

  const idKaryawan = c.req.param('id');

  if (!idKaryawan) {
    return badRequest(c, 'Parameter "id_karyawan" diperlukan');
  }

  const data = await service.getSuratKaryawanTTP(idKaryawan);

  if (!data) {
    return notFound(c, 'Alamat lengkap tidak ditemukan');
  }

  const plainData: PlainRecord = toPlainRecord(data);

  const toStringOrNull = (value: unknown): string | null =>
    value != null ? String(value) : null;
  const extractUnitKerja = () => ({
    ukk_id: toStringOrNull(plainData['unit_kerja_karyawan.ukk_id']),
    karyawan_id: toStringOrNull(plainData['unit_kerja_karyawan.karyawan_id']),
    unit_kerja: toStringOrNull(plainData['unit_kerja_karyawan.unit_kerja']),
    jab_id: toStringOrNull(plainData['unit_kerja_karyawan.jab_id']),

    jabatan: {
      jab_id: toStringOrNull(plainData['unit_kerja_karyawan.jabatan.jab_id']),
      jabatan: toStringOrNull(plainData['unit_kerja_karyawan.jabatan.jabatan']),
    },

    unit_kerja_detail: {
      kode_divisi: toStringOrNull(
        plainData['unit_kerja_karyawan.unit_kerja_detail.kode_divisi']
      ),

      direktur: {
        dir_id: toStringOrNull(
          plainData['unit_kerja_karyawan.unit_kerja_detail.direktur.dir_id']
        ),
        nama_dir: toStringOrNull(
          plainData['unit_kerja_karyawan.unit_kerja_detail.direktur.nama_dir']
        ),
      },

      deputi: {
        dep_id: toStringOrNull(
          plainData['unit_kerja_karyawan.unit_kerja_detail.deputi.dep_id']
        ),
        nama_dep: toStringOrNull(
          plainData['unit_kerja_karyawan.unit_kerja_detail.deputi.nama_dep']
        ),
      },

      divisi: {
        div_id: toStringOrNull(
          plainData['unit_kerja_karyawan.unit_kerja_detail.divisi.div_id']
        ),
        nama_div: toStringOrNull(
          plainData['unit_kerja_karyawan.unit_kerja_detail.divisi.nama_div']
        ),
      },

      bagian: {
        bag_id: toStringOrNull(
          plainData['unit_kerja_karyawan.unit_kerja_detail.bagian.bag_id']
        ),
        nama_bag: toStringOrNull(
          plainData['unit_kerja_karyawan.unit_kerja_detail.bagian.nama_bag']
        ),
      },

      seksi: {
        sek_id: toStringOrNull(
          plainData['unit_kerja_karyawan.unit_kerja_detail.seksi.sek_id']
        ),
        nama_sek: toStringOrNull(
          plainData['unit_kerja_karyawan.unit_kerja_detail.seksi.nama_sek']
        ),
      },
    },
  });

  const extractAlamat = (prefix: string, idAlias: string): AlamatDetail => ({
    id: toStringOrNull(plainData[`${prefix}.${idAlias}`]),
    alamat: toStringOrNull(plainData[`${prefix}.alamat`]),
    rt: toStringOrNull(plainData[`${prefix}.rt`]),
    rw: toStringOrNull(plainData[`${prefix}.rw`]),
    kode_pos: toStringOrNull(plainData[`${prefix}.kode_pos`]),
    status_tempat_tinggal: toStringOrNull(
      plainData[`${prefix}.status_tempat_tinggal`]
    ),
    kelurahan: {
      id: toStringOrNull(plainData[`${prefix}.kelurahan.id`]),
      nama: toStringOrNull(plainData[`${prefix}.kelurahan.nama`]),
    },
    kecamatan: {
      id: toStringOrNull(plainData[`${prefix}.kelurahan.kecamatan.id`]),
      nama: toStringOrNull(plainData[`${prefix}.kelurahan.kecamatan.nama`]),
    },
    kota: {
      id: toStringOrNull(plainData[`${prefix}.kelurahan.kecamatan.kota.id`]),
      nama: toStringOrNull(
        plainData[`${prefix}.kelurahan.kecamatan.kota.nama`]
      ),
    },
    provinsi: {
      id: toStringOrNull(
        plainData[`${prefix}.kelurahan.kecamatan.kota.provinsi.id`]
      ),
      nama: toStringOrNull(
        plainData[`${prefix}.kelurahan.kecamatan.kota.provinsi.nama`]
      ),
    },
  });

  const result = {
    id_karyawan: toStringOrNull(plainData.id_karyawan),
    nik: toStringOrNull(plainData.nik),
    nama_lengkap: toStringOrNull(plainData.nama_lengkap),
    no_ktp: toStringOrNull(plainData.no_ktp),
    tgl_join_penabur_jkt: toStringOrNull(plainData.tgl_join_penabur_jkt),
    tgl_inactive: toStringOrNull(plainData.tgl_inactive),
    unitKerja: extractUnitKerja(),
    kode_status_gp: toStringOrNull(
      plainData['status_karyawan.stat_karyawan_gp']
    ),
    alamatTempatTinggalDetail: extractAlamat(
      'alamat_tempat_tinggal_detail',
      'alamatTempatTinggalId'
    ),
    alamatKtpDetail: extractAlamat('alamat_ktp_detail', 'alamatKtpId'),
  };

  return ok(
    c,
    result,
    `Berhasil ambil data alamat lengkap untuk id_karyawan ${idKaryawan}`
  );
};

export const getSuratKaryawanKWT = async (c: Context): Promise<Response> => {
  const idKaryawan = c.req.param('id');

  if (!idKaryawan) {
    return badRequest(c, 'Parameter "id_karyawan" diperlukan');
  }

  const data = await service.getSuratKaryawanKWT(idKaryawan);
  if (!data) {
    return notFound(c, 'Data tidak ditemukan');
  }

  const result = buildKwtPayload(data);

  return ok(c, result, `Berhasil ambil data untuk id_karyawan ${idKaryawan}`);
};

export const getDisposisi = async (c: Context): Promise<Response> => {
  const idKaryawan = c.req.param('id');

  if (!idKaryawan) {
    return badRequest(c, 'Parameter "id_karyawan" diperlukan');
  }

  const data = await service.getDisposisi(idKaryawan);
  if (!data) {
    return notFound(c, 'Data tidak ditemukan');
  }

  const result = buildKwtPayload(data);

  return ok(
    c,
    result,
    `Berhasil ambil data disposisi untuk id_karyawan ${idKaryawan}`
  );
};

export const getSuratKaryawanTKL = async (c: Context): Promise<Response> => {
  const idKaryawan = c.req.param('id');

  if (!idKaryawan) {
    return badRequest(c, 'Parameter "id_karyawan" diperlukan');
  }

  const data = await service.getSuratKaryawanTKL(idKaryawan);
  if (!data) {
    return notFound(c, 'Data tidak ditemukan');
  }

  const plainData: PlainRecord = toPlainRecord(data);

  // Helper konversi semua value ke string | null
  const toStringOrNull = (value: unknown): string | null =>
    value != null ? String(value) : null;
  const extractUnitKerja = () => ({
    ukk_id: toStringOrNull(plainData['unit_kerja_karyawan.ukk_id']),
    karyawan_id: toStringOrNull(plainData['unit_kerja_karyawan.karyawan_id']),
    unit_kerja: toStringOrNull(plainData['unit_kerja_karyawan.unit_kerja']),
    jab_id: toStringOrNull(plainData['unit_kerja_karyawan.jab_id']),

    jabatan: {
      jab_id: toStringOrNull(plainData['unit_kerja_karyawan.jabatan.jab_id']),
      jabatan: toStringOrNull(plainData['unit_kerja_karyawan.jabatan.jabatan']),
    },

    unit_kerja_detail: {
      kode_divisi: toStringOrNull(
        plainData['unit_kerja_karyawan.unit_kerja_detail.kode_divisi']
      ),

      direktur: {
        dir_id: toStringOrNull(
          plainData['unit_kerja_karyawan.unit_kerja_detail.direktur.dir_id']
        ),
        nama_dir: toStringOrNull(
          plainData['unit_kerja_karyawan.unit_kerja_detail.direktur.nama_dir']
        ),
      },

      deputi: {
        dep_id: toStringOrNull(
          plainData['unit_kerja_karyawan.unit_kerja_detail.deputi.dep_id']
        ),
        nama_dep: toStringOrNull(
          plainData['unit_kerja_karyawan.unit_kerja_detail.deputi.nama_dep']
        ),
      },

      divisi: {
        div_id: toStringOrNull(
          plainData['unit_kerja_karyawan.unit_kerja_detail.divisi.div_id']
        ),
        nama_div: toStringOrNull(
          plainData['unit_kerja_karyawan.unit_kerja_detail.divisi.nama_div']
        ),
      },

      bagian: {
        bag_id: toStringOrNull(
          plainData['unit_kerja_karyawan.unit_kerja_detail.bagian.bag_id']
        ),
        nama_bag: toStringOrNull(
          plainData['unit_kerja_karyawan.unit_kerja_detail.bagian.nama_bag']
        ),
      },

      seksi: {
        sek_id: toStringOrNull(
          plainData['unit_kerja_karyawan.unit_kerja_detail.seksi.sek_id']
        ),
        nama_sek: toStringOrNull(
          plainData['unit_kerja_karyawan.unit_kerja_detail.seksi.nama_sek']
        ),
      },
    },
  });
  const extractAlamat = (prefix: string, idAlias?: string) => ({
    id: idAlias ? toStringOrNull(plainData[`${prefix}.${idAlias}`]) : null,

    alamat: toStringOrNull(plainData[`${prefix}.alamat`]),
    rt: toStringOrNull(plainData[`${prefix}.rt`]),
    rw: toStringOrNull(plainData[`${prefix}.rw`]),
    kode_pos: toStringOrNull(plainData[`${prefix}.kode_pos`]),
    status_tempat_tinggal: toStringOrNull(
      plainData[`${prefix}.status_tempat_tinggal`]
    ),

    kelurahan: {
      id: toStringOrNull(plainData[`${prefix}.kelurahan.id`]),
      nama: toStringOrNull(plainData[`${prefix}.kelurahan.nama`]),
    },
    kecamatan: {
      id: toStringOrNull(plainData[`${prefix}.kelurahan.kecamatan.id`]),
      nama: toStringOrNull(plainData[`${prefix}.kelurahan.kecamatan.nama`]),
    },
    kota: {
      id: toStringOrNull(plainData[`${prefix}.kelurahan.kecamatan.kota.id`]),
      nama: toStringOrNull(
        plainData[`${prefix}.kelurahan.kecamatan.kota.nama`]
      ),
    },
    provinsi: {
      id: toStringOrNull(
        plainData[`${prefix}.kelurahan.kecamatan.kota.provinsi.id`]
      ),
      nama: toStringOrNull(
        plainData[`${prefix}.kelurahan.kecamatan.kota.provinsi.nama`]
      ),
    },
  });

  const result = {
    id_karyawan: toStringOrNull(plainData.id_karyawan),
    nik: toStringOrNull(plainData.nik),
    nama_lengkap: toStringOrNull(plainData.nama_lengkap),
    no_ktp: toStringOrNull(plainData.no_ktp),
    tgl_join_penabur_jkt: toStringOrNull(plainData.tgl_join_penabur_jkt),
    tgl_inactive: toStringOrNull(plainData.tgl_inactive),
    unitKerja: extractUnitKerja(),

    alamatKtpDetail: extractAlamat('alamat_ktp_detail'),
    alamatTempatTinggalDetail: extractAlamat('alamat_tempat_tinggal_detail'),
    kode_status_gp: toStringOrNull(
      plainData['status_karyawan.stat_karyawan_gp']
    ),
  };

  return ok(c, result, `Berhasil ambil data untuk id_karyawan ${idKaryawan}`);
};

export const getSuratKaryawanWTT = async (c: Context): Promise<Response> => {
  const idKaryawan = c.req.param('id');

  if (!idKaryawan) {
    return badRequest(c, 'Parameter "id_karyawan" diperlukan');
  }

  const data = await service.getSuratKaryawanWTT(idKaryawan);
  if (!data) {
    return notFound(c, 'Data tidak ditemukan');
  }

  const plainData: PlainRecord = toPlainRecord(data);

  // Helper konversi semua value ke string | null
  const toStringOrNull = (value: unknown): string | null =>
    value != null ? String(value) : null;

  const extractUnitKerja = () => ({
    ukk_id: toStringOrNull(plainData['unit_kerja_karyawan.ukk_id']),
    karyawan_id: toStringOrNull(plainData['unit_kerja_karyawan.karyawan_id']),
    unit_kerja: toStringOrNull(plainData['unit_kerja_karyawan.unit_kerja']),
    jab_id: toStringOrNull(plainData['unit_kerja_karyawan.jab_id']),

    jabatan: {
      jab_id: toStringOrNull(plainData['unit_kerja_karyawan.jabatan.jab_id']),
      jabatan: toStringOrNull(plainData['unit_kerja_karyawan.jabatan.jabatan']),
    },

    unit_kerja_detail: {
      kode_divisi: toStringOrNull(
        plainData['unit_kerja_karyawan.unit_kerja_detail.kode_divisi']
      ),

      direktur: {
        dir_id: toStringOrNull(
          plainData['unit_kerja_karyawan.unit_kerja_detail.direktur.dir_id']
        ),
        nama_dir: toStringOrNull(
          plainData['unit_kerja_karyawan.unit_kerja_detail.direktur.nama_dir']
        ),
      },

      deputi: {
        dep_id: toStringOrNull(
          plainData['unit_kerja_karyawan.unit_kerja_detail.deputi.dep_id']
        ),
        nama_dep: toStringOrNull(
          plainData['unit_kerja_karyawan.unit_kerja_detail.deputi.nama_dep']
        ),
      },

      divisi: {
        div_id: toStringOrNull(
          plainData['unit_kerja_karyawan.unit_kerja_detail.divisi.div_id']
        ),
        nama_div: toStringOrNull(
          plainData['unit_kerja_karyawan.unit_kerja_detail.divisi.nama_div']
        ),
      },

      bagian: {
        bag_id: toStringOrNull(
          plainData['unit_kerja_karyawan.unit_kerja_detail.bagian.bag_id']
        ),
        nama_bag: toStringOrNull(
          plainData['unit_kerja_karyawan.unit_kerja_detail.bagian.nama_bag']
        ),
      },

      seksi: {
        sek_id: toStringOrNull(
          plainData['unit_kerja_karyawan.unit_kerja_detail.seksi.sek_id']
        ),
        nama_sek: toStringOrNull(
          plainData['unit_kerja_karyawan.unit_kerja_detail.seksi.nama_sek']
        ),
      },
    },
  });
  const extractAlamat = (prefix: string, idAlias?: string) => ({
    id: idAlias ? toStringOrNull(plainData[`${prefix}.${idAlias}`]) : null,

    alamat: toStringOrNull(plainData[`${prefix}.alamat`]),
    rt: toStringOrNull(plainData[`${prefix}.rt`]),
    rw: toStringOrNull(plainData[`${prefix}.rw`]),
    kode_pos: toStringOrNull(plainData[`${prefix}.kode_pos`]),
    status_tempat_tinggal: toStringOrNull(
      plainData[`${prefix}.status_tempat_tinggal`]
    ),

    kelurahan: {
      id: toStringOrNull(plainData[`${prefix}.kelurahan.id`]),
      nama: toStringOrNull(plainData[`${prefix}.kelurahan.nama`]),
    },
    kecamatan: {
      id: toStringOrNull(plainData[`${prefix}.kelurahan.kecamatan.id`]),
      nama: toStringOrNull(plainData[`${prefix}.kelurahan.kecamatan.nama`]),
    },
    kota: {
      id: toStringOrNull(plainData[`${prefix}.kelurahan.kecamatan.kota.id`]),
      nama: toStringOrNull(
        plainData[`${prefix}.kelurahan.kecamatan.kota.nama`]
      ),
    },
    provinsi: {
      id: toStringOrNull(
        plainData[`${prefix}.kelurahan.kecamatan.kota.provinsi.id`]
      ),
      nama: toStringOrNull(
        plainData[`${prefix}.kelurahan.kecamatan.kota.provinsi.nama`]
      ),
    },
  });

  const result = {
    id_karyawan: toStringOrNull(plainData.id_karyawan),
    nik: toStringOrNull(plainData.nik),
    nama_lengkap: toStringOrNull(plainData.nama_lengkap),
    alamatKtpDetail: extractAlamat('alamat_ktp_detail'),
    alamatTempatTinggalDetail: extractAlamat('alamat_tempat_tinggal_detail'),
    unitKerja: extractUnitKerja(),
    kode_status_gp: toStringOrNull(
      plainData['status_karyawan.stat_karyawan_gp']
    ),
  };

  return ok(c, result, `Berhasil ambil data untuk id_karyawan ${idKaryawan}`);
};

export const SuratBeritaAcaraBIPARTIT = async (
  c: Context
): Promise<Response> => {
  const idKaryawan = c.req.param('id');

  if (!idKaryawan) {
    return badRequest(c, 'Parameter "id_karyawan" diperlukan');
  }

  // >>> FIXED: panggil service yang benar
  const data = await service.SuratBeritaAcaraBIPARTIT(idKaryawan);

  if (!data) {
    return notFound(c, 'Data tidak ditemukan');
  }

  const plainData: PlainRecord = toPlainRecord(data);

  return ok(
    c,
    plainData,
    `Berhasil ambil data Karyawan untuk id_karyawan ${idKaryawan}`
  );
};

export const CutiPanjang = async (c: Context): Promise<Response> => {
  const id = c.req.param('id');

  if (!id) {
    await logWarn('Parameter "id" wajib diisi');
    return badRequest(c, 'Parameter id wajib diisi');
  }

  await logInfo(`Memulai ambil data karyawan berdasarkan ID: ${id}`);

  const data = await service.CutiPanjang(id);
  if (!data) {
    await logWarn(`Karyawan dengan ID ${id} tidak ditemukan`);
    return notFound(c, 'Karyawan tidak ditemukan');
  }

  // Convert data ke plain object
  const plainData: Record<string, unknown> =
    'toJSON' in data &&
    typeof (data as { toJSON?: unknown }).toJSON === 'function'
      ? ((data as { toJSON: () => unknown }).toJSON() as Record<
          string,
          unknown
        >)
      : (data as unknown as Record<string, unknown>);

  type FlatValue = string | number | null;
  type FilteredData = Record<
    string,
    FlatValue | Record<string, FlatValue | Record<string, unknown>>
  >;

  const filteredData: FilteredData = {};

  const relationalKeys = [
    'direktur',
    'deputi',
    'divisi',
    'bagian',
    'seksi',
    'unit_kerja',
    'jabatan',
  ];

  const pemisah: Record<string, string> = {
    agama_detail: 'agama',
  };

  const excludeKeys = [
    'sek_id',
    'bag_id',
    'div_id',
    'dep_id',
    'dir_id',
    'jab_id',
  ];

  Object.entries(plainData).forEach(([key, value]) => {
    const parts = key.split('.');
    const secondLastKey =
      parts.length > 1 ? parts[parts.length - 2] : undefined;
    const lastKey = parts[parts.length - 1];

    // Relational fields
    if (
      secondLastKey &&
      relationalKeys.includes(secondLastKey) &&
      !excludeKeys.includes(lastKey)
    ) {
      const mappedKey = pemisah[secondLastKey] ?? secondLastKey;
      if (!filteredData[mappedKey]) filteredData[mappedKey] = {};
      (
        filteredData[mappedKey] as Record<
          string,
          FlatValue | Record<string, unknown>
        >
      )[lastKey] = value as FlatValue;
      return;
    }

    // Field utama
    if (parts.length === 1) {
      filteredData[key] = value as FlatValue;
      return;
    }

    // Khusus status_karyawan_gp
    if (key.endsWith('stat_karyawan_gp')) {
      filteredData['kode_status_karyawan'] = String(value ?? '');
      return;
    }
  });

  await logInfo(`✅ Berhasil ambil data karyawan: ${id}`);
  return ok(c, filteredData, `Berhasil ambil data karyawan: ${id}`);
};

export const SuratPHKbyId = async (c: Context): Promise<Response> => {
  const idKaryawan = c.req.param('id');

  if (!idKaryawan) {
    return badRequest(c, 'Parameter "id_karyawan" diperlukan');
  }

  // >>> FIXED: panggil service yang benar
  const data = await service.SuratPHKbyId(idKaryawan);

  if (!data) {
    return notFound(c, 'Data tidak ditemukan');
  }

  const plainData: PlainRecord = toPlainRecord(data);

  return ok(
    c,
    plainData,
    `Berhasil ambil data Karyawan untuk id_karyawan ${idKaryawan}`
  );
};

export const SuratPHK = async (c: Context) => {
  if (!c.env.repository) {
    await logWarn('Repository tidak tersedia');
    return badRequest(c, 'Repository tidak tersedia');
  }

  const service = new SuratService(); // ✅ FIX

  await logInfo('Memulai mengambil daftar karyawan PHK / Mengundurkan Diri');

  const data = await service.SuratPHK();

  if (!data) {
    await logWarn('Data karyawan PHK / Mengundurkan Diri tidak ditemukan');
    return notFound(c, 'Data karyawan tidak ditemukan');
  }

  await logInfo('Berhasil mengambil data karyawan PHK / Mengundurkan Diri');

  return ok(c, data, 'Berhasil ambil data karyawan PHK / Mengundurkan Diri');
};

export const CutiDiLuarTangguangan = async (c: Context): Promise<Response> => {
  const id = c.req.param('id');

  if (!id) {
    await logWarn('Parameter "id" wajib diisi');
    return badRequest(c, 'Parameter id wajib diisi');
  }

  await logInfo(`Memulai ambil data karyawan berdasarkan ID: ${id}`);

  const data = await service.CutiDiLuarTangguangan(id);
  if (!data) {
    await logWarn(`Karyawan dengan ID ${id} tidak ditemukan`);
    return notFound(c, 'Karyawan tidak ditemukan');
  }

  // Convert data ke plain object
  const plainData: Record<string, unknown> =
    'toJSON' in data &&
    typeof (data as { toJSON?: unknown }).toJSON === 'function'
      ? ((data as { toJSON: () => unknown }).toJSON() as Record<
          string,
          unknown
        >)
      : (data as unknown as Record<string, unknown>);

  type FlatValue = string | number | null;
  type FilteredData = Record<
    string,
    FlatValue | Record<string, FlatValue | Record<string, unknown>>
  >;

  const filteredData: FilteredData = {};

  const relationalKeys = [
    'direktur',
    'deputi',
    'divisi',
    'bagian',
    'seksi',
    'unit_kerja',
    'jabatan',
  ];

  const pemisah: Record<string, string> = {
    agama_detail: 'agama',
  };

  const excludeKeys = [
    'sek_id',
    'bag_id',
    'div_id',
    'dep_id',
    'dir_id',
    'jab_id',
  ];

  Object.entries(plainData).forEach(([key, value]) => {
    const parts = key.split('.');
    const secondLastKey =
      parts.length > 1 ? parts[parts.length - 2] : undefined;
    const lastKey = parts[parts.length - 1];

    // Relational fields
    if (
      secondLastKey &&
      relationalKeys.includes(secondLastKey) &&
      !excludeKeys.includes(lastKey)
    ) {
      const mappedKey = pemisah[secondLastKey] ?? secondLastKey;
      if (!filteredData[mappedKey]) filteredData[mappedKey] = {};
      (
        filteredData[mappedKey] as Record<
          string,
          FlatValue | Record<string, unknown>
        >
      )[lastKey] = value as FlatValue;
      return;
    }

    // Field utama
    if (parts.length === 1) {
      filteredData[key] = value as FlatValue;
      return;
    }

    // Khusus status_karyawan_gp
    if (key.endsWith('stat_karyawan_gp')) {
      filteredData['kode_status_karyawan'] = String(value ?? '');
      return;
    }
  });

  await logInfo(`✅ Berhasil ambil data karyawan: ${id}`);
  return ok(c, filteredData, `Berhasil ambil data karyawan: ${id}`);
};

export const Mutasi = async (c: Context): Promise<Response> => {
  const id = c.req.param('id');

  if (!id) {
    await logWarn('Parameter "id" wajib diisi');
    return badRequest(c, 'Parameter id wajib diisi');
  }

  await logInfo(`Memulai ambil data karyawan berdasarkan ID: ${id}`);

  const data = await service.Mutasi(id);
  if (!data) {
    await logWarn(`Karyawan dengan ID ${id} tidak ditemukan`);
    return notFound(c, 'Karyawan tidak ditemukan');
  }

  // Convert data ke plain object
  const plainData: Record<string, unknown> =
    'toJSON' in data &&
    typeof (data as { toJSON?: unknown }).toJSON === 'function'
      ? ((data as { toJSON: () => unknown }).toJSON() as Record<
          string,
          unknown
        >)
      : (data as unknown as Record<string, unknown>);

  type FlatValue = string | number | null;
  type FilteredData = Record<
    string,
    FlatValue | Record<string, FlatValue | Record<string, unknown>>
  >;

  const filteredData: FilteredData = {};

  const relationalKeys = [
    'direktur',
    'deputi',
    'divisi',
    'bagian',
    'seksi',
    'unit_kerja',
    'jabatan',
  ];

  const pemisah: Record<string, string> = {
    agama_detail: 'agama',
  };

  const excludeKeys = [
    'sek_id',
    'bag_id',
    'div_id',
    'dep_id',
    'dir_id',
    'jab_id',
  ];

  Object.entries(plainData).forEach(([key, value]) => {
    const parts = key.split('.');
    const secondLastKey =
      parts.length > 1 ? parts[parts.length - 2] : undefined;
    const lastKey = parts[parts.length - 1];

    // Relational fields
    if (
      secondLastKey &&
      relationalKeys.includes(secondLastKey) &&
      !excludeKeys.includes(lastKey)
    ) {
      const mappedKey = pemisah[secondLastKey] ?? secondLastKey;
      if (!filteredData[mappedKey]) filteredData[mappedKey] = {};
      (
        filteredData[mappedKey] as Record<
          string,
          FlatValue | Record<string, unknown>
        >
      )[lastKey] = value as FlatValue;
      return;
    }

    // Field utama
    if (parts.length === 1) {
      filteredData[key] = value as FlatValue;
      return;
    }

    // Khusus status_karyawan_gp
    if (key.endsWith('stat_karyawan_gp')) {
      filteredData['kode_status_karyawan'] = String(value ?? '');
      return;
    }
  });

  await logInfo(`✅ Berhasil ambil data karyawan: ${id}`);
  return ok(c, filteredData, `Berhasil ambil data karyawan: ${id}`);
};

export const getSuratKeputusanKenaikanGolongan = async (c: Context) => {
  const id = c.req.param('id');

  if (!id) {
    await logWarn('Parameter "id" wajib diisi');
    return badRequest(c, 'Parameter id wajib diisi');
  }

  await logInfo(`Memulai ambil data karyawan berdasarkan ID: ${id}`);

  const data = await service.getSuratKeputusanKenaikanGolongan(id);
  if (!data) {
    await logWarn(`Karyawan dengan ID ${id} tidak ditemukan`);
    return notFound(c, 'Karyawan tidak ditemukan');
  }

  // Convert data ke plain object
  const plainData: Record<string, unknown> =
    'toJSON' in data &&
    typeof (data as { toJSON?: unknown }).toJSON === 'function'
      ? ((data as { toJSON: () => unknown }).toJSON() as Record<
          string,
          unknown
        >)
      : (data as unknown as Record<string, unknown>);

  type FlatValue = string | number | null;
  type FilteredData = Record<
    string,
    FlatValue | Record<string, FlatValue | Record<string, unknown>>
  >;

  const filteredData: FilteredData = {};

  const relationalKeys = [
    'direktur',
    'deputi',
    'divisi',
    'bagian',
    'seksi',
    'unit_kerja',
    'jabatan',
    'mapel',
    'agama_detail',
    'history',
  ];

  const pemisah: Record<string, string> = {
    agama_detail: 'agama',
  };

  const excludeKeys = [
    'sek_id',
    'bag_id',
    'div_id',
    'dep_id',
    'dir_id',
    'mapel_id',
    'jab_id',
  ];

  Object.entries(plainData).forEach(([key, value]) => {
    const parts = key.split('.');
    const secondLastKey =
      parts.length > 1 ? parts[parts.length - 2] : undefined;
    const lastKey = parts[parts.length - 1];

    // Khusus "agama"
    if (secondLastKey === 'agama_detail' && lastKey === 'agama') {
      filteredData['agama'] = value as FlatValue;
      return;
    }

    // Relational fields
    if (
      secondLastKey &&
      relationalKeys.includes(secondLastKey) &&
      !excludeKeys.includes(lastKey)
    ) {
      const mappedKey = pemisah[secondLastKey] ?? secondLastKey;
      if (!filteredData[mappedKey]) filteredData[mappedKey] = {};
      (
        filteredData[mappedKey] as Record<
          string,
          FlatValue | Record<string, unknown>
        >
      )[lastKey] = value as FlatValue;
      return;
    }

    // Field utama
    if (parts.length === 1) {
      filteredData[key] = value as FlatValue;
      return;
    }

    // Khusus status_karyawan_gp
    if (key.endsWith('stat_karyawan_gp')) {
      filteredData['kode_status_karyawan'] = String(value ?? '');
      return;
    }
  });

  await logInfo(`✅ Berhasil ambil data karyawan: ${id}`);
  return ok(c, filteredData, `Berhasil ambil data karyawan: ${id}`);
};

export const usulan_pengangkatan = async (c: Context) => {
  const id = c.req.param('id');
  if (!id) return badRequest(c, 'Parameter id wajib diisi');

  const data = await service.usulan_pengangkatan(id);
  if (!data) return notFound(c, 'Karyawan tidak ditemukan');

  // ====== KONVERSI KE JSON ======
  const plainData: Record<string, unknown> =
    'toJSON' in data &&
    typeof (data as { toJSON?: unknown }).toJSON === 'function'
      ? ((data as { toJSON: () => unknown }).toJSON() as Record<
          string,
          unknown
        >)
      : (data as unknown as Record<string, unknown>);

  const result: Record<string, unknown> = { ...plainData };

  // === AGAMA DETAIL ===
  if (result.agama_detail && typeof result.agama_detail === 'object') {
    result.agama =
      (result.agama_detail as Record<string, unknown>)['agama'] ?? null;
    delete result.agama_detail;
  }

  // === STATUS KARYAWAN ===
  if (result.status_karyawan && typeof result.status_karyawan === 'object') {
    result.kode_status_karyawan =
      (result.status_karyawan as Record<string, unknown>)['stat_karyawan_gp'] ??
      null;
    delete result.status_karyawan;
  }

  // === UNIT KERJA ===
  const unitKerja = (
    result.unit_kerja_karyawan as Record<string, unknown> | undefined
  )?.unit_kerja_detail;

  if (unitKerja && typeof unitKerja === 'object') {
    const uk = unitKerja as Record<string, unknown>;
    result.direktur = uk.direktur ?? null;
    result.deputi = uk.deputi ?? null;
    result.divisi = uk.divisi ?? null;
    result.bagian = uk.bagian ?? null;
    result.seksi = uk.seksi ?? null;

    delete (result.unit_kerja_karyawan as Record<string, unknown>)[
      'unit_kerja_detail'
    ];
  }

  // === JABATAN ===
  const jabatan = (
    result.unit_kerja_karyawan as Record<string, unknown> | undefined
  )?.jabatan;
  if (jabatan !== undefined) {
    result.jabatan = jabatan;
  }

  // === KELUARGA (jumlah anak) ===
  const keluarga = result.keluarga_karyawan;
  if (Array.isArray(keluarga)) {
    const anak = keluarga.filter(
      (k): k is Record<string, unknown> =>
        typeof k === 'object' && k !== null && k.hubungan === 'Anak'
    );
    result.jumlah_anak = anak.length;
  } else {
    result.jumlah_anak = 0;
  }

  // Hapus array keluarga
  delete result.keluarga_karyawan;

  return ok(c, result, `Berhasil ambil data karyawan: ${id}`);
};

export const surat_kesalahan_berat_pelanggaran = async (c: Context) => {
  const id = c.req.param('id');

  if (!id) {
    await logWarn('Parameter "id" wajib diisi');
    return badRequest(c, 'Parameter id wajib diisi');
  }

  const result = await service.surat_kesalahan_berat_pelanggaran(id);

  if (!result.success) {
    return badRequest(c, result.message);
  }

  return ok(
    c,
    result.data,
    'Berhasil ambil data surat kesalahan berat/pelanggaran'
  );
};

// export const surat_kesepakatan_bersama = async (c: Context) => {
//   const id = c.req.param('id');

//   if (!id) {
//     await logWarn('Parameter "id" wajib diisi');
//     return badRequest(c, 'Parameter "id" diperlukan');
//   }

//   const result = await service.surat_kesepakatan_bersama(id);

//   if (!result.success || !result.data) {
//     await logWarn(`Karyawan dengan ID ${id} tidak ditemukan`);
//     return notFound(c, 'Karyawan tidak ditemukan');
//   }

//   const plain = toPlainRecord(result.data);

//   // Helper convert value safely
//   const val = (key: string) =>
//     plain[key] ?? plain[`PrsKaryawan.${key}`] ?? null;
//   const v = (key: string) =>
//     plain[key] !== undefined ? String(plain[key]) : null;

//   // Extract alamat
//   const extractAlamat = (prefix: string) => ({
//     alamat: v(`${prefix}.alamat`),
//     rt: v(`${prefix}.rt`),
//     rw: v(`${prefix}.rw`),
//     kode_pos: v(`${prefix}.kode_pos`),
//     status_tempat_tinggal: v(`${prefix}.status_tempat_tinggal`),

//     kelurahan: {
//       id: v(`${prefix}.kelurahan.id`),
//       nama: v(`${prefix}.kelurahan.nama`),
//     },
//     kecamatan: {
//       id: v(`${prefix}.kelurahan.kecamatan.id`),
//       nama: v(`${prefix}.kelurahan.kecamatan.nama`),
//     },
//     kota: {
//       id: v(`${prefix}.kelurahan.kecamatan.kota.id`),
//       nama: v(`${prefix}.kelurahan.kecamatan.kota.nama`),
//     },
//     provinsi: {
//       id: v(`${prefix}.kelurahan.kecamatan.kota.provinsi.id`),
//       nama: v(`${prefix}.kelurahan.kecamatan.kota.provinsi.nama`),
//     },
//   });

//   const response = {
//     id_karyawan: val('id_karyawan'),
//     nik: val('nik'),
//     nama_lengkap: val('nama_lengkap'),
//     no_ktp: val('no_ktp'),
//     status_karyawan: v('status_karyawan.stat_karyawan_gp'),

//     alamatTempatTinggalDetail: extractAlamat('alamat_tempat_tinggal_detail'),
//     alamatKtpDetail: extractAlamat('alamat_ktp_detail'),
//   };

//   return ok(
//     c,
//     response,
//     `Berhasil mengambil Surat Kesepakatan Bersama untuk id ${id}`
//   );
// };

export const BPJS_Ketenagakerjaan = async (c: Context) => {
  const id = c.req.param('id');

  if (!id) {
    await logWarn('Parameter "id" wajib diisi');
    return badRequest(c, 'Parameter id wajib diisi');
  }

  const result = await service.BPJS_Ketenagakerjaan(id);

  if (!result.success) {
    return badRequest(c, result.message);
  }

  if (!result.data) {
    await logWarn(`Data BPJS Ketenagakerjaan untuk ID ${id} tidak ditemukan`);
    return notFound(
      c,
      `Data BPJS Ketenagakerjaan untuk ID ${id} tidak ditemukan`
    );
  }

  return ok(c, result.data, 'Berhasil ambil data BPJS Ketenagakerjaan');
};

export const surat_keterangan = async (c: Context) => {
  const id = c.req.param('id');

  if (!id) {
    await logWarn('Parameter "id" wajib diisi');
    return badRequest(c, 'Parameter id wajib diisi');
  }

  const result = await service.surat_keterangan(id);

  if (!result.success) {
    return badRequest(c, result.message);
  }

  if (!result.data) {
    await logWarn(`Data surat keterangan untuk ID ${id} tidak ditemukan`);
    return notFound(c, `Data surat keterangan untuk ID ${id} tidak ditemukan`);
  }

  return ok(
    c,
    result.data,
    `Berhasil ambil data surat keterangan untuk ID ${id}`
  );
};

export const pengunduran_diri = async (c: Context) => {
  const id = c.req.param('id');

  if (!id) {
    await logWarn('Parameter "id" wajib diisi');
    return badRequest(c, 'Parameter id wajib diisi');
  }

  await logInfo(`Memulai ambil data karyawan berdasarkan ID: ${id}`);

  const data = await service.pengunduran_diri(id);

  if (!data) {
    await logWarn(`Karyawan dengan ID ${id} tidak ditemukan`);
    return notFound(c, 'Karyawan tidak ditemukan');
  }
  const payload =
    typeof data === 'object' && data !== null && 'data' in data
      ? (data as { data?: unknown }).data
      : data;

  if (!payload || typeof payload !== 'object') {
    await logWarn(`Data karyawan dengan ID ${id} tidak valid`);
    return notFound(c, 'Karyawan tidak ditemukan');
  }

  // Convert ke plain object
  const plainData: Record<string, unknown> =
    'toJSON' in (payload as object) &&
    typeof (payload as { toJSON?: unknown }).toJSON === 'function'
      ? ((payload as { toJSON: () => unknown }).toJSON() as Record<
          string,
          unknown
        >)
      : (payload as unknown as Record<string, unknown>);

  const filteredData: Record<string, unknown> = {};

  Object.entries(plainData).forEach(([key, value]) => {
    const parts = key.split('.');

    // ===== 1. FIELD UTAMA =====
    if (parts.length === 1) {
      filteredData[key] = value;
      return;
    }

    // ===== 2. RELATIONAL FIELD =====
    let ref: Record<string, unknown> = filteredData;
    for (let i = 0; i < parts.length - 1; i++) {
      const p = parts[i];
      if (!ref[p]) ref[p] = {};
      ref = ref[p] as Record<string, unknown>;
    }

    ref[parts[parts.length - 1]] = value;
  });

  await logInfo(`✅ Berhasil ambil data karyawan: ${id}`);
  return ok(c, filteredData, `Berhasil ambil data karyawan: ${id}`);
};

// export const surat_penempatan = async (c: Context): Promise<Response> => {
//   const id = c.req.param('id');

//   if (!id) {
//     await logWarn('Parameter "id" wajib diisi');
//     return badRequest(c, 'Parameter id wajib diisi');
//   }

//   await logInfo(`Memulai ambil data karyawan berdasarkan ID: ${id}`);

//   const data = await service.surat_penempatan(id);

//   if (!data) {
//     await logWarn(`Karyawan dengan ID ${id} tidak ditemukan`);
//     return notFound(c, 'Karyawan tidak ditemukan');
//   }

//   // Convert data ke plain object
//   const payload =
//     typeof data === 'object' && data !== null && 'data' in data
//       ? (data as { data?: unknown }).data
//       : data;

//   if (!payload || typeof payload !== 'object') {
//     await logWarn(`Data karyawan dengan ID ${id} tidak valid`);
//     return notFound(c, 'Karyawan tidak ditemukan');
//   }

//   // ===== CONVERT KE PLAIN OBJECT =====
//   const plainData: Record<string, string | number | null | undefined> =
//     'toJSON' in (payload as object) &&
//     typeof (payload as { toJSON?: unknown }).toJSON === 'function'
//       ? ((payload as { toJSON: () => unknown }).toJSON() as Record<
//           string,
//           string | number | null | undefined
//         >)
//       : (payload as unknown as Record<
//           string,
//           string | number | null | undefined
//         >);

//   type FlatValue = string | number | null;

//   const filteredData: Record<string, FlatValue | Record<string, unknown>> = {};

//   Object.entries(plainData).forEach(([key, value]) => {
//     const parts = key.split('.');
//     const secondLastKey = parts[parts.length - 2];
//     const lastKey = parts[parts.length - 1];

//     const relationalKeys = [
//       'direktur',
//       'deputi',
//       'divisi',
//       'bagian',
//       'seksi',
//       'unit_kerja',
//       'jabatan',
//     ];

//     const pemisah: Record<string, string> = {
//       agama_detail: 'agama',
//     };

//     const excludeKeys = [
//       'sek_id',
//       'bag_id',
//       'div_id',
//       'dep_id',
//       'dir_id',
//       'jab_id',
//     ];

//     // Relational fields
//     if (
//       secondLastKey &&
//       relationalKeys.includes(secondLastKey) &&
//       !excludeKeys.includes(lastKey)
//     ) {
//       const mappedKey = pemisah[secondLastKey] ?? secondLastKey;
//       if (!filteredData[mappedKey]) filteredData[mappedKey] = {};
//       (filteredData[mappedKey] as Record<string, unknown>)[lastKey] = value;
//       return;
//     }

//     // Field utama
//     if (parts.length === 1) {
//       filteredData[key] = value as FlatValue;
//       return;
//     }

//     // Khusus status_karyawan_gp
//     if (key.endsWith('stat_karyawan_gp')) {
//       filteredData['kode_status_karyawan'] = String(value ?? '');
//       return;
//     }
//   });

//   await logInfo(`✅ Berhasil ambil data karyawan: ${id}`);
//   return ok(c, filteredData, `Berhasil ambil data karyawan: ${id}`);
// };

// src/types/alamat.type.ts

/** Record generic untuk hasil Sequelize (key dinamis, value bisa berbagai tipe) */
export interface AlamatRecord {
  [key: string]: string | number | boolean | null | undefined;
}

/** Struktur hasil akhir data alamat */
export interface AlamatDetail {
  id: string | null;
  alamat: string | null;
  rt: string | null;
  rw: string | null;
  kode_pos: string | null;
  status_tempat_tinggal: string | null;
  kelurahan: { id: string | null; nama: string | null };
  kecamatan: { id: string | null; nama: string | null };
  kota: { id: string | null; nama: string | null };
  provinsi: { id: string | null; nama: string | null };
}

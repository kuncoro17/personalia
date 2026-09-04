// src/types/prsKeluargaKaryawan.types.ts
export interface PrsKeluargaKaryawanAttributes {
  id: string;
  karyawan_id: string;
  nama_lengkap: string;
  nomor_identitas: string;
  tempat_lahir: string;
  tanggal_lahir: Date;
  no_telp: string;
  agama: number;
  gender: string;
  kewarganegaraan: string;
  pekerjaan: string;
  pendidikan: string;
  flag_status: number;
  hubungan: string;
  tanggungan_medical: number;
  kebijakan_khusus_medical: number;
  flag_berpisah: number;
  keterangan: string;
  created_at?: Date;
  updated_at?: Date;
}

// Tipe untuk input create (id, created_at, updated_at di-generate otomatis)
export type PrsKeluargaKaryawanCreateInput = Omit<
  PrsKeluargaKaryawanAttributes,
  'id' | 'created_at' | 'updated_at'
>;
export interface KeluargaRelasi extends PrsKeluargaKaryawanAttributes {
  agama_detail?: { agama: string };
  tempat_tinggal_keluarga_karyawan?: { nama_kota: string; kode_kota: string };
  nama_agama?: string | null;
  nama_kota?: string | null;
  kode_kota?: string | null;
}

export interface KeluargaDetail {
  keluarga_karyawan?: KeluargaRelasi[];
}

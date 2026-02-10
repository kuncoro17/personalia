// src/types/prsKaryawan.types.ts

// Ambil struktur utama dari model
export interface PrsKaryawanAttributes {
  id_karyawan: string;
  nik?: string;
  no_ktp?: string;
  status_aktif?: string;
  foto?: string;
  nama_lengkap?: string;
  nama_panggilan?: string;
  telp_pribadi?: string;
  telp_kantor?: string;
  email_pribadi?: string;
  email_penabur?: string;
  tgl_join_penabur?: Date | string;
  tgl_join_penabur_jkt?: Date | string;

  agama?: number;
  status_nikah?: string;
  tanggal_pernikahan?: Date;
  tipe_sekolah?: string;
  kode_status_karyawan?: string;
  tgl_status_permanen?: Date;
  tgl_penuh_waktu?: Date;
  tanggal_inactive?: Date;
  alasan_berhenti_kerja?: string;
  atasan_langsung?: string;
  atasan_tidak_langsung?: string;
  alamat_ktp?: string;
  alamat_tempat_tinggal?: string;
  tempat_lahir?: string;
  birth_date?: Date;
  gender?: string;
  gol_darah?: string;
  tinggi_badan?: number;
  berat_badan?: number;
  kewarganegaraan?: string;
  anggota_gereja?: string;
  instagram?: string;
  twitter?: string;
  no_kitas?: string;
  no_visa?: string;
  no_tabita?: string;
  npwp?: string;
  rekening?: string;
  kode_golongan?: string;
  no_bpjs_kesehatan?: string;
  no_bpjs_ketenagakerjaan?: string;
  no_bpjs_danpes?: string;
  nama_bpjs_danpes?: string;
  etnis?: string;
  no_pasport?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}
export interface KontakDaruratRecord {
  nama_kondar: string;
  hubungan_kondar: string;
  telp_darurat: string;
  alamat_kondar: string;
}

// Input untuk create (tanpa id & timestamps, sisanya optional sesuai kebutuhan form)
export type PrsKaryawanCreateInput = Omit<
  PrsKaryawanAttributes,
  'id_karyawan' | 'created_at' | 'updated_at' | 'deleted_at'
>;

// Input untuk update (semua opsional, kecuali id/timestamps)
export type PrsKaryawanUpdateInput = Partial<
  Omit<
    PrsKaryawanAttributes,
    'id_karyawan' | 'created_at' | 'updated_at' | 'deleted_at'
  >
>;

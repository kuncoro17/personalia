import { z } from 'zod';

// ============================
// 🧩 Zod Schema Berdasarkan Model PrsKaryawan
// ============================

export const PrsKaryawanSchema = z.object({
  id_karyawan: z.string().uuid(),
  nik: z.string().nullable().optional(),
  no_ktp: z.string().nullable().optional(),
  status_aktif: z.string().nullable().optional(),
  foto: z.string().nullable().optional(),
  nama_lengkap: z.string().nullable().optional(),
  nama_panggilan: z.string().nullable().optional(),
  telp_pribadi: z.string().nullable().optional(),
  telp_kantor: z.string().nullable().optional(),
  email_pribadi: z.string().email().nullable().optional(),
  email_penabur: z.string().email().nullable().optional(),
  tgl_join_penabur: z.string().nullable().optional(),
  tgl_join_penabur_jkt: z.string().nullable().optional(),
  agama: z.number().nullable().optional(),
  status_nikah: z.string().nullable().optional(),
  tanggal_pernikahan: z.string().nullable().optional(),
  tipe_sekolah: z.string().nullable().optional(),
  kode_status_karyawan: z.string().nullable().optional(),
  tgl_status_permanen: z.string().nullable().optional(),
  tgl_penuh_waktu: z.string().nullable().optional(),
  tanggal_inactive: z.string().nullable().optional(),
  alasan_berhenti_kerja: z.string().nullable().optional(),
  atasan_langsung: z.string().nullable().optional(),
  atasan_tidak_langsung: z.string().nullable().optional(),
  alamat_ktp: z.string().uuid().nullable().optional(),
  alamat_tempat_tinggal: z.string().uuid().nullable().optional(),
  tempat_lahir: z.string().uuid().nullable().optional(),
  birth_date: z.string().nullable().optional(),
  gender: z.string().nullable().optional(),
  gol_darah: z.string().nullable().optional(),
  tinggi_badan: z.number().nullable().optional(),
  berat_badan: z.number().nullable().optional(),
  kewarganegaraan: z.string().nullable().optional(),
  anggota_gereja: z.string().nullable().optional(),
  instagram: z.string().nullable().optional(),
  twitter: z.string().nullable().optional(),
  no_kitas: z.string().nullable().optional(),
  no_visa: z.string().nullable().optional(),
  no_tabita: z.string().nullable().optional(),
  npwp: z.string().nullable().optional(),
  rekening: z.string().nullable().optional(),
  kode_golongan: z.string().nullable().optional(),
  no_bpjs_kesehatan: z.string().nullable().optional(),
  no_bpjs_ketenagakerjaan: z.string().nullable().optional(),
  no_bpjs_danpes: z.string().nullable().optional(),
  nama_bpjs_danpes: z.string().nullable().optional(),
  etnis: z.string().nullable().optional(),
  no_pasport: z.string().nullable().optional(),
  created_at: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional(),
});

// ============================
// 📦 Array Schema untuk list
// ============================

export const PrsKaryawanListSchema = z.array(PrsKaryawanSchema);

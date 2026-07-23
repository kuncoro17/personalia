import { z } from 'zod';

export const prsKaryawanSchema = z.object({
  nik: z
    .string()
    .trim()
    .regex(/^[0-9]{7,16}$/, {
      message: 'NIK harus berupa angka minimal 7 digit',
    }),
  no_ktp: z
    .string()
    .trim()
    .regex(/^[0-9]{16}$/, { message: 'No KTP harus berupa angka 16 digit' }),
  id_karyawan: z.uuid().optional(),
  status_aktif: z.string(),
  foto: z.string().optional(),
  nama_lengkap: z.string().max(255),
  nama_panggilan: z.string().max(100),
  telp_pribadi: z.string().max(15).optional(),
  telp_kantor: z.string().max(15).optional(),
  email_pribadi: z.string().email().max(100),
  email_penabur: z.string().email().max(100),
  tgl_join_penabur: z.string().optional(), // ISO format: YYYY-MM-DD
  tgl_join_penabur_jkt: z.string().optional(),
  agama: z.union([z.string(), z.number()]).optional(),
  status_nikah: z.string().optional(),
  tanggal_pernikahan: z.string().optional(),
  tipe_sekolah: z.string().optional(),
  kode_status_karyawan: z.string().max(5).optional(),
  tgl_status_permanen: z.string().optional(),
  tgl_penuh_waktu: z.string().optional(),
  tanggal_inactive: z.string().nullable().optional(),
  alasan_berhenti_kerja: z.string().max(100).optional(),
  atasan_langsung: z.string().max(255).optional(),
  atasan_tidak_langsung: z.string().max(255).optional(),
  alamat_ktp: z.string().uuid().optional(),
  alamat_tempat_tinggal: z.string().uuid().optional(),
  tempat_lahir: z.string().optional(),
  birth_date: z.string().optional(),
  gender: z.string().optional(),
  gol_darah: z.string().max(3).optional(),
  tinggi_badan: z.union([z.string(), z.number()]).optional(),
  berat_badan: z.union([z.string(), z.number()]).optional(),
  id_master_setempat: z.union([z.string(), z.number()]).optional(),
  kewarganegaraan: z.string().optional(),
  anggota_gereja: z.string().max(255).optional(),
  instagram: z.string().max(100).optional(),
  twitter: z.string().max(100).optional(),
  no_kitas: z.string().max(20).optional(),
  no_visa: z.string().max(20).optional(),
  no_tabita: z.string().max(20).optional(),
  npwp: z.string().max(20).optional(),
  rekening: z.string().max(20).optional(),
  kode_golongan: z.string().max(20).optional(),
  no_bpjs_kesehatan: z.string().max(20).optional(),
  no_bpjs_ketenagakerjaan: z.string().max(20).optional(),
  no_bpjs_danpes: z.string().max(20).optional(),
  nama_bpjs_danpes: z.string().max(255).optional(),
  etnis: z.string().max(150).optional(),
  no_pasport: z.string().max(150).optional(),
});

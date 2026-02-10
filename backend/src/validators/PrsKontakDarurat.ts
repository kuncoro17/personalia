import { z } from 'zod';

export const kontakDaruratSchema = z.object({
  karyawan_id: z.string().uuid(),
  nama_kondar: z.string().min(1, 'Nama kontak darurat tidak boleh kosong'),
  telp_darurat: z.string().optional(),
  email: z.string().email('Format email tidak valid'),
  kategori_kontak: z.string(),
  no_hp: z.string(),
  hubungan_kondar: z.string(),
  alamat_kondar: z.string(),
});

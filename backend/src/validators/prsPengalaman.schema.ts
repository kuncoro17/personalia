import { z } from 'zod';

export const prsPengalamanSchema = z.object({
  karyawan_id: z.string().uuid(),
  nama_perusahaan: z.string().min(1),
  jabatan: z.string().min(1),
  mulai_bekerja: z.coerce.date(),
  berhenti_bekerja: z.coerce.date(),
  alasan_berhenti: z.string().optional(),
});

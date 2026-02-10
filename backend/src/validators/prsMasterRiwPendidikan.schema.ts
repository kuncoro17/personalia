import { z } from 'zod';

export const prsMasterRiwPendidikanSchema = z.object({
  univ: z.string().min(1, 'Universitas wajib diisi'),
  tingkat: z.string().min(1, 'Tingkat wajib diisi'),
});

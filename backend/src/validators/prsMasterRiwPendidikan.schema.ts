import { z } from 'zod';

export const prsMasterRiwPendidikanSchema = z.object({
  univ: z
    .string()
    .trim()
    .min(1, 'Universitas wajib diisi')
    .max(255, 'Universitas maksimal 255 karakter'),
});

import { z } from 'zod';

export const prsMasterAgamaSchema = z.object({
  agama: z
    .string()
    .min(1, 'Agama wajib diisi')
    .max(20, 'Agama maksimal 20 karakter'),
});

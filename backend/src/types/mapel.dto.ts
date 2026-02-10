// src/dto/mapel.dto.ts
import { z } from 'zod';

// Zod schema
export const CreateMapelSchema = z.object({
  nama_mapel: z
    .string()
    .min(1, 'Nama mapel wajib diisi')
    .max(100, 'Nama mapel maksimal 100 karakter'),
});

export const UpdateMapelSchema = z.object({
  nama_mapel: z
    .string()
    .min(1, 'Nama mapel wajib diisi')
    .max(100, 'Nama mapel maksimal 100 karakter')
    .optional(),
});

// DTO types (untuk dipakai di service/controller)
export type CreateMapelDTO = z.infer<typeof CreateMapelSchema>;
export type UpdateMapelDTO = z.infer<typeof UpdateMapelSchema>;

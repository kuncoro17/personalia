// services/prsDivisiService.ts
import * as repo from '../repositories/prsDivisiRepository';
import { z } from 'zod';
import {
  BadRequestException,
  NotFoundException,
} from '../utils/http-exception';
import xss from 'xss';
import { PrsDivisiCreationAttributes } from '../models/PrsDivisi';

const divisiSchema = z.object({
  kode: z
    .string()
    .max(5, 'Kode maksimal 5 karakter')
    .nonempty('Kode wajib diisi'),
  nama_div: z
    .string()
    .max(255, 'Nama divisi maksimal 255 karakter')
    .nonempty('Nama divisi wajib diisi'),
});
function sanitize(
  data: PrsDivisiCreationAttributes
): PrsDivisiCreationAttributes {
  return {
    kode: xss(data.kode ?? '').trim(),
    nama_div: xss(data.nama_div ?? '').trim(),
  };
}

export const getAll = () => repo.findAll();

export const getById = async (id: string) => {
  const sanitizedId = xss(id);
  const data = await repo.findById(sanitizedId);
  if (!data) throw new NotFoundException('Divisi tidak ditemukan');
  return data;
};

export const create = async (body: unknown) => {
  const parsed = divisiSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues.map(i => i.message).join(', ');
    throw new BadRequestException(message);
  }
  const sanitized = sanitize(parsed.data);
  return repo.create(sanitized);
};

export const update = async (id: string, body: unknown) => {
  const parsed = divisiSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues.map(i => i.message).join(', ');
    throw new BadRequestException(message);
  }

  const sanitizedId = xss(id);
  const exist = await repo.findById(sanitizedId);
  if (!exist) throw new NotFoundException('Divisi tidak ditemukan');

  const sanitized = sanitize(parsed.data);
  await repo.update(sanitizedId, sanitized);
  return repo.findById(sanitizedId);
};

export const remove = async (id: string) => {
  const sanitizedId = xss(id);
  const exist = await repo.findById(sanitizedId);
  if (!exist) throw new NotFoundException('Divisi tidak ditemukan');
  return repo.hardDelete(sanitizedId);
};

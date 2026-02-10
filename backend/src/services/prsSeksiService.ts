import repo from '../repositories/prsSeksiRepo';
import xss from 'xss';
import {
  BadRequestException,
  NotFoundException,
} from '../utils/http-exception';
import {
  PrsSeksiAttributes,
  PrsSeksiCreationAttributes,
} from '../models/PrsSeksi';

// Validasi UUID
function isValidUUID(id: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

// Sanitasi input string saja
function sanitizeObject<T extends Record<string, unknown>>(
  input: Partial<T>
): Partial<T> {
  const sanitized: Partial<T> = {};
  for (const key in input) {
    const val = input[key];
    if (val !== undefined) {
      sanitized[key] =
        typeof val === 'string' ? (xss(val) as unknown as T[typeof key]) : val;
    }
  }
  return sanitized;
}

class PrsSeksiService {
  async getAll(): Promise<PrsSeksiAttributes[]> {
    const data = await repo.findAll();
    // pastikan kode tidak null jika mau dijadikan string
    return data.map(d => ({ ...d, kode: d.kode ?? '' }));
  }

  async getById(id: string): Promise<PrsSeksiAttributes> {
    const sanitizedId = xss(id);
    if (!isValidUUID(sanitizedId))
      throw new BadRequestException('Format ID tidak sesuai UUID');

    const data = await repo.findById(sanitizedId);
    if (!data) throw new NotFoundException('ID tidak ditemukan');

    return { ...data, kode: data.kode ?? '' };
  }

  private validate(data: PrsSeksiCreationAttributes) {
    const issues: string[] = [];

    if (!data.kode || data.kode.length > 5) {
      issues.push('Kode maksimal 5 karakter');
    }

    if (!data.nama_sek || data.nama_sek.trim() === '') {
      issues.push('Nama SEKSI wajib diisi');
    }

    if (issues.length) throw new BadRequestException(issues.join(', '));
  }

  async create(data: PrsSeksiCreationAttributes): Promise<PrsSeksiAttributes> {
    const clean = sanitizeObject(data);
    this.validate(clean as PrsSeksiCreationAttributes);
    const created = await repo.create(clean as PrsSeksiCreationAttributes);
    return { ...created, kode: created.kode ?? '' };
  }

  async update(
    id: string,
    data: Partial<PrsSeksiAttributes>
  ): Promise<PrsSeksiAttributes> {
    const sanitizedId = xss(id);
    if (!isValidUUID(sanitizedId))
      throw new BadRequestException('Format ID tidak sesuai UUID');

    const clean = sanitizeObject(data);
    const updated = await repo.update(sanitizedId, clean);
    if (!updated) throw new NotFoundException('ID tidak ditemukan');

    return { ...updated, kode: updated.kode ?? '' };
  }

  async delete(id: string): Promise<boolean> {
    const sanitizedId = xss(id);
    if (!isValidUUID(sanitizedId))
      throw new BadRequestException('Format ID tidak sesuai UUID');

    const deleted = await repo.delete(sanitizedId);
    if (!deleted) throw new NotFoundException('ID tidak ditemukan');

    return deleted;
  }
  async getSeksiByKodeBagian(kode_bagian: string) {
    if (!kode_bagian || kode_bagian.trim() === '') {
      throw new BadRequestException('kode_bagian harus diisi');
    }

    const data = await repo.findByKodeBagian(kode_bagian.trim());
    return data;
  }
}

export default new PrsSeksiService();

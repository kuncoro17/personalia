import {
  BadRequestException,
  NotFoundException,
} from '../utils/http-exception';
import xss from 'xss';
import { PrsJabatanRepository } from '../repositories/prsJabatanRepository';
import { z } from 'zod';

// ✅ Validasi input sesuai model
const jabatanSchema = z.object({
  kode_jab: z.string().min(1, 'Kode jabatan wajib diisi'),
  jabatan: z.string().min(1, 'Nama jabatan wajib diisi'),
});

type JabatanInput = z.infer<typeof jabatanSchema>;

export class PrsJabatanService {
  private repository = new PrsJabatanRepository();

  async getAll() {
    return await this.repository.findAll();
  }

  async getById(id: string) {
    const data = await this.repository.findById(id);
    if (!data) throw new NotFoundException('Jabatan tidak ditemukan');
    return data;
  }

  async create(data: unknown) {
    try {
      const parsed: JabatanInput = jabatanSchema.parse(data);

      const sanitized: JabatanInput = {
        ...parsed,
        kode_jab: xss(parsed.kode_jab),
        jabatan: xss(parsed.jabatan),
      };

      return await this.repository.create(sanitized);
    } catch (err) {
      if (err instanceof z.ZodError) {
        throw new BadRequestException(
          err.issues.map(e => e.message).join(', ')
        );
      }
      throw err;
    }
  }

  async update(id: string, data: unknown) {
    const existing = await this.repository.findById(id);
    if (!existing) throw new NotFoundException('Jabatan tidak ditemukan');

    try {
      const parsed: Partial<JabatanInput> = jabatanSchema.partial().parse(data);
      const sanitized = {
        ...parsed,
        kode_jab: parsed.kode_jab ? xss(parsed.kode_jab) : existing.kode_jab,
        jabatan: parsed.jabatan ? xss(parsed.jabatan) : existing.jabatan,
      };

      return await this.repository.update(id, sanitized);
    } catch (err) {
      if (err instanceof z.ZodError) {
        throw new BadRequestException(
          err.issues.map(e => e.message).join(', ')
        );
      }
      throw err;
    }
  }

  async delete(id: string) {
    const deleted = await this.repository.softDelete(id);
    if (!deleted) throw new NotFoundException('Jabatan tidak ditemukan');
    return deleted;
  }
}

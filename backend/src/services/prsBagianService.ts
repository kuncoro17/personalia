import repo from '../repositories/prsBagianRepo';
import { HTTPException } from 'hono/http-exception';
import xss from 'xss';
import {
  PrsBagianAttributes,
  PrsBagianCreationAttributes,
} from '../models/PrsBagian';

class PrsBagianService {
  private sanitize(
    data: Partial<PrsBagianAttributes>
  ): PrsBagianCreationAttributes {
    return {
      kode: data.kode ? xss(data.kode.trim()) : '',
      nama_bag: data.nama_bag ? xss(data.nama_bag.trim()) : '',
      alamat: data.alamat ? xss(data.alamat.trim()) : '',
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }

  private validate(data: Partial<PrsBagianAttributes>): void {
    const issues: string[] = [];
    if (!data.kode || data.kode.length > 5) {
      issues.push('Kode maksimal terdiri dari 5 karakter');
    }
    if (!data.nama_bag || data.nama_bag.trim() === '') {
      issues.push('Nama bagian tidak boleh kosong');
    }
    if (issues.length > 0) {
      throw new HTTPException(400, { message: issues.join(', ') });
    }
  }

  async getAll() {
    return repo.findAll();
  }

  async getById(id: string) {
    const sanitizedId = xss(id);
    const data = await repo.findById(sanitizedId);
    if (!data) {
      throw new HTTPException(404, { message: 'Bagian tidak ditemukan' });
    }
    return data;
  }

  async create(data: Partial<PrsBagianAttributes>) {
    this.validate(data);
    const sanitized = this.sanitize(data);
    return repo.create(sanitized);
  }

  async update(id: string, data: Partial<PrsBagianAttributes>) {
    this.validate(data);
    const sanitizedId = xss(id);
    const sanitized = this.sanitize(data);
    const updated = await repo.update(sanitizedId, sanitized);
    if (!updated) {
      throw new HTTPException(404, { message: 'Bagian tidak ditemukan' });
    }
    return updated;
  }

  async delete(id: string) {
    const sanitizedId = xss(id);
    const deleted = await repo.delete(sanitizedId);
    if (!deleted) {
      throw new HTTPException(404, { message: 'Bagian tidak ditemukan' });
    }
    return deleted;
  }
  async getUnitKerjaByDivisi(kode_divisi: string) {
    if (!kode_divisi || kode_divisi.trim() === '') {
      throw new HTTPException(404, { message: 'kode_divisi harus diisi' });
    }

    const data = await repo.findByKodeDivisi(kode_divisi.trim());
    return data;
  }
}

export default new PrsBagianService();

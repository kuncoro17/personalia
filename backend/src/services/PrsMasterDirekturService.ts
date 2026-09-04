import repo from '../repositories/PrsMasterDirekturRepository';
import xss from 'xss';
import {
  BadRequestException,
  NotFoundException,
} from '../utils/http-exception';

interface DirpelInput {
  kode: string;
  nama_dir: string;
  alamat?: string;
}

function sanitize(data: DirpelInput) {
  return {
    kode: xss(data.kode),
    nama_dir: xss(data.nama_dir),
    alamat: xss(data.alamat ?? ''),
    created_at: new Date(),
    updated_at: new Date(),
  };
}

export default {
  async getAll() {
    return await repo.findAll();
  },

  async getById(id: string) {
    const data = await repo.findById(id);
    if (!data) throw new NotFoundException('Dirpel tidak ditemukan');
    return data;
  },

  async getByKode(kode: string) {
    const sanitizedKode = xss(kode || '');
    if (!sanitizedKode)
      throw new BadRequestException('Parameter kode wajib diisi');

    const data = await repo.findByKode(sanitizedKode);
    if (!data) throw new NotFoundException('Data Dirpel tidak ditemukan');

    return data;
  },

  async create(data: DirpelInput) {
    if (!data.kode || !data.nama_dir) {
      throw new BadRequestException('Field wajib tidak lengkap');
    }

    const existing = await repo.findByKode(data.kode);
    if (existing) throw new BadRequestException('Kode sudah digunakan');

    const sanitized = sanitize(data);
    return await repo.create(sanitized);
  },

  async update(id: string, data: DirpelInput) {
    if (!data.kode || !data.nama_dir) {
      throw new BadRequestException('Field wajib tidak lengkap');
    }

    const updated = await repo.update(id, {
      ...sanitize(data),
      updated_at: new Date(),
    });

    if (!updated) throw new NotFoundException('Dirpel tidak ditemukan');
    return { message: 'Data Dirpel berhasil diperbarui' };
  },

  async delete(id: string) {
    const deleted = await repo.delete(id);
    if (!deleted) throw new NotFoundException('Dirpel tidak ditemukan');
    return { message: 'Data Dirpel berhasil dihapus' };
  },
};

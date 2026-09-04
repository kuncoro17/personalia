import PrsMasterDeputiRepository from '../repositories/prsMasterDeputiRepo';
import xss from 'xss';
import {
  BadRequestException,
  NotFoundException,
} from '../utils/http-exception';

interface DeputiInput {
  kode: string;
  nama_dep: string;
  alamat?: string;
}

function sanitize(data: DeputiInput) {
  return {
    kode: xss(data.kode),
    nama_dep: xss(data.nama_dep),
    alamat: xss(data.alamat ?? ''),
    created_at: new Date(),
    updated_at: new Date(),
  };
}

export default {
  async getAll() {
    return await PrsMasterDeputiRepository.findAll();
  },

  async getById(id: string) {
    const data = await PrsMasterDeputiRepository.findById(id);
    if (!data) throw new NotFoundException('Deputi tidak ditemukan');
    return data;
  },

  async getByKode(kode: string) {
    const sanitizedKode = xss(kode || '');
    if (!sanitizedKode)
      throw new BadRequestException('Parameter kode wajib diisi');

    const data = await PrsMasterDeputiRepository.findByKode(sanitizedKode);
    if (!data) throw new NotFoundException('Data deputi tidak ditemukan');

    return data;
  },

  async create(data: DeputiInput) {
    if (!data.kode || !data.nama_dep) {
      throw new BadRequestException('Field wajib tidak lengkap');
    }

    const existing = await PrsMasterDeputiRepository.findByKode(data.kode);
    if (existing) throw new BadRequestException('Kode sudah digunakan');

    const sanitized = sanitize(data);
    return await PrsMasterDeputiRepository.create(sanitized);
  },

  async update(id: string, data: DeputiInput) {
    if (!data.kode || !data.nama_dep) {
      throw new BadRequestException('Field wajib tidak lengkap');
    }

    const updated = await PrsMasterDeputiRepository.update(id, {
      ...sanitize(data),
      updated_at: new Date(),
    });

    if (!updated) throw new NotFoundException('Deputi tidak ditemukan');
    return { message: 'Data deputi berhasil diperbarui' };
  },

  async delete(id: string) {
    const deleted = await PrsMasterDeputiRepository.delete(id);
    if (!deleted) throw new NotFoundException('Deputi tidak ditemukan');
    return { message: 'Data deputi berhasil dihapus' };
  },
};

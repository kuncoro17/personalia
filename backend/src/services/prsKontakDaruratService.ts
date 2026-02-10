// src/services/prsKontakDaruratService.ts
import { prsKontakDaruratRepository } from '../repositories/prsKontakDaruratRepo';
import xss from 'xss';
import {
  BadRequestException,
  NotFoundException,
} from '../utils/http-exception';

export interface PrsKontakDaruratCreateInput {
  karyawan_id: string;
  nama_kondar: string;
  telp_darurat?: string | null;
  email?: string | null;
  kategori_kontak?: string | null;
  no_hp?: string | null;
  hubungan_kondar?: string | null;
  alamat_kondar?: string | null;
}

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function sanitize(
  data: PrsKontakDaruratCreateInput
): PrsKontakDaruratCreateInput {
  return {
    karyawan_id: xss(data.karyawan_id),
    nama_kondar: xss(data.nama_kondar),
    telp_darurat: data.telp_darurat ? xss(data.telp_darurat) : null,
    email: data.email ? xss(data.email) : null,
    kategori_kontak: data.kategori_kontak ? xss(data.kategori_kontak) : null,
    no_hp: data.no_hp ? xss(data.no_hp) : null,
    hubungan_kondar: data.hubungan_kondar ? xss(data.hubungan_kondar) : null,
    alamat_kondar: data.alamat_kondar ? xss(data.alamat_kondar) : null,
  };
}

class PrsKontakDaruratService {
  async getAll() {
    return await prsKontakDaruratRepository.findAll();
  }

  async getById(id: string) {
    if (!uuidRegex.test(id)) {
      throw new BadRequestException('Format ID tidak sesuai UUID');
    }
    const data = await prsKontakDaruratRepository.findById(id);
    if (!data) throw new NotFoundException('ID tidak ditemukan');
    return data;
  }

  private validate(data: PrsKontakDaruratCreateInput) {
    const issues: string[] = [];

    if (!data.karyawan_id) issues.push('Karyawan ID wajib diisi');
    if (!data.nama_kondar) issues.push('Nama kontak wajib diisi');

    if (data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        issues.push('Format email tidak valid');
      }
    }

    if (issues.length) throw new BadRequestException(issues.join(', '));
  }

  async create(data: PrsKontakDaruratCreateInput) {
    this.validate(data);
    return await prsKontakDaruratRepository.create(sanitize(data));
  }

  async update(id: string, data: PrsKontakDaruratCreateInput) {
    if (!uuidRegex.test(id)) {
      throw new BadRequestException('Format ID tidak sesuai UUID');
    }
    this.validate(data);
    const updated = await prsKontakDaruratRepository.update(id, sanitize(data));
    if (!updated) throw new NotFoundException('ID tidak ditemukan');
    return updated;
  }

  async delete(id: string) {
    if (!uuidRegex.test(id)) {
      throw new BadRequestException('Format ID tidak sesuai UUID');
    }
    const deleted = await prsKontakDaruratRepository.delete(id);
    if (!deleted) throw new NotFoundException('ID tidak ditemukan');
    return true;
  }
}

export const prsKontakDaruratService = new PrsKontakDaruratService();

import PrsKontakDarurat from '../models/prsKontakDarurat';
import xss from 'xss';
import { PrsKontakDaruratCreateInput } from '../types/prsKontakDarurat.types';

class PrsKontakDaruratRepository {
  async findAll(limit = 100): Promise<PrsKontakDarurat[]> {
    return await PrsKontakDarurat.findAll({ order: [['id', 'ASC']], limit });
  }

  async findById(id: string): Promise<PrsKontakDarurat | null> {
    return await PrsKontakDarurat.findByPk(id);
  }
  async create(data: PrsKontakDaruratCreateInput): Promise<PrsKontakDarurat> {
    const sanitized: PrsKontakDaruratCreateInput = {
      karyawan_id: xss(data.karyawan_id),
      nama_kondar: xss(data.nama_kondar),
      telp_darurat: data.telp_darurat ? xss(data.telp_darurat) : undefined,
      email: data.email ? xss(data.email) : undefined,
      kategori_kontak: data.kategori_kontak
        ? xss(data.kategori_kontak)
        : undefined,
      no_hp: data.no_hp ? xss(data.no_hp) : undefined,
      hubungan_kondar: data.hubungan_kondar
        ? xss(data.hubungan_kondar)
        : undefined,
      alamat_kondar: data.alamat_kondar ? xss(data.alamat_kondar) : undefined,
    };

    return await PrsKontakDarurat.create(sanitized);
  }

  async update(
    id: string,
    data: Partial<PrsKontakDaruratCreateInput>
  ): Promise<PrsKontakDarurat | null> {
    const kontak = await PrsKontakDarurat.findByPk(id);
    if (!kontak) return null;
    return await kontak.update(data);
  }

  async delete(id: string): Promise<boolean> {
    const kontak = await PrsKontakDarurat.findByPk(id);
    if (!kontak) return false;
    await kontak.destroy();
    return true;
  }
}

export const prsKontakDaruratRepository = new PrsKontakDaruratRepository();

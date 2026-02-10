import { PrsMasterKotRepository } from '../repositories/prsMasterKotRepo';

import {
  BadRequestException,
  NotFoundException,
} from '../utils/http-exception';
import xss from 'xss';

export interface CreateKotDTO {
  nama: string;
  prov_id: string; // UUID
}

export interface UpdateKotDTO {
  nama?: string;
  prov_id?: string;
}

class PrsMasterKotService {
  private repo = new PrsMasterKotRepository();

  private sanitizeCreateDTO(data: CreateKotDTO): CreateKotDTO {
    return {
      nama: xss(data.nama),
      prov_id: xss(data.prov_id),
    };
  }

  private sanitizeUpdateDTO(data: UpdateKotDTO): UpdateKotDTO {
    return {
      nama: data.nama ? xss(data.nama) : undefined,
      prov_id: data.prov_id ? xss(data.prov_id) : undefined,
    };
  }

  async findAll() {
    return await this.repo.findAll();
  }

  async findById(id: string) {
    const data = await this.repo.findById(id);
    if (!data) throw new NotFoundException('Data kota tidak ditemukan');
    return data;
  }

  async findByIdProv(prov_id: string) {
    const data = await this.repo.findByIdProv(prov_id);
    if (!data || data.length === 0) {
      throw new NotFoundException(
        'Data kota untuk provinsi ini tidak ditemukan'
      );
    }
    return data;
  }

  async create(data: CreateKotDTO) {
    const clean = this.sanitizeCreateDTO(data);

    if (!clean.nama || !clean.prov_id) {
      throw new BadRequestException('Nama dan prov_id wajib diisi');
    }

    // insert ke DB
    const created = await this.repo.create(clean);
    return created;
  }

  async update(id: string, data: UpdateKotDTO) {
    const clean = this.sanitizeUpdateDTO(data);
    const updated = await this.repo.update(id, clean);
    if (!updated) throw new NotFoundException('Data kota tidak ditemukan');
    return updated;
  }

  async delete(id: string) {
    const deleted = await this.repo.delete(id);
    if (!deleted) throw new NotFoundException('Data kota tidak ditemukan');
    return deleted;
  }
}

export default new PrsMasterKotService();

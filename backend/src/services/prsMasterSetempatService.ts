import xss from 'xss';
import { PrsMasterSetempatRepository } from '../repositories/prsMasterSetempatRepo';
import {
  BadRequestException,
  NotFoundException,
} from '../utils/http-exception';

export interface CreateSetempatDTO {
  kota_setempat: string;
}

export interface UpdateSetempatDTO {
  kota_setempat?: string;
}

const parseId = (id: string): number => {
  const asNumber = Number(id);
  if (!Number.isInteger(asNumber) || asNumber <= 0) {
    throw new BadRequestException('ID tidak valid');
  }
  return asNumber;
};

class PrsMasterSetempatService {
  private repo = new PrsMasterSetempatRepository();

  private sanitizeCreateDTO(data: CreateSetempatDTO): CreateSetempatDTO {
    return { kota_setempat: xss(data.kota_setempat) };
  }

  private sanitizeUpdateDTO(data: UpdateSetempatDTO): UpdateSetempatDTO {
    return {
      kota_setempat: data.kota_setempat ? xss(data.kota_setempat) : undefined,
    };
  }

  async findAll() {
    return await this.repo.findAll();
  }

  async findById(id: string) {
    const parsedId = parseId(id);
    const data = await this.repo.findById(parsedId);
    if (!data) throw new NotFoundException('Data setempat tidak ditemukan');
    return data;
  }

  async create(data: CreateSetempatDTO) {
    const clean = this.sanitizeCreateDTO(data);
    if (!clean.kota_setempat)
      throw new BadRequestException('kota_setempat wajib diisi');
    return await this.repo.create(clean);
  }

  async update(id: string, data: UpdateSetempatDTO) {
    const parsedId = parseId(id);
    const clean = this.sanitizeUpdateDTO(data);
    const updated = await this.repo.update(parsedId, clean);
    if (!updated) throw new NotFoundException('Data setempat tidak ditemukan');
    return updated;
  }

  async delete(id: string) {
    const parsedId = parseId(id);
    const deleted = await this.repo.delete(parsedId);
    if (!deleted) throw new NotFoundException('Data setempat tidak ditemukan');
    return deleted;
  }
}

export default new PrsMasterSetempatService();

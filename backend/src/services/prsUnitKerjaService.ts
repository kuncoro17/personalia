import { PrsUnitKerjaRepository } from '../repositories/prsUnitKerjaRepo';
import {
  PrsUnitKerjaAttributes,
  PrsUnitKerjaCreateInput,
} from '../types/prsUnitKerja.types';
import {
  BadRequestException,
  NotFoundException,
} from '../utils/http-exception';
import xss from 'xss';
import { v4 as uuidv4 } from 'uuid';
import { logError, logInfo } from '../utils/log.helper';
const repository = new PrsUnitKerjaRepository();

function sanitizeObject(
  input: Partial<PrsUnitKerjaCreateInput>
): Partial<PrsUnitKerjaCreateInput> {
  const allowedFields: (keyof PrsUnitKerjaCreateInput)[] = [
    'kode_seksi',
    'kode_bagian',
    'kode_divisi',
  ];

  const sanitized: Partial<PrsUnitKerjaCreateInput> = {};
  for (const key of allowedFields) {
    const value = input[key];
    if (value !== null && value !== undefined) {
      sanitized[key] = typeof value === 'string' ? xss(value) : value;
    }
  }
  return sanitized;
}

export class PrsUnitKerjaService {
  async getAll(): Promise<PrsUnitKerjaAttributes[]> {
    return await repository.findAll();
  }
  async getAllUnitKerja1() {
    const data = await repository.findAllunitKerja();
    if (!data || data.length === 0) {
      throw new BadRequestException('Data unit kerja tidak ditemukan');
    }
    return data;
  }
  async getById(id: string): Promise<PrsUnitKerjaAttributes> {
    const data = await repository.findById(xss(id));
    if (!data) throw new NotFoundException('Unit kerja tidak ditemukan');
    return data;
  }

  async create(data: PrsUnitKerjaCreateInput): Promise<PrsUnitKerjaAttributes> {
    const sanitized: PrsUnitKerjaCreateInput = {
      uk_id: uuidv4(),
      kode_seksi: xss(data.kode_seksi),
      kode_bagian: xss(data.kode_bagian),
      kode_divisi: xss(data.kode_divisi),
      kode_direktur: data.kode_direktur ? xss(data.kode_direktur) : null,
      kode_deputi: data.kode_deputi ? xss(data.kode_deputi) : null,
    };

    // validasi panjang kode
    if (sanitized.kode_seksi.length > 5) {
      throw new BadRequestException('kode_seksi harus 3 karakter');
    }
    if (sanitized.kode_bagian.length > 5) {
      throw new BadRequestException('kode_bagian harus 3 karakter');
    }
    if (sanitized.kode_divisi.length > 5) {
      throw new BadRequestException('kode_divisi harus 3 karakter');
    }

    return await repository.create(sanitized);
  }

  async update(id: string, data: Partial<PrsUnitKerjaCreateInput>) {
    const sanitizedData = sanitizeObject(data);
    const updated = await repository.update(xss(id), sanitizedData);
    if (!updated) throw new NotFoundException('Unit kerja tidak ditemukan');
    return updated;
  }

  async delete(id: string) {
    const deleted = await repository.delete(xss(id));
    if (!deleted) throw new NotFoundException('Unit kerja tidak ditemukan');
    return deleted;
  }
  async findJoinedUnitKerja() {
    logInfo('Memulai pengambilan data Unit Kerja (join dengan master)');

    const data = await repository.findJoinedUnitKerja();

    if (!data) {
      logError('Data Unit Kerja tidak ditemukan');
      throw new NotFoundException('Data Unit Kerja tidak ditemukan');
    }

    return data;
  }
}

export default new PrsUnitKerjaService();

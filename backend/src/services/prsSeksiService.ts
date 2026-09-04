import repo from '../repositories/prsSeksiRepo';
import xss from 'xss';
import {
  BadRequestException,
  NotFoundException,
} from '../utils/http-exception';
import type {
  PrsSeksiAttributes,
  PrsSeksiCreationAttributes,
} from '../models/PrsSeksi';
import { deleteOrganizationMaster } from './deleteOrganizationMaster';

export type PrsSeksiRepository = typeof repo;
type DeleteOrganizationMaster = typeof deleteOrganizationMaster;

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

export class PrsSeksiService {
  private readonly repository: PrsSeksiRepository;
  private readonly deleteMaster: DeleteOrganizationMaster;

  constructor(
    repository: PrsSeksiRepository = repo,
    deleteMaster: DeleteOrganizationMaster = deleteOrganizationMaster
  ) {
    this.repository = repository;
    this.deleteMaster = deleteMaster;
  }

  async getAll(): Promise<PrsSeksiAttributes[]> {
    const data = await this.repository.findAll();
    return data.map(d => {
      const plain = d.toJSON() as PrsSeksiAttributes;
      return { ...plain, kode: plain.kode ?? '' };
    });
  }

  async getById(id: string): Promise<PrsSeksiAttributes> {
    const sanitizedId = xss(id);
    if (!isValidUUID(sanitizedId))
      throw new BadRequestException('Format ID tidak sesuai UUID');

    const data = await this.repository.findById(sanitizedId);
    if (!data) throw new NotFoundException('ID tidak ditemukan');

    const plain = data.toJSON() as PrsSeksiAttributes;
    return { ...plain, kode: plain.kode ?? '' };
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
    const created = await this.repository.create(
      clean as PrsSeksiCreationAttributes
    );
    const plain = created.toJSON() as PrsSeksiAttributes;
    return { ...plain, kode: plain.kode ?? '' };
  }

  async update(
    id: string,
    data: Partial<PrsSeksiAttributes>
  ): Promise<PrsSeksiAttributes> {
    const sanitizedId = xss(id);
    if (!isValidUUID(sanitizedId))
      throw new BadRequestException('Format ID tidak sesuai UUID');

    const clean = sanitizeObject(data);
    const updated = await this.repository.update(sanitizedId, clean);
    if (!updated) throw new NotFoundException('ID tidak ditemukan');

    const plain = updated.toJSON() as PrsSeksiAttributes;
    return { ...plain, kode: plain.kode ?? '' };
  }

  async delete(id: string): Promise<boolean> {
    const sanitizedId = xss(id);
    if (!isValidUUID(sanitizedId))
      throw new BadRequestException('Format ID tidak sesuai UUID');

    const record = await this.repository.findById(sanitizedId);
    if (!record) throw new NotFoundException('ID tidak ditemukan');

    await this.deleteMaster({
      record,
      code: record.getDataValue('kode') ?? '',
      column: 'kode_seksi',
      label: 'Seksi',
    });

    return true;
  }
  async getSeksiByKodeBagian(kode_bagian: string) {
    if (!kode_bagian || kode_bagian.trim() === '') {
      throw new BadRequestException('kode_bagian harus diisi');
    }

    const data = await this.repository.findByKodeBagian(kode_bagian.trim());
    return data;
  }
}

export default new PrsSeksiService();

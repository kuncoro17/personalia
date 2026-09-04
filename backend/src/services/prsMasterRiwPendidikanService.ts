import repo from '../repositories/prsMasterRiwPendidikanRepo';
import xss from 'xss';
import {
  BadRequestException,
  NotFoundException,
} from '../utils/http-exception';
import { prsMasterRiwPendidikanSchema } from '../validators/prsMasterRiwPendidikan.schema';
import {
  RiwPendAttributes,
  RiwPendCreationAttributes,
} from '../models/PrsMasterRiwPendidikan';

function isValidUUID(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    id
  );
}

function sanitize(
  data: Partial<RiwPendAttributes>
): Partial<RiwPendAttributes> {
  return {
    univ: data.univ ? xss(data.univ) : '',
  };
}

class PrsMasterRiwPendidikanService {
  async getAll(): Promise<RiwPendAttributes[]> {
    return repo.findAll();
  }

  async getById(id: string): Promise<RiwPendAttributes> {
    if (!isValidUUID(id)) throw new BadRequestException('ID tidak valid');
    const data = await repo.findById(id);
    if (!data) throw new NotFoundException('Data tidak ditemukan');
    return data;
  }

  async create(data: RiwPendCreationAttributes): Promise<RiwPendAttributes> {
    const parsed = prsMasterRiwPendidikanSchema.safeParse(data);
    if (!parsed.success) {
      throw new BadRequestException(
        parsed.error.issues.map(e => e.message).join(', ')
      );
    }
    return repo.create(sanitize(parsed.data) as RiwPendCreationAttributes);
  }

  async update(
    id: string,
    data: Partial<RiwPendAttributes>
  ): Promise<{ message: string }> {
    if (!isValidUUID(id)) throw new BadRequestException('ID tidak valid');
    const parsed = prsMasterRiwPendidikanSchema.partial().safeParse(data);
    if (!parsed.success) {
      throw new BadRequestException(
        parsed.error.issues.map(e => e.message).join(', ')
      );
    }
    if (!parsed.data.univ) {
      throw new BadRequestException('Universitas wajib diisi');
    }
    const updated = await repo.update(id, sanitize(parsed.data));
    if (!updated) throw new NotFoundException('ID tidak ditemukan');
    return { message: 'Berhasil diperbarui' };
  }

  async delete(id: string): Promise<{ message: string }> {
    if (!isValidUUID(id)) throw new BadRequestException('ID tidak valid');
    const deleted = await repo.delete(id);
    if (!deleted) throw new NotFoundException('ID tidak ditemukan');
    return { message: 'Berhasil dihapus' };
  }
}

export default new PrsMasterRiwPendidikanService();

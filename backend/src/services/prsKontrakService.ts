import repo from '../repositories/prsKontrakRepo';
import {
  BadRequestException,
  NotFoundException,
} from '../utils/http-exception';
import xss from 'xss';

// DTO
export interface CreateKontrakDTO {
  ukk_id: string;
  file_kontrak: string;
  tanggal_mulai: string;
  tanggal_berakhir: string;
}

export interface UpdateKontrakDTO {
  file_kontrak?: string;
  tanggal_mulai?: string;
  tanggal_berakhir?: string;
}

// validasi UUID
function isValidUUID(id: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

// Sanitasi input dengan Pick<T, K>
function sanitizeObject<T, K extends keyof T>(
  input: T,
  allowedFields: K[]
): Pick<T, K> {
  const sanitized = {} as Pick<T, K>;
  for (const key of allowedFields) {
    const value = input[key];
    sanitized[key] =
      typeof value === 'string' ? (xss(value) as unknown as T[K]) : value;
  }
  return sanitized;
}

class PrsKontrakService {
  private allowedFields: (keyof CreateKontrakDTO)[] = [
    'ukk_id',
    'file_kontrak',
    'tanggal_mulai',
    'tanggal_berakhir',
  ];

  async findAll() {
    return repo.findAll();
  }

  async findById(id: string) {
    if (!isValidUUID(id)) throw new BadRequestException('ID tidak valid');
    const data = await repo.findById(id);
    if (!data) throw new NotFoundException('Data tidak ditemukan');
    return data;
  }

  async create(data: CreateKontrakDTO) {
    if (!isValidUUID(data.ukk_id))
      throw new BadRequestException('ukk_id harus berupa UUID');

    // sanitasi aman, tetap menghasilkan CreateKontrakDTO
    const sanitized = sanitizeObject(data, this.allowedFields);

    if (
      !sanitized.file_kontrak ||
      !sanitized.tanggal_mulai ||
      !sanitized.tanggal_berakhir
    ) {
      throw new BadRequestException(
        'Field file_kontrak, tanggal_mulai, dan tanggal_berakhir wajib diisi'
      );
    }

    return repo.create(sanitized);
  }

  async update(id: string, data: UpdateKontrakDTO) {
    if (!isValidUUID(id)) throw new BadRequestException('ID tidak valid');

    // hanya mengambil field yang ada di DTO Update
    const sanitized = sanitizeObject(
      data,
      Object.keys(data) as (keyof UpdateKontrakDTO)[]
    );

    const updated = await repo.update(id, sanitized);
    if (!updated) throw new NotFoundException('Data tidak ditemukan');
    return updated;
  }

  async delete(id: string) {
    if (!isValidUUID(id)) throw new BadRequestException('ID tidak valid');
    const deleted = await repo.delete(id);
    if (!deleted) throw new NotFoundException('Data tidak ditemukan');
    return deleted;
  }
}

export default new PrsKontrakService();

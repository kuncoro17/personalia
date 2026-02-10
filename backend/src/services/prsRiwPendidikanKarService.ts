import { PrsRiwPendidikanKarRepository } from '../repositories/prsRiwPendidikanKarRepo';
import {
  BadRequestException,
  NotFoundException,
} from '../utils/http-exception';
import { RiwPendidikanKarCreationAttributes } from '../models/PrsRiwPendidikanKar';
import xss from 'xss';

const repository = new PrsRiwPendidikanKarRepository();

function isValidUUID(id: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

// interface PendidikanPayload {
//   karyawan_id?: string;
//   rpk_id?: string;
//   riw_pendidikan_id?: string | null;
//   jurusan?: string | null;
//   tahun_kelulusan?: number | null;
//   ipk?: number | null;
//   tingkat?: string;
// }
interface UpdatePendidikanInput {
  jurusan?: string;
  tingkat?: string;
  tahun_kelulusan?: number;
  ipk?: number;
  univ?: string; // input only → map ke riw_pendidikan_id
}

interface UpdatePendidikanPayload {
  jurusan?: string;
  tingkat?: string;
  tahun_kelulusan?: number;
  ipk?: number;
  riw_pendidikan_id?: string;
}
// interface UpdatePendidikanInput extends UpdatePendidikanPayload {
//   univ?: string;
// }
type SanitizeMode = 'create' | 'update';

type SanitizeResult<M extends SanitizeMode> = M extends 'create'
  ? RiwPendidikanKarCreationAttributes
  : Partial<RiwPendidikanKarCreationAttributes>;
export function sanitizeObject<M extends SanitizeMode>(
  input: Partial<RiwPendidikanKarCreationAttributes>,
  mode: M
): SanitizeResult<M> {
  const sanitized: Partial<RiwPendidikanKarCreationAttributes> = {
    karyawan_id: input.karyawan_id ? xss(input.karyawan_id) : undefined,
    rpk_id: input.rpk_id ? xss(input.rpk_id) : undefined,

    riw_pendidikan_id: input.riw_pendidikan_id
      ? xss(input.riw_pendidikan_id)
      : undefined,

    jurusan:
      input.jurusan !== undefined
        ? input.jurusan
          ? xss(input.jurusan)
          : undefined
        : undefined,

    tahun_kelulusan: input.tahun_kelulusan ?? undefined,
    ipk: input.ipk ?? undefined,
    tingkat: input.tingkat ? xss(input.tingkat) : undefined,
  };

  // CREATE → field wajib
  if (mode === 'create') {
    if (!sanitized.karyawan_id || !sanitized.rpk_id) {
      throw new BadRequestException('karyawan_id dan rpk_id wajib diisi');
    }

    // Type assertion AMAN karena sudah divalidasi
    return sanitized as SanitizeResult<M>;
  }

  return sanitized as SanitizeResult<M>;
}

/* ============================================================
   SANITIZER UNTUK UPDATE PENDIDIKAN (khusus by karyawan_id & rpk_id)
============================================================ */
function sanitizeUpdatePendidikan(
  input: Partial<UpdatePendidikanInput>
): Partial<UpdatePendidikanPayload> {
  const sanitized: Partial<UpdatePendidikanPayload> = {};

  if (input.jurusan !== undefined) {
    sanitized.jurusan = xss(input.jurusan);
  }

  if (input.tingkat !== undefined) {
    sanitized.tingkat = xss(input.tingkat);
  }

  if (input.tahun_kelulusan !== undefined) {
    sanitized.tahun_kelulusan = input.tahun_kelulusan;
  }

  if (input.ipk !== undefined) {
    sanitized.ipk = input.ipk;
  }

  // MAP univ → riw_pendidikan_id
  if (input.univ !== undefined) {
    sanitized.riw_pendidikan_id = xss(input.univ);
  }

  return sanitized;
}

/* ============================================================
   SERVICE
============================================================ */
export class PrsRiwPendidikanKarService {
  async findAll() {
    return await repository.findAll();
  }

  async findById(id: string) {
    if (!isValidUUID(id)) throw new BadRequestException('ID tidak valid');
    const data = await repository.findById(id);
    if (!data) throw new NotFoundException('Data tidak ditemukan');
    return data;
  }

  /* ------------ CREATE ------------ */
  async create(data: Partial<RiwPendidikanKarCreationAttributes>) {
    const sanitized = sanitizeObject(data, 'create');
    return await repository.create(sanitized);
  }

  /* ------------ UPDATE BY rpk_id ------------ */
  async update(id: string, data: Partial<RiwPendidikanKarCreationAttributes>) {
    if (!isValidUUID(id)) throw new BadRequestException('ID tidak valid');
    const sanitized = sanitizeObject(data, 'update');
    const updated = await repository.update(id, sanitized);

    if (!updated) throw new NotFoundException('Data tidak ditemukan');
    return updated;
  }

  /* ------------ DELETE ------------ */
  async delete(id: string) {
    if (!isValidUUID(id)) throw new BadRequestException('ID tidak valid');
    const deleted = await repository.delete(id);
    if (!deleted) throw new NotFoundException('Data tidak ditemukan');
    return deleted;
  }

  /* ------------ UPDATE BY karyawan_id + rpk_id ------------ */
  async updatePendidikan(
    id_karyawan: string,
    rpk_id: string,
    data: Partial<UpdatePendidikanInput>
  ) {
    if (!isValidUUID(id_karyawan)) {
      throw new BadRequestException('ID karyawan tidak valid');
    }

    if (!isValidUUID(rpk_id)) {
      throw new BadRequestException('ID riwayat pendidikan tidak valid');
    }

    const sanitizedData = sanitizeUpdatePendidikan(data);

    const result = await repository.updatePendidikan(
      id_karyawan,
      rpk_id,
      sanitizedData
    );

    if (!result || result[0] === 0) {
      throw new NotFoundException(
        'Data pendidikan tidak ditemukan atau sudah tidak aktif'
      );
    }

    return {
      message: 'Data pendidikan berhasil diperbarui',
    };
  }
}

export default new PrsRiwPendidikanKarService();

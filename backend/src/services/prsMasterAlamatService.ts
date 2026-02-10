import repo from '../repositories/prsMasterAlamatRepo';
import xss from 'xss';
import {
  BadRequestException,
  NotFoundException,
} from '../utils/http-exception';
import PrsKaryawanAlamatDTO from '../types/PrsKaryawanAlamatDTO';
import {
  PrsMasterAlamatCreationAttributes,
  CreateAlamatPayload,
} from '../types/AlamatTypes';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isValidUUID(id: string): boolean {
  return UUID_RE.test(id);
}
interface AlamatInput {
  alamat: string;
  kel_id: string;
  rt?: number;
  rw?: number;
  kode_pos?: string;
  status_tempat_tinggal?: string;
  kelurahan?: string;
}
const mapAlamatDtoToRepoPayload = (dto?: {
  alamat?: string;
  rt?: string;
  rw?: string;
  kode_pos?: string;
  status_tempat_tinggal?: string;
  kelurahan?: string;
}): PrsMasterAlamatCreationAttributes | undefined => {
  if (!dto) return undefined;

  if (!dto.kelurahan) {
    throw new BadRequestException('kelurahan wajib dikirim');
  }

  if (!isValidUUID(dto.kelurahan)) {
    throw new BadRequestException('kelurahan harus UUID');
  }

  return {
    alamat: dto.alamat ?? '',
    kel_id: dto.kelurahan, // 🔥 MAPPING PENTING
    rt: dto.rt ? Number(dto.rt) : undefined,
    rw: dto.rw ? Number(dto.rw) : undefined,
    kode_pos: dto.kode_pos,
    status_tempat_tinggal: dto.status_tempat_tinggal,
  };
};

function sanitize(data: AlamatInput) {
  return {
    alamat: xss(data.alamat),
    kel_id: xss(data.kel_id),
    rt: data.rt,
    rw: data.rw,
    kode_pos: data.kode_pos ? xss(data.kode_pos) : null,
    status_tempat_tinggal: data.status_tempat_tinggal
      ? xss(data.status_tempat_tinggal)
      : null,
    created_at: new Date(),
    updated_at: new Date(),
  };
}

export default {
  async getAll() {
    return repo.findAll();
  },

  async getById(id: string) {
    const data = await repo.findById(id);
    if (!data) throw new NotFoundException('Data tidak ditemukan');
    return data;
  },

  async create(data: AlamatInput) {
    if (!data.alamat || !data.kel_id) {
      throw new BadRequestException('Field wajib tidak lengkap');
    }
    const sanitized = sanitize(data);
    return repo.create(sanitized);
  },

  async update(id: string, data: AlamatInput) {
    const updated = await repo.update(id, {
      ...sanitize(data),
      updated_at: new Date(),
    });
    if (!updated) throw new NotFoundException('Data tidak ditemukan');
    return { message: 'Berhasil diperbarui' };
  },

  async delete(id: string) {
    const deleted = await repo.delete(id);
    if (!deleted) throw new NotFoundException('Data tidak ditemukan');
    return { message: 'Berhasil dihapus' };
  },
  // services/PrsKaryawan.service.ts
  async createAlamatByKaryawanId(
    id_karyawan: string,
    payload: PrsKaryawanAlamatDTO
  ) {
    if (!id_karyawan) {
      throw new BadRequestException('id_karyawan wajib dikirim');
    }

    const repoPayload: CreateAlamatPayload = {
      alamat_tempat_tinggal: mapAlamatDtoToRepoPayload(
        payload.alamatTempatTinggalDetail
      ),
      alamat_ktp: mapAlamatDtoToRepoPayload(payload.alamatKtpDetail),
    };

    if (!repoPayload.alamat_tempat_tinggal && !repoPayload.alamat_ktp) {
      throw new BadRequestException('Alamat wajib dikirim');
    }

    const result = await repo.createAlamatByKaryawanId(
      id_karyawan,
      repoPayload
    );

    if (!result) {
      throw new NotFoundException('Data alamat tidak ditemukan');
    }

    return result;
  },
  async getAlamatByIdKaryawan(id_karyawan: string) {
    if (!id_karyawan) {
      throw new BadRequestException('id_karyawan wajib dikirim');
    }

    const data = await repo.getAlamatByIdKaryawan(id_karyawan);

    if (!data) {
      throw new NotFoundException('Alamat karyawan tidak ditemukan');
    }

    return data;
  },
};

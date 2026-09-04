import { CreationAttributes } from 'sequelize';
import PrsKeluargaKaryawan, {
  PrsKeluargaKaryawanAttributes,
} from '../models/PrsKeluargaKaryawan';

// Input yang dibutuhkan untuk create
export interface KeluargaCreateInput {
  karyawan_id: string;
  nama_lengkap: string;
  nomor_identitas: string;
  tempat_lahir: string;
  tanggal_lahir: Date;
  no_telp: string;
  agama: number;
  gender: string;
  kewarganegaraan: string;
  pekerjaan: string;
  pendidikan: string;
  flag_status: number;
  hubungan: string;
  tanggungan_medical: number;
  kebijakan_khusus_medical: number;
  flag_berpisah: number;
  keterangan: string;
}

// Plain object hasil .toJSON()
export interface KeluargaPlain extends KeluargaCreateInput {
  id: string;
  created_at?: Date;
  updated_at?: Date;
}

export class PrsKeluargaKaryawanRepository {
  // 🔹 Get all records
  async getAll(limit = 100): Promise<KeluargaPlain[]> {
    const records = await PrsKeluargaKaryawan.findAll({
      order: [['id', 'ASC']],
      limit,
    });
    return records.map(r => r.toJSON() as KeluargaPlain);
  }

  // 🔹 Get by primary key
  async getById(id: string): Promise<KeluargaPlain | null> {
    const record = await PrsKeluargaKaryawan.findByPk(id);
    return record ? (record.toJSON() as KeluargaPlain) : null;
  }

  // 🔹 Get by karyawan_id
  async getByKaryawanId(
    karyawan_id: string,
    limit = 100,
    offset = 0
  ): Promise<KeluargaPlain[]> {
    const records = await PrsKeluargaKaryawan.findAll({
      where: { karyawan_id },
      limit,
      offset,
      order: [['id', 'ASC']],
    });
    return records.map(r => r.toJSON() as KeluargaPlain);
  }

  // 🔹 Create record (versi aman TypeScript)
  async create(
    data: CreationAttributes<PrsKeluargaKaryawan>
  ): Promise<PrsKeluargaKaryawanAttributes> {
    const record = await PrsKeluargaKaryawan.create(data);
    return record.toJSON();
  }

  // 🔹 Update by ID
  async update(
    id: string,
    data: Partial<KeluargaCreateInput>
  ): Promise<KeluargaPlain | null> {
    const record = await PrsKeluargaKaryawan.findByPk(id);
    if (!record) return null;
    const updated = await record.update(data);
    return updated.toJSON() as KeluargaPlain;
  }

  // 🔹 Delete by ID
  async delete(id: string): Promise<KeluargaPlain | null> {
    const record = await PrsKeluargaKaryawan.findByPk(id);
    if (!record) return null;
    await record.destroy();
    return record.toJSON() as KeluargaPlain;
  }
}

// Export instance repository
export default new PrsKeluargaKaryawanRepository();

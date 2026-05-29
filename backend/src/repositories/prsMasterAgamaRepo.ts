// src/repositories/prsMasterAgamaRepository.ts
import PrsKaryawan from '../models/PrsKaryawanModel';
import PrsKeluargaKaryawan from '../models/PrsKeluargaKaryawan';
import PrsMasterAgama from '../models/PrsMasterAgama';

class PrsMasterAgamaRepository {
  async findAll() {
    return await PrsMasterAgama.findAll({
      raw: true,
      order: [['kode_agama', 'ASC']],
    });
  }

  async findById(kode_agama: number) {
    return await PrsMasterAgama.findByPk(kode_agama, { raw: true });
  }

  async create(data: Record<string, unknown>) {
    const lastRecord = await PrsMasterAgama.findOne({
      order: [['kode_agama', 'DESC']],
    });

    const lastId = lastRecord
      ? (lastRecord.getDataValue('kode_agama') as number)
      : 0;
    const nextId = lastId + 1;

    return await PrsMasterAgama.create({
      kode_agama: nextId,
      ...data,
    });
  }

  async update(kode_agama: number, data: Record<string, unknown>) {
    const record = await PrsMasterAgama.findByPk(kode_agama);
    if (!record) return null;
    return await record.update(data);
  }

  async delete(kode_agama: number) {
    const usedByKaryawan = await PrsKaryawan.count({
      where: { agama: kode_agama },
    });

    const usedByKeluarga = await PrsKeluargaKaryawan.count({
      where: { agama: kode_agama },
    });

    if (usedByKaryawan > 0 || usedByKeluarga > 0) {
      throw new Error(
        'Data agama masih digunakan oleh karyawan, tidak bisa dihapus'
      );
    }

    const record = await PrsMasterAgama.findByPk(kode_agama);
    if (!record) return null;

    await record.destroy();
    return true;
  }
}

export default new PrsMasterAgamaRepository();

// src/repositories/prsMasterAgamaRepository.ts
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
    // cek apakah masih dipakai di prs_karyawan
    const related = await PrsMasterAgama.findOne({
      where: { kode_agama },
      raw: true,
    });

    if (related) {
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

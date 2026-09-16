import { PrsJabatan, PrsJabatanCreationAttributes } from '../models/prsJabatan';

export class PrsJabatanRepository {
  async findAll() {
    return await PrsJabatan.findAll({
      order: [['created_at', 'DESC']], // optional, urut terbaru
    });
  }

  async findById(id: string) {
    return await PrsJabatan.findOne({
      where: { jab_id: id }, // sesuaikan nama primary key
    });
  }

  // ✅ gunakan tipe PrsJabatanCreationAttributes
  async create(data: Partial<PrsJabatan>) {
    return await PrsJabatan.create(data as PrsJabatanCreationAttributes);
  }

  async update(id: string, data: Partial<PrsJabatan>) {
    const jabatan = await PrsJabatan.findByPk(id);
    if (!jabatan) return null;
    await jabatan.update(data);
    return jabatan;
  }
  async findByJabId(jab_id: string) {
    return await PrsJabatan.findOne({
      where: { jab_id },
    });
  }

  async softDelete(id: string) {
    const jabatan = await PrsJabatan.findByPk(id);
    if (!jabatan) return null;

    return jabatan;
  }
}

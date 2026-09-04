import PrsUnitKerjaKaryawanModel, {
  PrsUnitKerjaKaryawanDTO,
} from '../models/PrsUnitKerjaKaryawan';

export class PrsUnitKerjaKaryawanRepository {
  async findAll(): Promise<PrsUnitKerjaKaryawanDTO[]> {
    const result = await PrsUnitKerjaKaryawanModel.findAll({ raw: true });
    return result as PrsUnitKerjaKaryawanDTO[];
  }

  async findById(id: string): Promise<PrsUnitKerjaKaryawanDTO | null> {
    const result = await PrsUnitKerjaKaryawanModel.findByPk(id, { raw: true });
    return result as PrsUnitKerjaKaryawanDTO | null;
  }

  async findByIdKaryawan(karyawan_id: string) {
    const result = await PrsUnitKerjaKaryawanModel.findOne({
      where: { karyawan_id },
      raw: false, // pakai instance kalau mau update .update()
    });

    return result;
  }

  async create(
    data: PrsUnitKerjaKaryawanDTO
  ): Promise<PrsUnitKerjaKaryawanDTO> {
    const result = await PrsUnitKerjaKaryawanModel.create(data);
    return result.get({ plain: true });
  }

  async update(
    id: string,
    data: Partial<PrsUnitKerjaKaryawanDTO>
  ): Promise<PrsUnitKerjaKaryawanDTO | null> {
    const record = await PrsUnitKerjaKaryawanModel.findByPk(id);
    if (!record) return null;
    const updated = await record.update(data);
    return updated.get({ plain: true });
  }
  async updateByKaryawanId(
    karyawan_id: string,
    data: Partial<PrsUnitKerjaKaryawanDTO> // ✅ type-safe
  ) {
    // ambil instance lalu update supaya hooks dan return instance
    const instance = await PrsUnitKerjaKaryawanModel.findOne({
      where: { karyawan_id },
    });

    if (!instance) return null;

    await instance.update(data);

    return instance;
  }

  async delete(id: string): Promise<boolean> {
    const record = await PrsUnitKerjaKaryawanModel.findByPk(id);
    if (!record) return false;
    await record.destroy();
    return true;
  }
  async updateByJabId(
    karyawan_id: string,
    data: Partial<PrsUnitKerjaKaryawanModel>
  ) {
    const jabatan = await PrsUnitKerjaKaryawanModel.findOne({
      where: { karyawan_id },
    });

    if (!jabatan) return null;

    await jabatan.update(data);
    return jabatan;
  }
}

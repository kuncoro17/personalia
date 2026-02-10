import { Transaction } from 'sequelize';
import PrsRiwPendidikanKar, {
  RiwPendidikanKarAttributes,
  RiwPendidikanKarCreationAttributes,
} from '../models/PrsRiwPendidikanKar';
export type UpdatePendidikanPayload = Partial<
  Pick<
    RiwPendidikanKarAttributes,
    'jurusan' | 'tahun_kelulusan' | 'tingkat' | 'ipk' | 'riw_pendidikan_id'
  >
>;
export class PrsRiwPendidikanKarRepository {
  async findAll(): Promise<PrsRiwPendidikanKar[]> {
    return await PrsRiwPendidikanKar.findAll();
  }

  async findById(id: string): Promise<PrsRiwPendidikanKar | null> {
    return await PrsRiwPendidikanKar.findByPk(id);
  }

  async create(
    data: RiwPendidikanKarCreationAttributes
  ): Promise<PrsRiwPendidikanKar> {
    return await PrsRiwPendidikanKar.create(data);
  }

  async update(
    id: string,
    data: Partial<RiwPendidikanKarAttributes>
  ): Promise<PrsRiwPendidikanKar | null> {
    const found = await PrsRiwPendidikanKar.findByPk(id);
    if (!found) return null;
    return await found.update(data);
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await PrsRiwPendidikanKar.destroy({
      where: { rpk_id: id },
    });
    return deleted > 0;
  }

  async updatePendidikan(
    id_karyawan: string,
    rpk_id: string,
    data: UpdatePendidikanPayload,
    transaction?: Transaction
  ): Promise<[number]> {
    return PrsRiwPendidikanKar.update(data, {
      where: {
        karyawan_id: id_karyawan,
        rpk_id,
      },
      transaction,
    });
  }
}

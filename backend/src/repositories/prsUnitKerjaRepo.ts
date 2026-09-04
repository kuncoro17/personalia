import PrsUnitKerja from '../models/PrsUnitKerja';
import { logInfo } from '../utils/log.helper';
import {
  PrsUnitKerjaAttributes,
  PrsUnitKerjaCreateInput,
} from '../types/prsUnitKerja.types';
import PrsMasterDirektur from '../models/PrsMasterDirektur';
import PrsMasterDeputi from '../models/PrsMasterDeputi';
import PrsDivisi from '../models/PrsDivisi';
import PrsBagian from '../models/PrsBagian';
import PrsSeksi from '../models/PrsSeksi';

export class PrsUnitKerjaRepository {
  async findAll(): Promise<PrsUnitKerjaAttributes[]> {
    return await PrsUnitKerja.findAll({
      order: [['created_at', 'DESC']],
    });
  }

  async findById(id: string): Promise<PrsUnitKerjaAttributes | null> {
    return await PrsUnitKerja.findByPk(id, { raw: true });
  }
  async findAllunitKerja() {
    const result = await PrsUnitKerja.findAll({
      attributes: [['uk_id', 'id']],
      include: [
        {
          model: PrsMasterDirektur,
          as: 'direktur',
          attributes: [
            ['kode', 'id'],
            ['nama_dir', 'nama'],
          ],
        },
        {
          model: PrsMasterDeputi,
          as: 'deputi',
          attributes: [
            ['kode', 'id'],
            ['nama_dep', 'nama'],
          ],
        },
        {
          model: PrsDivisi,
          as: 'divisi',
          attributes: [
            ['kode', 'id'],
            ['nama_div', 'nama'],
          ],
        },
        {
          model: PrsBagian,
          as: 'bagian',
          attributes: [
            ['kode', 'id'],
            ['nama_bag', 'nama'],
          ],
        },
        {
          model: PrsSeksi,
          as: 'seksi',
          attributes: [
            ['kode', 'id'],
            ['nama_sek', 'nama'],
          ],
        },
      ],
      order: [['created_at', 'DESC']],
      raw: true,
      nest: true,
    });
    return result;
  }

  async create(data: PrsUnitKerjaCreateInput) {
    await logInfo('DEBUG insert data', data); // ganti console.log
    return await PrsUnitKerja.create(data);
  }

  async update(id: string, data: Partial<PrsUnitKerjaCreateInput>) {
    const record = await PrsUnitKerja.findByPk(id);
    if (!record) return null;
    return await record.update(data);
  }

  async delete(id: string) {
    const record = await PrsUnitKerja.findByPk(id);
    if (!record) return null;
    return await record.destroy();
  }
  async findJoinedUnitKerja() {
    const data = await PrsUnitKerja.findAll({
      include: [
        {
          model: PrsSeksi,
          as: 'seksi',
          attributes: ['kode', ['nama_sek', 'nama']],
        },
        {
          model: PrsBagian,
          as: 'bagian',
          attributes: ['kode', ['nama_bag', 'nama']],
        },
        {
          model: PrsDivisi,
          as: 'divisi',
          attributes: ['kode', ['nama_div', 'nama']],
        },
        {
          model: PrsMasterDeputi,
          as: 'deputi',
          attributes: ['kode', ['nama_dep', 'nama']],
        },
        {
          model: PrsMasterDirektur,
          as: 'direktur',
          attributes: ['kode', ['nama_dir', 'nama']],
        },
      ],
      attributes: [
        'uk_id',
        'kode_seksi',
        'kode_bagian',
        'kode_divisi',
        'kode_deputi',
        'kode_direktur',
      ],
      order: [['created_at', 'DESC']],
      raw: true,
      nest: true,
    });

    return data;
  }
}

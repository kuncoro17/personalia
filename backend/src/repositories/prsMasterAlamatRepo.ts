import { Op } from 'sequelize';
import PrsMasterAlamat from '../models/PrsMasterAlamat';
import PrsKaryawan from '../models/PrsKaryawanModel';
import sequelize from '../config/database';
import PrsMasterKel from '../models/PrsMasterKel';
import PrsMasterKec from '../models/PrsMasterKec';
import PrsMasterKot from '../models/PrsMasterKot';
import PrsMasterProv from '../models/PrsMasterProv';
import { PrsMasterAlamatCreationAttributes } from '../types/AlamatTypes';

interface CreateAlamatPayload {
  alamat_tempat_tinggal?: PrsMasterAlamatCreationAttributes;
  alamat_ktp?: PrsMasterAlamatCreationAttributes;
}
const PrsMasterAlamatRepo = {
  async findAll() {
    return PrsMasterAlamat.findAll({
      include: [{ association: 'kelurahan' }],
      order: [['alamat', 'ASC']],
    });
  },

  async findById(id: string) {
    return PrsMasterAlamat.findByPk(id, {
      include: [{ association: 'kelurahan' }],
    });
  },

  async findByAlamatLike(alamat: string) {
    return PrsMasterAlamat.findAll({
      where: {
        alamat: {
          [Op.iLike]: `%${alamat}%`,
        },
      },
      order: [['alamat', 'ASC']],
    });
  },

  async create(data: Record<string, unknown>) {
    return PrsMasterAlamat.create(data);
  },

  async createAlamatByKaryawanId(
    id_karyawan: string,
    payload: CreateAlamatPayload
  ) {
    const trx = await sequelize.transaction();

    try {
      const karyawan = await PrsKaryawan.findByPk(id_karyawan, {
        transaction: trx,
      });

      if (!karyawan) {
        throw new Error('Karyawan tidak ditemukan');
      }

      if (payload.alamat_tempat_tinggal) {
        const alamatTinggal = await PrsMasterAlamat.create(
          payload.alamat_tempat_tinggal,
          { transaction: trx }
        );

        await karyawan.update(
          { alamat_tempat_tinggal: alamatTinggal.get('id') as string },
          { transaction: trx }
        );
      }

      if (payload.alamat_ktp) {
        const alamatKtp = await PrsMasterAlamat.create(payload.alamat_ktp, {
          transaction: trx,
        });

        await karyawan.update(
          { alamat_ktp: alamatKtp.get('id') as string },
          { transaction: trx }
        );
      }

      await trx.commit();
      return this.getAlamatByIdKaryawan(id_karyawan);
    } catch (err) {
      await trx.rollback();
      throw err;
    }
  },
  async getAlamatByIdKaryawan(
    id_karyawan: string
  ): Promise<PrsKaryawan | null> {
    return await PrsKaryawan.findOne({
      where: { id_karyawan },
      attributes: ['id_karyawan'],
      include: [
        {
          model: PrsMasterAlamat,
          as: 'alamat_tempat_tinggal_detail',
          attributes: [
            'id',
            'alamat',
            'rt',
            'rw',
            'kode_pos',
            'status_tempat_tinggal',
          ],
          include: [
            {
              model: PrsMasterKel,
              as: 'kelurahan',
              attributes: ['id', 'nama'],
              include: [
                {
                  model: PrsMasterKec,
                  as: 'kecamatan',
                  attributes: ['id', 'nama'],
                  include: [
                    {
                      model: PrsMasterKot,
                      as: 'kota',
                      attributes: ['id', 'nama', 'prov_id'],
                      include: [
                        {
                          model: PrsMasterProv,
                          as: 'provinsi',
                          attributes: ['id', 'nama'],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          model: PrsMasterAlamat,
          as: 'alamat_ktp_detail',
          attributes: [
            'id',
            'alamat',
            'rt',
            'rw',
            'kode_pos',
            'status_tempat_tinggal',
          ],
          include: [
            {
              model: PrsMasterKel,
              as: 'kelurahan',
              attributes: ['id', 'nama'],
              include: [
                {
                  model: PrsMasterKec,
                  as: 'kecamatan',
                  attributes: ['id', 'nama'],
                  include: [
                    {
                      model: PrsMasterKot,
                      as: 'kota',
                      attributes: ['id', 'nama', 'prov_id'],
                      include: [
                        {
                          model: PrsMasterProv,
                          as: 'provinsi',
                          attributes: ['id', 'nama'],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      raw: false, // ✅ ini penting
    });
  },
  async update(id: string, data: Record<string, unknown>) {
    const record = await PrsMasterAlamat.findByPk(id);
    if (!record) return null;
    return record.update(data);
  },

  async delete(id: string) {
    const record = await PrsMasterAlamat.findByPk(id);
    if (!record) return null;
    return record.destroy();
  },
};

export default PrsMasterAlamatRepo;

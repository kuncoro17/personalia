import PrsKaryawan, { KaryawanAttributes } from '../models/PrsKaryawanModel';

import { sequelize } from '../config/database';
import PrsKeluargaKaryawan from '../models/PrsKeluargaKaryawan';
import PrsMasterAgama from '../models/PrsMasterAgama';
import PrsMasterAlamat from '../models/PrsMasterAlamat';
import PrsStatusKaryawan from '../models/PrsStatusKaryawan';
import PrsUnitKerja from '../models/PrsUnitKerja';
import PrsUnitKerjaKaryawan from '../models/PrsUnitKerjaKaryawan';
import PrsJamMengajarKaryawan from '../models/prsJamMengajarKaryawan';
import PrsMasterMapel from '../models/PrsMasterMapel';
import PrsKontrak from '../models/PrsKontrak';
import PrsMasterKel from '../models/PrsMasterKel';
import PrsMasterKec from '../models/PrsMasterKec';
import PrsMasterKot from '../models/PrsMasterKot';
import PrsMasterProv from '../models/PrsMasterProv';
import PrsMasterSetempat from '../models/PrsMasterSetempat';
import PrsRiwPendidikanKar from '../models/PrsRiwPendidikanKar';
import PrsMasterRiwPendidikan from '../models/PrsMasterRiwPendidikan';
import PrsKontakDarurat from '../models/prsKontakDarurat';
import PrsBagian from '../models/PrsBagian';
import PrsDivisi from '../models/PrsDivisi';
import PrsSeksi from '../models/PrsSeksi';
import PrsDokumen from '../models/prsDokumenModel';
import PrsJabatan from '../models/prsJabatan';
import PrsMasterDeputi from '../models/PrsMasterDeputi';
import PrsMasterDirektur from '../models/PrsMasterDirektur';
// import PrsKaryawanAlamatDTO from '../types/PrsKaryawanAlamatDTO';
import { PrsKeluargaKaryawanCreateInput } from '../types/prsKeluargaKaryawan.types';
import { PrsKontakDaruratCreateInput } from '../types/prsKontakDarurat.types';
// import { PrsKaryawanAttributes } from '../types/prsKaryawan.types';
import { literal } from 'sequelize';

import type { Attributes } from 'sequelize';

type KaryawanUpdateSequelize = Partial<
  Omit<Attributes<PrsKaryawan>, 'id_karyawan'>
>;

const dateFields: (keyof KaryawanAttributes)[] = [
  'tgl_join_penabur',
  'tgl_join_penabur_jkt',
  'tanggal_pernikahan',
  'tgl_status_permanen',
  'tgl_penuh_waktu',
  'tanggal_inactive',
  'birth_date',
  'created_at',
  'updated_at',
];

// type KaryawanUpdatePayload = Partial<KaryawanAttributes>;
// function toSequelizeValue(
//   value: string | number | undefined
// ): string | typeof literal | undefined {
//   if (value === undefined) return undefined;
//   if (typeof value === 'number') return value.toString(); // convert number ke string
//   return value;

type CreateInput = Parameters<typeof PrsKaryawan.create>[0];
type UpdateInput = Parameters<typeof PrsKaryawan.update>[0];
interface UpdateAlamatInput {
  id?: string;
  alamat?: string | null;
  rt?: string | null;
  rw?: string | null;
  kode_pos?: string | null;
  status_tempat_tinggal?: string | null;
  kelurahan?: string | null; // bisa disesuaikan tipe sebenarnya, misal id string
}
interface UpdateAlamatKaryawanPayload {
  alamat_tempat_tinggal?: UpdateAlamatInput;
  alamat_ktp?: UpdateAlamatInput;
}
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';
export class PrsKaryawanRepository {
  async findAllWithPagination(limit: number, offset: number) {
    return await PrsKaryawan.findAll({
      limit,
      offset,
      order: [['nama_lengkap', 'ASC']],
      attributes: [
        'id_karyawan',
        'foto',
        'nik',
        'nama_lengkap',
        'email_penabur',
      ],
      include: [
        {
          model: PrsMasterSetempat,
          as: 'master_setempat',
          attributes: ['id', 'kota_setempat'],
          required: false,
        },
        {
          model: PrsUnitKerjaKaryawan,
          as: 'unit_kerja_karyawan',
          attributes: ['jab_id'],
          include: [
            {
              model: PrsJabatan,
              as: 'jabatan',
              attributes: ['jabatan'],
            },
          ],
        },
        {
          model: PrsStatusKaryawan,
          as: 'status_karyawan',
          attributes: ['stat_karyawan_gp'],
        },
      ],
    });
  }

  async findAllWithPaginationBySetempat(
    id_master_setempat: number,
    limit: number,
    offset: number
  ) {
    return await PrsKaryawan.findAll({
      where: { id_master_setempat },
      limit,
      offset,
      order: [['nama_lengkap', 'ASC']],
      attributes: [
        'id_karyawan',
        'foto',
        'nik',
        'nama_lengkap',
        'email_penabur',
      ],
      include: [
        {
          model: PrsMasterSetempat,
          as: 'master_setempat',
          attributes: ['id', 'kota_setempat'],
          required: false,
        },
        {
          model: PrsUnitKerjaKaryawan,
          as: 'unit_kerja_karyawan',
          attributes: ['jab_id'],
          include: [
            {
              model: PrsJabatan,
              as: 'jabatan',
              attributes: ['jabatan'],
            },
          ],
        },
        {
          model: PrsStatusKaryawan,
          as: 'status_karyawan',
          attributes: ['stat_karyawan_gp'],
        },
      ],
    });
  }

  async countAll() {
    return await PrsKaryawan.count();
  }

  async countAllBySetempat(id_master_setempat: number) {
    return await PrsKaryawan.count({ where: { id_master_setempat } });
  }
  async findById(id: string) {
    const data = await PrsKaryawan.findByPk(id, {
      attributes: [
        'id_karyawan',
        'foto',
        'nik',
        'birth_date',
        'gol_darah',
        'kode_golongan',
        'gender',
        'kewarganegaraan',
        'nama_lengkap',
        'email_penabur',
        'nama_panggilan',
        'kode_status_karyawan',
        'email_pribadi',
        'no_ktp',
        'no_pasport',
        'telp_pribadi',
        'telp_kantor',
        'tgl_join_penabur',
        'tgl_join_penabur_jkt',

        'status_nikah',
        'alasan_berhenti_kerja',
        'tgl_status_permanen',
        'tgl_penuh_waktu',
        'tanggal_inactive',
      ],

      include: [
        // ================== UNIT KERJA ==================
        {
          model: PrsUnitKerjaKaryawan,
          as: 'unit_kerja_karyawan',
          attributes: ['ukk_id', 'karyawan_id', 'unit_kerja', 'jab_id'],

          include: [
            // ========== JABATAN ==========
            {
              model: PrsJabatan,
              as: 'jabatan',
              attributes: [
                ['jab_id', 'id'],
                ['jabatan', 'nama'],
              ],
            },

            // ========== UNIT KERJA DETAIL (direktur, divisi, dll) ==========
            {
              model: PrsUnitKerja,
              as: 'unit_kerja_detail',
              attributes: {
                exclude: [
                  'uk_id',
                  'kode_direktur',
                  'kode_deputi',
                  'kode_divisi',
                  'kode_bagian',
                  'kode_seksi',
                ],
              },
              include: [
                {
                  model: PrsMasterDirektur,
                  as: 'direktur',
                  attributes: [['dir_id', 'id'], 'kode', ['nama_dir', 'nama']],
                },
                {
                  model: PrsMasterDeputi,
                  as: 'deputi',
                  attributes: [['dep_id', 'id'], 'kode', ['nama_dep', 'nama']],
                },
                {
                  model: PrsDivisi,
                  as: 'divisi',
                  attributes: [['div_id', 'id'], 'kode', ['nama_div', 'nama']],
                },
                {
                  model: PrsBagian,
                  as: 'bagian',
                  attributes: [['bag_id', 'id'], 'kode', ['nama_bag', 'nama']],
                },
                {
                  model: PrsSeksi,
                  as: 'seksi',
                  attributes: [
                    ['sek_id', 'id'],
                    'sek_id',
                    'kode',
                    ['nama_sek', 'nama'],
                  ],
                },
              ],
            },

            // ========== JAM MENGAJAR + MAPEL ==========
            {
              model: PrsJamMengajarKaryawan,
              as: 'jam_mengajar',
              attributes: ['jam_mengajar', ['mengajar_mapel', 'id']],
              include: [
                {
                  model: PrsMasterMapel,
                  as: 'mapel',
                  attributes: [
                    ['mapel_id', 'id'],
                    ['nama_mapel', 'nama'],
                  ],
                },
              ],
            },
          ],
        },
        {
          model: PrsStatusKaryawan,
          as: 'status_karyawan',
          attributes: ['stat_karyawan_gp'],
        },
        {
          model: PrsMasterAgama,
          as: 'agama_detail',
          attributes: [['kode_agama', 'id'], 'agama'],
        },
      ],

      raw: true,
      nest: false,
    });

    return data;
  }

  async unit_kerja_karyawan_byidkaryawan(id_karyawan: string) {
    const data = await PrsKaryawan.findOne({
      where: { id_karyawan },
      attributes: [
        'id_karyawan',
        'nik',
        'nama_lengkap',
        'tgl_join_penabur_jkt',
        'tgl_join_penabur',
        'tanggal_inactive',
      ],
      include: [
        {
          model: PrsUnitKerjaKaryawan,
          as: 'unit_kerja_karyawan',
          attributes: ['ukk_id', 'unit_kerja', 'jab_id', 'lokasi_penggajian'],
          include: [
            {
              model: PrsUnitKerja,
              as: 'unit_kerja_detail',
              attributes: [
                'uk_id',
                'kode_seksi',
                'kode_bagian',
                'kode_divisi',
                'kode_deputi',
                'kode_direktur',
              ],
              include: [
                {
                  model: PrsSeksi,
                  as: 'seksi', // ✅ benar karena relasi ini didefinisikan di PrsUnitKerja
                  attributes: [
                    ['kode', 'id'],
                    ['nama_sek', 'name'],
                  ],
                },
                {
                  model: PrsBagian,
                  as: 'bagian', // ✅ benar karena relasi ini didefinisikan di PrsUnitKerja
                  attributes: [
                    ['kode', 'id'],
                    ['nama_bag', 'name'],
                  ],
                },
                {
                  model: PrsDivisi,
                  as: 'divisi', // ✅ benar karena relasi ini didefinisikan di PrsUnitKerja
                  attributes: [
                    ['kode', 'id'],
                    ['nama_div', 'name'],
                  ],
                },
                {
                  model: PrsMasterDeputi,
                  as: 'deputi', // ✅ benar karena relasi ini didefinisikan di PrsUnitKerja
                  attributes: [
                    ['kode', 'id'],
                    ['nama_dep', 'name'],
                  ],
                },
                {
                  model: PrsMasterDirektur,
                  as: 'direktur', // ✅ benar karena relasi ini didefinisikan di PrsUnitKerja
                  attributes: [
                    ['kode', 'id'],
                    ['nama_dir', 'name'],
                  ],
                },
              ],
            },
            {
              model: PrsJabatan,
              as: 'jabatan',
              attributes: ['kode_jab', 'jabatan'],
            },
            {
              model: PrsJamMengajarKaryawan,
              as: 'jam_mengajar',
              attributes: ['jam_mengajar', 'mengajar_mapel'],
              include: [
                {
                  model: PrsMasterMapel,
                  as: 'mapel',
                  attributes: ['nama_mapel'],
                },
              ],
            },
          ],
        },
      ],
    });

    return data;
  }

  async Direktur() {
    return await PrsKaryawan.findAll({
      attributes: ['id_karyawan', 'nik', 'nama_lengkap'],
      include: [
        {
          model: PrsUnitKerjaKaryawan,
          as: 'unit_kerja_karyawan',
          required: true,
          attributes: ['ukk_id', 'unit_kerja', 'jab_id', 'lokasi_penggajian'],
          include: [
            {
              model: PrsUnitKerja,
              as: 'unit_kerja_detail',
              required: true,
              attributes: [
                'uk_id',
                'kode_seksi',
                'kode_bagian',
                'kode_divisi',
                'kode_deputi',
                'kode_direktur',
              ],
              include: [
                {
                  model: PrsMasterDirektur,
                  as: 'direktur',
                  required: true,

                  attributes: [
                    ['kode', 'id'],
                    ['nama_dir', 'name'],
                  ],
                },
                {
                  model: PrsSeksi,
                  as: 'seksi',
                  attributes: [
                    ['kode', 'id'],
                    ['nama_sek', 'name'],
                  ],
                },
                {
                  model: PrsBagian,
                  as: 'bagian',
                  attributes: [
                    ['kode', 'id'],
                    ['nama_bag', 'name'],
                  ],
                },
                {
                  model: PrsDivisi,
                  as: 'divisi',
                  attributes: [
                    ['kode', 'id'],
                    ['nama_div', 'name'],
                  ],
                },
                {
                  model: PrsMasterDeputi,
                  as: 'deputi',
                  attributes: [
                    ['kode', 'id'],
                    ['nama_dep', 'name'],
                  ],
                },
              ],
            },
            {
              model: PrsJabatan,
              as: 'jabatan',
              where: { kode_jab: 'JDK' },
              attributes: [
                ['kode_jab', 'id'],
                ['jabatan', 'name'],
              ],
            },
            {
              model: PrsJamMengajarKaryawan,
              as: 'jam_mengajar',
              attributes: ['jam_mengajar'],
              include: [
                {
                  model: PrsMasterMapel,
                  as: 'mapel',
                  attributes: ['nama_mapel'],
                },
              ],
            },
          ],
        },
      ],
    });
  }

  async getAlamatByIdKaryawan(
    id_karyawan: string
  ): Promise<PrsKaryawan | null> {
    return await PrsKaryawan.findOne({
      where: { id_karyawan },

      // Alias ID agar mudah ditangkap controller
      attributes: [
        'id_karyawan',
        // ['alamat_tempat_tinggal', 'alamat_tempat_tinggal_id'],
        // ['alamat_ktp', 'alamat_ktp_id'],
      ],

      include: [
        {
          model: PrsMasterAlamat,
          as: 'alamat_tempat_tinggal_detail',
          attributes: [
            ['id', 'alamatTempatTinggalId'],

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
                      attributes: ['id', 'nama'],
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
            ['id', 'alamatKtpId'],
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
                      attributes: ['id', 'nama'],
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

      raw: true,
      nest: false,
    });
  }

  // repository/prsKaryawanRepository.ts
  async findByNameAscPaginated(
    nama_lengkap: string,
    limit: number,
    offset: number
  ) {
    try {
      const { count, rows } = await PrsKaryawan.findAndCountAll({
        where: {
          nama_lengkap: { [Op.iLike]: `%${nama_lengkap}%` },
          status_aktif: 'Aktif',
        },
        order: [['nama_lengkap', 'ASC']],
        attributes: [
          'id_karyawan',
          'foto',
          'nik',
          'nama_lengkap',
          'email_penabur',
        ],
        include: [
          {
            model: PrsUnitKerjaKaryawan,
            as: 'unit_kerja_karyawan',
            attributes: ['jab_id'],
            include: [
              {
                model: PrsJabatan,
                as: 'jabatan',
                attributes: ['jabatan'],
              },
            ],
          },

          {
            model: PrsStatusKaryawan,
            as: 'status_karyawan',
            attributes: ['stat_karyawan_gp'],
          },
        ],
        limit,
        offset,
        raw: true,
        nest: false,
      });

      return { total: count, data: rows };
    } catch (error) {
      throw new Error(`Gagal mencari karyawan berdasarkan nama: ${error}`);
    }
  }

  async create(data: CreateInput) {
    return await PrsKaryawan.create(data);
  }

  async updateTidakAktif(id: string, data: UpdateInput) {
    const record = await PrsKaryawan.findByPk(id);
    if (!record) return null;
    return await record.update(data);
  }

  async updateKaryawan(id: string, data: UpdateInput) {
    const record = await PrsKaryawan.findByPk(id);
    if (!record) return null;
    return await record.update(data);
  }
  async findUkkIdByKaryawanId(karyawan_id: string) {
    const record = await PrsUnitKerjaKaryawan.findOne({
      where: { karyawan_id },
      attributes: ['ukk_id'],
    });
    return record ? record.ukk_id : null;
  }

  async updateMengajarMapelByUkkId(ukk_id: string, mengajar_mapel: string) {
    const record = await PrsJamMengajarKaryawan.findOne({ where: { ukk_id } });
    if (!record) return null;
    return await record.update({ mengajar_mapel });
  }

  async delete(id: string) {
    const record = await PrsKaryawan.findByPk(id);
    if (!record) return null;
    return await record.destroy();
  }
  async getByJoinDate(date: string) {
    return await PrsKaryawan.findAll({
      attributes: [
        'nik',
        'nama_lengkap',
        ['tgl_join_penabur', 'join_date_penabur'],
        [Sequelize.col('status_karyawan.stat_karyawan_gp'), 'stat_karyawan_gp'],
      ],
      where: {
        tgl_join_penabur: date,
        status_aktif: 'Aktif',
      },
      include: [
        {
          model: PrsStatusKaryawan,
          as: 'status_karyawan',
          attributes: [],
        },
      ],
    });
  }
  async getBirthdayToday(limit: number, offset: number) {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const wib = new Date(utc + 7 * 3600000);

    const day = wib.getDate();
    const month = wib.getMonth() + 1;
    const formatted = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const whereCondition = Sequelize.where(
      Sequelize.fn('TO_CHAR', Sequelize.col('birth_date'), 'MM-DD'),
      formatted
    );

    // Ambil data ulang tahun hari ini
    const data = await PrsKaryawan.findAll({
      attributes: ['nama_lengkap', 'foto', 'nik'],
      where: whereCondition,
      order: [['nama_lengkap', 'ASC']],
      limit,
      offset,
      include: [
        {
          model: PrsUnitKerjaKaryawan,
          as: 'unit_kerja_karyawan',
          attributes: ['ukk_id', 'karyawan_id', 'jab_id'],
          include: [
            {
              model: PrsJabatan,
              as: 'jabatan',
              attributes: ['jab_id', 'kode_jab', 'jabatan'],
            },
            {
              model: PrsUnitKerja,
              as: 'unit_kerja_detail', // pastikan alias sama seperti di model
              attributes: ['uk_id'],
              include: [
                {
                  model: PrsMasterDirektur,
                  as: 'direktur',
                  attributes: ['kode', 'nama_dir'],
                },
                {
                  model: PrsMasterDeputi,
                  as: 'deputi',
                  attributes: ['kode', 'nama_dep'],
                },
                {
                  model: PrsDivisi,
                  as: 'divisi',
                  attributes: ['nama_div'],
                },
                {
                  model: PrsBagian,
                  as: 'bagian',
                  attributes: ['nama_bag'],
                },
                {
                  model: PrsSeksi,
                  as: 'seksi',
                  attributes: ['nama_sek'],
                },
              ],
            },
          ],
        },
      ],
    });

    // Hitung total untuk pagination
    const total = await PrsKaryawan.count({ where: whereCondition });

    return { data, total };
  }
  async countAktif() {
    const count = await PrsKaryawan.count({
      where: { status_aktif: 'Aktif' },
    });

    const data = await PrsKaryawan.findAll({
      where: { status_aktif: 'Aktif' },
      attributes: ['id_karyawan', 'nama_lengkap', 'nik', 'email_penabur'], // pilih field yang dibutuhkan
    });

    return { count, data };
  }

  async countTidakAktif() {
    const count = await PrsKaryawan.count({
      where: { status_aktif: 'Tidak Aktif' },
    });

    const data = await PrsKaryawan.findAll({
      where: { status_aktif: 'Tidak Aktif' },
      attributes: ['id_karyawan', 'nama_lengkap', 'nik', 'email_penabur'], // pilih kolom yang diperlukan
    });

    return { count, data };
  }
  async getKeluargaByKaryawanId(idKaryawan: string) {
    return await PrsKaryawan.findOne({
      where: { id_karyawan: idKaryawan },
      attributes: ['nik', 'nama_lengkap', 'status_nikah'],
      include: [
        {
          model: PrsKeluargaKaryawan,
          as: 'keluarga_karyawan', // harus sama dengan alias di hasMany
          attributes: [
            'id',
            'karyawan_id',
            'nama_lengkap',
            'kewarganegaraan',
            'nomor_identitas',
            'tempat_lahir',
            'tanggal_lahir',
            'pekerjaan',
            'pendidikan',
            'gender',
            'hubungan',
            'no_telp',
            'keterangan',
            'flag_status',
            'flag_berpisah',
            'tanggungan_medical',
            'kebijakan_khusus_medical',
            [
              Sequelize.literal(`
              DATE_PART('year', AGE(CURRENT_DATE, "keluarga_karyawan"."tanggal_lahir"))
            `),
              'usia',
            ],
          ],
          include: [
            {
              model: PrsMasterAgama,
              as: 'agama_detail', // alias di PrsKeluargaKaryawan
              attributes: ['agama'], // pastikan sesuai kolom di DB
            },
          ],
        },
      ],
    });
  }
  async getKeluargaByKaryawanIdAndId(idKaryawan: string, idKeluarga?: string) {
    return await PrsKaryawan.findOne({
      where: { id_karyawan: idKaryawan },
      attributes: ['nik', 'nama_lengkap', 'status_nikah'],
      include: [
        {
          model: PrsKeluargaKaryawan,
          as: 'keluarga_karyawan',
          where: idKeluarga
            ? { karyawan_id: idKaryawan, id: idKeluarga }
            : { karyawan_id: idKaryawan },

          attributes: [
            'id',
            'nama_lengkap',
            'kewarganegaraan',
            'nomor_identitas',
            'tempat_lahir',
            'tanggal_lahir',
            'pekerjaan',
            'pendidikan',
            'gender',
            'hubungan',
            'no_telp',
            'keterangan',
            'flag_status',
            'flag_berpisah',
            'tanggungan_medical',
            'kebijakan_khusus_medical',
            [
              Sequelize.literal(`
              DATE_PART('year', AGE(CURRENT_DATE, "keluarga_karyawan"."tanggal_lahir"))
            `),
              'usia',
            ],
          ],

          include: [
            // Relasi agama (sudah ada)
            {
              model: PrsMasterAgama,
              as: 'agama_detail',
              attributes: ['agama'],
            },

            // ➕ Tambahkan relasi master kota
            {
              model: PrsMasterKot,
              as: 'tempat_lahir_detail',
              attributes: ['id', 'nama'], // sesuaikan field di tabel master kota
            },
          ],
        },
      ],
    });
  }

  async getKeluargaById(karyawan_id: string, id: string) {
    return await PrsKeluargaKaryawan.findOne({
      where: {
        karyawan_id,
        id,
      },
    });
  }

  async updateKeluargaById(
    karyawan_id: string,
    id: string,
    payload: Partial<PrsKeluargaKaryawanCreateInput>
  ) {
    // Update record
    await PrsKeluargaKaryawan.update(payload, {
      where: {
        karyawan_id,
        id,
      },
    });

    // Ambil data terbaru
    return await PrsKeluargaKaryawan.findOne({
      where: {
        karyawan_id,
        id,
      },
      include: [
        {
          model: PrsMasterAgama,
          as: 'agama_detail',
          attributes: ['agama'],
        },
      ],
    });
  }

  // src/repositories/PrsStatusKaryawanRepository.ts

  async findAllWithKaryawan() {
    return await PrsKaryawan.findAll({
      attributes: [
        [Sequelize.fn('COUNT', Sequelize.col('id_karyawan')), 'jumlah'],
        [Sequelize.col('status_karyawan.stat_karyawan_gp'), 'stat_karyawan_gp'],
      ],
      where: {
        status_aktif: 'Aktif',
      },
      include: [
        {
          model: PrsStatusKaryawan,
          as: 'status_karyawan',
          attributes: [],
        },
      ],
      group: ['status_karyawan.stat_karyawan_gp'],
    });
  }

  async findByIdLokasiKerja(idKaryawan: string) {
    return await PrsKaryawan.findOne({
      where: {
        id_karyawan: idKaryawan,
        status_aktif: 'Aktif',
      },
      attributes: ['id_karyawan', 'nik', 'email_penabur'],
      include: [
        {
          model: PrsUnitKerjaKaryawan,
          as: 'unit_kerja_karyawan',
          attributes: [
            'karyawan_id',
            'unit_kerja',
            'lokasi_penggajian',
            'bag_id',
          ],
          include: [
            {
              model: PrsUnitKerja,
              as: 'unit_kerja_detail',
              attributes: [
                'uk_id',
                'kode_seksi',
                'kode_bagian',
                'kode_divisi',
                'kode_deputi',
                'kode_direktur',
              ],
            },
          ],
        },
      ],
      raw: true,
      nest: true,
    });
  }

  async findByEmailLokasiKerjaSeksiBagianDivisi(email: string) {
    return await PrsKaryawan.findOne({
      where: {
        email_penabur: { [Op.iLike]: `%${email}%` },
        status_aktif: 'Aktif',
      },
      attributes: ['id_karyawan', 'nik', 'email_penabur'],
      include: [
        {
          model: PrsUnitKerjaKaryawan,
          as: 'unit_kerja_karyawan',
          attributes: ['lokasi_penggajian'],
          include: [
            {
              model: PrsUnitKerja,
              as: 'unitkerja',
              attributes: ['uk_id', 'kode_seksi', 'kode_bagian', 'kode_divisi'],
              include: [
                {
                  model: PrsDivisi,
                  as: 'divisi',
                  attributes: ['kode', 'nama_div'],
                },
                {
                  model: PrsBagian,
                  as: 'bagian',
                  attributes: ['kode', 'nama_bag'],
                },
                {
                  model: PrsSeksi,
                  as: 'seksi',
                  attributes: ['kode', 'nama_sek'],
                },
              ],
            },
          ],
        },
      ],
      raw: true,
      nest: false,
    });
  }

  async getDetailMengajarByID(karyawan_id: string) {
    return await PrsKaryawan.findOne({
      where: {
        email_penabur: { [Op.iLike]: `%${karyawan_id}%` },
        status_aktif: 'Aktif',
      },
      attributes: ['id_karyawan', 'nik', 'email_penabur'],
      include: [
        {
          model: PrsUnitKerjaKaryawan,
          as: 'unit_kerja_karyawan',
          attributes: ['ukk_id'],
          include: [
            {
              model: PrsJamMengajarKaryawan,
              as: 'jam_mengajar',
              attributes: ['jam_mengajar', 'mengajar_mapel'],
              include: [
                {
                  model: PrsMasterMapel,
                  as: 'mapel',
                  attributes: ['mapel_id', 'nama_mapel'],
                },
              ],
            },
          ],
        },
      ],
    });
  }
  async getKontrakByEmail(email: string) {
    return await PrsKaryawan.findOne({
      where: {
        email_penabur: { [Op.iLike]: `%${email}%` },
        status_aktif: 'Aktif',
      },
      attributes: ['id_karyawan', 'nama_lengkap', 'email_penabur'],
      include: [
        {
          model: PrsUnitKerjaKaryawan,
          as: 'unitkerja_karyawan',
          attributes: ['ukk_id', 'unit_kerja'],
          include: [
            {
              model: PrsKontrak,
              as: 'kontrak',
              attributes: [
                'id',
                'file_kontrak',
                'tanggal_mulai',
                'tanggal_berakhir',
              ],
            },
          ],
        },
      ],
    });
  }
  async getalamatByEmail(email: string) {
    return await PrsKaryawan.findOne({
      where: {
        email_penabur: { [Op.iLike]: `%${email}%` },
        status_aktif: 'Aktif',
      },
      include: [
        {
          model: PrsMasterAlamat,
          as: 'alamat', // pastikan alias ini sesuai dengan definisi hasOne/belongsTo di model
          include: [
            {
              model: PrsMasterKel,
              as: 'kelurahan',
              include: [
                {
                  model: PrsMasterKec,
                  as: 'kecamatan',
                  include: [
                    {
                      model: PrsMasterKot,
                      as: 'kota',
                      include: [
                        {
                          model: PrsMasterProv,
                          as: 'provinsi',
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
    });
  }

  async getDetailPendidikanByIdKaryawan(id_karyawan: string) {
    const data = await PrsKaryawan.findAll({
      where: { id_karyawan, status_aktif: 'Aktif' },
      attributes: [],
      include: [
        {
          model: PrsRiwPendidikanKar,
          as: 'pendidikan',
          required: true,
          attributes: [
            'rpk_id',
            ['riw_pendidikan_id', 'univ'],
            'jurusan',
            'tahun_kelulusan',
            'tingkat',
            'ipk',
          ],
          include: [
            {
              model: PrsMasterRiwPendidikan,
              as: 'jenjang',
              required: true,
              attributes: ['id', ['univ', 'nama']],
            },
          ],
        },
      ],
      raw: true,
      nest: false,
    });

    return data;
  }

  async getKontakDaruratByIdKaryawan(id_karyawan: string) {
    return await PrsKaryawan.findAll({
      where: {
        id_karyawan,
        status_aktif: 'Aktif',
      },
      attributes: [],

      include: [
        {
          model: PrsKontakDarurat,
          as: 'kontak_darurat',
          attributes: [
            'karyawan_id',
            'id',
            'nama_kondar',
            'hubungan_kondar',
            'telp_darurat',
            'no_hp',
            'alamat_kondar',
          ],
        },
      ],
      raw: true,
      nest: false,
    });
  }

  async updateKontakDaruratById(
    karyawan_id: string,
    id: string,
    payload: Partial<PrsKontakDaruratCreateInput>
  ) {
    // Update record
    await PrsKontakDarurat.update(payload, {
      where: {
        karyawan_id,
        id,
      },
    });

    // Ambil data terbaru
    return await PrsKontakDarurat.findOne({
      where: { karyawan_id, id },
      attributes: [
        'id',
        'nama_kondar',
        'hubungan_kondar',
        'alamat_kondar',
        'telp_darurat',
        'email',
        'kategori_kontak',
        'no_hp',
      ],
    });
  }
  async getKaryawanWithDokumenByEmail(email: string) {
    return PrsKaryawan.findOne({
      where: { email_penabur: email },
      include: [
        {
          model: PrsDokumen,
          as: 'dokumen',
          required: false,
        },
      ],
    });
  }
  async findKaryawanJamMengajar(id: string) {
    return await PrsKaryawan.findByPk(id, {
      attributes: ['nik'],
      include: [
        // ================== UNIT KERJA ==================
        {
          include: [
            // ========== JABATAN ==========

            // ========== UNIT KERJA DETAIL (direktur, divisi, dll) ==========
            {
              model: PrsUnitKerja,
              as: 'unit_kerja_detail',
              attributes: ['uk_id'],
              include: [
                {
                  model: PrsMasterDirektur,
                  as: 'direktur',
                  attributes: ['nama_dir'],
                },
                {
                  model: PrsMasterDeputi,
                  as: 'deputi',
                  attributes: ['nama_dep'],
                },
                {
                  model: PrsDivisi,
                  as: 'divisi',
                  attributes: ['nama_div'],
                },
                {
                  model: PrsBagian,
                  as: 'bagian',
                  attributes: ['nama_bag'],
                },
                {
                  model: PrsSeksi,
                  as: 'seksi',
                  attributes: ['nama_sek'],
                },
              ],
            },

            // ========== JAM MENGAJAR + MAPEL ==========
            {
              model: PrsJamMengajarKaryawan,
              as: 'jam_mengajar',
              attributes: ['jam_mengajar', 'mengajar_mapel'],
              include: [
                {
                  model: PrsMasterMapel,
                  as: 'mapel',
                  attributes: ['nama_mapel'],
                },
              ],
            },
          ],
        },
      ],
    });
  }
  async detail_karyawan(id: string) {
    const data = await PrsKaryawan.findByPk(id, {
      attributes: [
        'id_karyawan',
        'kewarganegaraan',
        'tempat_lahir',
        'birth_date',
        'gol_darah',
        'no_kitas',
        'gender',
        'no_visa',
        'no_ktp',
        'no_pasport',
      ],

      raw: true,
      nest: false,
    });

    return data;
  }
  async informasi_penggajian(id: string) {
    const data = await PrsKaryawan.findByPk(id, {
      attributes: [
        'id_karyawan',
        'npwp',
        'no_tabita',
        'rekening',
        'no_bpjs_kesehatan',
        'no_bpjs_ketenagakerjaan',
        'no_bpjs_danpes',
      ],

      raw: true,
      nest: false,
    });

    return data;
  }
  async updateInformasiPenggajian(
    id: string,
    payload: Partial<KaryawanAttributes>
  ): Promise<number> {
    const [affected] = await PrsKaryawan.update(payload, {
      where: { id_karyawan: id },
    });

    return affected;
  }
  async updateAlamatKaryawan(
    id_karyawan: string,
    payload: UpdateAlamatKaryawanPayload
  ) {
    const trx = await sequelize.transaction();

    try {
      // 1. Validasi karyawan
      const karyawan = await PrsKaryawan.findOne({
        where: { id_karyawan },
        transaction: trx,
      });

      if (!karyawan) {
        throw new Error('Karyawan tidak ditemukan');
      }

      // helper build PATCH payload
      const buildUpdatePayload = (src: UpdateAlamatInput) => {
        const data: Partial<UpdateAlamatInput> = {};

        if (src.alamat !== undefined) data.alamat = src.alamat;
        if (src.rt !== undefined) data.rt = src.rt;
        if (src.rw !== undefined) data.rw = src.rw;
        if (src.kode_pos !== undefined) data.kode_pos = src.kode_pos;
        if (src.status_tempat_tinggal !== undefined)
          data.status_tempat_tinggal = src.status_tempat_tinggal;
        if (src.kelurahan !== undefined) data.kelurahan = src.kelurahan;

        return data;
      };

      let updated = false;

      // 2. UPDATE alamat tempat tinggal
      if (payload.alamat_tempat_tinggal?.id) {
        const updatePayload = buildUpdatePayload(payload.alamat_tempat_tinggal);

        if (Object.keys(updatePayload).length > 0) {
          await PrsMasterAlamat.update(updatePayload, {
            where: { id: payload.alamat_tempat_tinggal.id },
            transaction: trx,
          });
          updated = true;
        }
      }

      // 3. UPDATE alamat KTP
      if (payload.alamat_ktp?.id) {
        const updatePayload = buildUpdatePayload(payload.alamat_ktp);

        if (Object.keys(updatePayload).length > 0) {
          await PrsMasterAlamat.update(updatePayload, {
            where: { id: payload.alamat_ktp.id },
            transaction: trx,
          });
          updated = true;
        }
      }

      if (!updated) {
        throw new Error('Tidak ada data alamat yang diupdate');
      }

      await trx.commit();

      return await this.getAlamatByIdKaryawan(id_karyawan);
    } catch (err) {
      await trx.rollback();
      throw err;
    }
  }

  async getAdditionalById(id_karyawan: string) {
    return await PrsKaryawan.findOne({
      where: { id_karyawan },
      attributes: [
        'foto',
        'gol_darah',
        'kewarganegaraan',
        'gender',
        'tempat_lahir',
        'birth_date',
        'instagram',
        'twitter',
        'no_kitas',
        'no_visa',
        'no_tabita',
        'npwp',
        'rekening',
        'kode_golongan',
        'no_bpjs_ketenagakerjaan',
        'no_bpjs_danpes',
        'nama_bpjs_danpes',
        'no_pasport',
      ],
    });
  }

  async updateAdditionalById(
    id_karyawan: string,
    data: Partial<KaryawanAttributes>
  ): Promise<number> {
    const updateData: KaryawanUpdateSequelize = {};

    for (const [key, value] of Object.entries(data)) {
      if (value === undefined || value === null) continue;

      const typedKey = key as keyof KaryawanUpdateSequelize;

      if (
        dateFields.includes(key as keyof KaryawanAttributes) &&
        typeof value === 'string'
      ) {
        // 🔥 satu-satunya cast yang dibolehkan
        (updateData as Record<string, unknown>)[typedKey] = literal(
          `'${value}'`
        );
        continue;
      }

      (updateData as Record<string, unknown>)[typedKey] = value;
    }

    const [affectedRows] = await PrsKaryawan.update(updateData, {
      where: { id_karyawan },
    });

    return affectedRows;
  }
}

import { PrsKaryawan, PrsMasterAlamat } from '../models';
import { Sequelize } from 'sequelize';
import PrsKeluargaKaryawan from '../models/PrsKeluargaKaryawan';
import PrsMasterAgama from '../models/PrsMasterAgama';
import PrsStatusKaryawan from '../models/PrsStatusKaryawan';
import PrsUnitKerja from '../models/PrsUnitKerja';
import PrsUnitKerjaKaryawan from '../models/PrsUnitKerjaKaryawan';
import PrsMasterKel from '../models/PrsMasterKel';
import PrsMasterKec from '../models/PrsMasterKec';
import PrsMasterKot from '../models/PrsMasterKot';
import PrsMasterProv from '../models/PrsMasterProv';
import PrsRiwPendidikanKar from '../models/PrsRiwPendidikanKar';
import PrsBagian from '../models/PrsBagian';
import PrsDivisi from '../models/PrsDivisi';
import PrsSeksi from '../models/PrsSeksi';
import PrsJabatan from '../models/prsJabatan';
import PrsMasterDeputi from '../models/PrsMasterDeputi';
import PrsMasterDirektur from '../models/PrsMasterDirektur';
import PrsJamMengajarKaryawan from '../models/prsJamMengajarKaryawan';
import PrsMasterMapel from '../models/PrsMasterMapel';
import History from '../models/HistoryModels';
import { Op } from 'sequelize';
import { HistoryAttributes } from '../types/history';

export class LetterRepository {
  // ================= SURAT KARYAWAN TTP / KWT / TKL / WTT =================
  private async getSuratByStatus(
    id_karyawan: string,
    status: string
  ): Promise<PrsKaryawan | null> {
    return await PrsKaryawan.findOne({
      where: { id_karyawan },
      attributes: [
        'id_karyawan',
        'nik',
        'nama_lengkap',
        'no_ktp',
        'tgl_join_penabur_jkt',
        'tanggal_inactive',
      ],
      include: [
        this.includeUnitKerja(),
        {
          model: PrsStatusKaryawan,
          as: 'status_karyawan',
          attributes: ['stat_karyawan_gp'],
          where: { stat_karyawan_gp: status },
        },
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
      raw: false,
      nest: true,
    });
  }

  async SuratKaryawanTTP(id_karyawan: string): Promise<PrsKaryawan | null> {
    return await PrsKaryawan.findOne({
      where: { id_karyawan },
      attributes: [
        'id_karyawan',
        'nik',
        'nama_lengkap',
        'no_ktp',
        'tgl_join_penabur_jkt',
        'tanggal_inactive',
      ],
      include: [
        this.includeUnitKerja(),
        {
          model: PrsStatusKaryawan,
          as: 'status_karyawan',
          attributes: ['stat_karyawan_gp'],
          where: { stat_karyawan_gp: 'TTP' },
        },
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
      raw: false,
      nest: true,
    });
  }

  async SuratKaryawanKWT(id_karyawan: string): Promise<PrsKaryawan | null> {
    return await PrsKaryawan.findOne({
      where: { id_karyawan },
      attributes: [
        'id_karyawan',
        'nik',
        'nama_lengkap',
        'no_ktp',
        'tgl_join_penabur_jkt',
        'tanggal_inactive',
      ],
      include: [
        this.includeUnitKerja(),

        {
          model: PrsStatusKaryawan,
          as: 'status_karyawan',
          attributes: ['stat_karyawan_gp'],
          where: { stat_karyawan_gp: 'KWT' },
        },
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

  async Disposisi(id_karyawan: string): Promise<PrsKaryawan | null> {
    return await this.SuratKaryawanKWT(id_karyawan);
  }

  async SuratKaryawanTKL(id_karyawan: string): Promise<PrsKaryawan | null> {
    return await PrsKaryawan.findOne({
      where: { id_karyawan },
      attributes: [
        'id_karyawan',
        'nik',
        'nama_lengkap',
        'no_ktp',
        'tgl_join_penabur_jkt',
        'tanggal_inactive',
      ],
      include: [
        this.includeUnitKerja(),
        {
          model: PrsStatusKaryawan,
          as: 'status_karyawan',
          attributes: ['stat_karyawan_gp'],
          where: { stat_karyawan_gp: 'TKL' },
        },
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

  async SuratKaryawanWTT(id_karyawan: string) {
    return this.getSuratByStatus(id_karyawan, 'WTT');
  }

  // ================= INCLUDE ALAMAT =================
  private includeAlamat(alias: string) {
    return {
      model: PrsMasterAlamat,
      as: alias,
      attributes: [
        'id',
        'alamat',
        'rt',
        'rw',
        'kode_pos',
        'status_tempat_tinggal',
      ],
      include: [
        this.includeUnitKerja(),
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
    };
  }

  // ================= SURAT BERITA ACARA BIPARTIT =================
  async SuratBeritaAcaraBIPARTIT(id_karyawan: string) {
    return await PrsKaryawan.findOne({
      where: { id_karyawan, status_aktif: 'Aktif' },
      attributes: [
        'id_karyawan',
        'nik',
        'nik',
        'nama_lengkap',
        'no_ktp',
        'tgl_join_penabur',
        'tgl_join_penabur_jkt',
        'tgl_status_permanen',
        'tgl_penuh_waktu',
        'tanggal_inactive',
      ],
      raw: false,
      nest: true,
    });
  }

  // ================= UNIT KERJA + JABATAN =================
  private includeUnitKerja() {
    return {
      model: PrsUnitKerjaKaryawan,
      as: 'unit_kerja_karyawan',
      attributes: ['ukk_id', 'karyawan_id', 'unit_kerja', 'jab_id'],
      include: [
        { model: PrsJabatan, as: 'jabatan', attributes: ['jab_id', 'jabatan'] },
        {
          model: PrsUnitKerja,
          as: 'unit_kerja_detail',
          attributes: ['kode_divisi'],
          include: [
            {
              model: PrsMasterDirektur,
              as: 'direktur',
              attributes: ['dir_id', 'nama_dir'],
            },
            {
              model: PrsMasterDeputi,
              as: 'deputi',
              attributes: ['dep_id', 'nama_dep'],
            },
            {
              model: PrsDivisi,
              as: 'divisi',
              attributes: ['div_id', 'nama_div'],
            },
            {
              model: PrsBagian,
              as: 'bagian',
              attributes: ['bag_id', 'nama_bag'],
            },
            {
              model: PrsSeksi,
              as: 'seksi',
              attributes: ['sek_id', 'nama_sek'],
            },
          ],
        },
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
    };
  }

  // ================= CUTI PANJANG =================
  async CutiPanjang(id: string) {
    return await PrsKaryawan.findByPk(id, {
      attributes: ['id_karyawan', 'nik', 'nama_lengkap', 'nik'],
      include: [
        this.includeUnitKerja(),
        {
          model: PrsStatusKaryawan,
          as: 'status_karyawan',
          attributes: ['stat_karyawan_gp'],
        },
      ],
      raw: false,
      nest: true,
    });
  }

  // ================= SURAT PHK =================
  async SuratPHKbyId(id_karyawan: string) {
    return await PrsKaryawan.findByPk(id_karyawan, {
      attributes: [
        'id_karyawan',
        'nik',
        'nik',
        'nama_lengkap',
        'telp_pribadi',
        'alasan_berhenti_kerja',
        'no_bpjs_kesehatan',
      ],
      raw: false,
      nest: true,
    });
  }

  async SuratPHK() {
    return await PrsKaryawan.findAll({
      where: {
        alasan_berhenti_kerja: { [Op.in]: ['Mengundurkan Diri', 'PHK'] },
      },
      attributes: [
        'id_karyawan',
        'nik',
        'nik',
        'nama_lengkap',
        'telp_pribadi',
        'alasan_berhenti_kerja',
        'no_bpjs_kesehatan',
      ],
      raw: false,
      nest: true,
    });
  }

  // ================= HISTORY =================
  private async attachHistory(data: any, id: string) {
    const lastHistory = (await History.findOne({
      where: {
        id_karyawan: id,
        tipe_perubahan: {
          [Op.like]: '%kode_golongan%',
        },
      },
      order: [['created_at', 'DESC']],
      attributes: ['tipe_perubahan', 'value_lama', 'created_at'],
      raw: true,
    })) as HistoryAttributes | null;

    return {
      ...data,
      'history.tipe_perubahan': lastHistory?.tipe_perubahan ?? null,
      'history.value_lama': lastHistory?.value_lama ?? null,
      'history.created_at': lastHistory?.created_at ?? null,
    };
  }

  // ================= SURAT KEPUTUSAN KENAIKAN GOLONGAN =================
  async surat_keputusan_kenaikan_golongan(id: string) {
    const data = await PrsKaryawan.findByPk(id, {
      attributes: [
        'id_karyawan',
        'nik',
        'nama_lengkap',
        'nik',
        'kode_golongan',
        'tempat_lahir',
        'birth_date',
      ],
      include: [
        this.includeUnitKerja(),
        {
          model: PrsStatusKaryawan,
          as: 'status_karyawan',
          attributes: ['stat_karyawan_gp'],
        },
      ],
      raw: false,
      nest: true,
    });

    if (!data) return null;

    // 🔑 WAJIB: ubah Sequelize instance → plain object
    const plainData = data.get({ plain: true });

    // 🔑 AMAN: attach history ke plain object
    return await this.attachHistory(plainData, id);
  }

  // ================= USULAN PENGANGKATAN =================
  async usulan_pengangkatan(id: string) {
    return await PrsKaryawan.findByPk(id, {
      attributes: [
        'id_karyawan',
        'nik',
        'nik',
        'nama_lengkap',
        'agama',
        'tgl_join_penabur_jkt',
        'tempat_lahir',
        'birth_date',
        'status_nikah',
        'kode_golongan',
      ],
      include: [
        this.includeUnitKerja(),

        {
          model: PrsStatusKaryawan,
          as: 'status_karyawan',
          attributes: ['stat_karyawan_gp'],
        },
        {
          model: PrsRiwPendidikanKar,
          as: 'pendidikan',
          attributes: ['tingkat'],
          order: [['tahun_kelulusan', 'DESC']],
          limit: 1,
        },
        {
          model: PrsMasterAgama,
          as: 'agama_detail',
          attributes: ['kode_agama', 'agama'],
        },
      ],
      raw: false,
      nest: true,
    });
  }

  async Mutasi(id: string) {
    const data = await PrsKaryawan.findByPk(id, {
      attributes: [
        'id_karyawan',
        'nik',
        'nama_lengkap',
        'nik',
        'kode_golongan',
        'tempat_lahir',
        'birth_date',
      ],

      include: [
        this.includeUnitKerja(),
        {
          model: PrsStatusKaryawan,
          as: 'status_karyawan',
          attributes: ['stat_karyawan_gp'],
        },
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
      raw: false,
      nest: true,
    });

    if (!data) return null;

    // 🔑 WAJIB: ubah Sequelize instance → plain object
    const plainData = data.get({ plain: true });

    // 🔑 AMAN: attach history ke plain object
    return await this.attachHistory(plainData, id);
  }

  async surat_kesalahan_berat_atau_pelanggaran(id: string) {
    const data = await PrsKaryawan.findByPk(id, {
      attributes: [
        'id_karyawan',
        'nik',
        'nama_lengkap',
        'nik',
        'kode_golongan',
        'tempat_lahir',
        'birth_date',
      ],

      include: [
        this.includeUnitKerja(),
        {
          model: PrsStatusKaryawan,
          as: 'status_karyawan',
          attributes: ['stat_karyawan_gp'],
        },
      ],
      raw: false,
      nest: true,
    });

    if (!data) return null;

    // 🔑 WAJIB: ubah Sequelize instance → plain object
    const plainData = data.get({ plain: true });

    // 🔑 AMAN: attach history ke plain object
    return await this.attachHistory(plainData, id);
  }
  async pengunduran_diri(id: string) {
    const data = await PrsKaryawan.findByPk(id, {
      attributes: [
        'id_karyawan',
        'nik',
        'nama_lengkap',
        'nik',
        'kode_golongan',
        'tgl_join_penabur_jkt',
        'tanggal_inactive',
        'tempat_lahir',
        'birth_date',
      ],

      include: [
        this.includeUnitKerja(),
        {
          model: PrsStatusKaryawan,
          as: 'status_karyawan',
          attributes: ['stat_karyawan_gp'],
        },
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
          required: false,
          include: [
            {
              model: PrsMasterKel,
              as: 'kelurahan',
              attributes: ['id', 'nama'],
              required: false,
              include: [
                {
                  model: PrsMasterKec,
                  as: 'kecamatan',
                  attributes: ['id', 'nama'],
                  required: false,
                  include: [
                    {
                      model: PrsMasterKot,
                      as: 'kota',
                      attributes: ['id', 'nama'],
                      required: false,
                      include: [
                        {
                          model: PrsMasterProv,
                          as: 'provinsi',
                          attributes: ['id', 'nama'],
                          required: false,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ✅ Alamat KTP
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
          required: false,
          include: [
            {
              model: PrsMasterKel,
              as: 'kelurahan',
              attributes: ['id', 'nama'],
              required: false,
              include: [
                {
                  model: PrsMasterKec,
                  as: 'kecamatan',
                  attributes: ['id', 'nama'],
                  required: false,
                  include: [
                    {
                      model: PrsMasterKot,
                      as: 'kota',
                      attributes: ['id', 'nama'],
                      required: false,
                      include: [
                        {
                          model: PrsMasterProv,
                          as: 'provinsi',
                          attributes: ['id', 'nama'],
                          required: false,
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
      raw: false,
      nest: true,
    });

    if (!data) return null;

    // 🔑 WAJIB: ubah Sequelize instance → plain object
    const plainData = data.get({ plain: true });

    // 🔑 AMAN: attach history ke plain object
    return await this.attachHistory(plainData, id);
  }
  async keterangan_kerja(id: string) {
    const data = await PrsKaryawan.findByPk(id, {
      attributes: [
        'id_karyawan',
        'nik',
        'nama_lengkap',
        'kode_golongan',
        'tempat_lahir',
        'birth_date',
        'status_nikah',
        'agama',
        'tgl_join_penabur',
        'tgl_join_penabur_jkt',
        'tanggal_inactive',
      ],

      include: [
        // ✅ Pendidikan (digabung di sini)
        {
          model: PrsRiwPendidikanKar,
          as: 'pendidikan',
          // ⚠️ kalau tidak semua karyawan punya data pendidikan,
          // jangan required:true (nanti data utama bisa jadi null)
          required: false,
          attributes: [
            'rpk_id',
            ['riw_pendidikan_id', 'univ'],
            'jurusan',
            'tahun_kelulusan',
            'tingkat',
            'ipk',
          ],
        },

        // ✅ Keluarga
        {
          model: PrsKeluargaKaryawan,
          as: 'keluarga_karyawan',
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
              as: 'agama_detail',
              attributes: ['agama'],
              required: false,
            },
          ],
          required: false,
        },

        this.includeUnitKerja(),
        {
          model: PrsUnitKerjaKaryawan,
          as: 'unit_kerja_karyawan',
          attributes: ['jab_id'],
          include: [
            {
              model: PrsJabatan,
              as: 'jabatan',
              attributes: ['jab_id', 'jabatan'],
              required: false,
            },
          ],
          required: false,
        },

        // ✅ Agama karyawan
        {
          model: PrsMasterAgama,
          as: 'agama_detail',
          attributes: ['kode_agama', 'agama'],
          required: false,
        },

        // ✅ Alamat tempat tinggal
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
          required: false,
          include: [
            {
              model: PrsMasterKel,
              as: 'kelurahan',
              attributes: ['id', 'nama'],
              required: false,
              include: [
                {
                  model: PrsMasterKec,
                  as: 'kecamatan',
                  attributes: ['id', 'nama'],
                  required: false,
                  include: [
                    {
                      model: PrsMasterKot,
                      as: 'kota',
                      attributes: ['id', 'nama'],
                      required: false,
                      include: [
                        {
                          model: PrsMasterProv,
                          as: 'provinsi',
                          attributes: ['id', 'nama'],
                          required: false,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ✅ Alamat KTP
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
          required: false,
          include: [
            {
              model: PrsMasterKel,
              as: 'kelurahan',
              attributes: ['id', 'nama'],
              required: false,
              include: [
                {
                  model: PrsMasterKec,
                  as: 'kecamatan',
                  attributes: ['id', 'nama'],
                  required: false,
                  include: [
                    {
                      model: PrsMasterKot,
                      as: 'kota',
                      attributes: ['id', 'nama'],
                      required: false,
                      include: [
                        {
                          model: PrsMasterProv,
                          as: 'provinsi',
                          attributes: ['id', 'nama'],
                          required: false,
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

      raw: false,
      nest: true,
    });

    if (!data) return null;

    const plain: any = data.get({ plain: true });

    // ✅ hitung jumlah anak
    const jumlah_anak = (plain.keluarga_karyawan ?? []).filter(
      (k: any) =>
        String(k?.hubungan ?? '')
          .trim()
          .toLowerCase() === 'anak'
    ).length;

    // ✅ gabungkan field baru
    const result = {
      ...plain,
      jumlah_anak,
    };

    // ✅ kalau kamu butuh attach history, lakukan di sini
    // asumsi attachHistory return object yang sudah dimodif
    return await this.attachHistory(result, id);
  }

  async BPJS_Ketenagakerjaan(id: string) {
    const data = await PrsKaryawan.findByPk(id, {
      attributes: [
        'id_karyawan',
        'nik',
        'nama_lengkap',
        'nik',
        'kode_golongan',
        'tempat_lahir',
        'tgl_join_penabur_jkt',
        'tanggal_inactive',
        'birth_date',
        'no_bpjs_kesehatan',
        'no_bpjs_danpes',
        'no_bpjs_ketenagakerjaan',
      ],

      include: [
        this.includeUnitKerja(),
        {
          model: PrsUnitKerjaKaryawan,
          as: 'unit_kerja_karyawan',
          attributes: ['jab_id'],
          include: [
            {
              model: PrsJabatan,
              as: 'jabatan',
              attributes: ['jab_id', 'jabatan'],
            },
          ],
        },

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
      raw: false,
      nest: true,
    });

    if (!data) return null;

    // 🔑 WAJIB: ubah Sequelize instance → plain object
    return data.get({ plain: true });
  }
}

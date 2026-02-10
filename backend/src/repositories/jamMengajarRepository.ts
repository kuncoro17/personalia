// repositories/jamMengajarRepository.ts
import PrsJamMengajarKaryawan, {
  JamMengajarAttributes,
  JamMengajarCreationAttributes,
} from '../models/prsJamMengajarKaryawan';
import PrsUnitKerjaKaryawan from '../models/PrsUnitKerjaKaryawan';
// import PrsKaryawan from '../models/PrsKaryawanModel';
import PrsMasterMapel from '../models/PrsMasterMapel';
import PrsJabatan from '../models/prsJabatan';
interface MapelRelation {
  mapel_id: string;
  nama_mapel: string;
}

interface JabatanRelation {
  kode_jab: string;
  jabatan: string;
}
interface UnitKerjaKaryawanRelation {
  jab_id: string;
  unit_kerja: string;
  lokasi_kerja: string;
  jabatan?: JabatanRelation;
}

interface JamMengajarWithRelations {
  jmk_id: string;
  jam_mengajar: string;
  mengajar_mapel?: string;
  created_at: Date;
  updated_at: Date;
  mapel?: MapelRelation;
  unit_kerja_karyawan?: UnitKerjaKaryawanRelation;
}

interface UpdateJamMengajarPayload {
  jam_mengajar?: number;
  mengajar_mapel?: string;
  mata_pelajaran?: string;
  unit_kerja?: string;
  jabatan?: string;
}

interface JamMengajarResult {
  id_karyawan: string;
  ukk_id: string;
  jmk_id: string; // ganti dari number → string
  jam_mengajar: number | null;
  mengajar_mapel: string | null;
  mata_pelajaran: { id: string; nama: string } | null;
  jabatan: {
    jab_id?: string | null;
    unit_kerja?: string | null;
    lokasi_kerja?: string | null;
    jabatan?: {
      kode_jab: string;
      jabatan: string;
    } | null;
  } | null;
  created_at?: Date; // ✨ jadikan optional
  updated_at?: Date; // ✨ jadikan optional
}

// interface MapelDTO {
//   mapel_id: string;
//   nama_mapel: string;
// }

// interface JabatanDTO {
//   kode_jab: string;
//   jabatan: string;
// }

// interface UnitKerjaKaryawanDTO {
//   jab_id: string;
//   unit_kerja: string;
//   jabatan?: JabatanDTO | null;
// }

// interface PrsJamMengajarKaryawanDTO {
//   jmk_id: string;
//   jam_mengajar: number;
//   mengajar_mapel: string;
//   mapel?: MapelDTO | null;
//   unit_kerja_karyawan?: UnitKerjaKaryawanDTO | null;
//   created_at: Date;
//   updated_at: Date;
// }

// interface UpdatePayload {
//   jam_mengajar?: number;
//   mengajar_mapel?: string;
//   mata_pelajaran?: string;
//   unit_kerja?: string;
//   jabatan?: string;
// }

export default {
  async getAll(): Promise<PrsJamMengajarKaryawan[]> {
    return PrsJamMengajarKaryawan.findAll();
  },

  async getById(id: string): Promise<PrsJamMengajarKaryawan | null> {
    return PrsJamMengajarKaryawan.findByPk(id);
  },

  async create(
    data: JamMengajarCreationAttributes
  ): Promise<PrsJamMengajarKaryawan> {
    return PrsJamMengajarKaryawan.create(data);
  },

  async update(
    id: string,
    data: Partial<JamMengajarAttributes>
  ): Promise<PrsJamMengajarKaryawan | null> {
    const record = await PrsJamMengajarKaryawan.findByPk(id);
    if (!record) return null;
    await record.update(data);
    return record;
  },

  async delete(id: string): Promise<PrsJamMengajarKaryawan | null> {
    const record = await PrsJamMengajarKaryawan.findByPk(id);
    if (!record) return null;
    await record.destroy();
    return record;
  },
  async GetJamMengajarByIdKaryawan(id_karyawan: string) {
    // 1️⃣ Ambil semua unit kerja karyawan
    const unitKerja = await PrsUnitKerjaKaryawan.findAll({
      where: { karyawan_id: id_karyawan },
      attributes: ['ukk_id', 'unit_kerja', ['jab_id', 'jabatan']],
      raw: true,
    });

    if (!unitKerja.length) return [];

    // 2️⃣ Ambil jam mengajar per ukk_id (batch)
    const ukkIds = unitKerja.map(u => u.ukk_id);

    const jamMengajar = await PrsJamMengajarKaryawan.findAll({
      where: { ukk_id: ukkIds },
      attributes: ['jmk_id', 'jam_mengajar', 'mengajar_mapel', 'ukk_id'],
      include: [
        {
          model: PrsMasterMapel,
          as: 'mapel',
          attributes: ['mapel_id', 'nama_mapel'],
          required: false,
        },
      ],
      raw: true,
    });

    // 3️⃣ Gabungkan data unit kerja dan jam mengajar
    const result = unitKerja.map(uk => {
      const jm = jamMengajar.filter(j => j.ukk_id === uk.ukk_id);
      return {
        ...uk,
        jam_mengajar: jm.map(j => ({
          jmk_id: j.jmk_id,
          jam_mengajar: j.jam_mengajar,
          mengajar_mapel: j.mengajar_mapel,
          mapel: j.mapel
            ? { id: j.mapel.mapel_id, nama: j.mapel.nama_mapel }
            : null,
        })),
      };
    });

    return result;
  },

  async updateByIdKaryawanAndUkkId(
    id_karyawan: string,
    ukk_id: string,
    payload: UpdateJamMengajarPayload
  ): Promise<JamMengajarResult> {
    // 🔹 Cek relasi karyawan dan unit kerja
    const unitKerja = await PrsUnitKerjaKaryawan.findOne({
      where: { karyawan_id: id_karyawan, ukk_id },
      attributes: ['ukk_id', 'karyawan_id', 'unit_kerja', 'jab_id'],
    });

    if (!unitKerja) {
      throw new Error('Data unit kerja untuk karyawan ini tidak ditemukan.');
    }

    // 🔹 Tentukan mapel ID yang digunakan
    const mapelId = payload.mata_pelajaran ?? payload.mengajar_mapel;

    // 🔹 Update tabel prs_jam_mengajar_karyawan
    if (payload.jam_mengajar !== undefined || mapelId !== undefined) {
      await PrsJamMengajarKaryawan.update(
        {
          jam_mengajar: payload.jam_mengajar,
          mengajar_mapel: mapelId,
        },
        { where: { ukk_id } }
      );
    }

    // 🔹 Update jabatan & unit kerja
    const updateUnit: Partial<{ unit_kerja: string; jab_id: string }> = {};
    if (payload.jabatan !== undefined) updateUnit.jab_id = payload.jabatan;
    if (payload.unit_kerja !== undefined)
      updateUnit.unit_kerja = payload.unit_kerja;

    if (Object.keys(updateUnit).length > 0) {
      await PrsUnitKerjaKaryawan.update(updateUnit, {
        where: { ukk_id, karyawan_id: id_karyawan },
      });
    }

    // 🔹 Ambil data terbaru setelah update
    const updated = (await PrsJamMengajarKaryawan.findOne({
      where: { ukk_id },
      include: [
        {
          model: PrsMasterMapel,
          as: 'mapel',
          attributes: ['mapel_id', 'nama_mapel'],
          required: false,
        },
        {
          model: PrsUnitKerjaKaryawan,
          as: 'unit_kerja_karyawan',
          attributes: ['jab_id', 'unit_kerja', 'lokasi_kerja'],
          include: [
            {
              model: PrsJabatan,
              as: 'jabatan',
              attributes: ['kode_jab', 'jabatan'],
            },
          ],
          required: false,
        },
      ],
    })) as PrsJamMengajarKaryawan & JamMengajarWithRelations;

    if (!updated) {
      throw new Error('Data jam mengajar tidak ditemukan setelah update.');
    }

    // 🔹 Bentuk data mapel & jabatan
    const mapel = updated.mapel
      ? { id: updated.mapel.mapel_id, nama: updated.mapel.nama_mapel }
      : null;

    const jabatan = updated.unit_kerja_karyawan ?? null;

    return {
      id_karyawan,
      ukk_id,
      jmk_id: updated.getDataValue('jmk_id'),
      jam_mengajar: updated.getDataValue('jam_mengajar'),
      mengajar_mapel: updated.getDataValue('mengajar_mapel'),
      mata_pelajaran: mapel,
      jabatan,
      created_at: updated.getDataValue('created_at'),
      updated_at: updated.getDataValue('updated_at'),
    };
  },
};

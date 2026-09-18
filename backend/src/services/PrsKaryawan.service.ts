import {
  KaryawanUnitKerjaFilter,
  PrsKaryawanRepository,
} from '../repositories/PrsKaryawanRepository';
import PrsKeluargaKaryawan, {
  PrsKeluargaKaryawanAttributes,
} from '../models/PrsKeluargaKaryawan';
import { mapAdditionalDtoToKaryawanPayload } from '../helper/mapAdditionalDtoToKaryawanPayload';

import PrsJamMengajarKaryawan from '../models/prsJamMengajarKaryawan';
import PrsKaryawanAlamatDTO from '../types/PrsKaryawanAlamatDTO';
import PrsUnitKerjaKaryawan from '../models/PrsUnitKerjaKaryawan';
import { AdditionalDTO } from '../types/AdditionalDTO';
import { cleanObject } from '../utils/cleanObject';
import {
  BadRequestException,
  NotFoundException,
} from '../utils/http-exception';
import PrsKaryawan from '../models/PrsKaryawanModel';

import xss from 'xss';
import { PrsKaryawanAttributes } from '../types/prsKaryawan.types';

export interface PrsKeluargaKaryawanResponse {
  id: string;
  karyawan_id: string;
  nama_lengkap: string;
  nomor_identitas: string;
  tempat_lahir: string;
  tanggal_lahir: Date;
  no_telp: string;
  gender: string;
  kewarganegaraan: string;
  pekerjaan: string;
  pendidikan: string;
  flag_status: number;
  hubungan: number;
  tanggungan_medical: number;
  kebijakan_khusus_medical: number;
  flag_berpisah: number;
  keterangan: string;

  // 🔥 FIELD TAMBAHAN (HASIL JOIN)
  nama_agama: string | null;
  nama_kota: string | null;
  kode_kota: string | null;

  created_at?: Date;
  updated_at?: Date;
  keluarga_karyawan?: PrsKeluargaKaryawanResponse[];
}

export interface KaryawanWithKeluarga extends PrsKaryawan {
  keluarga_karyawan?: (PrsKeluargaKaryawan & {
    agama_detail?: { agama: string };
    tempat_tinggal_keluarga_karyawan?: { nama_kota: string; kode_kota: string };
    nama_agama?: string | null;
    nama_kota?: string | null;
    kode_kota?: string | null;
  })[];
}

export interface KeluargaDetail {
  keluarga_karyawan?: (PrsKeluargaKaryawanAttributes & {
    agama_detail?: { agama: string };
    tempat_tinggal_keluarga_karyawan?: { nama_kota: string; kode_kota: string };
    nama_agama?: string | null;
    nama_kota?: string | null;
    kode_kota?: string | null;
  })[];
}

// Tipe hasil join
export type PrsKaryawanWithKeluarga = PrsKaryawanAttributes & KeluargaDetail;

const repository = new PrsKaryawanRepository();
function isValidUUID(id: string) {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}
const allowedFields = [
  'nik',
  'no_ktp',
  'id_karyawan',
  'status_aktif',
  'foto',
  'nama_lengkap',
  'nama_panggilan',
  'telp_pribadi',
  'telp_kantor',
  'email_pribadi',
  'email_penabur',
  'tgl_join_penabur',
  'tgl_join_penabur_jkt',
  'agama',
  'status_nikah',
  'tanggal_pernikahan',
  'tipe_sekolah',
  'kode_status_karyawan',
  'tgl_status_permanen',
  'tgl_penuh_waktu',
  'tanggal_inactive',
  'alasan_berhenti_kerja',
  'atasan_langsung',
  'atasan_tidak_langsung',
  'alamat_ktp',
  'alamat_tempat_tinggal',
  'tempat_lahir',
  'birth_date',
  'gender',
  'gol_darah',
  'tinggi_badan',
  'berat_badan',
  'kewarganegaraan',
  'anggota_gereja',
  'instagram',
  'twitter',
  'no_kitas',
  'no_visa',
  'no_tabita',
  'npwp',
  'rekening',
  'kode_golongan',
  'no_bpjs_kesehatan',
  'no_bpjs_ketenagakerjaan',
  'no_bpjs_danpes',
  'nama_bpjs_danpes',
  'etnis',
  'no_pasport',
  'id_master_setempat',
] as const;

// Tipe DTO berdasarkan field yang diizinkan
type KaryawanDTO = Partial<
  Record<(typeof allowedFields)[number], string | number | Date | null>
>;

function sanitizeObject(input: KaryawanDTO): KaryawanDTO {
  const sanitized: KaryawanDTO = {};
  for (const key in input) {
    if (allowedFields.includes(key as (typeof allowedFields)[number])) {
      const value = input[key as keyof KaryawanDTO];
      sanitized[key as keyof KaryawanDTO] =
        typeof value === 'string' ? xss(value) : value;
    }
  }

  return sanitized;
}

export type UpdateInformasiPenggajianPayload = Partial<
  Pick<
    PrsKaryawanAttributes,
    'npwp' | 'rekening' | 'no_bpjs_ketenagakerjaan' | 'no_bpjs_kesehatan'
  >
>;
export class PrsKaryawanService {
  private repository = new PrsKaryawanRepository();

  async getAll(
    page = 1,
    limit = 10,
    status_aktif?: string,
    unitKerjaFilter?: KaryawanUnitKerjaFilter
  ) {
    const offset = (page - 1) * limit;

    const data = await this.repository.findAllWithPagination(
      limit,
      offset,
      status_aktif,
      unitKerjaFilter
    );
    const total = await this.repository.countAll(status_aktif, unitKerjaFilter);

    return {
      data: data ?? [],
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getAllBySetempat(
    id_master_setempat: number,
    page = 1,
    limit = 10,
    status_aktif?: string,
    unitKerjaFilter?: KaryawanUnitKerjaFilter
  ) {
    const offset = (page - 1) * limit;

    const data = await this.repository.findAllWithPaginationBySetempat(
      id_master_setempat,
      limit,
      offset,
      status_aktif,
      unitKerjaFilter
    );
    const total = await this.repository.countAllBySetempat(
      id_master_setempat,
      status_aktif,
      unitKerjaFilter
    );

    return {
      data: data ?? [],
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: string) {
    const sanitized = xss(id || '').trim();
    if (!sanitized) throw new BadRequestException('Parameter wajib diisi');

    const data = isValidUUID(sanitized)
      ? await repository.findById(sanitized)
      : await repository.findByIdOrNik(sanitized);
    if (!data) throw new NotFoundException('Karyawan tidak ditemukan');
    return data;
  }

  async getByIdOrNik(identifier: string) {
    const sanitized = xss(identifier || '').trim();
    if (!sanitized) throw new BadRequestException('Parameter wajib diisi');

    const data = await repository.findByIdOrNik(sanitized);
    if (!data) throw new NotFoundException('Karyawan tidak ditemukan');
    return data;
  }

  async getByemail(email: string): Promise<PrsKaryawan> {
    const data = await repository.getAlamatByIdKaryawan(email);
    if (!data) throw new NotFoundException('Karyawan tidak ditemukan');
    return data;
  }

  async getSetempatIdByEmail(email: string) {
    const sanitized = xss(email || '').trim();
    if (!sanitized) return null;

    return repository.findSetempatIdByEmail(sanitized);
  }

  async getAccessProfileByEmail(email: string) {
    const sanitized = xss(email || '').trim();
    if (!sanitized) return null;

    return repository.findAccessProfileByEmail(sanitized);
  }

  // services/prsKaryawanService.ts
  async findByNameAscPaginated(
    nama_lengkap: string,
    page: number,
    limit: number,
    id_master_setempat?: number,
    status_aktif?: string,
    unitKerjaFilter?: KaryawanUnitKerjaFilter
  ) {
    const sanitized = xss(nama_lengkap || '');
    if (!sanitized) throw new BadRequestException('Parameter nama wajib diisi');

    const validPage = Number.isNaN(page) || page < 1 ? 1 : page;
    const validLimit = Number.isNaN(limit) || limit < 1 ? 10 : limit;
    const offset = (validPage - 1) * validLimit;

    return repository.findByNameAscPaginated(
      sanitized,
      validLimit,
      offset,
      id_master_setempat,
      status_aktif,
      unitKerjaFilter
    );
  }

  async create(data: KaryawanDTO) {
    const sanitizedData = sanitizeObject(data);
    if (!sanitizedData.nik || sanitizedData.nik.toString().length < 7) {
      throw new BadRequestException('NIK tidak valid atau terlalu pendek');
    }
    return await repository.create(sanitizedData);
  }

  async update(id: string, data: KaryawanDTO) {
    const sanitizedData = sanitizeObject(data);
    const updated = await repository.updateKaryawan(id, sanitizedData);
    if (!updated) throw new NotFoundException('Karyawan tidak ditemukan');
    return updated;
  }

  async updateMengajarMapelByKaryawanId(
    idKaryawan: string,
    mengajarMapel: string
  ) {
    // 🔍 1️⃣ Cari unit kerja (ukk_id) berdasarkan id_karyawan
    const unitKerja = await PrsUnitKerjaKaryawan.findOne({
      where: { karyawan_id: idKaryawan },
      attributes: ['ukk_id'],
    });

    if (!unitKerja) {
      throw new NotFoundException(
        'Unit kerja tidak ditemukan untuk karyawan ini'
      );
    }

    const ukkId = unitKerja.get('ukk_id') as string;

    // 🔍 2️⃣ Cek apakah ada data jam mengajar terkait ukk_id
    const jamMengajar = await PrsJamMengajarKaryawan.findOne({
      where: { ukk_id: ukkId },
    });
    if (!jamMengajar) {
      throw new NotFoundException(
        'Data jam mengajar tidak ditemukan untuk karyawan ini'
      );
    }

    // ✏️ 3️⃣ Update kolom mengajar_mapel
    await PrsJamMengajarKaryawan.update(
      { mengajar_mapel: mengajarMapel },
      { where: { ukk_id: ukkId } }
    );

    return { message: 'Data mengajar_mapel berhasil diperbarui' };
  }

  async updateStatusTidakAktif(id: string, status: string) {
    const sanitizedStatus = xss(status);
    const updated = await repository.updateTidakAktif(id, {
      status_aktif: sanitizedStatus,
    });
    if (!updated) {
      throw new NotFoundException('ID karyawan tidak ada');
    }
    return updated;
  }

  async delete(id: string) {
    const deleted = await repository.delete(id);
    if (!deleted) throw new NotFoundException('Karyawan tidak ditemukan');
    return deleted;
  }

  async getKaryawanByJoinDate(date: string) {
    const result = await repository.getByJoinDate(date);

    if (!result || result.length === 0) {
      return {
        total: 0,
        date,
        data: [],
      };
    }

    return {
      total: result.length,
      date,
      data: result,
    };
  }

  async getKaryawanOffboardingByDate(date: string) {
    const result = await repository.getByInactiveDate(date);

    return {
      total: result.length,
      date,
      data: result,
    };
  }

  async getKaryawanBirthdayToday(page = 1, limit = 3) {
    const offset = (page - 1) * limit;
    const { data, total } = await this.repository.getBirthdayToday(
      limit,
      offset
    );

    // Jika tidak ada data ulang tahun hari ini
    if (!data || data.length === 0) {
      return {
        total: 0,
        page,
        limit,
        total_pages: 0,
        data: [],
      };
    }

    // Jika ada data
    return {
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
      data,
    };
  }

  async getCountAktif() {
    return await repository.countAktif();
  }

  async getCountTidakAktif() {
    return await repository.countTidakAktif();
  }

  async getKeluargaByKaryawanId(karyawan_id: string) {
    const sanitizedId = xss(karyawan_id);
    if (!isValidUUID(sanitizedId))
      throw new BadRequestException('Format ID tidak sesuai UUID');

    const data = await repository.getKeluargaByKaryawanId(sanitizedId);
    if (!data) throw new NotFoundException('Karyawan tidak ditemukan');
    return data;
  }
  async getKeluargaByKaryawanIdAndId(
    idKaryawan: string,
    idKeluarga: string
  ): Promise<PrsKaryawanWithKeluarga> {
    const data = await repository.getKeluargaByKaryawanIdAndId(
      idKaryawan,
      idKeluarga
    );

    if (!data) {
      throw new NotFoundException('Data keluarga tidak ditemukan');
    }

    // 🔥 TRANSFORMASI DI SINI (BUKAN MUTATE MODEL)
    const keluargaResponse = data.keluarga_karyawan?.map(kel => {
      const plain = kel.get({ plain: true });

      return {
        ...plain,
        tanggal_lahir: new Date(plain.tanggal_lahir),
        nama_agama: kel.agama_detail?.agama ?? null,
        nama_kota: kel.tempat_tinggal_keluarga_karyawan?.nama_kota ?? null,
        kode_kota: kel.tempat_tinggal_keluarga_karyawan?.kode_kota ?? null,
      };
    });

    // 🔥 RETURN OBJECT BARU (BUKAN INSTANCE SEQUELIZE)
    return {
      ...(data.get({ plain: true }) as Omit<
        PrsKaryawanWithKeluarga,
        'keluarga_karyawan'
      >),
      keluarga_karyawan: keluargaResponse,
    };
  }

  async getUnitKerjaByKaryawanId(id: string) {
    // 1️⃣ Validasi UUID
    if (!isValidUUID(id)) {
      throw new BadRequestException('ID karyawan tidak valid.');
    }

    // 2️⃣ Sanitasi input
    const safeId = xss(id);

    // 3️⃣ Ambil data dari repository (JANGAN lupa pakai await)
    const data = await this.repository.unit_kerja_karyawan_byidkaryawan(safeId);

    // 4️⃣ Cek hasil
    if (!data) {
      throw new NotFoundException(
        `Data unit kerja untuk ID ${safeId} tidak ditemukan.`
      );
    }

    return data;
  }
  async direktur() {
    const data = await this.repository.Direktur();

    if (!data || data.length === 0) {
      throw new NotFoundException('Data direktur tidak ditemukan');
    }

    return data;
  }

  async getAllWithKaryawan() {
    return await repository.findAllWithKaryawan();
  }

  async getDetailPendidikanByIdKaryawan(id_karyawan: string) {
    const sanitizedId = xss(id_karyawan);

    if (!isValidUUID(sanitizedId)) {
      throw new BadRequestException('Format ID karyawan tidak valid');
    }

    const data = await repository.getDetailPendidikanByIdKaryawan(sanitizedId);

    if (!data) {
      throw new NotFoundException(
        `Data pendidikan tidak ditemukan untuk id_karyawan: ${sanitizedId}`
      );
    }

    return data;
  }

  async updateKeluargaById(
    karyawan_id: string,
    id: string,
    payload: {
      nama_lengkap?: string;
      nomor_identitas?: string;
      tempat_lahir?: string;
      tanggal_lahir?: string;
      agama?: number;
      kewarganegaraan?: string;
      pekerjaan?: string;
      pendidikan?: string;
      gender?: string;
      hubungan?: string;
      telepon?: string;
      flag_status?: number;
      tanggungan_medical?: number;
      kebijakan_khusus_medical?: number;
      flag_berpisah?: number;
      keterangan?: string;
    }
  ) {
    const sanitizedIdKaryawan = xss(karyawan_id);
    const sanitizedId = xss(id);

    if (!isValidUUID(sanitizedIdKaryawan)) {
      throw new BadRequestException('Format id_karyawan tidak valid');
    }
    if (!isValidUUID(sanitizedId)) {
      throw new BadRequestException('Format id keluarga tidak valid');
    }

    const existing = await repository.getKeluargaById(
      sanitizedIdKaryawan,
      sanitizedId
    );

    if (!existing) {
      throw new NotFoundException(
        `Data keluarga tidak ditemukan untuk id: ${sanitizedId}`
      );
    }

    // 🔥 TRANSFORM PAYLOAD KE FORMAT DB
    const updatePayload = {
      ...payload,
      tanggal_lahir: payload.tanggal_lahir
        ? new Date(payload.tanggal_lahir)
        : undefined,
    };

    const updated = await repository.updateKeluargaById(
      sanitizedIdKaryawan,
      sanitizedId,
      updatePayload
    );

    return {
      success: true,
      message: 'Data keluarga berhasil diperbarui',
      data: updated,
    };
  }

  async getUnitKerjaByIdKaryawan(idKaryawan: string) {
    const sanitizedId = xss(idKaryawan || '');
    if (!sanitizedId) {
      throw new BadRequestException('id_karyawan tidak boleh kosong');
    }

    // validasi UUID opsional jika id_karyawan berupa UUID
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(sanitizedId)) {
      throw new BadRequestException('Format id_karyawan tidak valid');
    }

    const data = await repository.findByIdLokasiKerja(sanitizedId);
    if (!data) {
      throw new NotFoundException(
        'Data tidak ditemukan untuk id_karyawan tersebut'
      );
    }
    // console.log(data);

    return data;
  }

  async getDetailMengajarByID(id_karyawan: string) {
    const sanitizedID = xss(id_karyawan);
    if (!sanitizedID) throw new BadRequestException('Email tidak boleh kosong');

    const data = await repository.getDetailMengajarByID(sanitizedID);
    if (!data)
      throw new NotFoundException(
        `Data tidak ditemukan untuk email ${sanitizedID}`
      );

    return data;
  }
  async getKontrakByEmail(email: string) {
    const sanitizedEmail = xss(email);
    if (!sanitizedEmail)
      throw new BadRequestException('Email tidak boleh kosong');

    const data = await repository.getKontrakByEmail(sanitizedEmail);
    if (!data)
      throw new NotFoundException(
        'Data kontrak tidak ditemukan untuk email ini'
      );

    return data;
  }
  async getAlamatLengkapByIdKaryawan(idKaryawan: string) {
    const sanitizedId = xss(idKaryawan);

    if (!sanitizedId)
      throw new BadRequestException('ID karyawan tidak boleh kosong');
    if (!isValidUUID(sanitizedId))
      throw new BadRequestException('ID karyawan tidak valid');

    const data = await repository.getAlamatByIdKaryawan(sanitizedId);
    if (!data)
      throw new NotFoundException(
        `Alamat tidak ditemukan untuk id_karyawan: ${sanitizedId}`
      );

    return data;
  }

  async getKontakDaruratByIdKaryawan(id_karyawan: string) {
    const sanitizedId = xss(id_karyawan);

    if (!isValidUUID(sanitizedId)) {
      throw new BadRequestException('Format ID karyawan tidak valid');
    }

    const data = await repository.getKontakDaruratByIdKaryawan(sanitizedId);

    if (!data) {
      throw new NotFoundException(
        `Data kontak darurat tidak ditemukan untuk id_karyawan: ${sanitizedId}`
      );
    }

    return data;
  }

  async updateKontakDaruratById(
    id_karyawan: string,
    id: string,
    payload: {
      nama_kondar?: string;
      hubungan_kondar?: string;
      alamat_kondar?: string;
      telp_darurat?: string;
      email?: string;
      kategori_kontak?: string;
      no_hp?: string;
    }
  ) {
    const sanitizedIdKaryawan = xss(id_karyawan);
    const sanitizedId = xss(id);

    // validasi uuid
    if (!isValidUUID(sanitizedIdKaryawan)) {
      throw new BadRequestException('Format id_karyawan tidak valid');
    }

    if (!isValidUUID(sanitizedId)) {
      throw new BadRequestException('Format id kontak_darurat tidak valid');
    }

    // update data
    const updated = await repository.updateKontakDaruratById(
      sanitizedIdKaryawan,
      sanitizedId,
      payload
    );

    return {
      message: 'Kontak darurat berhasil diupdate',
      data: updated,
    };
  }

  async getUnitKerjaWithDivisiBagianSeksiByEmail(email: string) {
    const sanitizedEmail = xss(email || '');
    if (!sanitizedEmail)
      throw new BadRequestException('Email tidak boleh kosong');

    const data =
      await repository.findByEmailLokasiKerjaSeksiBagianDivisi(sanitizedEmail);
    if (!data)
      throw new NotFoundException(
        `Data tidak ditemukan untuk email ${sanitizedEmail}`
      );

    return data;
  }
  async getKaryawanWithDokumenByEmail(email: string) {
    const sanitizedEmail = xss(email || '');
    if (!sanitizedEmail)
      throw new BadRequestException('Email tidak boleh kosong');

    const data = await repository.getKaryawanWithDokumenByEmail(sanitizedEmail);
    if (!data)
      throw new NotFoundException(
        `Data tidak ditemukan untuk email ${sanitizedEmail}`
      );

    return data;
  }
  async getDetailKaryawan(id: string) {
    // 🔹 Validasi ID wajib diisi
    if (!id) throw new BadRequestException('Parameter id wajib diisi');

    // 🔹 Validasi format UUID
    if (!isValidUUID(id))
      throw new BadRequestException('Format id tidak valid');

    // 🔹 Sanitasi input
    const cleanId = xss(id);

    // 🔹 Ambil data dari repository
    const data = await this.repository.detail_karyawan(cleanId);

    // 🔹 Cek jika data tidak ditemukan
    if (!data)
      throw new NotFoundException(
        `Data karyawan dengan id ${cleanId} tidak ditemukan`
      );

    return data;
  }

  async getInformasiPenggajian(id: string) {
    // 🔹 Validasi ID wajib diisi
    if (!id) throw new BadRequestException('Parameter id wajib diisi');

    // 🔹 Validasi format UUID
    if (!isValidUUID(id))
      throw new BadRequestException('Format id tidak valid');

    // 🔹 Sanitasi input (mencegah XSS)
    const cleanId = xss(id);

    // 🔹 Ambil data dari repository
    const data = await this.repository.informasi_penggajian(cleanId);

    // 🔹 Cek jika data tidak ditemukan
    if (!data) {
      throw new NotFoundException(
        `Informasi penggajian tidak ditemukan untuk id: ${cleanId}`
      );
    }

    return data;
  }

  async updateInformasiPenggajian(
    id: string,
    payload: Partial<UpdateInformasiPenggajianPayload>
  ) {
    const updated = await repository.updateInformasiPenggajian(id, payload);

    if (updated === 0) {
      return {
        success: false,
        message: 'Data tidak ditemukan atau tidak berubah',
      };
    }

    return {
      success: true,
      message: 'Informasi penggajian berhasil diupdate',
    };
  }

  async updateAlamat(
    id_karyawan: string,
    payload: Partial<PrsKaryawanAlamatDTO>
  ) {
    if (!id_karyawan) {
      throw new BadRequestException('id_karyawan wajib dikirim');
    }

    const cleanPayload = {
      alamat_tempat_tinggal: cleanObject(payload.alamatTempatTinggalDetail),
      alamat_ktp: cleanObject(payload.alamatKtpDetail),
    };

    if (!cleanPayload.alamat_tempat_tinggal && !cleanPayload.alamat_ktp) {
      throw new BadRequestException('Tidak ada data alamat yang dikirim');
    }

    const result = await this.repository.updateAlamatKaryawan(
      id_karyawan,
      cleanPayload
    );

    return {
      success: true,
      message: 'Alamat berhasil diperbarui',
      data: result,
    };
  }

  async getAdditionalById(id_karyawan: string) {
    const sanitizedId = xss(id_karyawan);

    if (!isValidUUID(sanitizedId)) {
      throw new BadRequestException('Format ID karyawan tidak valid');
    }

    const data = await repository.getAdditionalById(sanitizedId);

    if (!data) {
      throw new NotFoundException('Data tidak ditemukan');
    }

    return {
      data, // ⬅️ controller HARUS menerima "data"
    };
  }

  async updateAdditionalById(
    id_karyawan: string,
    payload: Partial<AdditionalDTO>
  ) {
    const sanitizedId = xss(id_karyawan);
    const allowedFields = [
      'foto',
      'gol_darah',
      'tempat_lahir',
      'gender',
      'birth_date',
      'kewarganegaraan',
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
    ] as const satisfies readonly (keyof AdditionalDTO)[];

    // Validasi ID
    if (!sanitizedId) {
      throw new BadRequestException('id_karyawan wajib dikirim');
    }

    if (!isValidUUID(sanitizedId)) {
      throw new BadRequestException('Format ID karyawan tidak valid');
    }

    // Validasi payload
    if (!payload || Object.keys(payload).length === 0) {
      throw new BadRequestException('Payload tidak boleh kosong');
    }

    const sanitizedPayload: Partial<AdditionalDTO> = {};

    for (const key of allowedFields) {
      const value = payload[key];

      if (typeof value === 'string') {
        sanitizedPayload[key] = xss(value);
      } else if (value !== undefined) {
        sanitizedPayload[key] = value;
      }
    }

    if (Object.keys(sanitizedPayload).length === 0) {
      throw new BadRequestException('Tidak ada field yang bisa diupdate');
    }

    if (sanitizedPayload.tempat_lahir !== undefined) {
      const tempatLahir = String(sanitizedPayload.tempat_lahir).trim();

      if (!tempatLahir) {
        delete sanitizedPayload.tempat_lahir;
      } else if (!isValidUUID(tempatLahir)) {
        throw new BadRequestException('Tempat lahir harus berupa ID kota yang valid');
      } else {
        sanitizedPayload.tempat_lahir = tempatLahir;
      }
    }

    if (Object.keys(sanitizedPayload).length === 0) {
      throw new BadRequestException('Tidak ada field yang bisa diupdate');
    }

    const updatePayload = mapAdditionalDtoToKaryawanPayload(sanitizedPayload);

    // UPDATE
    await repository.updateAdditionalById(sanitizedId, updatePayload);
    // if (updated === 0) {
    //   throw new NotFoundException('ID karyawan tidak ditemukan');
    // }

    return {
      message: 'Data tambahan berhasil diperbarui',
      success: true,
      data: sanitizedPayload,
    };
  }
}

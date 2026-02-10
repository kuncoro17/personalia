// services/SuratService.ts

import {
  BadRequestException,
  NotFoundException,
} from '../utils/http-exception';

import xss from 'xss';

import { LetterRepository } from '../repositories/LetterRepository';
function isValidUUID(id: string) {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}
const repository = new LetterRepository();
export class SuratService {
  async getSuratKaryawanTTP(idKaryawan: string) {
    const sanitizedId = xss(idKaryawan);

    if (!sanitizedId)
      throw new BadRequestException('ID karyawan tidak boleh kosong');
    if (!isValidUUID(sanitizedId))
      throw new BadRequestException('ID karyawan tidak valid');

    const data = await repository.SuratKaryawanTTP(sanitizedId);
    if (!data)
      throw new NotFoundException(
        `Alamat tidak ditemukan untuk id_karyawan: ${sanitizedId}`
      );

    return data;
  }

  async getSuratKaryawanKWT(id: string) {
    // 🔹 Validasi ID wajib diisi
    if (!id) throw new BadRequestException('Parameter id wajib diisi');

    // 🔹 Validasi format UUID
    if (!isValidUUID(id)) {
      throw new BadRequestException('Format id tidak valid');
    }

    // 🔹 Sanitasi input
    const cleanId = xss(id);

    // 🔹 Ambil data dari repository
    const data = await repository.SuratKaryawanKWT(cleanId);

    // 🔹 Jika data tidak ditemukan
    if (!data) {
      throw new NotFoundException(
        `Data karyawan KWT dengan id ${cleanId} tidak ditemukan`
      );
    }

    return data;
  }
  async getSuratKaryawanTKL(id: string) {
    // 🔹 Validasi ID wajib diisi
    if (!id) throw new BadRequestException('Parameter id wajib diisi');

    // 🔹 Validasi format UUID
    if (!isValidUUID(id)) {
      throw new BadRequestException('Format id tidak valid');
    }

    // 🔹 Sanitasi input
    const cleanId = xss(id);

    // 🔹 Ambil data dari repository
    const data = await repository.SuratKaryawanTKL(cleanId);

    // 🔹 Jika data tidak ditemukan
    if (!data) {
      throw new NotFoundException(
        `Data karyawan TKL dengan id ${cleanId} tidak ditemukan`
      );
    }

    return data;
  }
  async getSuratKaryawanWTT(id: string) {
    // 🔹 Validasi ID wajib diisi
    if (!id) throw new BadRequestException('Parameter id wajib diisi');

    // 🔹 Validasi format UUID
    if (!isValidUUID(id)) {
      throw new BadRequestException('Format id tidak valid');
    }

    // 🔹 Sanitasi input
    const cleanId = xss(id);

    // 🔹 Ambil data dari repository
    const data = await repository.SuratKaryawanWTT(cleanId);

    // 🔹 Jika data tidak ditemukan
    if (!data) {
      throw new NotFoundException(
        `Data karyawan WTT dengan id ${cleanId} tidak ditemukan`
      );
    }

    return data;
  }
  async SuratBeritaAcaraBIPARTIT(id: string) {
    // 🔹 Validasi ID wajib diisi
    if (!id) throw new BadRequestException('Parameter id wajib diisi');

    // 🔹 Validasi format UUID
    if (!isValidUUID(id)) {
      throw new BadRequestException('Format id tidak valid');
    }

    // 🔹 Sanitasi input
    const cleanId = xss(id);

    // 🔹 Ambil data dari repository
    const data = await repository.SuratBeritaAcaraBIPARTIT(cleanId);

    // 🔹 Jika data tidak ditemukan
    if (!data) {
      throw new NotFoundException(
        `Data karyawan dengan id ${cleanId} tidak ditemukan`
      );
    }

    return data;
  }
  async CutiPanjang(id: string) {
    // 🔹 Validasi ID wajib diisi
    if (!id) throw new BadRequestException('Parameter id wajib diisi');

    // 🔹 Validasi format UUID
    if (!isValidUUID(id)) {
      throw new BadRequestException('Format id tidak valid');
    }

    // 🔹 Sanitasi input
    const cleanId = xss(id);

    // 🔹 Ambil data dari repository
    const data = await repository.CutiPanjang(cleanId);

    // 🔹 Jika data tidak ditemukan
    if (!data) {
      throw new NotFoundException(
        `Data karyawan dengan id ${cleanId} tidak ditemukan`
      );
    }

    return data;
  }
  async SuratPHKbyId(id: string) {
    // 🔹 Validasi ID wajib diisi
    if (!id) throw new BadRequestException('Parameter id wajib diisi');

    // 🔹 Validasi format UUID
    if (!isValidUUID(id)) {
      throw new BadRequestException('Format id tidak valid');
    }

    // 🔹 Sanitasi input
    const cleanId = xss(id);

    // 🔹 Ambil data dari repository
    const data = await repository.SuratPHKbyId(cleanId);

    // 🔹 Jika data tidak ditemukan
    if (!data) {
      throw new NotFoundException(
        `Data karyawan dengan id ${cleanId} tidak ditemukan`
      );
    }

    return data;
  }
  async SuratPHK() {
    const data = await repository.SuratPHK();

    if (!data || data.length === 0) {
      throw new NotFoundException(
        'Tidak ada karyawan dengan status PHK / Mengundurkan Diri'
      );
    }

    return data;
  }
  async CutiDiLuarTangguangan(id: string) {
    // 🔹 Validasi ID wajib diisi
    if (!id) throw new BadRequestException('Parameter id wajib diisi');

    // 🔹 Validasi format UUID
    if (!isValidUUID(id)) {
      throw new BadRequestException('Format id tidak valid');
    }

    // 🔹 Sanitasi input
    const cleanId = xss(id);

    // 🔹 Ambil data dari repository
    const data = await repository.CutiPanjang(cleanId);

    // 🔹 Jika data tidak ditemukan
    if (!data) {
      throw new NotFoundException(
        `Data karyawan dengan id ${cleanId} tidak ditemukan`
      );
    }

    return data;
  }
  async Mutasi(id: string) {
    // 🔹 Validasi ID wajib diisi
    if (!id) throw new BadRequestException('Parameter id wajib diisi');

    // 🔹 Validasi format UUID
    if (!isValidUUID(id)) {
      throw new BadRequestException('Format id tidak valid');
    }

    // 🔹 Sanitasi input
    const cleanId = xss(id);

    // 🔹 Ambil data dari repository
    const data = await repository.Mutasi(cleanId);

    // 🔹 Jika data tidak ditemukan
    if (!data) {
      throw new NotFoundException(
        `Data karyawan dengan id ${cleanId} tidak ditemukan`
      );
    }

    return data;
  }
  async getSuratKeputusanKenaikanGolongan(id: string) {
    const data = await repository.surat_keputusan_kenaikan_golongan(id);

    if (!data) {
      throw new Error('Data karyawan tidak ditemukan');
    }

    return data;
  }
  async usulan_pengangkatan(id: string) {
    // 🔹 Validasi ID wajib diisi
    if (!id) throw new BadRequestException('Parameter id wajib diisi');

    // 🔹 Validasi format UUID
    if (!isValidUUID(id)) {
      throw new BadRequestException('Format id tidak valid');
    }

    // 🔹 Sanitasi input
    const cleanId = xss(id);

    // 🔹 Ambil data dari repository
    const data = await repository.usulan_pengangkatan(cleanId);

    // 🔹 Jika data tidak ditemukan
    if (!data) {
      throw new NotFoundException(
        `Data karyawan dengan id ${cleanId} tidak ditemukan`
      );
    }

    return data;
  }
  async surat_kesalahan_berat_pelanggaran(id: string): Promise<{
    success: boolean;
    data?: unknown;
    message?: string;
  }> {
    try {
      const data = await repository.surat_kesalahan_berat_atau_pelanggaran(id);

      if (!data) {
        return {
          success: false,
          message: 'Data tidak ditemukan',
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error: unknown) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Terjadi kesalahan pada service',
      };
    }
  }

  // async surat_kesepakatan_bersama(id: string): Promise<{
  //   success: boolean;
  //   data?: unknown;
  //   message?: string;
  // }> {
  //   try {
  //     const data = await repository.surat_kesepakatan_bersama(id);

  //     if (!data) {
  //       return {
  //         success: false,
  //         message: 'Karyawan tidak ditemukan',
  //       };
  //     }

  //     return {
  //       success: true,
  //       data,
  //     };
  //   } catch (error: unknown) {
  //     const message =
  //       error instanceof Error
  //         ? error.message
  //         : 'Terjadi kesalahan pada service';

  //     return {
  //       success: false,
  //       message,
  //     };
  //   }
  // }

  async BPJS_Ketenagakerjaan(id: string): Promise<{
    success: boolean;
    data?: unknown;
    message?: string;
  }> {
    try {
      const data = await repository.BPJS_Ketenagakerjaan(id);

      return {
        success: true,
        data,
      };
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan pada service';

      return {
        success: false,
        message,
      };
    }
  }

  async surat_keterangan(id: string): Promise<{
    success: boolean;
    data?: unknown;
    message?: string;
  }> {
    try {
      const data = await repository.keterangan_kerja(id);

      return {
        success: true,
        data,
      };
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan pada service';

      return {
        success: false,
        message,
      };
    }
  }

  async pengunduran_diri(id: string): Promise<{
    success: boolean;
    data?: unknown;
    message?: string;
  }> {
    try {
      const data = await repository.pengunduran_diri(id);

      if (!data) {
        return {
          success: false,
          message: `Karyawan dengan id ${id} tidak ditemukan`,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan pada service';

      return {
        success: false,
        message,
      };
    }
  }

  // async surat_penempatan(id_karyawan: string): Promise<{
  //   success: boolean;
  //   data?: unknown;
  //   message?: string;
  // }> {
  //   try {
  //     const data = await repository.pengunduran_diri(id_karyawan);

  //     if (!data) {
  //       return {
  //         success: false,
  //         message: `Karyawan dengan id ${id_karyawan} tidak ditemukan`,
  //       };
  //     }

  //     return {
  //       success: true,
  //       data,
  //     };
  //   } catch (error: unknown) {
  //     const message =
  //       error instanceof Error
  //         ? error.message
  //         : 'Terjadi kesalahan pada service';

  //     return {
  //       success: false,
  //       message,
  //     };
  //   }
  // }
}

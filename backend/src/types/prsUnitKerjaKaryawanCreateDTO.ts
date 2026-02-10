import { UUID } from 'crypto';

// types/prsUnitKerjaKaryawanDTO.ts
export interface PrsUnitKerjaKaryawanDTO {
  ukk_id: string; // wajib, karena ini di DB
  karyawan_id: UUID;
  unit_kerja: string;
  jab_id: string;
  lokasi_penggajian: string;
}

export interface CreatePrsUnitKerjaKaryawanDTO {
  ukk_id: string;
  karyawan_id: UUID;
  unit_kerja: string;
  jab_id: string;
  lokasi_penggajian: string;
}

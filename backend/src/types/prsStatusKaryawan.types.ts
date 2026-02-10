// src/types/prsStatusKaryawan.types.ts
export interface PrsStatusKaryawanAttributes {
  stat_id: string;
  kode: string;
  stat_karyawan: string;
  stat_karyawan_gp?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

export type PrsStatusKaryawanCreateInput = Omit<
  PrsStatusKaryawanAttributes,
  'stat_id' | 'created_at' | 'updated_at'
>;

export type PrsStatusKaryawanUpdateInput =
  Partial<PrsStatusKaryawanCreateInput>;

import { Optional } from 'sequelize';

export interface HistoryAttributes {
  id_karyawan: string;
  tipe_perubahan: string;
  value_lama?: string | null;
  keterangan?: string | null;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

// Properti yang optional saat create
export type HistoryCreationAttributes = Optional<
  HistoryAttributes,
  'created_at' | 'updated_at' | 'deleted_at' | 'value_lama' | 'keterangan'
>;

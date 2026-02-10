export interface PrsUnitKerjaAttributes {
  uk_id: string;

  kode_seksi: string;
  kode_bagian: string;
  kode_divisi: string;
  kode_direktur?: string | null;
  kode_deputi?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

export type PrsUnitKerjaCreateInput = Omit<
  PrsUnitKerjaAttributes,
  'created_at' | 'updated_at'
>;

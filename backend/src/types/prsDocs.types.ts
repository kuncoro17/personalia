// src/types/prsDokumen.types.ts
export interface PrsDokumenAttributes {
  id: string;
  karyawan_id: string;
  kitas?: string | null;
  visa?: string | null;
  tabita?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

export type UpdateDokumenBody = Partial<
  Pick<PrsDokumenAttributes, 'kitas' | 'visa' | 'tabita'>
> & {
  updated_at?: Date;
};

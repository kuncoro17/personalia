export interface PrsMasterAlamatAttributes {
  id: string;
  alamat: string;
  kel_id: string;
  rt?: number;
  rw?: number;
  kode_pos?: string;
  status_tempat_tinggal?: string;
  created_at?: Date;
  updated_at?: Date;
}

// Untuk CREATE → id, created_at, updated_at optional
export type PrsMasterAlamatCreationAttributes = Omit<
  PrsMasterAlamatAttributes,
  'id' | 'created_at' | 'updated_at'
>;
export interface CreateAlamatPayload {
  alamat_tempat_tinggal?: PrsMasterAlamatCreationAttributes;
  alamat_ktp?: PrsMasterAlamatCreationAttributes;
}

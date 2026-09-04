// import type PrsKaryawanModel from '../models/PrsKaryawanModel';

export interface RelationalField {
  id?: string;
  nama?: string;
}

export type RelationalKeys =
  | 'direktur'
  | 'deputi'
  | 'divisi'
  | 'bagian'
  | 'seksi'
  | 'unit_kerja'
  | 'jabatan'
  | 'mapel'
  | 'agama';

export const Pemisah: Record<RelationalKeys, string> = {
  direktur: 'nama_dir',
  deputi: 'nama_dep',
  divisi: 'nama_div',
  bagian: 'nama_bag',
  seksi: 'nama_sek',
  unit_kerja: 'unit_kerja',
  jabatan: 'jabatan',
  mapel: 'mapel',
  agama: 'nama',
};

// Semua field utama bisa string | number | null
// type NonRelationalKeys = Exclude<keyof PrsKaryawanModel, RelationalKeys>;

// export type FilteredKaryawan = {
//   [K in NonRelationalKeys]?: string | number | null;
// } & {
//   [K in RelationalKeys]?: RelationalField;
// };

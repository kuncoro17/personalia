import { PrsKaryawanAttributes } from './prsKaryawan.types';

// tipe alamat yang diambil dari tabel prs_master_alamat
export interface PrsMasterAlamatAttributes {
  id: string;
  alamat: string;
  rt: number;
  rw: number;
  kode_pos: string;
  status_tempat_tinggal: string;
}

// type utama hasil findById (sudah include alamat dan hasil olahan)
export interface PrsKaryawanWithAlamat extends PrsKaryawanAttributes {
  alamat_ktp_detail?: PrsMasterAlamatAttributes | null;
  alamat_tempat_tinggal_detail?: PrsMasterAlamatAttributes | null;
  alamat?:
    | {
        ktp?: PrsMasterAlamatAttributes | null;
        tempat_tinggal?: PrsMasterAlamatAttributes | null;
      }
    | PrsMasterAlamatAttributes
    | null;
}

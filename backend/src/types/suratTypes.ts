import { PrsKaryawan } from '../models';

export interface PrsKaryawanWithRelations extends PrsKaryawan {
  alamat_ktp_detail?: any;
  alamat_tempat_tinggal_detail?: any;
  status_karyawan?: {
    stat_karyawan_gp?: string;
  };
}

// export interface PrsKaryawanAlamatDTO {
//   id_karyawan: string;

//   alamat_tempat_tinggal: {
//     alamat: string;
//     rt: string;
//     rw: string;
//     kode_pos: string;
//     status_tempat_tinggal: string;
//     kel_id: string; // id kelurahan
//   };

//   alamat_ktp: {
//     alamat: string;
//     rt: string;
//     rw: string;
//     kode_pos: string;
//     status_tempat_tinggal: string;
//     kel_id: string; // id kelurahan
//   };
// }
export interface PrsKaryawanAlamatDTO {
  id_karyawan?: string;

  alamatTempatTinggalDetail?: {
    alamat?: string;
    rt?: string;
    rw?: string;
    kode_pos?: string;
    status_tempat_tinggal?: string;
    kelurahan?: string;
  };

  alamatKtpDetail?: {
    alamat?: string;
    rt?: string;
    rw?: string;
    kode_pos?: string;
    status_tempat_tinggal?: string;
    kelurahan?: string;
  };
}

export default PrsKaryawanAlamatDTO;

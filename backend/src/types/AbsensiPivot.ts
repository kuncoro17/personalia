// types/AbsensiPivot.ts
export interface AbsensiPivotRow {
  nik: string;
  nama_lengkap: string;
  // kolom tanggal bisa dinamis, jadi optional string
  [key: string]: string | number | null;
}

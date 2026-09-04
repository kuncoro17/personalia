// src/types/AbsensiTypes.ts
export interface CheckinRow {
  userid: string | number;
  checktime: Date | string;
}

export interface LemburRow {
  Nik: string | number;
  Tgl: string; // format: "dd/mm/yyyy"
  [key: string]: unknown; // jika ada field tambahan
}

export interface GabunganRow extends LemburRow {
  JamMasuk: string | null;
  JamPulang: string | null;
  RangeCheckin: string;
}

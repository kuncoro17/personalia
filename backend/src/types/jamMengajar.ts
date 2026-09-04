// src/types/jamMengajar.ts
export interface JamMengajarResult {
  id_karyawan: string;
  ukk_id: string;
  jmk_id: number;
  jam_mengajar: number | null;
  mengajar_mapel: string | null;
  mata_pelajaran: { id: string; nama: string } | null;
  jabatan: {
    jab_id?: string | null;
    unit_kerja?: string | null;
    lokasi_kerja?: string | null;
    jabatan?: {
      kode_jab: string;
      jabatan: string;
    } | null;
  } | null;
  created_at: Date;
  updated_at: Date;
}

export default JamMengajarResult;

// src/types/prsKontrak.types.ts
export interface CreateKontrakDTO {
  ukk_id: string;
  file_kontrak: string;
  tanggal_mulai: string | Date;
  tanggal_berakhir: string | Date;
}

export interface UpdateKontrakDTO {
  file_kontrak?: string;
  tanggal_mulai?: string | Date;
  tanggal_berakhir?: string | Date;
}

// src/types/prsDokumen.types.ts
import { UploadedFile } from '../helper/fileHelper';

export interface CreateDokumenDTO {
  karyawan_id: string;
  kitas?: UploadedFile | null;
  visa?: UploadedFile | null;
  tabita?: UploadedFile | null;
}

export interface UpdateDokumenDTO {
  karyawan_id?: string;
  kitas?: UploadedFile | null;
  visa?: UploadedFile | null;
  tabita?: UploadedFile | null;
}

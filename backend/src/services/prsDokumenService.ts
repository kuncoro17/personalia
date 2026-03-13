import PrsDokumen from '../models/prsDokumenModel';
import { BadRequestException } from '../utils/http-exception';
import { UploadedFile, uploadFile } from '../helper/fileHelper';

interface CreateDokumenDTO {
  karyawan_id: string;
  tipe_dokumen_id: string;
  dokumen: UploadedFile | null;
}

interface UpdateDokumenDTO {
  karyawan_id?: string;
  tipe_dokumen_id?: string;
  dokumen?: UploadedFile | null;
}

function isUploadedFile(file: unknown): file is UploadedFile {
  return (
    typeof file === 'object' &&
    file !== null &&
    'originalname' in file &&
    'buffer' in file
  );
}

// ---- CREATE ----
export const create = async (data: CreateDokumenDTO) => {
  const { karyawan_id, tipe_dokumen_id, dokumen } = data;

  if (!karyawan_id || !tipe_dokumen_id)
    throw new BadRequestException(
      'karyawan_id dan tipe_dokumen_id wajib diisi'
    );

  let uploadedPath: string | null = null;

  if (dokumen && isUploadedFile(dokumen)) {
    uploadedPath = await uploadFile(
      dokumen,
      `uploads/docs/${Date.now()}-${dokumen.originalname}`
    );
  }

  const newDoc = await PrsDokumen.create({
    karyawan_id,
    tipe_dokumen_id,
    dokumen_path: uploadedPath ?? '',
  });

  return newDoc.toJSON();
};

// ---- READ ----
export const getAll = async () => await PrsDokumen.findAll();

export const getById = async (id: string) => await PrsDokumen.findByPk(id);

// ---- UPDATE ----
export const updateDokumenService = async (
  id: string,
  data: UpdateDokumenDTO
) => {
  const existing = await PrsDokumen.findByPk(id);
  if (!existing) throw new BadRequestException('Dokumen tidak ditemukan');

  let uploadedPath: string | undefined;
  if (data.dokumen && isUploadedFile(data.dokumen)) {
    uploadedPath = await uploadFile(
      data.dokumen,
      `uploads/docs/${Date.now()}-${data.dokumen.originalname}`
    );
  }

  await existing.update({
    karyawan_id: data.karyawan_id ?? existing.karyawan_id,
    tipe_dokumen_id: data.tipe_dokumen_id ?? existing.tipe_dokumen_id,
    dokumen_path: uploadedPath ?? existing.dokumen_path ?? '',
  });

  return existing.toJSON();
};

// ---- DELETE ----
export const remove = async (id: string): Promise<boolean> => {
  const deleted = await PrsDokumen.destroy({ where: { id } });
  return deleted > 0;
};

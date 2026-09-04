import PrsDokumen from '../models/prsDokumenModel';
import PrsTipeDokumen from '../models/prsTipeDokumenModel';
import { BadRequestException } from '../utils/http-exception';
import { UploadedFile, uploadFile } from '../helper/fileHelper';

interface CreateDokumenDTO {
  karyawan_id: string;
  tipe_dokumen_id?: string;
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

const getDefaultTipeDokumenId = async () => {
  const [defaultTipeDokumen] = await PrsTipeDokumen.findOrCreate({
    where: { tipe_dokumen: 'LAINNYA' },
    defaults: { tipe_dokumen: 'LAINNYA' },
  });

  // Some legacy databases do not have a database-side default for this UUID.
  // In that setup findOrCreate can persist the row while returning an instance
  // whose generated id has not been hydrated yet. Read it back before creating
  // PrsDokumen so its required foreign key can never be passed as null.
  if (defaultTipeDokumen.id) return defaultTipeDokumen.id;

  const persistedDefault = await PrsTipeDokumen.findOne({
    where: { tipe_dokumen: 'LAINNYA' },
  });

  if (!persistedDefault?.id) {
    throw new BadRequestException(
      'Tipe dokumen default LAINNYA tidak dapat dibuat'
    );
  }

  return persistedDefault.id;
};

// ---- CREATE ----
export const create = async (data: CreateDokumenDTO) => {
  const { karyawan_id, tipe_dokumen_id, dokumen } = data;

  if (!karyawan_id) throw new BadRequestException('karyawan_id wajib diisi');
  if (!dokumen || !isUploadedFile(dokumen)) {
    throw new BadRequestException('dokumen wajib diisi');
  }

  let uploadedPath: string | null = null;

  uploadedPath = await uploadFile(
    dokumen,
    `uploads/docs/${Date.now()}-${dokumen.originalname}`
  );

  const newDoc = await PrsDokumen.create({
    karyawan_id,
    tipe_dokumen_id: tipe_dokumen_id || (await getDefaultTipeDokumenId()),
    dokumen_path: uploadedPath ?? '',
  });

  return newDoc.toJSON();
};

// ---- READ ----
export const getAll = async () => await PrsDokumen.findAll();

export const getById = async (id: string) => await PrsDokumen.findByPk(id);

export const getByKaryawanId = async (karyawanId: string) =>
  await PrsDokumen.findAll({
    where: { karyawan_id: karyawanId },
    include: [
      {
        model: PrsTipeDokumen,
        as: 'tipe_dokumen',
        attributes: ['id', 'tipe_dokumen'],
        required: false,
      },
    ],
    order: [['created_at', 'DESC']],
  });

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

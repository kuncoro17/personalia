import PrsTipeDokumen from '../models/prsTipeDokumenModel';
import { BadRequestException } from '../utils/http-exception';
import {
  CreateTipeDokumenDTO,
  UpdateTipeDokumenDTO,
} from '../types/prsTipeDokumen';

// ---- CREATE ----
export const create = async (data: CreateTipeDokumenDTO) => {
  const tipeDokumen = data.tipe_dokumen?.trim();

  if (!tipeDokumen) {
    throw new BadRequestException('Field tipe_dokumen wajib diisi');
  }

  if (tipeDokumen.length > 100) {
    throw new BadRequestException('tipe_dokumen maksimal 100 karakter');
  }

  const newTipe = await PrsTipeDokumen.create({
    tipe_dokumen: tipeDokumen,
  });

  return newTipe.toJSON();
};

// ---- READ ALL ----
export const getAll = async () => {
  return await PrsTipeDokumen.findAll({ order: [['tipe_dokumen', 'ASC']] });
};

// ---- READ BY ID ----
export const getById = async (id: string) => {
  const tipe = await PrsTipeDokumen.findByPk(id);
  if (!tipe) {
    throw new BadRequestException(
      `Tipe dokumen dengan ID ${id} tidak ditemukan`
    );
  }
  return tipe.toJSON();
};

// ---- UPDATE ----
export const updateTipeDokumenService = async (
  id: string,
  data: UpdateTipeDokumenDTO
) => {
  const record = await PrsTipeDokumen.findByPk(id);
  if (!record) {
    throw new BadRequestException(
      `Tipe dokumen dengan ID ${id} tidak ditemukan`
    );
  }

  const tipeDokumen = data.tipe_dokumen?.trim();
  if (!tipeDokumen) {
    throw new BadRequestException('Field tipe_dokumen wajib diisi');
  }

  if (tipeDokumen.length > 100) {
    throw new BadRequestException('tipe_dokumen maksimal 100 karakter');
  }

  await record.update({ tipe_dokumen: tipeDokumen });

  return record.toJSON();
};

// ---- DELETE ----
export const remove = async (id: string): Promise<boolean> => {
  const deleted = await PrsTipeDokumen.destroy({ where: { id } });
  if (deleted === 0) {
    throw new BadRequestException(
      `Tipe dokumen dengan ID ${id} tidak ditemukan`
    );
  }
  return true;
};

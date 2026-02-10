import PrsTipeDokumen from '../models/prsTipeDokumenModel';
import { BadRequestException } from '../utils/http-exception';
import {
  CreateTipeDokumenDTO,
  UpdateTipeDokumenDTO,
} from '../types/prsTipeDokumen';

// ---- CREATE ----
export const create = async (data: CreateTipeDokumenDTO) => {
  if (!data.tipe_dokumen) {
    throw new BadRequestException('Field tipe_dokumen wajib diisi');
  }

  const newTipe = await PrsTipeDokumen.create({
    tipe_dokumen: data.tipe_dokumen.trim(),
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

  await record.update({
    tipe_dokumen: data.tipe_dokumen?.trim() ?? record.tipe_dokumen,
  });

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

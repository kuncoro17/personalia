import PrsTipeDokumen from '../models/prsTipeDokumenModel';
import { PrsTipeDokumenAttributes } from '../models/prsTipeDokumenModel';

const findAll = async (): Promise<PrsTipeDokumen[]> => {
  return await PrsTipeDokumen.findAll({ order: [['tipe_dokumen', 'ASC']] });
};

const findById = async (id: string): Promise<PrsTipeDokumen | null> => {
  return await PrsTipeDokumen.findByPk(id);
};

const create = async (
  data: Omit<PrsTipeDokumenAttributes, 'id'>
): Promise<PrsTipeDokumen> => {
  return await PrsTipeDokumen.create(data);
};

const update = async (
  id: string,
  data: Partial<PrsTipeDokumenAttributes>
): Promise<PrsTipeDokumen | null> => {
  const record = await PrsTipeDokumen.findByPk(id);
  if (!record) return null;

  await record.update(data);
  return record;
};

const remove = async (id: string): Promise<boolean> => {
  const deleted = await PrsTipeDokumen.destroy({ where: { id } });
  return deleted > 0;
};

export default { findAll, findById, create, update, remove };

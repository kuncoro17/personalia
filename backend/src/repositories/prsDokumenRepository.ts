import PrsDokumen, { PrsDokumenAttributes } from '../models/prsDokumenModel';

interface FindAllOptions {
  page?: number;
  limit?: number;
}

const findAll = async (options: FindAllOptions = {}): Promise<PrsDokumen[]> => {
  const { page = 1, limit = 50 } = options; // default limit 50
  const offset = (page - 1) * limit;

  return await PrsDokumen.findAll({
    limit,
    offset,
    order: [['created_at', 'DESC']], // optional: urut berdasarkan created_at terbaru
  });
};

const findById = async (id: string): Promise<PrsDokumen | null> => {
  return await PrsDokumen.findByPk(id);
};

const create = async (data: PrsDokumenAttributes): Promise<PrsDokumen> => {
  return await PrsDokumen.create(data);
};

const update = async (
  id: string,
  data: Partial<PrsDokumenAttributes>
): Promise<PrsDokumen | null> => {
  const dokumen = await PrsDokumen.findByPk(id);
  if (!dokumen) return null;
  await dokumen.update(data);
  return dokumen;
};

const remove = async (id: string): Promise<boolean> => {
  const deleted = await PrsDokumen.destroy({ where: { id } });
  return deleted > 0;
};

export default { findAll, findById, create, update, remove };

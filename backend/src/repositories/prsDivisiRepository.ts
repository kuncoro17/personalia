// repositories/prsDivisiRepository.ts
import PrsDivisi, {
  PrsDivisiAttributes,
  PrsDivisiCreationAttributes,
} from '../models/PrsDivisi';

let isPrsDivisiTableEnsured = false;
let ensureTablePromise: Promise<void> | null = null;

const ensurePrsDivisiTable = async () => {
  if (isPrsDivisiTableEnsured) return;
  if (!ensureTablePromise) {
    ensureTablePromise = PrsDivisi.sync()
      .then(() => {
        isPrsDivisiTableEnsured = true;
      })
      .finally(() => {
        ensureTablePromise = null;
      });
  }
  await ensureTablePromise;
};

export const findAll = async (): Promise<PrsDivisi[]> => {
  await ensurePrsDivisiTable();
  return PrsDivisi.findAll();
};

export const findById = async (id: string): Promise<PrsDivisi | null> => {
  await ensurePrsDivisiTable();
  return PrsDivisi.findByPk(id);
};

export const create = async (
  data: PrsDivisiCreationAttributes
): Promise<PrsDivisi> => {
  await ensurePrsDivisiTable();
  return PrsDivisi.create(data);
};

export const update = async (
  id: string,
  data: Partial<PrsDivisiAttributes>
): Promise<PrsDivisi | null> => {
  await ensurePrsDivisiTable();
  const record = await PrsDivisi.findByPk(id);
  if (!record) return null;
  return record.update(data);
};

export const hardDelete = async (id: string): Promise<PrsDivisi | null> => {
  await ensurePrsDivisiTable();
  const record = await PrsDivisi.findByPk(id);
  if (!record) return null;
  await record.destroy({ force: true });
  return record;
};

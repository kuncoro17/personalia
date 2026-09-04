import PrsMasterRiwPendidikan, {
  RiwPendAttributes,
  RiwPendCreationAttributes,
} from '../models/PrsMasterRiwPendidikan';

export default {
  findAll: async (): Promise<RiwPendAttributes[]> => {
    return PrsMasterRiwPendidikan.findAll({ raw: true });
  },

  findById: async (id: string): Promise<RiwPendAttributes | null> => {
    return PrsMasterRiwPendidikan.findByPk(id, { raw: true });
  },

  create: async (
    data: RiwPendCreationAttributes
  ): Promise<RiwPendAttributes> => {
    const created = await PrsMasterRiwPendidikan.create(data);
    return created.get({ plain: true });
  },

  update: async (
    id: string,
    data: Partial<RiwPendAttributes>
  ): Promise<boolean> => {
    const [updated] = await PrsMasterRiwPendidikan.update(data, {
      where: { id },
    });
    return updated > 0;
  },

  delete: async (id: string): Promise<boolean> => {
    const deleted = await PrsMasterRiwPendidikan.destroy({ where: { id } });
    return deleted > 0;
  },
};

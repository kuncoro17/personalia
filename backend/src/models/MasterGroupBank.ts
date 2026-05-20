import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface MasterGroupBankAttributes {
  id: string;
  group_bank?: string | null;
}

export type MasterGroupBankCreationAttributes = Optional<
  MasterGroupBankAttributes,
  'id'
>;

export class MasterGroupBank
  extends Model<MasterGroupBankAttributes, MasterGroupBankCreationAttributes>
  implements MasterGroupBankAttributes
{
  public id!: string;
  public group_bank!: string | null;
}

MasterGroupBank.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    group_bank: {
      type: DataTypes.CHAR(10),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'master_group_bank',
    timestamps: false,
  }
);

export default MasterGroupBank;

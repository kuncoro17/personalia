import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface MasterBankGiroAttributes {
  id_bank_giro: string;
  bank_giro?: string | null;
  id_group_bank?: string | null;
}

export type MasterBankGiroCreationAttributes = Optional<
  MasterBankGiroAttributes,
  'id_bank_giro'
>;

export class MasterBankGiro
  extends Model<MasterBankGiroAttributes, MasterBankGiroCreationAttributes>
  implements MasterBankGiroAttributes
{
  public id_bank_giro!: string;
  public bank_giro!: string | null;
  public id_group_bank!: string | null;
}

MasterBankGiro.init(
  {
    id_bank_giro: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    bank_giro: {
      type: DataTypes.CHAR(10),
      allowNull: true,
    },
    id_group_bank: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'master_bank_giro',
    timestamps: false,
  }
);

export default MasterBankGiro;

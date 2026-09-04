import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface KelAttributes {
  id: string;
  nama: string;
  kec_id: string;

  created_at?: Date;
  updated_at?: Date;
}

// Field yang boleh dikosongkan waktu create
export type KelCreationAttributes = Optional<
  KelAttributes,
  'id' | 'created_at' | 'updated_at'
>;

class PrsMasterKel
  extends Model<KelAttributes, KelCreationAttributes>
  implements KelAttributes
{
  declare id: string;
  declare nama: string;
  declare kec_id: string;

  declare created_at?: Date;
  declare updated_at?: Date;
}

PrsMasterKel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nama: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    kec_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'prs_master_kel',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default PrsMasterKel;

import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface PrsBagianAttributes {
  bag_id: string;
  kode: string;
  nama_bag: string;
  created_at?: Date;
  updated_at?: Date;
}

export type PrsBagianCreationAttributes = Optional<
  PrsBagianAttributes,
  'bag_id' | 'created_at' | 'updated_at'
>;

class PrsBagian
  extends Model<PrsBagianAttributes, PrsBagianCreationAttributes>
  implements PrsBagianAttributes
{
  declare bag_id: string;
  declare kode: string;
  declare nama_bag: string;
  declare created_at?: Date;
  declare updated_at?: Date;
}

PrsBagian.init(
  {
    bag_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    kode: {
      type: DataTypes.STRING(5),
      allowNull: false,
    },
    nama_bag: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'prs_bagian',
    timestamps: false,
  }
);

export default PrsBagian;

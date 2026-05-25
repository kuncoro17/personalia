import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface PrsMasterSetempatAttributes {
  id: number;
  kota_setempat: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

export type PrsMasterSetempatCreationAttributes = Optional<
  PrsMasterSetempatAttributes,
  'id' | 'created_at' | 'updated_at' | 'deleted_at'
>;

class PrsMasterSetempat
  extends Model<
    PrsMasterSetempatAttributes,
    PrsMasterSetempatCreationAttributes
  >
  implements PrsMasterSetempatAttributes
{
  public id!: number;
  public kota_setempat!: string;
  public created_at!: Date;
  public updated_at!: Date;
  public deleted_at!: Date | null;
}

PrsMasterSetempat.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    kota_setempat: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'prs_master_setempat',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  }
);

export default PrsMasterSetempat;

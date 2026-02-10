import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface KotAttributes {
  id: string;
  nama: string;
  prov_id: string;
  created_at?: Date;
  updated_at?: Date;
}
export interface CreateKotDTO {
  nama: string;
  prov_id: string; // UUID
}

export interface UpdateKotDTO {
  nama?: string;
  prov_id?: string;
}
export type KotCreationAttributes = Optional<
  KotAttributes,
  'id' | 'created_at' | 'updated_at'
>;

class PrsMasterKot
  extends Model<KotAttributes, KotCreationAttributes>
  implements KotAttributes
{
  public id!: string;
  public nama!: string;
  public prov_id!: string;
  public created_at!: Date;
  public updated_at!: Date;
}

PrsMasterKot.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prov_id: {
      type: DataTypes.UUID,
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
  },
  {
    sequelize,
    tableName: 'prs_master_kot',
    timestamps: true,
    paranoid: false,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default PrsMasterKot;

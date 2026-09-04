import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface ProvAttributes {
  id: string;
  nama: string;
  created_at?: Date;
  updated_at?: Date;
}

class PrsMasterProv
  extends Model<ProvAttributes, Optional<ProvAttributes, 'id'>>
  implements ProvAttributes
{
  public id!: string;
  public nama!: string;
  public created_at?: Date;
  public updated_at?: Date;
}

PrsMasterProv.init(
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
    tableName: 'prs_master_prov',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default PrsMasterProv;

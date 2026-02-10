import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface PrsTipeDokumenAttributes {
  id: string;
  tipe_dokumen: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

type PrsTipeDokumenCreation = Optional<PrsTipeDokumenAttributes, 'id'>;

export default class PrsTipeDokumen
  extends Model<PrsTipeDokumenAttributes, PrsTipeDokumenCreation>
  implements PrsTipeDokumenAttributes
{
  public id!: string;
  public tipe_dokumen!: string;
  public created_at?: Date;
  public updated_at?: Date;
  public deleted_at?: Date | null;
}

PrsTipeDokumen.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    tipe_dokumen: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'prs_tipe_dokumen',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,
    deletedAt: 'deleted_at',
  }
);

import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface PrsDokumenAttributes {
  readonly id: string;
  readonly karyawan_id: string;
  readonly dokumen_path: string | null;
  readonly tipe_dokumen_id: string;
  readonly created_at?: Date;
  readonly updated_at?: Date;
  readonly deleted_at?: Date | null;
}

type PrsDokumenCreationAttributes = Optional<
  PrsDokumenAttributes,
  'id' | 'created_at' | 'updated_at' | 'deleted_at'
>;

class PrsDokumen
  extends Model<PrsDokumenAttributes, PrsDokumenCreationAttributes>
  implements PrsDokumenAttributes
{
  public id!: string;
  public karyawan_id!: string;
  public dokumen_path!: string | null;
  public tipe_dokumen_id!: string;
  public created_at!: Date;
  public updated_at!: Date;
  public deleted_at!: Date | null;
}

PrsDokumen.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    karyawan_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    dokumen_path: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    tipe_dokumen_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'prs_dokumen',
    timestamps: true,
    paranoid: true, // aktifkan soft delete → pakai deleted_at
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  }
);

export default PrsDokumen;

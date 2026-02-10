import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface PrsJabatanAttributes {
  jab_id: string;
  kode_jab: string;
  jabatan: string;

  created_at?: Date;
  updated_at?: Date;
}

export type PrsJabatanCreationAttributes = Optional<
  PrsJabatanAttributes,
  'jab_id'
>;

export class PrsJabatan
  extends Model<PrsJabatanAttributes, PrsJabatanCreationAttributes>
  implements PrsJabatanAttributes
{
  public jab_id!: string;
  public kode_jab!: string;
  public jabatan!: string;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

PrsJabatan.init(
  {
    jab_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    kode_jab: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    jabatan: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: 'PrsJabatan',
    tableName: 'prs_jabatan',
    timestamps: true,

    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);
export default PrsJabatan;

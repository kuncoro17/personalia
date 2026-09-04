import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface PrsUnitKerjaAttributes {
  uk_id: string;
  kode_seksi: string;
  kode_bagian: string;
  kode_divisi: string;
  kode_direktur?: string | null;
  kode_deputi?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

type PrsUnitKerjaCreationAttributes = Optional<PrsUnitKerjaAttributes, 'uk_id'>;

class PrsUnitKerja
  extends Model<PrsUnitKerjaAttributes, PrsUnitKerjaCreationAttributes>
  implements PrsUnitKerjaAttributes
{
  public uk_id!: string;
  public kode_seksi!: string;
  public kode_bagian!: string;
  public kode_divisi!: string;
  public kode_direktur!: string | null;
  public kode_deputi!: string | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

PrsUnitKerja.init(
  {
    uk_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    kode_seksi: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    kode_bagian: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    kode_divisi: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    kode_direktur: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    kode_deputi: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'PrsUnitKerja',
    tableName: 'prs_unit_kerja',
    timestamps: false, // karena kamu pakai created_at & updated_at manual
  }
);

export default PrsUnitKerja;

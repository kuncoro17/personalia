import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface PrsSeksiAttributes {
  sek_id: string;
  kode: string | null;
  nama_sek: string;
  alamat: string;
  created_at?: Date;
  updated_at?: Date;
}

// Omit sek_id saat create karena default UUID
export type PrsSeksiCreationAttributes = Optional<
  PrsSeksiAttributes,
  'sek_id' | 'created_at' | 'updated_at'
>;

class PrsSeksi
  extends Model<PrsSeksiAttributes, PrsSeksiCreationAttributes>
  implements PrsSeksiAttributes
{
  public sek_id!: string;
  public kode!: string | null;
  public nama_sek!: string;
  public alamat!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

PrsSeksi.init(
  {
    sek_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    kode: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    nama_sek: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    alamat: {
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
  },
  {
    sequelize,
    tableName: 'prs_seksi',
    timestamps: false, // karena pakai manual created_at/updated_at
    // supaya deleted_at dipakai untuk soft delete
  }
);

export default PrsSeksi;

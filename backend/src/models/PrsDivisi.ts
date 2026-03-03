import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface PrsDivisiAttributes {
  div_id: string;
  kode: string;
  nama_div: string;
  alamat: string;
  created_at?: Date;
  updated_at?: Date;
}

// Gunakan type, bukan interface kosong
export type PrsDivisiCreationAttributes = Optional<
  PrsDivisiAttributes,
  'div_id' | 'created_at' | 'updated_at'
>;

class PrsDivisi
  extends Model<PrsDivisiAttributes, PrsDivisiCreationAttributes>
  implements PrsDivisiAttributes
{
  declare div_id: string;
  declare kode: string;
  declare nama_div: string;
  declare alamat: string;
  declare created_at?: Date;
  declare updated_at?: Date;
}

PrsDivisi.init(
  {
    div_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    kode: {
      type: DataTypes.STRING(5),
      allowNull: false,
    },
    nama_div: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    alamat: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'prs_divisi',
    timestamps: false,
  }
);

export default PrsDivisi;

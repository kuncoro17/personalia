import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface PrsMasterDeputiAttributes {
  dep_id: string;
  kode: string;
  nama_dep: string;
  alamat: string;
  created_at?: Date;
  updated_at?: Date;
}

export type PrsMasterDeputiCreationAttributes = Optional<
  PrsMasterDeputiAttributes,
  'dep_id'
>;

export class PrsMasterDeputi
  extends Model<PrsMasterDeputiAttributes, PrsMasterDeputiCreationAttributes>
  implements PrsMasterDeputiAttributes
{
  public dep_id!: string;
  public kode!: string;
  public nama_dep!: string;
  public alamat!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

PrsMasterDeputi.init(
  {
    dep_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    kode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    nama_dep: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    alamat: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'prs_deputi',
    createdAt: 'created_at', // map ke field DB
    updatedAt: 'updated_at',
    timestamps: true,
  }
);

export default PrsMasterDeputi;

import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface PrsMasterDirekturAttributes {
  dir_id: string;
  kode: string;
  nama_dir: string;
  created_at?: Date;
  updated_at?: Date;
}

export type PrsMasterDirekturCreationAttributes = Optional<
  PrsMasterDirekturAttributes,
  'dir_id'
>;

export class PrsMasterDirektur
  extends Model<
    PrsMasterDirekturAttributes,
    PrsMasterDirekturCreationAttributes
  >
  implements PrsMasterDirekturAttributes
{
  public dir_id!: string;
  public kode!: string;
  public nama_dir!: string;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

PrsMasterDirektur.init(
  {
    dir_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    kode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    nama_dir: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // 🔥 WAJIB TAMBAH INI (BIAR MATCH DENGAN DATABASE)
    created_at: {
      type: DataTypes.DATE,
      field: 'created_at', // mapping DB → model
    },
    updated_at: {
      type: DataTypes.DATE,
      field: 'updated_at',
    },
  },
  {
    sequelize,
    tableName: 'prs_direktur',
    timestamps: true,

    // 🔥 WAJIB TAMBAH INI JUGA (override default timestamps)
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default PrsMasterDirektur;

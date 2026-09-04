// models/History.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

// 1️⃣ Definisikan attributes
export interface HistoryAttributes {
  id_karyawan: string;
  tipe_perubahan: string;
  value_lama?: string | null;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

// 2️⃣ Definisikan tipe untuk create
export type HistoryCreationAttributes = Optional<
  HistoryAttributes,
  'value_lama' | 'created_at' | 'updated_at' | 'deleted_at'
>;

// 3️⃣ Extend Model
class History
  extends Model<HistoryAttributes, HistoryCreationAttributes>
  implements HistoryAttributes
{
  public id_karyawan!: string;
  public tipe_perubahan!: string;
  public value_lama?: string | null;
  public created_at?: Date;
  public updated_at?: Date;
  public deleted_at?: Date | null;
}

History.init(
  {
    id_karyawan: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    tipe_perubahan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value_lama: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'History',
    tableName: 'history',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  }
);

export default History;

// models/PrsStatusKaryawan.ts
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import {
  PrsStatusKaryawanAttributes,
  PrsStatusKaryawanCreateInput,
} from '../types/prsStatusKaryawan.types';

class PrsStatusKaryawan
  extends Model<PrsStatusKaryawanAttributes, PrsStatusKaryawanCreateInput>
  implements PrsStatusKaryawanAttributes
{
  declare stat_id: string;
  declare kode: string;
  declare stat_karyawan: string;
  declare stat_karyawan_gp?: string | null;
  declare created_at?: Date;
  declare updated_at?: Date;
}

PrsStatusKaryawan.init(
  {
    stat_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    kode: {
      type: DataTypes.CHAR(5),
      allowNull: false,
    },
    stat_karyawan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stat_karyawan_gp: {
      type: DataTypes.CHAR(5),
      allowNull: true,
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'prs_status_karyawan',
    timestamps: false,
  }
);

export default PrsStatusKaryawan;

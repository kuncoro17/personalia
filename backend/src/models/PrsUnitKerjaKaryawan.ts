import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export interface PrsUnitKerjaKaryawanDTO {
  ukk_id: string;
  karyawan_id: string; // ✅ tetap string
  unit_kerja: string;
  jab_id: string;
  lokasi_penggajian: string;
  created_at?: Date | null;
  updated_at?: Date | null;
  deleted_at?: Date | null;
}

class PrsUnitKerjaKaryawan
  extends Model<PrsUnitKerjaKaryawanDTO>
  implements PrsUnitKerjaKaryawanDTO
{
  ukk_id!: string;
  karyawan_id!: string; // ✅ ini tetap string
  unit_kerja!: string;
  jab_id!: string;
  lokasi_penggajian!: string;
  created_at?: Date | null;
  updated_at?: Date | null;
  deleted_at?: Date | null;
}

PrsUnitKerjaKaryawan.init(
  {
    ukk_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    karyawan_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    unit_kerja: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    jab_id: { type: DataTypes.STRING, allowNull: false },
    lokasi_penggajian: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE,
  },
  {
    tableName: 'prs_unit_kerja_karyawan',
    timestamps: false,
    underscored: true,
    sequelize,
  }
);

export default PrsUnitKerjaKaryawan;

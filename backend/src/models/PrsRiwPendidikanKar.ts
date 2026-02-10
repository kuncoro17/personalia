import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface RiwPendidikanKarAttributes {
  rpk_id: string;
  karyawan_id: string;
  riw_pendidikan_id: string;
  jurusan?: string | null;
  tingkat: string;
  tahun_kelulusan?: number | null;
  ipk?: number | null;
  created_at?: Date;
  updated_at?: Date;
}

export type RiwPendidikanKarCreationAttributes = Optional<
  RiwPendidikanKarAttributes,
  'rpk_id' | 'created_at' | 'updated_at'
>;

class PrsRiwPendidikanKar
  extends Model<RiwPendidikanKarAttributes, RiwPendidikanKarCreationAttributes>
  implements RiwPendidikanKarAttributes
{
  declare rpk_id: string;
  declare karyawan_id: string;
  declare riw_pendidikan_id: string;
  declare jurusan?: string | null;
  public tingkat!: string;
  declare tahun_kelulusan?: number | null;
  declare ipk?: number | null;
  declare created_at?: Date;
  declare updated_at?: Date;
}

PrsRiwPendidikanKar.init(
  {
    rpk_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    karyawan_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    riw_pendidikan_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    jurusan: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    tahun_kelulusan: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ipk: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    tingkat: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'prs_riw_pendidikan_kar',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: false,
  }
);

export default PrsRiwPendidikanKar;

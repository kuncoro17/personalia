import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface PengalamanAttributes {
  id: string;
  karyawan_id: string;
  nama_perusahaan: string;
  jabatan: string;
  mulai_bekerja: Date | null;
  berhenti_bekerja: Date | null;
  alasan_berhenti: string;
  created_at?: Date;
  updated_at?: Date;
}

export type PengalamanCreationAttributes = Optional<
  PengalamanAttributes,
  'id' | 'created_at' | 'updated_at'
>;

class PrsPengalaman
  extends Model<PengalamanAttributes, PengalamanCreationAttributes>
  implements PengalamanAttributes
{
  declare id: string;
  declare karyawan_id: string;
  declare nama_perusahaan: string;
  declare jabatan: string;
  declare mulai_bekerja: Date | null;
  declare berhenti_bekerja: Date | null;
  declare alasan_berhenti: string;
  declare created_at?: Date;
  declare updated_at?: Date;
}

PrsPengalaman.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    karyawan_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    nama_perusahaan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jabatan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mulai_bekerja: DataTypes.DATE,
    berhenti_bekerja: DataTypes.DATE,
    alasan_berhenti: DataTypes.STRING,
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'prs_pengalaman_kerja',
    timestamps: false,
  }
);

export default PrsPengalaman;

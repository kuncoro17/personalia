import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
export interface PrsKeluargaKaryawanAttributes {
  id: string;
  karyawan_id: string;
  nama_lengkap: string;
  nomor_identitas: string;
  tempat_lahir: string;
  tanggal_lahir: Date;
  no_telp: string;
  agama: number;
  gender: string;
  kewarganegaraan: string;
  pekerjaan: string;
  pendidikan: string;
  flag_status: number;
  hubungan: string;
  tanggungan_medical: number;
  kebijakan_khusus_medical: number;
  flag_berpisah: number;
  keterangan: string;
  created_at?: Date;
  updated_at?: Date;
}

class PrsKeluargaKaryawan
  extends Model<PrsKeluargaKaryawanAttributes, PrsKeluargaKaryawanAttributes>
  implements PrsKeluargaKaryawanAttributes
{
  // 🔹 FIELD KOLOM TABEL
  declare id: string;
  declare karyawan_id: string;
  declare nama_lengkap: string;
  declare nomor_identitas: string;
  declare tempat_lahir: string;
  declare tanggal_lahir: Date;
  declare no_telp: string;
  declare agama: number;
  declare gender: string;
  declare kewarganegaraan: string;
  declare pekerjaan: string;
  declare pendidikan: string;
  declare flag_status: number;
  declare hubungan: string;
  declare tanggungan_medical: number;
  declare kebijakan_khusus_medical: number;
  declare flag_berpisah: number;
  declare keterangan: string;
  declare created_at?: Date;
  declare updated_at?: Date;

  // 🔥 FIELD RELASI (UNTUK TYPING SAJA)
  declare agama_detail?: {
    agama: string;
  };

  declare tempat_tinggal_keluarga_karyawan?: {
    nama_kota: string;
    kode_kota: string;
  };
}

PrsKeluargaKaryawan.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    karyawan_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nama_lengkap: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nomor_identitas: {
      type: DataTypes.STRING,
    },
    tempat_lahir: {
      type: DataTypes.STRING,
    },
    tanggal_lahir: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    no_telp: {
      type: DataTypes.STRING,
    },
    agama: {
      type: DataTypes.INTEGER,
    },
    gender: {
      type: DataTypes.STRING,
    },
    kewarganegaraan: {
      type: DataTypes.STRING,
    },
    pekerjaan: {
      type: DataTypes.STRING,
    },
    pendidikan: {
      type: DataTypes.STRING,
    },
    flag_status: {
      type: DataTypes.INTEGER,
    },
    hubungan: {
      type: DataTypes.STRING,
    },
    tanggungan_medical: {
      type: DataTypes.INTEGER,
    },
    kebijakan_khusus_medical: {
      type: DataTypes.INTEGER,
    },
    flag_berpisah: {
      type: DataTypes.INTEGER,
    },
    keterangan: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: 'prs_keluarga_karyawan',
    timestamps: true,
    underscored: true,
  }
);

export default PrsKeluargaKaryawan;

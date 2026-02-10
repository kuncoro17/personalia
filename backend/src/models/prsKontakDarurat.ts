import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface PrsKontakDaruratAttributes {
  id: string;
  karyawan_id: string;
  nama_kondar: string;
  telp_darurat?: string | null;
  email?: string | null;
  kategori_kontak?: string | null;
  no_hp?: string | null;
  hubungan_kondar?: string | null;
  alamat_kondar?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

type PrsKontakDaruratCreation = Optional<
  PrsKontakDaruratAttributes,
  'id' | 'created_at' | 'updated_at'
>;

class PrsKontakDarurat
  extends Model<PrsKontakDaruratAttributes, PrsKontakDaruratCreation>
  implements PrsKontakDaruratAttributes
{
  public id!: string;
  public karyawan_id!: string;
  public nama_kondar!: string;
  public telp_darurat!: string | null;
  public email!: string | null;
  public kategori_kontak!: string | null;
  public no_hp!: string | null;
  public hubungan_kondar!: string | null;
  public alamat_kondar!: string | null;
  public created_at!: Date;
  public updated_at!: Date;
}

PrsKontakDarurat.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    karyawan_id: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    nama_kondar: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    telp_darurat: {
      type: DataTypes.STRING(16),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: { isEmail: true },
    },
    kategori_kontak: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    no_hp: {
      type: DataTypes.STRING(16),
      allowNull: true,
    },
    hubungan_kondar: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    alamat_kondar: {
      type: DataTypes.STRING(255),
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
  },
  {
    sequelize,
    tableName: 'prs_kontak_darurat',
    timestamps: false,
    paranoid: true,
    deletedAt: 'deleted_at',
  }
);

export default PrsKontakDarurat;

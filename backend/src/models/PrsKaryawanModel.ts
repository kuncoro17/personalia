// models/PrsKaryawan.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import PrsKeluargaKaryawan from './PrsKeluargaKaryawan';

export interface KaryawanAttributes {
  id_karyawan: string;
  nik?: string;
  no_ktp?: string;
  status_aktif?: string;
  foto?: string;
  nama_lengkap?: string;
  nama_panggilan?: string;
  telp_pribadi?: string;
  telp_kantor?: string;
  email_pribadi?: string;
  email_penabur?: string;
  tgl_join_penabur?: Date;
  tgl_join_penabur_jkt?: Date;
  agama?: number;
  status_nikah?: string;
  tanggal_pernikahan?: Date;
  tipe_sekolah?: string;
  kode_status_karyawan?: string;
  tgl_status_permanen?: Date;
  tgl_penuh_waktu?: Date;
  tanggal_inactive?: Date;
  alasan_berhenti_kerja?: string;
  atasan_langsung?: string;
  atasan_tidak_langsung?: string;
  alamat_ktp?: string;
  alamat_tempat_tinggal?: string;
  tempat_lahir?: string;
  birth_date?: Date;
  gender?: string;
  gol_darah?: string;
  tinggi_badan?: number;
  berat_badan?: number;
  kewarganegaraan?: string;
  anggota_gereja?: string;
  instagram?: string;
  twitter?: string;
  no_kitas?: string;
  no_visa?: string;
  no_tabita?: string;
  npwp?: string;
  rekening?: string;
  kode_golongan?: string;
  no_bpjs_kesehatan?: string;
  no_bpjs_ketenagakerjaan?: string;
  no_bpjs_danpes?: string;
  nama_bpjs_danpes?: string;
  etnis?: string;
  no_pasport?: string;
  id_master_setempat?: number | null;
  created_at?: Date;
  updated_at?: Date;
}

export type KaryawanCreationAttributes = Optional<
  KaryawanAttributes,
  'id_karyawan' | 'created_at' | 'updated_at'
>;

class PrsKaryawan extends Model<
  KaryawanAttributes,
  KaryawanCreationAttributes
> {
  // 🔹 ATTRIBUTES (TYPE ONLY)
  declare id_karyawan: string;
  declare nik?: string;
  declare no_ktp?: string;
  declare status_aktif?: string;
  declare foto?: string;
  declare nama_lengkap?: string;
  declare nama_panggilan?: string;
  declare telp_pribadi?: string;
  declare telp_kantor?: string;
  declare email_pribadi?: string;
  declare email_penabur?: string;
  declare tgl_join_penabur?: Date;
  declare tgl_join_penabur_jkt?: Date;
  declare agama?: number;
  declare status_nikah?: string;
  declare tanggal_pernikahan?: Date;
  declare tipe_sekolah?: string;
  declare kode_status_karyawan?: string;
  declare tgl_status_permanen?: Date;
  declare tgl_penuh_waktu?: Date;
  declare tanggal_inactive?: Date;
  declare alasan_berhenti_kerja?: string;
  declare atasan_langsung?: string;
  declare atasan_tidak_langsung?: string;
  declare alamat_ktp?: string;
  declare alamat_tempat_tinggal?: string;
  declare tempat_lahir?: string;
  declare birth_date?: Date;
  declare gender?: string;
  declare gol_darah?: string;
  declare tinggi_badan?: number;
  declare berat_badan?: number;
  declare kewarganegaraan?: string;
  declare anggota_gereja?: string;
  declare instagram?: string;
  declare twitter?: string;
  declare no_kitas?: string;
  declare no_visa?: string;
  declare no_tabita?: string;
  declare npwp?: string;
  declare rekening?: string;
  declare kode_golongan?: string;
  declare no_bpjs_kesehatan?: string;
  declare no_bpjs_ketenagakerjaan?: string;
  declare no_bpjs_danpes?: string;
  declare nama_bpjs_danpes?: string;
  declare etnis?: string;
  declare no_pasport?: string;
  declare id_master_setempat?: number | null;
  declare created_at?: Date;
  declare updated_at?: Date;

  // 🔹 ASSOCIATION
  declare keluarga_karyawan?: PrsKeluargaKaryawan[];
}

PrsKaryawan.init(
  {
    id_karyawan: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nik: DataTypes.STRING(30),
    no_ktp: DataTypes.STRING(40),
    status_aktif: DataTypes.STRING,
    foto: DataTypes.STRING(255),
    nama_lengkap: DataTypes.STRING(255),
    nama_panggilan: DataTypes.STRING(100),
    telp_pribadi: DataTypes.STRING(15),
    telp_kantor: DataTypes.STRING(15),
    email_pribadi: {
      type: DataTypes.STRING(100),
      validate: { isEmail: true },
    },
    email_penabur: {
      type: DataTypes.STRING(100),
      validate: { isEmail: true },
    },
    tgl_join_penabur: DataTypes.DATEONLY,
    tgl_join_penabur_jkt: DataTypes.DATEONLY,
    agama: DataTypes.INTEGER,
    status_nikah: DataTypes.STRING(50),
    tanggal_pernikahan: DataTypes.DATEONLY,
    tipe_sekolah: DataTypes.STRING(20),
    kode_status_karyawan: DataTypes.CHAR(5),
    tgl_status_permanen: DataTypes.DATEONLY,
    tgl_penuh_waktu: DataTypes.DATEONLY,
    tanggal_inactive: DataTypes.DATEONLY,
    alasan_berhenti_kerja: DataTypes.STRING(100),
    atasan_langsung: DataTypes.STRING(255),
    atasan_tidak_langsung: DataTypes.STRING(255),
    alamat_ktp: DataTypes.UUID,
    alamat_tempat_tinggal: DataTypes.UUID,
    tempat_lahir: DataTypes.UUID,
    birth_date: DataTypes.DATEONLY,
    gender: DataTypes.STRING,
    gol_darah: DataTypes.STRING(3),
    tinggi_badan: DataTypes.INTEGER,
    berat_badan: DataTypes.FLOAT,
    kewarganegaraan: DataTypes.STRING,
    anggota_gereja: DataTypes.STRING(255),
    instagram: DataTypes.STRING(100),
    twitter: DataTypes.STRING(100),
    no_kitas: DataTypes.STRING(20),
    no_visa: DataTypes.STRING(20),
    no_tabita: DataTypes.STRING(20),
    npwp: DataTypes.STRING(20),
    rekening: DataTypes.STRING(20),
    kode_golongan: DataTypes.STRING(20),
    no_bpjs_kesehatan: DataTypes.STRING(20),
    no_bpjs_ketenagakerjaan: DataTypes.STRING(20),
    no_bpjs_danpes: DataTypes.STRING(20),
    nama_bpjs_danpes: DataTypes.STRING(255),
    etnis: DataTypes.STRING(150),
    no_pasport: DataTypes.STRING(150),
    id_master_setempat: {
      type: DataTypes.INTEGER,
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
    tableName: 'prs_karyawan',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default PrsKaryawan;

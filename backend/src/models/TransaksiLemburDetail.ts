import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface TransaksiLemburDetailAttributes {
  idd: number;
  idv: number;
  bln_proses?: number | null;
  thn_proses?: number | null;
  nik: string;
  lokasi3: string;
  kode_sek: string;
  penempatan: string;
  hari: string;
  libur: string;
  tgl: string;
  input: string;
  istirahat: string;
  tot: string;
  lbr_start: string;
  lbr_stop: string;
  umkn: string;
  approv: string;
  closing: string;
  keterangan: string;
  tgl_created?: Date;
  usr_created?: string;
  tgl_update?: string;
  usr_update?: string;
  tgl_closing?: string;
  usr_closing?: string;
  tgl_approv?: string;
  usr_approv?: string;
  tgl_open?: string;
  usr_open?: string;
  paid?: number;
  tgl_unapprov?: string;
  usr_unapprov?: string;
  flag_key?: number;
  lokasi?: string | null;
}

// ✅ pakai type, bukan interface
export type TransaksiLemburDetailCreation = Optional<
  TransaksiLemburDetailAttributes,
  'idd'
>;

export class TransaksiLemburDetail
  extends Model<TransaksiLemburDetailAttributes, TransaksiLemburDetailCreation>
  implements TransaksiLemburDetailAttributes
{
  public idd!: number;
  public idv!: number;
  public bln_proses!: number;
  public thn_proses!: number;
  public nik!: string;
  public lokasi3!: string;
  public kode_sek!: string;
  public penempatan!: string;
  public hari!: string;
  public libur!: string;
  public tgl!: string;
  public input!: string;
  public istirahat!: string;
  public tot!: string;
  public lbr_start!: string;
  public lbr_stop!: string;
  public umkn!: string;
  public approv!: string;
  public closing!: string;
  public keterangan!: string;
  public tgl_created!: Date;
  public usr_created!: string;
  public tgl_update!: string;
  public usr_update!: string;
  public tgl_closing!: string;
  public usr_closing!: string;
  public tgl_approv!: string;
  public usr_approv!: string;
  public tgl_open!: string;
  public usr_open!: string;
  public paid!: number;
  public tgl_unapprov!: string;
  public usr_unapprov!: string;
  public flag_key!: number;
  public lokasi!: string | null;
}

TransaksiLemburDetail.init(
  {
    idd: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    idv: { type: DataTypes.INTEGER, allowNull: false },
    bln_proses: DataTypes.INTEGER,
    thn_proses: DataTypes.INTEGER,
    nik: { type: DataTypes.STRING(20), allowNull: false },
    lokasi3: { type: DataTypes.STRING(70), allowNull: false },
    kode_sek: { type: DataTypes.STRING(10), allowNull: false },
    penempatan: { type: DataTypes.STRING(70), allowNull: false },
    hari: { type: DataTypes.STRING(11), allowNull: false },
    libur: { type: DataTypes.STRING(1), allowNull: false },
    tgl: { type: DataTypes.STRING(11), allowNull: false },
    input: { type: DataTypes.STRING(11), allowNull: false },
    istirahat: { type: DataTypes.STRING(5), allowNull: false },
    tot: { type: DataTypes.STRING(8), allowNull: false },
    lbr_start: { type: DataTypes.STRING(8), allowNull: false },
    lbr_stop: { type: DataTypes.STRING(8), allowNull: false },
    umkn: { type: DataTypes.STRING(5), allowNull: false },
    approv: { type: DataTypes.STRING(2), allowNull: false, defaultValue: '0' },
    closing: { type: DataTypes.STRING(2), allowNull: false, defaultValue: '0' },
    keterangan: { type: DataTypes.STRING(255), allowNull: false },
    tgl_created: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    usr_created: { type: DataTypes.STRING(255), defaultValue: '' },
    tgl_update: DataTypes.STRING(15),
    usr_update: { type: DataTypes.STRING(255), defaultValue: '' },
    tgl_closing: DataTypes.STRING(15),
    usr_closing: { type: DataTypes.STRING(255), defaultValue: '' },
    tgl_approv: { type: DataTypes.STRING(20), defaultValue: '' },
    usr_approv: { type: DataTypes.STRING(255), defaultValue: '' },
    tgl_open: DataTypes.STRING(15),
    usr_open: { type: DataTypes.STRING(255), defaultValue: '' },
    paid: { type: DataTypes.INTEGER, defaultValue: 0 },
    tgl_unapprov: { type: DataTypes.STRING(11), defaultValue: '' },
    usr_unapprov: { type: DataTypes.STRING(255), defaultValue: '' },
    flag_key: { type: DataTypes.INTEGER, defaultValue: 0 },
    lokasi: { type: DataTypes.STRING(7), allowNull: true },
  },
  {
    sequelize,
    tableName: 'transaksi_lembur_detail',
    timestamps: false,
  }
);

import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface KeuCgSlipAttributes {
  id: number;
  date_time?: Date | null;
  modified?: Date | null;
  ip?: string | null;
  creator?: number | null;
  modifier?: number | null;
  jenis?: string | null;
  no_giro?: string | null;
  bank_giro?: string | null;
  tgl_giro?: Date | string | null;
  nama_peminta?: string | null;
  nom_giro?: string | null;
  jumlah?: string | null;
  terbilang?: string | null;
  no_rek?: string | null;
  an?: string | null;
  pd_bank?: string | null;
  tanggal_today?: Date | null;
  group_bank?: string | null;
  kode_bank?: string | null;
}

export type KeuCgSlipCreationAttributes = Optional<KeuCgSlipAttributes, 'id'>;

export class KeuCgSlip
  extends Model<KeuCgSlipAttributes, KeuCgSlipCreationAttributes>
  implements KeuCgSlipAttributes
{
  public id!: number;
  public date_time!: Date | null;
  public modified!: Date | null;
  public ip!: string | null;
  public creator!: number | null;
  public modifier!: number | null;
  public jenis!: string | null;
  public no_giro!: string | null;
  public bank_giro!: string | null;
  public tgl_giro!: Date | string | null;
  public nama_peminta!: string | null;
  public nom_giro!: string | null;
  public jumlah!: string | null;
  public terbilang!: string | null;
  public no_rek!: string | null;
  public an!: string | null;
  public pd_bank!: string | null;
  public tanggal_today!: Date | null;
  public group_bank!: string | null;
  public kode_bank!: string | null;
}

KeuCgSlip.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    date_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    modified: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ip: {
      type: DataTypes.STRING(25),
      allowNull: true,
    },
    creator: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    modifier: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    jenis: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    no_giro: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    bank_giro: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    tgl_giro: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    nama_peminta: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    nom_giro: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    jumlah: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    terbilang: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    no_rek: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    an: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    pd_bank: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    tanggal_today: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    group_bank: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    kode_bank: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'keu_cg_slip',
    timestamps: false,
  }
);

export default KeuCgSlip;

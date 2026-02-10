import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

class AbsensiPivot extends Model {
  public nik!: string;
  public nama_lengkap!: string | null;
  public unit_kerja!: string | null;
  public nama_div!: string | null;
  public nama_bag!: string | null;

  public total_hadir_HDR?: number;
  public total_yangmenggunakanjam?: number;
  public total_LUPA_LUPA?: number;
  public total_sakit_SKT?: number;
  public total_izin_IZN?: number;
  public total_event_EVN?: number;
  public total_cuti_tahunan_CTH?: number;
  public total_cuti_hamil_CKH?: number;
  public total_potong_gaji_IJF?: number;
  public total_izin_setengah_hari_IJS?: number;
  public total_izin_KCL?: number;
  public total_izin_covid_SKTCVD?: number;
  public total_izin_TK?: number;
  public total_izin_TRN?: number;
  public total_izin_DNL?: number;
  public total_semua?: number;
}

AbsensiPivot.init(
  {
    nik: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    nama_lengkap: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    unit_kerja: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nama_div: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nama_bag: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    total_hadir_HDR: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    total_yangmenggunakanjam: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    total_LUPA_LUPA: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    total_sakit_SKT: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    total_izin_IZN: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    total_event_EVN: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    total_cuti_tahunan_CTH: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    total_cuti_hamil_CKH: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    total_potong_gaji_IJF: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    total_izin_setengah_hari_IJS: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    total_izin_KCL: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    total_izin_covid_SKTCVD: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    total_izin_TK: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    total_izin_TRN: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    total_izin_DNL: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    total_semua: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'get_absensi_pivot_bagian', // virtual, hasil dari stored procedure
    timestamps: false,
  }
);

export default AbsensiPivot;

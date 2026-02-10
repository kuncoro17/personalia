import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

const PrsMasterAlamat = sequelize.define(
  'PrsMasterAlamat',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    alamat: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    kel_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    rt: DataTypes.INTEGER,
    rw: DataTypes.INTEGER,
    kode_pos: DataTypes.STRING(5),
    status_tempat_tinggal: DataTypes.STRING(50),
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  },
  {
    tableName: 'prs_master_alamat',
    timestamps: false,
  }
);

export default PrsMasterAlamat;

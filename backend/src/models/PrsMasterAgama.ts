import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

const PrsMasterAgama = sequelize.define(
  'prs_master_agama',
  {
    kode_agama: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    agama: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: 'prs_master_agama',
    timestamps: false,
  }
);

export default PrsMasterAgama;

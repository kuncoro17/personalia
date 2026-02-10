import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

class AppLog extends Model {
  declare id: number;
  declare level: string;
  declare message: string;
  declare error: string | null;
  declare response_time_ms: number | null;
  declare created_at: Date;
}

AppLog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    level: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    error: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    response_time_ms: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'app_logs',
    sequelize,
    timestamps: false,
  }
);

export default AppLog;

import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

class AppLog extends Model {
  declare id: number;
  declare level: string;
  declare message: string;
  declare error: string | null;
  declare response_time_ms: number | null;
  declare action: string | null;
  declare http_method: string | null;
  declare path: string | null;
  declare status_code: number | null;
  declare actor_id: string | null;
  declare actor_email: string | null;
  declare actor_name: string | null;
  declare auth_source: string | null;
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
    action: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    http_method: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    path: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status_code: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    actor_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    actor_email: {
      type: DataTypes.STRING(320),
      allowNull: true,
    },
    actor_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    auth_source: {
      type: DataTypes.STRING(50),
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

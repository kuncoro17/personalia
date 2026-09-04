import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface PrsKontrakAttributes {
  id: string;
  ukk_id: string;
  file_kontrak: string;
  tanggal_mulai: string;
  tanggal_berakhir: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

// Gunakan type langsung tanpa interface kosong
export type PrsKontrakCreationAttributes = Optional<
  PrsKontrakAttributes,
  'id' | 'created_at' | 'updated_at' | 'deleted_at'
>;

const PrsKontrak = sequelize.define<
  Model<PrsKontrakAttributes, PrsKontrakCreationAttributes>
>(
  'PrsKontrak',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    ukk_id: { type: DataTypes.UUID, allowNull: false },
    file_kontrak: { type: DataTypes.STRING, allowNull: false },
    tanggal_mulai: { type: DataTypes.DATEONLY, allowNull: false },
    tanggal_berakhir: { type: DataTypes.DATEONLY, allowNull: false },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    deleted_at: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: 'prs_kontrak',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  }
);

export default PrsKontrak;

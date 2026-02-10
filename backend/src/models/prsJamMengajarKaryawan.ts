// models/prsJamMengajarKaryawan.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
// Jika file bernama PrsMasterMapel.ts
import PrsMasterMapel from './PrsMasterMapel'; // konsisten

import PrsUnitKerjaKaryawan from '../models/PrsUnitKerjaKaryawan';

export interface JamMengajarAttributes {
  jmk_id: string;
  ukk_id: string;
  jam_mengajar: number;
  mengajar_mapel: string;
  created_at?: Date;
  updated_at?: Date;
  // deleted_at?: Date | null;
}

export type JamMengajarCreationAttributes = Optional<
  JamMengajarAttributes,
  'jmk_id' | 'created_at' | 'updated_at'
>;

class PrsJamMengajarKaryawan
  extends Model<JamMengajarAttributes, JamMengajarCreationAttributes>
  implements JamMengajarAttributes
{
  declare jmk_id: string;
  declare ukk_id: string;
  declare jam_mengajar: number;
  declare mengajar_mapel: string;
  declare created_at?: Date;
  declare updated_at?: Date;
  // declare deleted_at?: Date | null;

  // 🔹 deklarasi properti relasi untuk TypeScript
  declare mapel?: PrsMasterMapel | null;
  declare unit_kerja_karyawan?: PrsUnitKerjaKaryawan | null;

  // 🔹 association helper
  static associate() {
    PrsJamMengajarKaryawan.belongsTo(PrsMasterMapel, {
      as: 'mapel',
      foreignKey: 'mengajar_mapel',
      targetKey: 'mapel_id',
    });

    PrsJamMengajarKaryawan.hasOne(PrsUnitKerjaKaryawan, {
      as: 'unit_kerja_karyawan',
      foreignKey: 'ukk_id',
      sourceKey: 'ukk_id',
    });
  }
}

PrsJamMengajarKaryawan.init(
  {
    jmk_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    ukk_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    jam_mengajar: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    mengajar_mapel: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    // deleted_at: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'prs_jam_mengajar_karyawan',
    timestamps: false,
    paranoid: true,
  }
);

export default PrsJamMengajarKaryawan;

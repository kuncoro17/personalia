import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface RiwPendAttributes {
  id: string;
  univ: string;

  created_at?: Date;
  updated_at?: Date;
}

export type RiwPendCreationAttributes = Optional<
  RiwPendAttributes,
  'id' | 'created_at' | 'updated_at'
>;

class PrsMasterRiwPendidikan
  extends Model<RiwPendAttributes, RiwPendCreationAttributes>
  implements RiwPendAttributes
{
  public id!: string;
  public univ!: string;

  public created_at?: Date;
  public updated_at?: Date;
}

PrsMasterRiwPendidikan.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    univ: {
      type: DataTypes.STRING(255),
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
    sequelize,
    tableName: 'prs_master_riw_pendidikan',
    timestamps: false,
    paranoid: false,
  }
);

export default PrsMasterRiwPendidikan;

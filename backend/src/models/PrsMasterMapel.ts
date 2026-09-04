import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface MapelAttributes {
  mapel_id: string;
  nama_mapel: string;
  created_at?: Date | null;
  updated_at?: Date | null;
}

export type MapelCreationAttributes = Optional<
  MapelAttributes,
  'mapel_id' | 'created_at' | 'updated_at'
>;

export class PrsMasterMapel
  extends Model<MapelAttributes, MapelCreationAttributes>
  implements MapelAttributes
{
  public mapel_id!: string;
  public nama_mapel!: string;
  public created_at!: Date | null;
  public updated_at!: Date | null;
}

PrsMasterMapel.init(
  {
    mapel_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nama_mapel: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'prs_master_mapel',
    timestamps: false,
  }
);

export default PrsMasterMapel;

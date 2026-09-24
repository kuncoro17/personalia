import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface UserAttributes {
  id: string;
  email: string;
  name: string;
  email_verified_at: Date | null;
  remember_token: string | null;
  created_at: Date | null;
  updated_at: Date | null;
}

export type UserCreationAttributes = Optional<
  UserAttributes,
  'id' | 'email_verified_at' | 'remember_token' | 'created_at' | 'updated_at'
>;

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: string;
  declare email: string;
  declare name: string;
  declare email_verified_at: Date | null;
  declare remember_token: string | null;
  declare created_at: Date | null;
  declare updated_at: Date | null;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email_verified_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    remember_token: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default User;

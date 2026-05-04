import { DataTypes, Model } from 'sequelize';
import sequelize from '../loaders/sequelize';

interface UserAttributes {
  id: string;
  username: string;
  email?: string | null;
  name?: string | null;
  password_hash?: string | null;
  tenant_id?: string | null;
  is_active?: boolean;
  created_at?: Date;
}

interface UserCreationAttributes {
  id: string;
  username: string;
  email?: string;
  name?: string;
  password_hash?: string;
  tenant_id?: string;
  is_active?: boolean;
}

export class UserModel extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public username!: string;
  public email?: string | null;
  public name?: string | null;
  public password_hash?: string | null;
  public tenant_id?: string | null;
  public is_active?: boolean;
  public created_at?: Date;
}

UserModel.init(
  {
    id: { type: DataTypes.STRING(36), primaryKey: true },
    username: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    email: { type: DataTypes.STRING(255), allowNull: true },
    name: { type: DataTypes.STRING(255), allowNull: true },
    password_hash: { type: DataTypes.STRING(255), allowNull: true },
    tenant_id: { type: DataTypes.STRING(36), allowNull: true },
    is_active: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 1 },
  },
  { sequelize, tableName: 'users', timestamps: false }
);

export default UserModel;

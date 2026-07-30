import { DataTypes, Model } from 'sequelize';
import sequelize from '../loaders/sequelize';

interface UserRoleAttributes {
  user_id: string;
  role_id: string;
  assigned_at?: Date;
}

export class UserRoleModel extends Model<UserRoleAttributes> implements UserRoleAttributes {
  public user_id!: string;
  public role_id!: string;
  public assigned_at?: Date;
}

UserRoleModel.init(
  {
    user_id: { type: DataTypes.STRING(36), allowNull: false },
    role_id: { type: DataTypes.STRING(36), allowNull: false },
    assigned_at: { type: DataTypes.DATE, allowNull: true },
  },
  { sequelize, tableName: 'user_roles', timestamps: false }
);

export default UserRoleModel;

import { DataTypes, Model } from 'sequelize';
import sequelize from '../loaders/sequelize';

interface RoleAttributes {
  id: string;
  name: string;
  tenant_id?: string | null;
  description?: string | null;
  created_at?: Date;
}

interface RoleCreationAttributes {
  id: string;
  name: string;
  tenant_id?: string;
  description?: string;
}

export class RoleModel extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
  public id!: string;
  public name!: string;
  public tenant_id?: string | null;
  public description?: string | null;
  public created_at?: Date;
}

RoleModel.init(
  {
    id: { type: DataTypes.STRING(36), primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    tenant_id: { type: DataTypes.STRING(36), allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
  },
  { sequelize, tableName: 'roles', timestamps: false }
);

export default RoleModel;

import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/sequelize';

interface TenantAttributes {
  id: string;
  name: string;
  settings?: any;
  created_at?: Date;
}

interface TenantCreationAttributes {
  id: string;
  name: string;
  settings?: any;
}

export class TenantModel extends Model<TenantAttributes, TenantCreationAttributes> implements TenantAttributes {
  public id!: string;
  public name!: string;
  public settings?: any;
  public created_at?: Date;
}

TenantModel.init(
  {
    id: { type: DataTypes.STRING(50), primaryKey: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    settings: { type: DataTypes.JSON, allowNull: true },
  },
  {
    sequelize,
    tableName: 'tenants',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  }
);

export default TenantModel;

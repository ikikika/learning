import UserModel from './userModel';
import RoleModel from './roleModel';
import UserRoleModel from './userRoleModel';
import TenantModel from './tenantModel';

// Associations
UserModel.belongsToMany(RoleModel, { through: UserRoleModel, foreignKey: 'user_id', otherKey: 'role_id', as: 'Roles' });
RoleModel.belongsToMany(UserModel, { through: UserRoleModel, foreignKey: 'role_id', otherKey: 'user_id', as: 'Users' });

export const User = UserModel;
export const Role = RoleModel;
export const UserRole = UserRoleModel;
export const Tenant = TenantModel;

export default { User, Role, UserRole, Tenant };

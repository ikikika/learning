import bcrypt from 'bcryptjs';
import { User, Role } from '../models';
import { signToken } from '../utils/jwt';

export async function loginUser(username: string, password: string) {
  const user = await User.findOne({
    where: { username },
    include: [{ model: Role, as: 'Roles', attributes: ['name'], through: { attributes: [] } }],
  }) as any;

  if (!user) throw Object.assign(new Error('invalid credentials'), { status: 401 });
  if (!user.is_active) throw Object.assign(new Error('user inactive'), { status: 403 });

  const match = await bcrypt.compare(password, user.password_hash || '');
  if (!match) throw Object.assign(new Error('invalid credentials'), { status: 401 });

  const roleNames = (user.Roles || []).map((r: any) => r.name);
  const token = signToken({ sub: user.id, username: user.username, tenant_id: user.tenant_id, roles: roleNames });

  return {
    token,
    user: { id: user.id, username: user.username, email: user.email, tenant_id: user.tenant_id, roles: roleNames },
  };
}

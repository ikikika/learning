import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User, Role } from '../models';
import { signToken } from '../utils/jwt';

export async function login(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: 'username and password required' });
    return;
  }

  try {
    const user = await User.findOne({
      where: { username },
      include: [{ model: Role, as: 'Roles', attributes: ['name'], through: { attributes: [] } }],
    }) as any;

    if (!user) { res.status(401).json({ error: 'invalid credentials' }); return; }
    if (!user.is_active) { res.status(403).json({ error: 'user inactive' }); return; }

    const match = await bcrypt.compare(password, user.password_hash || '');
    if (!match) { res.status(401).json({ error: 'invalid credentials' }); return; }

    const roleNames = (user.Roles || []).map((r: any) => r.name);
    const token = signToken({ sub: user.id, username: user.username, tenant_id: user.tenant_id, roles: roleNames });

    res.json({ token, user: { id: user.id, username: user.username, email: user.email, tenant_id: user.tenant_id, roles: roleNames } });
  } catch (err) {
    console.error('Auth error', err);
    res.status(500).json({ error: 'internal' });
  }
}

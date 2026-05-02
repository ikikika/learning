import { Router } from 'express';
import { User, Role } from '../models';
import bcrypt from 'bcryptjs';
import { signToken } from '../utils/jwt';

const router = Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });

  try {
    const user = await User.findOne({
      where: { username },
      include: [{ model: Role, as: 'Roles', attributes: ['name'], through: { attributes: [] } }],
    }) as any;

    if (!user) return res.status(401).json({ error: 'invalid credentials' });
    if (!user.is_active) return res.status(403).json({ error: 'user inactive' });

    const match = await bcrypt.compare(password, user.password_hash || '');
    if (!match) return res.status(401).json({ error: 'invalid credentials' });

    const roleNames = (user.Roles || []).map((r: any) => r.name);

    const token = signToken({ sub: user.id, username: user.username, tenant_id: user.tenant_id, roles: roleNames });

    return res.json({ token, user: { id: user.id, username: user.username, email: user.email, tenant_id: user.tenant_id, roles: roleNames } });
  } catch (err) {
    console.error('Auth error', err);
    return res.status(500).json({ error: 'internal' });
  }
});

export default router;

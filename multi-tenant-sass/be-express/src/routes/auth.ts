import { Router } from 'express';
import sequelize from '../db/sequelize';
import bcrypt from 'bcryptjs';
import { signToken } from '../utils/jwt';

const router = Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });

  try {
    const [users] = await sequelize.query('SELECT * FROM users WHERE username = ? LIMIT 1', { replacements: [username] });
    if (!users || users.length === 0) return res.status(401).json({ error: 'invalid credentials' });
    const user = users[0] as any;

    if (!user.is_active) return res.status(403).json({ error: 'user inactive' });

    const match = await bcrypt.compare(password, user.password_hash || '');
    if (!match) return res.status(401).json({ error: 'invalid credentials' });

    // load roles
    const [roles] = await sequelize.query(
      'SELECT r.name FROM roles r JOIN user_roles ur ON ur.role_id = r.id WHERE ur.user_id = ?',
      { replacements: [user.id] }
    );
    const roleNames = (roles as any[]).map(r => r.name);

    const token = signToken({ sub: user.id, username: user.username, tenant_id: user.tenant_id, roles: roleNames });

    return res.json({ token, user: { id: user.id, username: user.username, email: user.email, tenant_id: user.tenant_id, roles: roleNames } });
  } catch (err) {
    console.error('Auth error', err);
    return res.status(500).json({ error: 'internal' });
  }
});

export default router;

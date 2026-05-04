import { Router, Request, Response } from 'express';
import * as authService from '../services/authService';

const router = Router();

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: 'username and password required' });
    return;
  }
  try {
    const result = await authService.loginUser(username, password);
    res.json(result);
  } catch (err: any) {
    const status = err.status || 500;
    if (status === 500) console.error('Auth error', err);
    res.status(status).json({ error: err.message || 'internal' });
  }
});

export default router;

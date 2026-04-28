import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'missing token' });
  const token = auth.replace(/^Bearer /, '');
  try {
    const decoded: any = verifyToken(token) as any;
    const roles: string[] = decoded?.roles || [];
    // attach user info
    (req as any).user = { id: decoded.sub, username: decoded.username, roles: roles, tenant_id: decoded.tenant_id };
    // caller may check roles if needed (e.g. superadmin)
    return next();
  } catch (err) {
    console.error('Token error', err);
    return res.status(401).json({ error: 'invalid token' });
  }
}

// Optional auth: if token present attach user, otherwise continue
export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return next();
  const token = auth.replace(/^Bearer /, '');
  try {
    const decoded: any = verifyToken(token) as any;
    const roles: string[] = decoded?.roles || [];
    (req as any).user = { id: decoded.sub, username: decoded.username, roles: roles, tenant_id: decoded.tenant_id };
  } catch (err) {
    console.warn('Optional token invalid', err);
    // don't block request on invalid optional token
  }
  return next();
}

export function requireRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: 'missing token' });
    const roles: string[] = user.roles || [];
    if (!roles.includes(role)) return res.status(403).json({ error: 'forbidden' });
    return next();
  };
}
import { Router, Request, Response } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import * as tenantService from '../services/tenantService';

const router = Router();

router.post('/', requireAuth, requireRole('superadmin'), async (req: Request, res: Response): Promise<void> => {
  const { id: suppliedId, name } = req.body;
  if (!name) { res.status(400).json({ error: "'name' is required" }); return; }
  try {
    const tenant = await tenantService.createTenant(suppliedId, name);
    res.status(201).json(tenant);
  } catch (err: any) {
    const status = err.status || 500;
    if (status === 500) console.error(err);
    res.status(status).json({ error: err.message || 'Failed to create tenant' });
  }
});

router.get('/', requireAuth, requireRole('superadmin'), async (_req: Request, res: Response): Promise<void> => {
  try {
    const tenants = await tenantService.listTenants();
    res.json(tenants);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tenants' });
  }
});

router.get('/:id', requireAuth, async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const tenant = await tenantService.getTenantById(req.params.id);
    res.json(tenant);
  } catch (err: any) {
    const status = err.status || 500;
    if (status === 500) console.error(err);
    res.status(status).json({ error: err.message || 'Failed to fetch tenant' });
  }
});

export default router;

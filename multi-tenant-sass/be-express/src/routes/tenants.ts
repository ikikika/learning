import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import TenantModel from '../models/tenantModel';

const router = Router();

// Create tenant (persisted via Sequelize)
router.post('/', async (req: Request, res: Response) => {
  const { id: suppliedId, name } = req.body;
  if (!name) return res.status(400).json({ error: "'name' is required" });
  const id = suppliedId || randomUUID();
  try {
    const [tenant, created] = await TenantModel.findOrCreate({ where: { id }, defaults: { id, name } });
    if (!created) return res.status(409).json({ error: 'Tenant already exists' });
    return res.status(201).json({ 
      id: tenant.id, 
      name: tenant.name, 
      createdAt: tenant.getDataValue('created_at'), 
      settings: tenant.settings });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create tenant' });
  }
});

// List tenants (from DB via Sequelize)
router.get('/', async (_req: Request, res: Response) => {
  try {
    const tenants = await TenantModel.findAll({ order: [['created_at', 'DESC']] });
    res.json(tenants.map(t => ({ 
      id: t.id, 
      name: t.name, 
      createdAt: t.getDataValue('created_at'), 
      settings: t.settings 
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tenants' });
  }
});

// Get tenant by id (from DB via Sequelize)
router.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
  const id = req.params.id;
  try {
    const tenant = await TenantModel.findByPk(id);
    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });
    res.json({ 
      id: tenant.id, 
      name: tenant.name, 
      createdAt: tenant.getDataValue('created_at'), 
      settings: tenant.settings 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tenant' });
  }
});

export default router;

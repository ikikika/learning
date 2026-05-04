import { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { Tenant } from '../models';

function formatTenant(t: InstanceType<typeof Tenant>) {
  return { id: t.id, name: t.name, createdAt: t.getDataValue('created_at'), settings: t.settings };
}

export async function createTenant(req: Request, res: Response): Promise<void> {
  const { id: suppliedId, name } = req.body;
  if (!name) { res.status(400).json({ error: "'name' is required" }); return; }
  const id = suppliedId || randomUUID();
  try {
    const [tenant, created] = await Tenant.findOrCreate({ where: { id }, defaults: { id, name } });
    if (!created) { res.status(409).json({ error: 'Tenant already exists' }); return; }
    res.status(201).json(formatTenant(tenant));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create tenant' });
  }
}

export async function listTenants(_req: Request, res: Response): Promise<void> {
  try {
    const tenants = await Tenant.findAll({ order: [['created_at', 'DESC']] });
    res.json(tenants.map(formatTenant));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tenants' });
  }
}

export async function getTenant(req: Request<{ id: string }>, res: Response): Promise<void> {
  try {
    const tenant = await Tenant.findByPk(req.params.id);
    if (!tenant) { res.status(404).json({ error: 'Tenant not found' }); return; }
    res.json(formatTenant(tenant));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tenant' });
  }
}

import { randomUUID } from 'crypto';
import { Tenant } from '../models';

function formatTenant(t: InstanceType<typeof Tenant>) {
  return { id: t.id, name: t.name, createdAt: t.getDataValue('created_at'), settings: t.settings };
}

export async function createTenant(suppliedId: string | undefined, name: string) {
  const id = suppliedId || randomUUID();
  const [tenant, created] = await Tenant.findOrCreate({ where: { id }, defaults: { id, name } });
  if (!created) throw Object.assign(new Error('Tenant already exists'), { status: 409 });
  return formatTenant(tenant);
}

export async function listTenants() {
  const tenants = await Tenant.findAll({ order: [['created_at', 'DESC']] });
  return tenants.map(formatTenant);
}

export async function getTenantById(id: string) {
  const tenant = await Tenant.findByPk(id);
  if (!tenant) throw Object.assign(new Error('Tenant not found'), { status: 404 });
  return formatTenant(tenant);
}

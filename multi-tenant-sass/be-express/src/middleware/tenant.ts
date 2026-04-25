import { Request, Response, NextFunction } from "express";
import TenantModel from "../models/tenantModel";

declare global {
  namespace Express {
    interface Request {
      tenant?: InstanceType<typeof TenantModel> | null;
    }
  }
}

// Middleware that enforces a tenant id and loads the tenant into `req.tenant`.
export async function requireTenant(req: Request, res: Response, next: NextFunction) {
  const tenantId = (req.header("x-tenant-id") || req.query.tenant_id || req.header("tenant-id")) as string | undefined;

  if (!tenantId) {
    return res.status(400).json({ error: "Missing tenant id. Provide `x-tenant-id` header or `tenant_id` query param." });
  }

  try {
    const tenant = await TenantModel.findByPk(tenantId);
    if (!tenant) return res.status(404).json({ error: `Tenant '${tenantId}' not found.` });
    req.tenant = tenant;
    return next();
  } catch (err) {
    console.error('requireTenant error', err);
    return res.status(500).json({ error: 'Failed to validate tenant' });
  }
}

// Lightweight helper to optionally attach tenant (does not error if missing)
export async function attachTenantIfPresent(req: Request, _res: Response, next: NextFunction) {
  const tenantId = (req.header("x-tenant-id") || req.query.tenant_id || req.header("tenant-id")) as string | undefined;
  if (!tenantId) {
    req.tenant = null;
    return next();
  }
  try {
    const tenant = await TenantModel.findByPk(tenantId);
    req.tenant = tenant || null;
  } catch (err) {
    console.error('attachTenantIfPresent error', err);
    req.tenant = null;
  }
  next();
}

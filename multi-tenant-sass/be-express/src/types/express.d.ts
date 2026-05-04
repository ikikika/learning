import TenantModel from '../models/tenantModel';

declare global {
  namespace Express {
    interface Request {
      tenant?: InstanceType<typeof TenantModel> | null;
    }
  }
}

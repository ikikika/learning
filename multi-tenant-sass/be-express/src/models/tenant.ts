export interface Tenant {
  id: string;
  name: string;
  createdAt: string; // ISO date
  settings?: Record<string, unknown>;
}

class TenantStoreClass {
  private tenants: Map<string, Tenant> = new Map();

  create(id: string, name: string) {
    const tenant: Tenant = { id, name, createdAt: new Date().toISOString(), settings: {} };
    this.tenants.set(id, tenant);
    return tenant;
  }

  get(id: string) {
    return this.tenants.get(id) ?? null;
  }

  exists(id: string) {
    return this.tenants.has(id);
  }

  list() {
    return Array.from(this.tenants.values());
  }

  delete(id: string) {
    return this.tenants.delete(id);
  }
}

export const tenantStore = new TenantStoreClass();

export default TenantStoreClass;

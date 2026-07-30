jest.mock('../../../src/models', () => ({
  Tenant: {
    findOrCreate: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
  },
}));

import { createTenant, listTenants, getTenantById } from '../../../src/services/tenantService';
import { Tenant } from '../../../src/models';

function makeMockTenant(overrides: Record<string, unknown> = {}) {
  return {
    id: 'tenant-1',
    name: 'Acme',
    settings: null,
    getDataValue: (key: string) => (key === 'created_at' ? '2026-01-01T00:00:00.000Z' : null),
    ...overrides,
  };
}

describe('tenantService.createTenant', () => {
  beforeEach(() => jest.clearAllMocks());

  test('creates and returns formatted tenant', async () => {
    (Tenant.findOrCreate as jest.Mock).mockResolvedValue([makeMockTenant(), true]);

    const result = await createTenant(undefined, 'Acme');

    expect(result.name).toBe('Acme');
    expect(result.id).toBe('tenant-1');
    expect(result.createdAt).toBe('2026-01-01T00:00:00.000Z');
  });

  test('uses suppliedId when provided', async () => {
    (Tenant.findOrCreate as jest.Mock).mockResolvedValue([makeMockTenant({ id: 'my-id' }), true]);

    const result = await createTenant('my-id', 'Acme');

    const [{ defaults }] = (Tenant.findOrCreate as jest.Mock).mock.calls[0];
    expect(defaults.id).toBe('my-id');
    expect(result.id).toBe('my-id');
  });

  test('generates a UUID when no id supplied', async () => {
    (Tenant.findOrCreate as jest.Mock).mockResolvedValue([makeMockTenant(), true]);
    await createTenant(undefined, 'Acme');

    const [{ defaults }] = (Tenant.findOrCreate as jest.Mock).mock.calls[0];
    expect(defaults.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
  });

  test('throws 409 when tenant already exists', async () => {
    (Tenant.findOrCreate as jest.Mock).mockResolvedValue([makeMockTenant(), false]);

    await expect(createTenant(undefined, 'Acme')).rejects.toMatchObject({
      message: 'Tenant already exists',
      status: 409,
    });
  });
});

describe('tenantService.listTenants', () => {
  beforeEach(() => jest.clearAllMocks());

  test('returns array of formatted tenants', async () => {
    (Tenant.findAll as jest.Mock).mockResolvedValue([
      makeMockTenant(),
      makeMockTenant({ id: 'tenant-2', name: 'Beta' }),
    ]);

    const result = await listTenants();

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Acme');
    expect(result[1].name).toBe('Beta');
  });

  test('returns empty array when no tenants exist', async () => {
    (Tenant.findAll as jest.Mock).mockResolvedValue([]);

    const result = await listTenants();

    expect(result).toEqual([]);
  });
});

describe('tenantService.getTenantById', () => {
  beforeEach(() => jest.clearAllMocks());

  test('returns formatted tenant when found', async () => {
    (Tenant.findByPk as jest.Mock).mockResolvedValue(makeMockTenant());

    const result = await getTenantById('tenant-1');

    expect(result.id).toBe('tenant-1');
    expect(result.name).toBe('Acme');
  });

  test('throws 404 when tenant not found', async () => {
    (Tenant.findByPk as jest.Mock).mockResolvedValue(null);

    await expect(getTenantById('missing')).rejects.toMatchObject({
      message: 'Tenant not found',
      status: 404,
    });
  });
});

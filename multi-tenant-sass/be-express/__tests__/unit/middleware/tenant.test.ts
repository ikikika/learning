import { Response, NextFunction } from 'express';

jest.mock('../../../src/models/tenantModel', () => ({ findByPk: jest.fn() }));

import { requireTenant, attachTenantIfPresent } from '../../../src/middleware/tenant';
import TenantModel from '../../../src/models/tenantModel';

function makeRes() {
  const res = {} as any;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as unknown as Response;
}

const next = jest.fn() as NextFunction;

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

// Builds a minimal req mock where req.header() returns the given tenant id for known headers
function makeReq(tenantId?: string, queryTenantId?: string) {
  return {
    header: (name: string) => {
      if ((name === 'x-tenant-id' || name === 'tenant-id') && tenantId) return tenantId;
      return undefined;
    },
    query: queryTenantId ? { tenant_id: queryTenantId } : {},
  } as any;
}

const fakeTenant = { id: 't1', name: 'Acme' };

describe('requireTenant', () => {
  test('attaches tenant and calls next when tenant found via header', async () => {
    (TenantModel.findByPk as jest.Mock).mockResolvedValue(fakeTenant);
    const req = makeReq('t1');
    const res = makeRes();

    await requireTenant(req, res, next);

    expect(req.tenant).toBe(fakeTenant);
    expect(next).toHaveBeenCalled();
  });

  test('attaches tenant and calls next when tenant found via query param', async () => {
    (TenantModel.findByPk as jest.Mock).mockResolvedValue(fakeTenant);
    const req = makeReq(undefined, 't1');
    const res = makeRes();

    await requireTenant(req, res, next);

    expect(req.tenant).toBe(fakeTenant);
    expect(next).toHaveBeenCalled();
  });

  test('returns 400 when no tenant id is provided', async () => {
    const req = makeReq();
    const res = makeRes();

    await requireTenant(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  test('returns 404 when tenant id provided but not found in DB', async () => {
    (TenantModel.findByPk as jest.Mock).mockResolvedValue(null);
    const req = makeReq('missing-id');
    const res = makeRes();

    await requireTenant(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).not.toHaveBeenCalled();
  });

  test('returns 500 on unexpected DB error', async () => {
    (TenantModel.findByPk as jest.Mock).mockRejectedValue(new Error('DB down'));
    const req = makeReq('t1');
    const res = makeRes();

    await requireTenant(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(next).not.toHaveBeenCalled();
  });
});

describe('attachTenantIfPresent', () => {
  test('attaches tenant and calls next when found', async () => {
    (TenantModel.findByPk as jest.Mock).mockResolvedValue(fakeTenant);
    const req = makeReq('t1');
    const res = makeRes();

    await attachTenantIfPresent(req, res, next);

    expect(req.tenant).toBe(fakeTenant);
    expect(next).toHaveBeenCalled();
  });

  test('sets tenant to null and calls next when no id given', async () => {
    const req = makeReq();
    const res = makeRes();

    await attachTenantIfPresent(req, res, next);

    expect(req.tenant).toBeNull();
    expect(next).toHaveBeenCalled();
  });

  test('sets tenant to null and calls next when DB lookup returns nothing', async () => {
    (TenantModel.findByPk as jest.Mock).mockResolvedValue(null);
    const req = makeReq('t1');
    const res = makeRes();

    await attachTenantIfPresent(req, res, next);

    expect(req.tenant).toBeNull();
    expect(next).toHaveBeenCalled();
  });

  test('sets tenant to null and calls next even on DB error', async () => {
    (TenantModel.findByPk as jest.Mock).mockRejectedValue(new Error('DB down'));
    const req = makeReq('t1');
    const res = makeRes();

    await attachTenantIfPresent(req, res, next);

    expect(req.tenant).toBeNull();
    expect(next).toHaveBeenCalled();
  });
});

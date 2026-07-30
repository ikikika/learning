import { Request, Response, NextFunction } from 'express';

jest.mock('../../../src/utils/jwt', () => ({ verifyToken: jest.fn() }));

import { requireAuth, optionalAuth, requireRole } from '../../../src/middleware/auth';
import { verifyToken } from '../../../src/utils/jwt';

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
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

const validPayload = { sub: 'u1', username: 'alice', tenant_id: 't1', roles: ['admin'] };

describe('requireAuth', () => {
  test('attaches user and calls next on valid Bearer token', async () => {
    (verifyToken as jest.Mock).mockReturnValue(validPayload);
    const req = { headers: { authorization: 'Bearer valid-token' } } as any;
    const res = makeRes();

    await requireAuth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual({ id: 'u1', username: 'alice', tenant_id: 't1', roles: ['admin'] });
  });

  test('returns 401 when authorization header is missing', async () => {
    const req = { headers: {} } as any;
    const res = makeRes();

    await requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('returns 401 when authorization header does not start with Bearer', async () => {
    const req = { headers: { authorization: 'Basic abc123' } } as any;
    const res = makeRes();

    await requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('returns 401 when token verification throws', async () => {
    (verifyToken as jest.Mock).mockImplementation(() => { throw new Error('expired'); });
    const req = { headers: { authorization: 'Bearer bad-token' } } as any;
    const res = makeRes();

    await requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});

describe('optionalAuth', () => {
  test('attaches user and calls next when valid token present', async () => {
    (verifyToken as jest.Mock).mockReturnValue(validPayload);
    const req = { headers: { authorization: 'Bearer valid-token' } } as any;
    const res = makeRes();

    await optionalAuth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toMatchObject({ id: 'u1' });
  });

  test('calls next without attaching user when no token present', async () => {
    const req = { headers: {} } as any;
    const res = makeRes();

    await optionalAuth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toBeUndefined();
  });

  test('calls next even when token verification throws', async () => {
    (verifyToken as jest.Mock).mockImplementation(() => { throw new Error('bad'); });
    const req = { headers: { authorization: 'Bearer bad' } } as any;
    const res = makeRes();

    await optionalAuth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toBeUndefined();
  });
});

describe('requireRole', () => {
  test('calls next when user has the required role', () => {
    const req = { user: { roles: ['superadmin', 'admin'] } } as any;
    const res = makeRes();

    requireRole('superadmin')(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test('returns 403 when user lacks the required role', () => {
    const req = { user: { roles: ['viewer'] } } as any;
    const res = makeRes();

    requireRole('superadmin')(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test('returns 401 when no user is attached to request', () => {
    const req = {} as any;
    const res = makeRes();

    requireRole('superadmin')(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});

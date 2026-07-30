import { signToken, verifyToken } from '../src/utils/jwt';

describe('JWT utils', () => {
  test('signToken produces a token and verifyToken returns payload', () => {
    const payload = { sub: 'user-123', username: 'testuser' };
    const token = signToken(payload);
    expect(typeof token).toBe('string');

    const decoded: any = verifyToken(token) as any;
    expect(decoded.sub).toBe(payload.sub);
    expect(decoded.username).toBe(payload.username);
  });
});

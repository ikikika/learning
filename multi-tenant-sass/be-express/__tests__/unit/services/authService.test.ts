import bcrypt from 'bcryptjs';

jest.mock('../../../src/models', () => ({
  User: { findOne: jest.fn() },
  Role: {},
}));
jest.mock('bcryptjs', () => ({ compare: jest.fn() }));
jest.mock('../../../src/utils/jwt', () => ({ signToken: jest.fn(() => 'mock-token') }));

// Import after mocks are set up
import { loginUser } from '../../../src/services/authService';
import { User } from '../../../src/models';

const mockUser = {
  id: 'user-1',
  username: 'alice',
  email: 'alice@example.com',
  is_active: true,
  password_hash: '$2a$10$hashed',
  tenant_id: 'tenant-1',
  Roles: [{ name: 'admin' }],
};

describe('authService.loginUser', () => {
  beforeEach(() => jest.clearAllMocks());

  test('returns token and user on valid credentials', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await loginUser('alice', 'password');

    expect(result.token).toBe('mock-token');
    expect(result.user.username).toBe('alice');
    expect(result.user.roles).toEqual(['admin']);
    expect(result.user.tenant_id).toBe('tenant-1');
  });

  test('throws 401 when user is not found', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);

    await expect(loginUser('alice', 'password')).rejects.toMatchObject({
      message: 'invalid credentials',
      status: 401,
    });
  });

  test('throws 403 when user is inactive', async () => {
    (User.findOne as jest.Mock).mockResolvedValue({ ...mockUser, is_active: false });

    await expect(loginUser('alice', 'password')).rejects.toMatchObject({
      message: 'user inactive',
      status: 403,
    });
  });

  test('throws 401 on wrong password', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(loginUser('alice', 'wrong')).rejects.toMatchObject({
      message: 'invalid credentials',
      status: 401,
    });
  });

  test('does not expose password_hash in returned user', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await loginUser('alice', 'password');

    expect(result.user).not.toHaveProperty('password_hash');
  });
});

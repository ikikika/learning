import { sign, verify, Secret, SignOptions, JwtPayload } from 'jsonwebtoken';

const JWT_SECRET: Secret = (process.env.JWT_SECRET || 'dev-secret');
// `expiresIn` accepts `number | StringValue` where StringValue is defined in the `ms` types.
const JWT_EXPIRES_IN: number | import('ms').StringValue = (process.env.JWT_EXPIRES_IN || '6h') as unknown as number | import('ms').StringValue;

export function signToken(payload: string | object | Buffer): string {
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN };
  return sign(payload as string | object | Buffer, JWT_SECRET, options);
}

export function verifyToken(token: string): string | JwtPayload {
  return verify(token, JWT_SECRET) as string | JwtPayload;
}

// Quick summary of what verifyToken() checks

// Signature: verifies the JWT signature using JWT_SECRET (HMAC/RS* depending on secret/key).
// Standard claims: enforces exp (expiration) and nbf (not-before) when present.
// Token format: fails for malformed tokens or invalid signature.
// Errors thrown: TokenExpiredError, NotBeforeError, or JsonWebTokenError on failure.
// Return value: the decoded token payload (string | JwtPayload) when verification succeeds.
// Usage: requireAuth calls verifyToken() and expects the payload to include sub, username, tenant_id, and roles to populate req.user (src/middleware/auth.ts).
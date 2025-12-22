/**
 * Shared app / Module Federation name helpers (CJS for webpack + init).
 */

/** Default MF / metadata names when --name is omitted. */
const DEFAULT_NAMES = {
  standalone: 'standalone',
  shell: 'shell',
  remote: 'demo-remote',
};

const DEFAULT_REMOTE_NAME = 'demoRemote';

/** npm-style package name (optional scope). */
const PACKAGE_NAME_RE =
  /^(?:@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;

/**
 * Derive a valid Module Federation container name from a package/app name.
 * e.g. `my-app` → `myApp`, `@acme/checkout` → `checkout`
 */
function toFederationName(pkgName) {
  const base = pkgName.includes('/') ? pkgName.split('/').pop() : pkgName;
  const parts = String(base)
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean);
  if (parts.length === 0) return '';
  return parts
    .map((part, i) => {
      const cleaned = part.replace(/^[0-9]+/, '');
      if (!cleaned) return '';
      if (i === 0) return cleaned.charAt(0).toLowerCase() + cleaned.slice(1);
      return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    })
    .join('');
}

/**
 * PascalCase identifier from a package/app name.
 * e.g. `my-checkout` → `MyCheckout`, `demoRemote` → `DemoRemote`
 */
function toPascalCase(pkgName) {
  const camel = toFederationName(pkgName);
  if (!camel) return '';
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

/** MF expose key from app name, e.g. `checkout` → `./Checkout`. */
function toExposePath(pkgName) {
  const pascal = toPascalCase(pkgName);
  if (!pascal) return '';
  return `./${pascal}`;
}

function isValidPackageName(value) {
  if (!value || typeof value !== 'string') return false;
  // Already a federation-safe identifier (e.g. demoRemote, shell).
  if (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(value)) return true;
  if (!PACKAGE_NAME_RE.test(value)) return false;
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(toFederationName(value));
}

function defaultNameForRole(role) {
  return DEFAULT_NAMES[role] || 'standalone';
}

module.exports = {
  DEFAULT_NAMES,
  DEFAULT_REMOTE_NAME,
  PACKAGE_NAME_RE,
  toFederationName,
  toPascalCase,
  toExposePath,
  isValidPackageName,
  defaultNameForRole,
};

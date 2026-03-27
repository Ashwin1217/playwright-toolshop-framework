# Security Policy

## Known Accepted Vulnerabilities

### brace-expansion < 5.0.5 (Moderate)

- **Advisory**: GHSA-f886-m6hf-6m8v
- **Affected packages**: eslint (dev dependency only)
- **Risk**: Zero — ESLint runs only in local development, never in production
- **Why not fixed**: `npm audit fix --force` would downgrade ESLint to v4,
  breaking the entire linting configuration
- **Resolution**: Will be resolved when ESLint releases a patched version
- **Accepted on**: 2026-03-27
- **Accepted by**: Aswin

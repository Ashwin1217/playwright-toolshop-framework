# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/).

---

## [1.0.0] — 2026-04-11

### Added

- Complete enterprise Playwright framework from scratch
- TypeScript with strict mode and path aliases
- ESLint v9 flat config with Playwright-specific rules
- Prettier code formatting
- Husky + lint-staged pre-commit hooks
- EditorConfig for cross-editor consistency
- Enterprise folder structure — 13 folders
- Per-environment configuration files (dev/staging/prod)
- dotenv integration for environment variable management
- Enterprise `playwright.config.ts` — multi-browser, retries, artifacts
- Global setup with storageState authentication
- `BasePage` abstract class with shared page interactions
- `LoginPage`, `HomePage`, `ProductPage`, `CartPage` Page Objects
- `NavigationComponent` and `ToastComponent` reusable components
- TypeScript interfaces for Product, Auth, and User data
- `BaseApiClient`, `AuthApiClient`, `ProductsApiClient` API layer
- Custom Playwright fixtures for automatic dependency injection
- Authentication tests (4 tests)
- Home page tests (9 tests)
- Product page tests (7 tests)
- Cart management tests (7 tests)
- Products API tests (11 tests)
- Allure reporting with metadata (epic, feature, story, severity)
- GitHub Actions CI with smoke and regression jobs
- Comprehensive README with architecture documentation
- CONTRIBUTING.md with coding standards
- SECURITY.md with vulnerability documentation
- CI_NOTES.md with Cloudflare limitation documentation

### Technical Decisions

- TypeScript 5.8.3 — pinned due to ESLint compatibility (not 6.x)
- `data-test` attribute — Toolshop uses this, not `data-testid`
- `storageState` per project — not global to avoid setup conflicts
- API tests as CI gate — UI tests best-effort due to Cloudflare

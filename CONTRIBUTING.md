# Contributing Guidelines

## Code Standards

### TypeScript

- Strict mode enabled — no `any` types
- All functions must have explicit return types
- Use `const` over `let` wherever possible

### Page Objects

- Locators defined as `private readonly` in constructor
- Child locators as `private` methods scoped to parent element
- Actions and assertions as separate methods — never mixed
- No raw Playwright calls in test files — always go through Page Objects

### Tests

- Import `test` and `expect` from `src/fixtures/index` — never from `@playwright/test`
- Follow AAA pattern — Arrange, Act, Assert
- Every test must be completely independent
- Tag all tests with `@smoke` or `@regression`
- Add Allure metadata at the top of every test

### Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix      | When to use                  |
| ----------- | ---------------------------- |
| `feat:`     | New feature or test          |
| `fix:`      | Bug fix                      |
| `chore:`    | Tooling, config, maintenance |
| `docs:`     | Documentation changes        |
| `ci:`       | CI/CD pipeline changes       |
| `refactor:` | Code restructure             |
| `test:`     | Adding or updating tests     |

### Branch Naming

feat/add-checkout-tests
fix/cart-quantity-locator
chore/update-dependencies

## Adding New Tests

1. Inspect the real site HTML before writing locators
2. Create or update Page Object in `src/pages/`
3. Add fixtures to `src/fixtures/index.ts` if needed
4. Write test in appropriate `tests/` subfolder
5. Add Allure metadata to every test
6. Run `npx tsc --noEmit` — fix all TypeScript errors
7. Run `npm run lint` — fix all ESLint errors
8. Run the specific test file locally before committing

## Adding New Page Objects

1. Extend `BasePage` for pages, not components
2. Define all locators as `private readonly` in constructor
3. Use `getByTestId()` for elements with `data-test` attributes
4. Use child locator methods for elements scoped to a parent
5. Keep assertions inside Page Objects — not in test files

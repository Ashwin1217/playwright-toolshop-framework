import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load environment-specific .env file
const env = process.env['ENV'] || 'dev';
dotenv.config({ path: path.resolve(__dirname, `config/environments/${env}.env`) });

export default defineConfig({
  // Test directory
  testDir: './tests',

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env['CI'],

  // Retry failed tests
  retries: process.env['CI'] ? 2 : 0,

  // Limit parallel workers
  workers: process.env['CI'] ? 4 : undefined,

  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['json', { outputFile: 'reports/json/results.json' }],
    ['junit', { outputFile: 'reports/junit/results.xml' }],
    ['list'],
  ],

  // Global test settings
  use: {
    // Base URL from environment config
    baseURL: process.env['BASE_URL'],

    // Tell Playwright which attribute getByTestId() should look for
    testIdAttribute: 'data-test',

    // Collect trace on first retry for debugging
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on first retry
    video: 'on-first-retry',

    // Browser context options
    ignoreHTTPSErrors: true,

    // Default timeout for actions
    actionTimeout: 15000,

    // Default timeout for navigation
    navigationTimeout: 30000,
  },

  // Global test timeout
  timeout: 60000,

  // Expect timeout
  expect: {
    timeout: 10000,
  },

  // Output directory for test artifacts
  outputDir: 'test-results/',

  // Browser projects
  projects: [
    // --- Setup project (runs before all tests) ---
    {
      name: 'setup',
      testMatch: '**/global.setup.ts',
    },

    // --- Desktop Browsers ---
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
      dependencies: ['setup'],
    },

    // --- Mobile Browsers ---
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
      },
      dependencies: ['setup'],
    },
    {
      name: 'mobile-safari',
      use: {
        ...devices['iPhone 13'],
      },
      dependencies: ['setup'],
    },

    // --- API Testing (no browser needed) ---
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: process.env['API_BASE_URL'],
      },
    },
  ],
});

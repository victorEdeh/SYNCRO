# Test Infrastructure Setup

This document describes the test infrastructure configuration for the client application.

## Overview

The test infrastructure includes:
- **Vitest** for unit and integration tests
- **Playwright** for E2E tests
- **V8 coverage provider** for code coverage reporting
- **Flaky test detection** for identifying unreliable tests
- **CI integration** with coverage enforcement

## Configuration Files

### Vitest Configuration (`vitest.config.ts`)

The Vitest configuration includes:
- **Coverage thresholds**: 70% lines, 65% branches, 75% functions, 70% statements
- **Coverage reporters**: text, HTML, JSON summary, LCOV
- **Test environment**: jsdom for DOM testing
- **Setup files**: `lib/test-utils/setup.ts` for global test setup

### Playwright Configuration (`playwright.config.ts`)

The Playwright configuration includes:
- **Retry logic**: 2 retries in CI, 0 locally
- **Reporters**: list, HTML, custom flaky reporter
- **Test fixtures**: Authentication and database state management
- **Multiple browsers**: Chromium, Firefox, WebKit, Mobile Chrome

### CI Workflow (`.github/workflows/test.yml`)

The CI workflow includes:
- **Unit tests** with coverage reporting
- **Coverage threshold checks** that fail the build if thresholds are not met
- **Codecov integration** for coverage tracking
- **PR comments** with coverage changes
- **E2E tests** across multiple browsers
- **Flaky test reporting** with artifact uploads

## Running Tests

### Unit Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run tests with coverage threshold check
pnpm test:coverage:check
```

### E2E Tests

```bash
# Run E2E tests
pnpm e2e

# Run E2E tests in headed mode (visible browser)
pnpm e2e:headed

# View E2E test report
pnpm e2e:report
```

## Coverage Thresholds

The following coverage thresholds are enforced in CI:

| Metric     | Threshold |
|------------|-----------|
| Lines      | 70%       |
| Branches   | 65%       |
| Functions  | 75%       |
| Statements | 70%       |

If any threshold is not met, the CI build will fail.

## Flaky Test Detection

The custom Playwright reporter tracks test failures and identifies flaky tests:

- **Critical**: Tests with >50% flake rate
- **Warning**: Tests with 30-50% flake rate
- **Stable**: Tests with 0% flake rate after 20 consecutive passes

Flaky test reports are saved to `test-results/flaky-tests.json` and uploaded as CI artifacts.

## Coverage Badge

To add a coverage badge to your README, configure Codecov and add:

```markdown
[![codecov](https://codecov.io/gh/YOUR_ORG/YOUR_REPO/branch/main/graph/badge.svg)](https://codecov.io/gh/YOUR_ORG/YOUR_REPO)
```

## Test Utilities

Test utilities are located in `lib/test-utils/`:

- `setup.ts`: Global test setup and mocks
- `flaky-reporter.ts`: Custom Playwright reporter for flaky test detection
- `fixtures.ts`: E2E test fixtures for authentication and database state

## Next Steps

1. Install dependencies: `pnpm install`
2. Run tests: `pnpm test`
3. Configure Codecov token in GitHub secrets
4. Add coverage badge to README

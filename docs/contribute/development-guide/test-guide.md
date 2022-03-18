---
id: test-guide
title: Test Guide
slug: /contribute/development-guide/test-guide/
---

Dragonfly includes unit tests and E2E tests.

## Unit tests {#unit-tests}

Unit tests is in the project directory.

### Running unit tests {#running-unit-tests}

```bash
make test
```

### Running uint tests with coverage reports {#running-uint-tests-with-coverage-reports}

```bash
make test-coverage
```

## E2E tests {#e2e-tests}

E2E tests is in `test/e2e` path.

### Running E2E tests {#running-e2e-tests}

```bash
make e2e-test
```

### Running E2E tests with coverage reports {#running-e2e-tests-with-coverage-reports}

```bash
make e2e-test-coverage
```

### Clean E2E tests environment {#clean-e2e-tests-environment}

```bash
make clean-e2e-test
```

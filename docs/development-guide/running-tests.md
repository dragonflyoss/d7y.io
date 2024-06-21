---
id: running-tests
title: Running Tests
slug: /development-guide/running-tests/
---

This document describes how to run unit tests and E2E tests.

## Prerequisites {#prerequisites}

<!-- markdownlint-disable -->

| Name   | Version | Document                        |
| ------ | ------- | ------------------------------- |
| Golang | 1.16.x  | [go.dev](https://go.dev/)       |
| Rust   | 1.6+    | [rustup.rs](https://rustup.rs/) |

<!-- markdownlint-restore -->

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

E2E tests is in `Dragonfly2/test/e2e` path.

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

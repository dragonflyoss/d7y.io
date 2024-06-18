---
id: running-tests
title: 运行测试
slug: /development-guide/running-tests/
---

本文档介绍如何运行单元测试和 E2E 测试。

## 环境准备

<!-- markdownlint-disable -->

| 所需软件 | 版本要求 | 文档                            |
| -------- | -------- | ------------------------------- |
| Golang   | 1.16.x   | [go.dev](https://go.dev/)       |
| Rust     | 3.0+     | [rustup.rs](https://rustup.rs/) |

<!-- markdownlint-restore -->

## 单元测试

单元测试代码在项目目录中。

### 运行单元测试

```bash
make test
```

### 运行单元测试并产出测试报告

```bash
make test-coverage
```

## E2E 测试

E2E 测试代码在 `Dragonfly2/test/e2e` 目录中。

### 运行 E2E 测试

```bash
make e2e-test
```

### 运行 E2E 测试并产出测试报告

```bash
make e2e-test-coverage
```

### 删除 E2E 测试环境

```bash
make clean-e2e-test
```

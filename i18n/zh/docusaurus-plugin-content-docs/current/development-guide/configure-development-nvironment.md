---
id: configure-development-environment
title: 配置开发环境
slug: /development-guide/configure-development-environment/
---

本文档介绍如何搭建 Dragonfly 的开发环境。

## 环境准备

<!-- markdownlint-disable -->

| 所需软件 | 版本要求                     | 文档                                                                         |
| -------- | ---------------------------- | ---------------------------------------------------------------------------- |
| Linux    |                              | [linux.org](https://www.linux.org/)                                          |
| Git      | 1.9.1+                       | [git-scm](https://git-scm.com/)                                              |
| Golang   | 1.16.x                       | [go.dev](https://go.dev/)                                                    |
| Rust     | 1.6+                         | [rustup.rs](https://rustup.rs/)                                              |
| Database | Mysql 5.6+ 或 PostgreSQL 12+ | [mysql](https://www.mysql.com/) OR [postgresql](https://www.postgresql.org/) |
| Redis    | 3.0+                         | [redis.io](https://redis.io/)                                                |

<!-- markdownlint-restore -->

## 使用源码安装

获取 Dragonfly 的源码：

```shell
git clone --recurse-submodules https://github.com/dragonflyoss/Dragonfly2.git
cd Dragonfly2
```

编译源码并安装二进制可执行程序：

```shell
# 构建 manager scheduler
make build-manager &&  make build-scheduler
```

获取 Client 的源码：

```shell
git clone --recurse-submodules https://github.com/dragonflyoss/client.git
cd client
```

## 运行

### Manager

#### 启动 Manager

编辑配置文件 Linux 环境下默认 Manager 配置路径为 `/etc/dragonfly/manager.yaml`，
参考文档 [Manager](../reference/configuration/manager.md)。

在 Manager 配置文件下设置 database.mysql.addrs 和 database.redis.addrs 地址为你的实际地址，配置内容如下：

```yaml
# Manager 配置。
database:
  type: mysql
  mysql:
    user: your_mysql_user
    password: your_mysql_password
    host: dragonfly-mysql
    port: your_mysql_port
    dbname: manager
    migrate: true
  redis:
    addrs:
      - dragonfly-redis
    masterName: your_redis_master_name
    username: your_redis_username
    password: your_redis_passwprd
    db: 0
    brokerDB: 1
    backendDB: 2
```

运行 Manager:

> 注意 : 在 Dragonfly2 项目目录下运行 Manager。

```bash
# 启动 Manager。
go run cmd/manager/main.go --config /etc/dragonfly/manager.yaml --verbose --console
```

#### 验证 Manager 是否在运行

Manager 部署完成之后，运行以下命令以检查 **Manager** 是否正在运行，以及 `8080` 和 `65003` 端口是否可用。

```bash
telnet 127.0.0.1 8080
telnet 127.0.0.1 65003
```

### Scheduler

#### 启动 Scheduler

编辑配置文件 Linux 环境下默认 Scheduler 配置路径为 `/etc/dragonfly/scheduler.yaml`，
参考文档 [Scheduler](../reference/configuration/scheduler.md)。

在 Scheduler 配置文件下设置 database.redis.addrs 和 manager.addr 地址为你的实际地址，配置内容如下：

```yaml
# Scheduler 配置。
database:
  redis:
    addrs:
      - dragonfly-redis
    masterName: your_redis_master_name
    username: your_redis_username
    password: your_redis_password
    brokerDB: 1
    backendDB: 2
    networkTopologyDB: 3
 manager:
  addr: dragonfly-manager:65003
  schedulerClusterID: 1
  keepAlive:
    interval: 5s
```

运行 Scheduler:

> 注意 : 在 Dragonfly2 项目目录下运行 Scheduler。

```bash
# 启动 Scheduler。
schedulergo run cmd/scheduler/main.go --config /etc/dragonfly/scheduler.yaml --verbose --console
```

#### 验证 Scheduler 是否在运行

Scheduler 部署完成之后，运行以下命令以检查 **Scheduler** 是否正在运行，以及 `8002` 端口是否可用。

```bash
telnet 127.0.0.1 8002
```

### Dfdaemon

#### 启动 Dfdaemon

编辑配置文件 Linux 环境下默认 Dfdaemon 配置路径为 `/etc/dragonfly/dfdaemon.yaml`，
参考文档 [Dfdaemon](../reference/configuration/client/dfdaemon.md)。

在 Seed Peer 配置文件下设置 manager.addrs 地址为你的实际地址，配置内容如下：

```yaml
# Dfdaemon 配置。
manager:
  addrs:
    - http://dragonfly-manager:65003
seedPeer:
  enable: true
  type: super
  clusterID: 1
```

运行 Dfdaemon:

> 注意 : 在 Client 项目目录下运行 Dfdaemon。

```bash
# 启动 Dfdaemon。
cargo run --bin dfdaemon -- --config /etc/dragonfly/dfdaemon.yaml -l info --verbose
```

#### 验证 Dfdaemon 是否在运行

Dfdaemon 部署完成之后，运行以下命令以检查 **Dfdaemon** 是否正在运行，以及 `4000`，`4001` 和 `4002` 端口是否可用。

```bash
telnet 127.0.0.1 4000
telnet 127.0.0.1 4001
telnet 127.0.0.1 4002
```

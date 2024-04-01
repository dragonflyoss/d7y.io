---
id: binaries
title: 使用二进制文件安装
---

文档的目标是帮助您快速开始使用源码或构建的二进制版本部署 Dragonfly。

## 依赖

<!-- markdownlint-disable -->

| 所需软件   | 版本要求                      | 文档                                                                          |
| -------- | ---------------------------- | ---------------------------------------------------------------------------  |
| Git      | 1.9.1+                       | [git-scm](https://git-scm.com/)                                              |
| Golang   | 1.16.x                       | [go.dev](https://go.dev/)                                                    |
| Database | Mysql 5.6+ 或 PostgreSQL 12+ | [mysql](https://www.mysql.com/) OR [postgresql](https://www.postgresql.org/) |
| Redis    | 3.0+                         | [redis.io](https://redis.io/)                                                |

<!-- markdownlint-restore -->

## 用 Dragonfly 项目安装

### 使用二进制版本安装

每个 Dragonfly [版本](https://github.com/dragonflyoss/Dragonfly2/releases) 都提供了各种操作系统的二进制版本，这些版本可以手动下载和安装。

下载 Dragonfly 的二进制文件：

> 注意: your_version 建议使用最新版本

```bash
VERSION=<your_version>
wget -O dragonfly_linux_amd64.tar.gz https://github.com/dragonflyoss/Dragonfly2/releases/download/v${VERSION}/dragonfly-${VERSION}-linux-amd64.tar.gz
```

 解压压缩包：

```bash
# 替换 `/path/to/dragonfly` 为真实安装目录。
tar -zxf dragonfly_linux_amd64.tar.gz -C /path/to/dragonfly
```

配置环境变量：

```bash
export PATH="/path/to/dragonfly:$PATH"
```

### 使用源码安装

获取 Dragonfly 的源码：

```bash
git clone --recurse-submodules https://github.com/dragonflyoss/Dragonfly2.git
cd Dragonfly2
```

编译源码并安装二进制可执行程序：

```bash
# 同时构建 scheduler，dfget 以及 manager。
make build

# make build 等同于
make build-scheduler && make build-dfget && make build-manager

# 安装二进制文件到 /opt/dragonfly/bin/{manager，scheduler，dfget}
make install-manager
make install-scheduler
make install-dfget
```

配置环境变量：

```bash
export PATH="/opt/dragonfly/bin/:$PATH"
```

## 运行

### Manager

#### 启动 Manager

编辑配置文件 Linux 环境下默认 Manager 配置路径为 `/etc/dragonfly/manager.yaml`，
Darwin 环境下默认 Manager 配置路径为 `$HOME/.dragonfly/config/manager.yaml`，参考文档 [Manager](../../reference/configuration/manager.md)。

在 Manager 配置文件下设置 database.mysql.addrs 和 database.redis.addrs  地址为你的实际地址，配置内容如下：

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

```bash
# 查看 Manager cli 帮助文档。
manager --help

# 启动 Manager。
manager
```

#### 验证 Manager 是否在运行

Manager 部署完成之后，运行以下命令以检查 **Manager** 是否正在运行，以及 `8080` 和 `65003` 端口是否可用。

```bash
telnet 127.0.0.1 8080
telnet 127.0.0.1 65003
```

#### Manager 控制台

可以在 `localhost:8080` 访问控制台，控制台功能预览参考文档 [console preview](../../reference/manage-console.md)。

![manager-console](../../resource/getting-started/installation/manager-console.png)

### Scheduler

#### 启动 Scheduler

编辑配置文件 Linux 环境下默认 Scheduler 配置路径为 `/etc/dragonfly/scheduler.yaml`，
Darwin 环境下默认 Scheduler 配置路径为 `$HOME/.dragonfly/config/scheduler.yaml`，参考文档 [Scheduler](../../reference/configuration/scheduler.md)。

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

```bash
# 查看 Scheduler cli 帮助。
scheduler --help

# 启动 Scheduler。
scheduler
```

#### 验证 Scheduler 是否在运行

Scheduler 部署完成之后，运行以下命令以检查 **Scheduler** 是否正在运行，以及 `8002` 端口是否可用。

```bash
telnet 127.0.0.1 8002
```

### Dfdaemon

#### 启动 Dfdaemon 作为 Seed Peer

编辑配置文件 Linux 环境下默认 Dfdaemon 配置路径为 `/etc/dragonfly/dfget.yaml`，
Darwin 环境下默认 Dfdaemon 配置路径为 `$HOME/.dragonfly/config/dfget.yaml`，参考文档 [Dfdaemon](../../reference/configuration/dfdaemon.md)。

在 Seed Peer 配置文件下设置 scheduler.manager.netAddrs.addr 地址为你的实际地址，配置内容如下：

```yaml
# Seed Peer 配置。
scheduler:
  manager:
    enable: true
    netAddrs:
      - type: tcp
        addr: dragonfly-manager:65003
    refreshInterval: 10m
    seedPeer:
      enable: true
      type: super
      clusterID: 1
```

把 Dfdaemon 当作 Seed Peer 运行:

```bash
# 查看 Dfget cli 帮助。
dfget --help

# 查看 Dfget daemon cli 帮助。
dfget daemon --help

# 启动 Dfget daemon 模式。
dfget daemon
```

#### 验证 Seed Peer 是否在运行

Seed Peer 部署完成之后，运行以下命令以检查 **Seed Peer** 是否正在运行，以及 `65000`，`65001` 和 `65002` 端口是否可用。

```bash
telnet 127.0.0.1 65000
telnet 127.0.0.1 65001
telnet 127.0.0.1 65002
```

#### 启动 Dfdaemon 作为 Peer

编辑配置文件 Linux 环境下默认 Dfdaemon 配置路径为 `/etc/dragonfly/dfget.yaml`，
Darwin 环境下默认 Dfdaemon 配置路径为 `$HOME/.dragonfly/config/dfget.yaml`，参考文档 [Dfdaemon](../../reference/configuration/dfdaemon.md)。

配置文件下设置 scheduler.manager.netAddrs.addr 地址为你的实际地址，配置内容如下：

```yaml
# Peer 配置。
scheduler:
  manager:
    enable: true
    netAddrs:
      - type: tcp
        addr: dragonfly-manager:65003
    refreshInterval: 10m
```

把 Dfdaemon 当作 Peer 运行:

```bash
# 查看 Dfget cli 帮助。
dfget --help

# 查看 Dfget daemon cli 帮助。
dfget daemon --help

# 启动 Dfget daemon 模式。
dfget daemon
```

#### 验证 Peer 是否在运行

Peer 部署完成之后，运行以下命令以检查 **Peer** 是否正在运行，以及 `65000`，`65001` 和 `65002` 端口是否可用。

```bash
telnet 127.0.0.1 65000
telnet 127.0.0.1 65001
telnet 127.0.0.1 65002
```

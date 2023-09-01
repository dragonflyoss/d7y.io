---
id: source
title: 源码安装
---

通过可执行文件分模块进行安装。

## 依赖

| 所需软件 | 版本要求                     |
| -------- | ---------------------------- |
| Git      | 1.9.1+                       |
| Golang   | 1.16.x                       |
| Database | Mysql 5.6+ 或 PostgreSQL 12+ |
| Redis    | 3.0+                         |

## 按模块单独安装

### 下载预编译二进制文件

1. 下载 Dragonfly 项目的压缩包。您可以从[github releases page](https://github.com/dragonflyoss/Dragonfly2/releases) 下载一个已发布的最近稳定版本

   > 注意: v2.x-rc.x 中的 rc 代表候选版本，不建议生产环境部署

   ```bash
   version=2.0.2

   wget -O dragonfly_linux_amd64.tar.gz \
      https://github.com/dragonflyoss/Dragonfly2/releases/download/v${version}/dragonfly-${version}-linux-amd64.tar.gz
   ```

2. 解压压缩包

   ```bash
   # 替换 `/path/to/dragonfly` 为真实安装目录
   tar -zxf dragonfly_linux_amd64.tar.gz -C /path/to/dragonfly
   ```

3. 配置环境变量

   ```bash
   export PATH="/path/to/dragonfly:$PATH"
   ```

### 自行编译

1. 获取 Dragonfly 的源码

   ```bash
   git clone --recurse-submodules https://github.com/dragonflyoss/Dragonfly2.git
   ```

2. 打开项目文件夹

   ```bash
   cd Dragonfly2
   ```

3. 编译源码并安装二进制可执行程序

   ```bash
   # 同时构建 scheduler, dfget 以及 manager
   make build

   # 等同于
   make build-scheduler && make build-dfget && make build-manager

   # 安装二进制文件到 /opt/dragonfly/bin/{manager,scheduler,dfget}
   make install-manager
   make install-scheduler
   make install-dfget
   ```

4. 配置环境变量

   ```bash
   export PATH="/opt/dragonfly/bin/:$PATH"
   ```

## 运行

### Manager

#### 启动 Manager

编辑配置文件 Linux 环境下默认 Manager 配置路径为 `/etc/dragonfly/manager.yaml`, Darwin 环境下默认 Manager 配置路径为 `$HOME/.dragonfly/config/manager.yaml`。
参考文档 [配置 Manager YAML 文件](../../reference/configuration/manager.md)。

```bash
# 下载 manager 配置样例
# 注意检查并修改样例配置文件，比如: database.mysql

# 查看 manager cli 帮助文档
manager --help

# 启动 manager
manager
```

manager 部署完成之后，运行以下命令以检查 **manager** 是否正在运行，以及 `8080` 和 `65003` 端口是否可用。

```bash
telnet 127.0.0.1 8080
telnet 127.0.0.1 65003
```

#### Manager 控制台

可以在 `localhost:8080` 访问控制台。

控制台功能预览参考文档 [console preview](../../reference/manage-console.md)。

### Scheduler

#### 启动 scheduler

编辑配置文件 Linux 环境下默认 Scheduler 配置路径为 `/etc/dragonfly/scheduler.yaml`, Darwin 环境下默认 Scheduler 配置路径为 `$HOME/.dragonfly/config/scheduler.yaml`。
参考文档 [配置 Scheduler YAML 文件](../../reference/configuration/scheduler.md)。

```bash
# 下载 scheduler 配置样例
# 注意检查并修改样例配置文件，比如: job.enable,job.redis,manager.addr ...

# 查看 scheduler cli 帮助
scheduler --help

# 启动 scheduler
scheduler
```

scheduler 部署完成之后，运行以下命令以检查 **scheduler** 是否正在运行，以及 `8002` 端口是否可用。

```bash
telnet 127.0.0.1 8002
```

### Dfdaemon

#### 启动 dfdaemon 作为 seed peer

编辑配置文件 Linux 环境下默认 Dfdaemon 配置路径为 `/etc/dragonfly/dfget.yaml`, Darwin 环境下默认 Dfdaemon 配置路径为 `$HOME/.dragonfly/config/dfget.yaml`。
参考文档 [配置 Dfdaemon YAML 文件](../../reference/configuration/dfdaemon.md)。

启动 Seed Peer 模式的配置如下：

```yaml
# Seed peer 配置文件
scheduler:
  manager:
    enable: true
    netAddrs:
      - type: tcp
        addr: manager-service:65003
    refreshInterval: 10m
    seedPeer:
      enable: true
      type: 'super'
      clusterID: 1
```

把 Dfdaemon 当作 Seed Peer 运行。

```bash
# 下载 dfdaemon 配置样例
# 注意检查并修改样例配置文件，比如: scheduler.manager ...

# 查看 dfget cli 帮助
dfget --help

# 查看 dfget daemon cli 帮助
dfget daemon --help

# 启动 dfget daemon 模式
dfget daemon
```

#### 启动 dfdaemon 作为 Peer

编辑配置文件 Linux 环境下默认 Dfdaemon 配置路径为 `/etc/dragonfly/dfget.yaml`, Darwin 环境下默认 Dfdaemon 配置路径为 `$HOME/.dragonfly/config/dfget.yaml`。
参考文档 [配置 Dfdaemon YAML 文件](../../reference/configuration/dfdaemon.md)。

```bash
# 下载 dfdaemon 配置样例
# 注意检查并修改样例配置文件，比如: scheduler.manager ...

# 查看 dfget cli 帮助
dfget --help

# 查看 dfget daemon cli 帮助
dfget daemon --help

# 启动 dfget daemon 模式
dfget daemon
```

dfget 部署完成之后，运行以下命令以检查 **dfdaemon** 是否正在运行，以及 `65000`, `65001` 和 `65002` 端口是否可用。

```bash
telnet 127.0.0.1 65000
telnet 127.0.0.1 65001
telnet 127.0.0.1 65002
```

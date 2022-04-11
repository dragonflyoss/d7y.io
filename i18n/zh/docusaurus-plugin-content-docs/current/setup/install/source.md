---
id: source
title: 源码安装
---

通过可执行文件分模块进行安装。

## 前提

| 所需软件 | 版本要求 |
| -------- | -------- |
| Git      | 1.9.1+   |
| Golang   | 1.16.x   |
| MySQL    | 5.6+     |
| Redis    | 3.0+     |
| Nginx    | 0.8+     |

## 按模块单独安装

### 下载预编译二进制文件

1. 下载 Dragonfly 项目的压缩包。您可以从[github releases page](https://github.com/dragonflyoss/Dragonfly2/releases) 下载一个已发布的最近稳定版本

   > 注意: v2.x-rc.x 中的 rc 代表候选版本，不建议生产环境部署

   ```bash
   version=2.0.2

   wget -O Dragonfly2_linux_amd64.tar.gz \
      https://github.com/dragonflyoss/Dragonfly2/releases/download/v${version}/Dragonfly2-${version}-linux-amd64.tar.gz
   ```

2. 解压压缩包

   ```bash
   # 替换 `/path/to/dragonfly` 为真实安装目录
   tar -zxf Dragonfly2_linux_amd64.tar.gz -C /path/to/dragonfly
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
   # 同时构建 cdn scheduler dfget manager
   make build

   # 等同于
   make build-cdn && make build-scheduler && make build-dfget && make build-manager

   # 构建 manager-console UI (可选)
   make build-manager-console

   # 安装二进制文件到 /opt/dragonfly/bin/{manager,cdn,scheduler,dfget}
   make install-manager
   make install-cdn
   make install-scheduler
   make install-dfget

   # 复制 ./manager/console/build/dist 到 指定目录 e.g. /opt/dragonfly/dist (可选)
   cp -R ./manager/console/dist /opt/dragonfly/
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
# 注意检查并修改样例配置文件，比如: database.mysql,server.rest.publicPath ...

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

### CDN

#### 启动 cdn

编辑配置文件 Linux 环境下默认 CDN 配置路径为 `/etc/dragonfly/cdn.yaml`, Darwin 环境下默认 CDN 配置路径为 `$HOME/.dragonfly/config/cdn.yaml`。
参考文档 [配置 CDN YAML 文件](../../reference/configuration/cdn.md)。

```bash
# 下载 cdn 配置样例
# 注意检查并修改样例配置文件，比如: base.manager ...

# 查看 cdn cli 帮助
cdn --help

# 启动 cdn
cdn
```

#### 启动 file server

您可以在满足以下条件的基础上用任何方式启动 file server：

- 必须挂载在 `/etc/dragonfly/cdn.yaml` 的 `plugins.storagedriver[]name: disk.config.baseDir` 目录上。
- 必须监听 `/etc/dragonfly/cdn.yaml` 中已经定义的 `base.downloadPort` 端口。

以 nginx 为例：

1. 将下面的配置添加到 Nginx 配置文件中

   ```conf
   server {
     # 必须是 `/etc/dragonfly/cdn.yaml` 中的 ${base.downloadPort}
     listen 8001;
     location / {
        # 必须是 `/etc/dragonfly/cdn.yaml` 中的 ${plugins.storagedriver[]name: disk.config.baseDir}
        root /Users/${USER_HOME}/ftp;
     }
   }
   ```

2. 启动 Nginx.

   ```bash
   sudo nginx
   ```

   CDN 部署完成之后，运行以下命令以检查 Nginx 和 **cdn** 是否正在运行，以及 `8001` 和 `8003` 端口是否可用。

   ```bash
   telnet 127.0.0.1 8001
   telnet 127.0.0.1 8003
   ```

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

### Dfget/Dfdaemon

### 启动 dfdaemon

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

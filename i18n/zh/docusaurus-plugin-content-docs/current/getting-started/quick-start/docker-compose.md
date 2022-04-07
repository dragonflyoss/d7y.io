---
id: docker-compose
title: Docker Compose
description: 文档的目标是帮助您快速开始使用 Dragonfly
slug: /getting-started/quick-start/docker-compose/
---

为了方便您快速搭建起 Dragonfly 环境，本文以 [Docker-Compose](https://docs.docker.com/compose/) 为例进行讲解，
如果需要 kubernetes 相关内容，可以参考 [快速开始: Helm Charts](../../setup/install/helm-charts.md)

如需在生产环境使用 Dragonfly 完成生产级别的镜像与文件分发，请参考 supernode 和 dfget 的详细生产级别配置参数，如果是 kubernetes , 可以使用
<https://github.com/dragonflyoss/helm-charts> 项目。

## 前提条件

本文档所有操作步骤均使用 docker 容器在同一台机器上完成，所以请确保您的机器上已经安装并启动 docker 容器引擎及安装docker-compose。

## 步骤 1：下载并运行Dragonfly docker-compose

> 国内用户可以考虑使用 [gitee 镜像库](https://gitee.com/mirrors/Dragonfly2) 加速下载
> 如果是 Mac OS 可能会报错, 参考 [sed command with -i option failing on Mac, but works on Linux](https://stackoverflow.com/a/41416710)

```bash
git clone https://github.com/dragonflyoss/Dragonfly2.git
cd ./Dragonfly2/deploy/docker-compose/

export IP=<host ip>
./run.sh
```

## 步骤 2: 修改 Docker Daemon 配置

我们需要修改 Docker Daemon 配置，通过 mirror 方式来使用 Dragonfly 进行镜像的拉取。

在配置文件 `/etc/docker/daemon.json` 中添加或更新如下配置项：

```bash
{
  "registry-mirrors": ["http://127.0.0.1:65001"]
}
```

重启 Docker Daemon

```bash
systemctl restart docker
```

> **提示**：
>
> 注意该操作会影响该主机正在运行的容器
>
> 如需进一步了解 `/etc/docker/daemon.json`，请参考 [Docker 文档](https://docs.docker.com/registry/recipes/mirror/#configure-the-cache)。

## 步骤 3：拉取镜像

通过以上步骤我们即完成了 Dragonfly 服务端与客户端的部署，并且设置了 Docker Daemon 通过 Dragonfly 来拉取官方镜像。

您可以如平时一样来拉取镜像，例如：

```bash
docker pull nginx:latest
```

## 步骤 4：验证

您可以通过执行以下命令，检验 nginx 镜像是否通过 Dragonfly 来传输完成。

```bash
docker exec dfdaemon grep "peer task done" /var/log/dragonfly/daemon/core.log
```

如果以上命令有诸如

```json
{"level":"info","ts":"2022-02-23 06:06:21.506","caller":"peer/peertask_conductor.go:1167","msg":"peer task done, cost: 16052ms","peer":"172.17.189.172-1-249fa302-f107-444d-b03e-103f54b2fa4f","task":"708fff474e9885df7a9efa95b607618478912367f70a1aeb2753cfb00dfb28f7","component":"PeerTask"}
```

格式化后类似

```json
{
    "level": "info",
    "ts": "2022-02-23 06:06:21.506",
    "caller": "peer/peertask_conductor.go:1167",
    "msg": "peer task done, cost: 16052ms",
    "peer": "172.17.189.172-1-249fa302-f107-444d-b03e-103f54b2fa4f",
    "task": "708fff474e9885df7a9efa95b607618478912367f70a1aeb2753cfb00dfb28f7",
    "component": "PeerTask"
}
```

则说明镜像下载通过 Dragonfly 来完成了。

## 步骤 5: Manager 控制台

通过浏览器打开 `http://ip:8080/`

账号为 `root`, 密码为 `dragonfly`

> 提示：用于生成环境请记得修改用户名和密码

更多信息参考 [Manager Console 文档](../../reference/manage-console.md)

## 步骤 6: 预热

为了使用 Dragonfly 的最佳体验, 你可以通过 [预热](../../reference/preheat.md) 提前下拉镜像。

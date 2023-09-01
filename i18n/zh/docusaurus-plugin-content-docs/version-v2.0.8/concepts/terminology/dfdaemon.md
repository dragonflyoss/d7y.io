---
id: dfdaemon
title: Dfdaemon
---

Dfdaemon 是 P2P 网络中的传输节点。使用 `dfget` 命令启动，或者使用 `dfget daemon` 命令来运行守护进程。

## 功能

- 基于 GRPC 提供下载功能, 并提供多源适配能力。
- 开启 Seed Peer 模式可以作为 P2P 集群中回源下载节点, 也就是整个集群中下载的根节点。
- 为镜像仓库或者其他 HTTP 下载任务提供代理服务。
- 下载任务基于 `HTTP` 或 `HTTPS` 或其他自定义协议。

## 关系模型

- Dfdaemon 注册到 Manager 以获取 Scheduler 信息。
- Dfdaemon 注册 P2P 任务到 Scheduler。
- Dfdaemon 上传数据提供给其他 Dfdaemon 进行下载。

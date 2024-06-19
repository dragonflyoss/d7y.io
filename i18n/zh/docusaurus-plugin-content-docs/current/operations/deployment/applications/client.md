---
id: client
title: Client
slug: /operations/deployment/applications/client/
---

Client 是 P2P 网络中的传输节点。使用 `dfdaemon` 命令启动，或者使用 `dfget` 命令来下载和上传文件。

## 功能

- 基于 GRPC 提供下载功能, 并提供多源适配能力。
- 开启 Seed Peer 模式可以作为 P2P 集群中回源下载节点, 也就是整个集群中下载的根节点。
- 为镜像仓库或者其他 HTTP 下载任务提供代理服务。
- 下载任务基于 `HTTP` 或 `HTTPS` 或其他自定义协议。
- 设置磁盘使用率，自动 GC 能力。
- 可自行调节下载任务的 Piece 大小。
- 支持 RDMA 提高系统吞吐量、降低系统的网络通信延迟。可以更好的支持 AI 推理场景将模型从远端加载到内存。
- 支持文件写入和做种，可以不依赖其他存储持久化，提高集群内文件读写性能。帮助 AI 场景模型和数据集更快速读写。

## 关系模型

- Client 注册到 Manager 以获取 Scheduler 信息。
- Client 注册 P2P 任务到 Scheduler。
- Client 上传数据提供给其他 Client 进行下载。

---
id: Roadmap
title: Roadmap
---

## v2.0

Manager:

- Console
  - 项目整体重构。
  - 优化页面 UI, 整体页面视觉改版。
  - 统一权限管理。
  - 项目增加 lint、test 等 Actions。
  - 增加开发文档。
  - 增加动态配置表单。
  - 增加 P2P 数据可视化。
  - 提供初始化用户安装页面
- 优化匹配 scheduler 集群规则。
- 增加应用级别安全限制和动态配置。
- 增加 Open API 接口鉴权。
- 无 Seed Peer 场景下，预热功能实现。

Scheduler:

- 提高调度的稳定性以及效率，并收集可用数据。
- 实现基于机器学习的多场景自适应智能 P2P 节点调度算法及优化。
- 优化当前基于负载进行的调度策略，改为基于 Peer 带宽进行调度。
- 针对 Piece 下载优先级特征值进行调度。

Client:

- 支持 Seed Peer 功能。
- 提升任务下载效率以及稳定性。
- 使用 GRPC 双向流传递 Peer 间 Piece 信息。
- 支持下载 Piece 优先级。

Document:

- 重构 d7y.io 官网，并完成 Dragonfly 2.0 项目文档。

Others:

- perf-tests 仓库中提供压测解决方案。
- 升级 Golang 1.18 版本，基于泛型重构已有代码。

## v2.1

Manager:

- Console [v1.0.0](https://github.com/dragonflyoss/console/tree/release-1.0.0) 已经发布，它是一个全新的可视化控制台方便用户操作 P2P 集群。
- 提供控制 Scheduler 可以提供的服务，例如在 Manager 中设置 Scheduler 不提供预热功能，那么 Scheduler 实例就会拒绝预热请求。
- 新增 Personal Access Tokens 功能，用户可以创建自己的 Personal Access Tokens 在调用 Open API 的时候鉴权使用。
- 新增 Cluster 资源单位，Cluster 代表一个 P2P 集群，其只包含一个 Scheduler Cluster 和一个 Seed Peer Cluster，并且二者关联。
- Manager REST 服务提供 TLS 配置。
- Manager 中 Scheduler、Seed Peer 等资源删除过程中，不再使用软删除。
- Scheduler 数据库表中新增 uk_scheduler 索引，Seed Peer 数据库表中新增 uk_seed_peer 索引。
- 由于初期功能设计定位不清晰的原因，删除 Security Domain 和 Security 的功能。
- 新增 Advertise Port 配置，方便用户配置不同的 Advertise Port。

Scheduler:

- 新增虚拟网络拓扑探索功能，能够在 P2P 运行时探测节点之间的网络延迟，从而构建一个虚拟网络拓扑结构提供调度使用。
- Scheduler 新增 Database 配置，并且把之前 Redis 的配置信息移入到 Database 配置中，并且兼容老版本。
- 修复调度器过滤以及评估过程中 candidateParentLimit 可能影响到调度结果的问题。
- 修复 Scheduler 中的 Storage 在 bufferSize 为 0 的时候，导致的无法写入下载记录的问题。
- 新增 Advertise Port 配置，方便用户配置不同的 Advertise Port。
- 修复 Task 注册阶段状态机状态变更错误的问题。

Client:

- Dfstore 提供 GetObjectMetadatas and CopyObject 接口，支持 Dragonfly 作为 JuiceFS 的后端存储。
- 修复当 Dfdaemon 没有可用的 Scheduler 地址时启动失败的现象。
- 修复 Dfstore 在 Dfdaemon 并发下载时，可能导致的对象存储下载失败。
- 在 Dfdaemon 中使用 GRPC 健康检查代替 net.Dial。

Others:

- 完成 Trail of Bits 的安全审计，报告可以参考[文档](https://github.com/dragonflyoss/Dragonfly2/blob/main/docs/security/dragonfly-comprehensive-report-2023.pdf)。
- 日志中隐藏敏感信息，例如 Header 中的一些 Token 信息等。

## v2.2

Manager:

- 可动态配置 Client 功能，例如可以让 Client 停止上传功能。
- 可动态配置 Scheduler 的调度计算权重。
- 增加缓存清理功能，清理特定任务的所有 Cache。
- P2P 流量走势可视化。
- 展示 Client 节点信息，例如 CPU、内存等。

Scheduler:

- 实现基于 V2 版本协议的调度功能。
- 提供元信息存储功能，方便通过 Client 向集群内写入文件和做种。
- 优化调度，提升 P2P 网络种节点带宽利用率。

Client:

- 使用 Rust 重写，减少 CPU 负载和 Memory 占用。
- 支持 RDMA 提高系统吞吐量、降低系统的网络通信延迟。可以更好的支持 AI 推理场景将模型从远端加载到内存。
- 支持文件写入和做种，可以不依赖其他存储持久化，提高集群内文件读写性能。帮助 AI 场景模型和数据集更快速读写。

Others:

- 定义 V2 版本的 P2P 传输协议。

Document:

- 重构文档内容，提升用户体验。
- 优化首页的 UI。

AI Infrastructure:

- 支持 Triton Inference Server 加速模型分发，参考文档 [Triton Inference Server](https://github.com/dragonflyoss/dragonfly-repository-agent)。
- 支持 TorchServer 加速模型分发，参考文档 [TorchServe](https://d7y.io/docs/next/setup/integration/torchserve)。
- 支持 HuggingFace 加速模型和数据集分发，参考文档 [Hugging Face](https://d7y.io/docs/next/setup/integration/hugging-face)。
- 支持 Git LFS 加速文件分发，参考文档 [Git LFS](https://d7y.io/docs/next/setup/integration/git-lfs)。
- 支持 JuiceFS 加速文件分发，Dragonfly 作为 JuiceFS 和对象存储中间 Cache 层。
- 支持 Fluid 加速分发模型。
- 支持更多 AI 基础设施高效分发模型以及数据集，与 AI 生态融合。

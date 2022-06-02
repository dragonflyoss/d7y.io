---
id: manager
title: Manager
---

Manager 在多 P2P 集群部署的时候扮演管理者的角色。主要提供动态配置管理以及数据收集等功能。

## 功能

- 存储动态配置供 Seed Peer 集群、Scheduler 集群以及 Dfdaemon 消费。
- 维护 Seed Peer 集群和 Scheduler 集群之间关联关系。
- 提供统一异步任务管理，用作预热等功能。
- 监听各模块是否健康运行。
- 为 Dfdaemon 筛选最优 Scheduler 集群调度使用。
- 提供可视化控制台，方便用户操作管理 P2P 集群。

## 关系模型

- Seed Peer 集群与 Scheduler 集群为一对多关系
- Seed Peer 集群与 Seed Peer 实例是一对多关系
- Scheduler 集群与 Scheduler 实例是一对多关系

## 管理多个 P2P 网络

Manager 可以管理多个 P2P 网络。通常一个 P2P 网络由一个 Scheduler 集群、一个 Seed Peer 集群和若干个 Dfdaemon 组成。
一个 P2P 网络中的服务网络必须是互通的。

![manage-multiple-p2p-networks](../../resource/architecture/manage-multiple-p2p-networks.png)

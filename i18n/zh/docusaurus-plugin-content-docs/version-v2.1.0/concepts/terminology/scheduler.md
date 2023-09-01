---
id: scheduler
title: Scheduler
---

Scheduler 主要工作就是为当前下载节点寻找最优父节点并触发 Seed Peer 进行回源下载。
在适当时候让 Dfdaemon 进行回源下载。

## 功能

- 基于机器学习的多场景自适应智能 P2P 节点调度, 为当前下载节点选择最优父节点。
- 构建 P2P 下载网络的有向无环图。
- 根据不同特征值评估节点下载能力, 剔除异常节点。
- 当下载失败情况，主动通知 Dfdaemon 进行回源下载。

## 调度功能

Scheduler 主要维护三种数据资源 task, peer 和 host。

- Peer: Dfdaemon 的一次下载任务
- Host: Dfdaemon 的主机信息，Host 和 Peer 是一对多关系
- Task: 一次下载任务, Task 和 Peer 是一对多关系

整体调度过程相当于针对节点负载数组建 P2P 网络的有向无环图。

![scheduler-dag](../../resource/architecture/scheduler-dag.png)

## Peer 状态机

Scheduler 将下载任务分为三种类型: `Tiny`, `Small` 和 `Normal`

- Tiny: 小于 128 字节的下载任务
- Small: 只有一个 piece 的下载任务
- Normal: 大于一个 piece 的下载任务

Scheduler 针对不同类型下载任务提供不同的调度策略，下图是 Peer 调度过程中状态转换:

![scheduler-state-machine](../../resource/architecture/scheduler-state-machine.jpg)

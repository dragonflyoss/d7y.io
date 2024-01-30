---
id: introduction
title: Introduction
description: Dragonfly 是一款基于 P2P 技术的文件分发和镜像加速系统，它旨在提高大规模文件传输的效率，最大限度地利用网络带宽。在镜像分发、文件分发、日志分发、AI 模型分发以及 AI 数据集分发等领域被大规模使用。
slug: /
---

## 介绍

Dragonfly 是一款基于 P2P 技术的文件分发和镜像加速系统，它旨在提高大规模文件传输的效率，最大限度地利用网络带宽。在镜像分发、文件分发、日志分发、AI 模型分发以及 AI 数据集分发等领域被大规模使用。

## 特征

Dragonfly 提供的基础能力包括：

- **基于 P2P 的文件分发**：通过利用 P2P 技术进行文件传输，它能最大限度地利用每个对等节点（Peer）的带宽资源。提高下载效率，并节省大量跨机房带宽，尤其是昂贵的跨境带宽。
- **非侵入式**：Dragonfly 可非侵入式支持多种容器用于镜像分发。
- **主机级别的限速**：除了像许多其他下载工具针对当前下载任务的限速之外，Dragonfly 还支持针对整个机器的限速。
- **高度一致性**：Dragonfly 可确保所有下载的文件是一致的，即使用户不进行最终一致性校验。
- **隔离异常节点**：Dragonfly 会自动隔离异常节点来提高下载稳定性。
- **生态**：Harbor 可以基于 Dragonfly 进行镜像分发以及预热。 镜像加速项目 Nydus 可以在容器运行时使用 Dragonfly 进行数据分发。

## 历史

自 17 年开源以来，Dragonfly 被许多大规模互联网公司选用并投入生产使用，并在 18 年 10 月正式进入 CNCF，成为中国第三个进入 CNCF 沙箱级别的项目。2020 年 4 月，CNCF 技术监督委员会（TOC）投票决定接受
Dragonfly 作为孵化级别的托管项目。Dragonfly2 基于 [Dragonfly1.x](https://github.com/dragonflyoss/Dragonfly) 演进而来，在保持 Dragonfly1.x 原有核心能力的基础上，Dragonfly 在系统架构设计、产品能力、使用场景等几大方向上进行了全面升级。

![milestone](./resource/getting-started/milestone.jpg)

## 组成

Dragonfly 架构主要分为三部分 Manager、Scheduler、Seed Peer 以及 Peer 各司其职组成 P2P 下载网络, Dfdaemon 可以作为 Seed Peer 和 Peer。
详细内容可以参考[架构文档](../concepts/terminology/architecture.md), 下面是各模块功能:

- **Manager**： Manager 在多 P2P 集群部署的时候扮演管理者的角色。主要提供动态配置管理以及数据收集等功能。也包含了前端控制台，方便用户进行可视化操作集群。
- **Scheduler**： 为当前下载节点寻找最优父节点并触发 Seed Peer 进行回源下载。在适当时候让 Peer 进行回源下载。
- **Seed Peer**： 提供主动触发回源能力，可以作为 P2P 节点中的根节点。
- **Peer**： 通过 Dfdaemon 部署，基于 C/S 架构提供 `dfget` 命令行下载工具，以及 `dfget daemon` 运行守护进程，提供任务下载能力。

## 架构

![sequence-diagram](./resource/getting-started/sequence-diagram.png)

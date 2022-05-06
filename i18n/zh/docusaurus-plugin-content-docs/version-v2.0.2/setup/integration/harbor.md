---
id: harbor
title: Harbor
---

本文档将帮助您将 Dragonfly 与 Harbor 一起使用。

## Harbor 地址作为 P2P 源镜像仓库

首先基于 Mirror 模式将 Harbor 地址作为 Dragonfly 的源仓库地址, 参考文档 [runtime-containerd-mirror](../runtime/containerd/mirror.md)。

## 预热功能集成

Dragonfly 2.0 兼容 Dragonfly 1.0 集成 Harbor 预热接口。

具体对接 Harbor 预热文档参考 [manager-preheat-providers](https://goharbor.io/docs/2.3.0/administration/p2p-preheat/manage-preheat-providers/)。

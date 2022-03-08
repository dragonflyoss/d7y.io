---
id: manager
title: Manager
---

Manager 控制台方便用户控制集群各模块服务，并且提供动态配置以及数据收集等功能。

## 关系模型

- CDN 集群与 Scheduler 集群为一对多关系
- CDN 集群与 CDN 实例是一对多关系
- Scheduler 集群与 Scheduler 实例是一对多关系

![manager-relationship](../../resource/manager-console/relationship.jpg)

Scheduler 实例信息通过，配置文件启动实例上报指定 Scheduler 集群 ID。

CDN 实例信息通过，配置文件启动实例上报指定 CDN 集群 ID。

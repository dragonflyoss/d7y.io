---
id: manage-console
title: Manage Console
---

Manager 控制台方便用户控制集群各模块服务，并且提供动态配置以及数据收集等功能。

## 关系模型

![manager-relationship](../resource/manager-console/relationship.jpg)

- CDN 集群与 Scheduler 集群为一对多关系
- CDN 集群与 CDN 实例是一对多关系
- Scheduler 集群与 Scheduler 实例是一对多关系

Scheduler 实例信息通过，配置文件启动实例上报指定 Scheduler 集群 ID。
参考[文档配置](https://github.com/dragonflyoss/Dragonfly2/blob/main/docs/en/deployment/configuration/scheduler.yaml) `schedulerClusterID`。

CDN 实例信息通过，配置文件启动实例上报指定 CDN 集群 ID。
参考[文档配置](https://github.com/dragonflyoss/Dragonfly2/blob/main/docs/en/deployment/configuration/cdn.yaml) `cdnClusterID`。

## 用户账号

服务启动后会默认生成 Root 用户, 账号为 `root`, 密码为 `dragonfly`。

## 功能页面

### 用户

#### 登陆

![signin](../resource/manager-console/signin.jpg)

#### 注册

![signup](../resource/manager-console/signup.jpg)

### 配置管理

#### Scheduler 集群

##### Scheduler 集群列表

![scheduler-cluster](../resource/manager-console/scheduler-cluster.jpg)

##### 添加 Scheduler 集群

![add-scheduler-cluster](../resource/manager-console/add-scheduler-cluster.jpg)

##### 配置 Scheduler 集群

![add-scheduler-cluster](../resource/manager-console/add-scheduler-cluster.jpg)

##### 配置 Scheduler 集群覆盖的客户端

![configure-scheduler-cluster-client](../resource/manager-console/configure-scheduler-cluster-client.jpg)

- `load_limit`: 客户端可以提供的最大下载任务负载数。

#### CDN 集群

##### CDN 集群列表

![cdn-cluster](../resource/manager-console/cdn-cluster.jpg)

##### 添加 CDN 集群

![add-cdn-cluster](../resource/manager-console/add-cdn-cluster.jpg)

##### 配置 CDN 集群

![configure-cdn-cluster](../resource/manager-console/configure-cdn-cluster.jpg)

- `load_limit`: CDN 可以提供的最大下载任务负载数。

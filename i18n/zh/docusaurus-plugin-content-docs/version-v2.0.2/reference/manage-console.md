---
id: manage-console
title: Manage 控制台
---

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

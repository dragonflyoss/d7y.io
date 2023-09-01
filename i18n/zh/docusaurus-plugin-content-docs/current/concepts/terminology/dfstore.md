---
id: dfstore
title: Dfstore
---

`dfstore` 是 dragonfly 存储客户端. 其可以依赖不同类型的对象存储服务作为 Backend，提供稳定的存储方案，现在支持 `S3` 和 `OSS`。

`dfstore` 依赖 Backend 对象存储服务结合 P2P 本身的加速特点。
可做到快写快读，并且能够节省回源以及跨机房流量，减少源站压力。

## 功能 {#features}

- 提供对象存储服务。
- 提供 `AsyncWriteBack`、`WriteBack` 两种写入 Backend 方式。
- Backend 适配 `S3` 以及 `OSS`。
- 可在 P2P 集群内复制多份副本，副本数量可控。

## 架构 {#architecture}

### Put Object {#put-object}

上传对象至 dragonfly 对象存储服务。

![dfstore-put-object](../../resource/concepts/dfstore-put-object.png)

#### Put Object 使用 AsyncWriteBack 模式 {#put-object-async}

Dfstore 会将 Object 同步写入 Peer，异步写入 Backend，异步写入 Seed Peer。

![dfstore-put-object-async](../../resource/concepts/dfstore-put-object-async.jpg)

#### Put Object 使用 WriteBack 模式 {#put-object-sync}

Dfstore 会将 Object 同步写入 Peer，同步写入 Backend，异步写入 Seed Peer。

![dfstore-put-object-sync](../../resource/concepts/dfstore-put-object-sync.jpg)

### Get Object {#get-object}

下载对象从 dragonfly 对象存储服务。

![dfstore-get-object](../../resource/concepts/dfstore-get-object.png)

#### 命中 Peer 缓存 {#get-object-hit-peer}

Dfstore 下载对象命中 Peer 缓存。

![dfstore-get-object-hit-peer](../../resource/concepts/dfstore-get-object-hit-peer.jpg)

#### 命中其他 Peers(包括 Seed Peer) 缓存 {#get-object-hit-other-peers}

Dfstore 下载对象命中其他 Peers 缓存。这里的其他 Peers 包括 Seed Peer。

![dfstore-get-object-hit-other-peer](../../resource/concepts/dfstore-get-object-hit-other-peer.jpg)

#### 命中 Backend {#get-object-hit-backend}

Dfstore 下载对象从 Backend。

![dfstore-get-object-hit-backend](../../resource/concepts/dfstore-get-object-hit-backend.jpg)

## 协议

Dragonfly 对象存储协议名称为 `dfs`，URL 定义为 `dfs://${bucketName}/${objectKey}`。

- bucketName: Backend 三方对象存储的 bucket 名字。
- objectKey: 对象存储的名字即路径。

**示例:**

假如 Backend 为 S3，上传对象为 `dfs://dragonfly/bar/foo/baz.jpg` 时。则为在 S3 的 dragonfly 桶中上传图片 `/bar/foo/baz.jpg`。

## 使用

### 步骤 1: 创建 Backend 对象存储服务

创建 Backend 三方对象存储服务、对应的桶以及相关联的 `AccessKey` 和 `AccessSecretKey`。
现在 Backend 支持 AWS 的 S3 和 Aliyun 的 OSS。

如何创建三方对象存储服务参考文档: [AWS S3](https://docs.aws.amazon.com/s3/index.html) 和 [Aliyun OSS](https://www.alibabacloud.com/help/en/object-storage-service)。

### 步骤 2: 配置三方对象存储服务信息到 Manager 服务

在 Manager 服务的配置中开启对象存储服务并填入对应信息。

```yaml
objectStorage:
  # Enable object storage
  enable: true
  # Object storage name of type, it can be s3 or oss
  name: s3
  # Storage region
  region: 'us-east-2'
  # Datacenter endpoint
  endpoint: 's3.us-east-2.amazonaws.com'
  # Access key ID
  accessKey: ''
  # Access key secret
  secretKey: ''
```

### 步骤 3: Peer 开启对象存储服务

在 Dfdameon 的配置中开启 Peer 的对象存储服务和动态拉取 Manager 服务。

```yaml
manager:
  # Get scheduler list dynamically from manager
  enable: true
  # Manager service address
  netAddrs:
    - type: tcp
      addr: manager-service:65003
  # Scheduler list refresh interval
  refreshInterval: 10m
objectStorage:
  # Enable object storage service
  enable: true
  # Filter is used to generate a unique Task ID by
  # filtering unnecessary query params in the URL,
  # it is separated by & character.
  # When filter: "Expires&Signature&ns", for example:
  #  http://localhost/xyz?Expires=111&Signature=222&ns=docker.io and http://localhost/xyz?Expires=333&Signature=999&ns=docker.io
  # is same task
  filter: 'Expires&Signature&ns'
  # MaxReplicas is the maximum number of replicas of an object cache in seed peers.
  maxReplicas: 3
  # Object storage service security option
  security:
    insecure: true
    tlsVerify: true
  tcpListen:
    # Listen address
    listen: 0.0.0.0
    # Listen port
    port: 65004
```

### 步骤 4: 安装 Dragonfly 系统

安装 Dragonfly 系统参考文档 [install dragonfly](../../setup/install/helm-charts.md)。[]

### 步骤 5: 安装 dfstore 命令行工具

安装最新版本 `dfstore` 命令行工具，可以参照链接 [github releases page](https://github.com/dragonflyoss/Dragonfly2/releases) 安装指定版本 `dfstore`。

```shell
go install d7y.io/dragonfly/v2/cmd/dfstore@latest
```

`dfstore` 需要和 Peer 在同一台机器上面，因为 `dfstore` 默认调用本地 Peer 的 `127.0.0.1:65004` 地址进行上传和下载对象。
如果 `dfstore` 和 Peer 不在同一台机器上，那么可以通过命令行参数 `--endpoint` 来配置 Peer 的对象存储服务地址。
具体命令行参数参考文档 [dfstore-cli](../../reference/cli/dfstore.md)。

### 步骤 6: 上传对象文件到 Dragonfly 对象存储服务

上传 `baz.jpg` 图片到 S3 或 OSS 的 `dragonfly` 桶中的路径 `/bar/foo/baz.jpg`。

```shell
dfstore cp ./baz.jpg dfs://dragonfly/bar/foo/baz.jpg
```

### 步骤 7: 下载对象文件从 Dragonfly 对象存储服务

下载 `baz.jpg` 图片从 S3 或 OSS 的 `dragonfly` 桶中的路径 `/bar/foo/baz.jpg`。

```shell
dfstore cp dfs://dragonfly/bar/foo/baz.jpg ./baz.jpg
```

### 步骤 8: 删除对象文件从 Dragonfly 对象存储服务

删除 S3 或 OSS 的 `dragonfly` 桶中的 `/bar/foo/baz.jpg` 图片。

```shell
dfstore rm dfs://dragonfly/bar/foo/baz.jpg
```

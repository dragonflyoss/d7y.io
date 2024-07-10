---
id: deployment-best-practices
title: 部署
slug: /operations/best-practices/deployment-best-practices/
---

本文档概述了我们计划如何为 Dragonfly 设置容量规划和性能优化.

## 容量规划

规划容量时需要考虑的一个重要因素是：最高预期存储容量。并且你需要对目前所拥有的机器的内存大小、CPU核心数、磁盘容量有清晰的了解。

如果您没有明确的容量规划，可以使用下面的估算值来预测您的容量。

### Manager

部署 Manager 我们会根据 Peer 数量来估算所使用的资源量。

> 应运行至少 3 个副本。

<!-- markdownlint-disable -->

| Total Number of Peer | CPU core | Memory | Disk  |
| -------------------- | -------- | ------ | ----- |
| 1K                   | 8C       | 16G    | 200Gi |
| 5K                   | 16C      | 32G    | 200Gi |
| 10K                  | 16C      | 64G    | 200Gi |

<!-- markdownlint-restore -->

### Scheduler

部署 Scheduler 我们会根据下载请求(秒)来估算所使用的资源量。

> 应运行至少 3 个副本。

<!-- markdownlint-disable -->

| Download request(sec) | CPU core | Memory | Disk  |
| --------------------- | -------- | ------ | ----- |
| 1K                    | 8C       | 16G    | 200Gi |
| 3K                    | 16C      | 32G    | 200Gi |
| 5K                    | 32C      | 64G    | 200Gi |

<!-- markdownlint-restore -->

### Client

部署 Client 我们会根据下载请求(秒)来估算所使用的资源量。

> 如果是 Seed Peer 应运行至少 3 个副本。Disk 大小根据 Cache 不同的文件/镜像总大小，用户根据需求计算。

<!-- markdownlint-disable -->

| Download request(sec) | CPU core | Memory | Disk  |
| --------------------- | -------- | ------ | ----- |
| 500                   | 8C       | 16G    | 500Gi |
| 1K                    | 8C       | 16G    | 3Ti   |
| 3K                    | 16C      | 32G    | 5Ti   |
| 5K                    | 32C      | 64G    | 10Ti  |

<!-- markdownlint-restore -->

### Cluster

以下数据是 Cluster 中每个组件所使用的资源。它们基于我们平常使用的经验所得。

<!-- markdownlint-disable -->

| Total Number of Peer | Manager            | Scheduler          | Seed Peer         | Peer        |
| -------------------- | ------------------ | ------------------ | ----------------- | ----------- |
| 500                  | 4C-8G-200Gi \* 3   | 8C-16G-200Gi \* 3  | 8C-16G-1Ti \* 3   | 4C-8G-500Gi |
| 1K                   | 8C-16G-200Gi \* 3  | 8C-16G-200Gi \* 3  | 8C-16G-3Ti \* 3   | 4C-8G-500Gi |
| 3K                   | 16C-32G-200Gi \* 3 | 16C-32G-200Gi \* 3 | 16C-32G-5Ti \* 3  | 4C-8G-500Gi |
| 5K                   | 16C-64G-200Gi \* 3 | 32C-64G-200Gi \* 3 | 32C-64G-10Ti \* 3 | 4C-8G-500Gi |

<!-- markdownlint-restore -->

## 性能调优

以下文档会帮助您获得更好的性能，特别是对于大规模运行。

### 限速率

#### 上行带宽限速

主要作用节点 P2P 分享 Piece 的带宽。当你的峰值带宽大于你的默认上行带宽，你可以设置 `rateLimit` 为合适的值提升上传速度，在不影响其他服务情况下，建议配置和机器上行带宽相同，详情参考 [dfdaemon.yaml](../../reference/configuration/client/dfdaemon.md)。

```yaml
upload:
  server:
    # grpc 服务器的端口。
    port: 4000
    ## GRPC 服务器的监听 ip。
    # ip: ""
    # 上传速度的默认速率限制，单位为 bps（字节每秒），默认为 20Gbps。
  rateLimit: 20000000000
```

#### 下行带宽限速

主要作用节点回源的带宽和从 Remote Peer 下载的带宽。当你的峰值带宽大于你的默认上行带宽，你可以设置 `rateLimit` 为合适的值提升下载速度，在不影响其他服务情况下，建议配置和机器下行带宽相同，详情参考 [dfdaemon.yaml](../../reference/configuration/client/dfdaemon.md)。

```yaml
download:
  server:
    # socketPath 是 dfdaemon GRPC 服务的 unix 套接字路径。
    socketPath: /var/run/dragonfly/dfdaemon.sock
  # 下载速度的默认速率限制，单位为 bps（字节每秒），默认为 20Gbps。
  rateLimit: 20000000000
```

### Piece 下载并发数

主要作用节点单个任务下载时，回源下载的 Piece 并发数和从 Remote Peer 下载的 Piece 并发数。默认并发数为 10，可根据机器配置调整。
Piece 并发数越大，任务下载越快，但是消耗 CPU 以及 Memory 会更多。用户根据实际情况在调整 Piece 并发数的同时，
调整 Client 的 CPU 以及 Memory 配置，详情参考 [dfdaemon.yaml](../../reference/configuration/client/dfdaemon.md)。

```yaml
download:
  # 从源下载 piece 的超时时间。
  pieceTimeout: 30s
  # 下载 piece 的并发数量。
  concurrentPieceCount: 10
```

### 强制 GC

主要作用节点磁盘中的任务 GC，当内存资源不足时我们可以调整 interval，interval 越小内存释放的越快，taskTTL 根据任务需要缓存时间用户自行评估。
`distHighThresholdPercent` 和 `distLowThresholdPercent` 建议使用默认值，详情参考 [dfdaemon.yaml](../../reference/configuration/client/dfdaemon.md)。

```yaml
gc:
  # 进行 GC 的时间间隔。
  interval: 900s
  policy:
    # 不活跃的 task 的存活时间。
    taskTTL: 21600s
    # 磁盘使用率的高阈值百分比。
    # 如果磁盘使用率大于阈值，dfdaemon 将执行 GC。
    distHighThresholdPercent: 80
    # 磁盘使用率的下阈值百分比。
    # 如果磁盘使用率低于阈值，dfdaemon 将停止 GC。
    distLowThresholdPercent: 60
```

### Nydus 缓存

Dragonfly 作为 Nydus 的缓存时，只需部署 Manager，Scheduler 以及 Seed Peer 即可。由于 Nydus 会将文件切分成 1MB 左右的 Chunk 请求按需加载文件。
所以使用 Seed Peer 的 HTTP Proxy 作为 Nydus 的缓存服务器，并且传输过程中利用 P2P 的传输方式，减少回源请求以及回源带宽。
使用 Nydus 的缓存服务器的时候，Dragonfly 配置需要有一定优化。

**1.** 当 `proxy.rules.regex` 正则匹配 Nydus 存储仓库的 URL 时，才能将下载流量转发到 P2P 网络中，详情参考 [dfdaemon.yaml](../../reference/configuration/client/dfdaemon.md)。。

```yaml
proxy:
  # rules 是代理服务器的正则列表。
  # regex 是请求 URL 的正则表达式。
  # useTLS 指示代理后端是否使用 TLS。
  # redirect 是重定向 URL。
  # FilteredQueryParams 是过滤后的查询参数，用于生成任务 ID。
  # 当过滤器为["Signature", "Expires", "ns"]时，例如：
  # http://example.com/xyz?Expires=e1&Signature=s1&ns=docker.io 和 http://example.com/xyz?Expires=e2&Signature=s2&ns=docker.io
  # 将生成相同的任务 ID.
  # 默认值包括过滤后的s3、gcs、oss、obs、cos的查询参数。
  rules:
    - regex: 'blobs/sha256.*'
      # useTLS: false
      # redirect: ""
      # filteredQueryParams: []
```

**2.** 推荐 `Seed peer load limit` 改成 10000 或者更高，提高 Seed Peer 之间的 P2P Cache 命中率。

点击 `UPDATE CLUSTER` 按钮更改 `Seed peer load limit` 为 10000。详情参考 [update-cluster](https://d7y.io/docs/next/advanced-guides/web-console/cluster/#update-cluster)。

![update-cluster](../../resource/operations/best-practices/deployment-best-practices/update-cluster.png)

更改 `Seed peer load limit` 成功。
![cluster](../../resource/operations/best-practices/deployment-best-practices/cluster.png)

**3.** Nydus 会发起 1MB 左右的 HTTP Range 请求实现按需加载，开启 Prefetch 的情况下 Seed Peer 可以在接受到 HTTP Range 请求后预取完整的资源，
提高缓存命中率，详情参考 [dfdaemon.yaml](../../reference/configuration/client/dfdaemon.md)。

```yaml
proxy:
  # 当请求使用 Range Header，请求部分数据的时候，可以预先获取非 Range 内的数据。
  prefetch: false
```

**4.** 下载速度较慢时，可以调整 Proxy 的 `readBufferSize` 值，适当调至为 64KB，目的是为了减少 Proxy 请求时间，参考文档 [dfdaemon.yaml](../../reference/configuration/client/dfdaemon.md)。

```yaml
proxy:
  # 从磁盘读取 piece 的缓冲区大小，默认为32KB。
  readBufferSize: 32768
```

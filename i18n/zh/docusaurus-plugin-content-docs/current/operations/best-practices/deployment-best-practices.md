---
id: deployment-best-practices
title: 部署
slug: /operations/best-practices/deployment-best-practices/
---

## 容量规划

首先你要预估集群在未来相当长的一段时间内，最高预期文件/镜像存储容量。

其次你还要对目前拥有的机器资源有清晰地了解。知道每台机器的内存大小、CPU核心数、磁盘容量。

### Manager

推荐每个集群至少部署 3 个。

<!-- markdownlint-disable -->

| Peer 总数 | CPU | Memory | Disk  |
| --------- | --- | ------ | ----- |
| 1K        | 8C  | 16G    | 200Gi |
| 5K        | 16C | 32G    | 200Gi |
| 10K       | 16C | 64G    | 200Gi |

<!-- markdownlint-restore -->

### Scheduler

推荐每个集群至少部署 3 个。

<!-- markdownlint-disable -->

| 每秒下载请求 | CPU | Memory | Disk  |
| ------------ | --- | ------ | ----- |
| 1K           | 8C  | 16G    | 200Gi |
| 3K           | 16C | 32G    | 200Gi |
| 5K           | 16C | 64G    | 200Gi |

<!-- markdownlint-restore -->

### Client

如果是 Seed Peer 推荐每个集群至少部署 3 个。Disk 大小根据 Cache 不同的文件/镜像总大小，用户根据需求计算。

<!-- markdownlint-disable -->

| 每秒下载请求 | CPU | Memory | Disk  |
| ------------ | --- | ------ | ----- |
| 500          | 8C  | 16G    | 500Gi |
| 1K           | 8C  | 16G    | 3Ti   |
| 3K           | 16C | 32G    | 5Ti   |
| 5K           | 16C | 64G    | 10Ti  |

<!-- markdownlint-restore -->

### Cluster

<!-- markdownlint-disable -->

| Peer 总数 | Manager            | Scheduler          | Seed Peer         | Peer        |
| --------- | ------------------ | ------------------ | ----------------- | ----------- |
| 500       | 4C-8G-200Gi \* 3   | 8C-16G-200Gi \* 3  | 8C-16G-1Ti \* 3   | 4C-8G-500Gi |
| 1K        | 8C-16G-200Gi \* 3  | 8C-16G-200Gi \* 3  | 8C-16G-3Ti \* 3   | 4C-8G-500Gi |
| 3K        | 16C-32G-200Gi \* 3 | 16C-32G-200Gi \* 3 | 16C-32G-5Ti \* 3  | 4C-8G-500Gi |
| 5K        | 16C-64G-200Gi \* 3 | 32C-64G-200Gi \* 3 | 32C-64G-10Ti \* 3 | 4C-8G-500Gi |

<!-- markdownlint-restore -->

## 性能调优

### 上行带宽限速

主要作用节点 P2P 分享 Piece 的带宽。在不影响其他服务情况下，建议配置和机器上行带宽相同，详情参考 [dfdaemon.yaml](../../reference/configuration/client/dfdaemon.md)。

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

### 下行带宽限速

主要作用节点回源的带宽和从 Remote Peer 下载的带宽。在不影响其他服务情况下，建议配置和机器下行带宽相同，详情参考 [dfdaemon.yaml](../../reference/configuration/client/dfdaemon.md)。

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

主要作用节点磁盘中的任务 GC，taskTTL 根据任务需要缓存时间用户自行评估。`distHighThresholdPercent` 和 `distLowThresholdPercent` 建议使用默认值，
详情参考 [dfdaemon.yaml](../../reference/configuration/client/dfdaemon.md)。

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

Dragonfly 作为 Nydus 的缓存时，只部署 Manager，Scheduler 以及 Seed Peer 即可。由于 Nydus 会将文件切分成 1MB 左右的 Chunk 请求按需加载文件。
所以使用 Seed Peer 的 HTTP Proxy 作为 Nydus 的缓存服务器，并且内部进行 P2P 减少回源请求以及回源带宽。做 Nydus 的缓存服务器的时候，Dragonfly 配置需要有一定优化。

**1.** `proxy.rules.regex` 正则匹配 Nydus 存储仓库的 URL。这样才能截获流量到 P2P 网络中，详情参考 [dfdaemon.yaml](../../reference/configuration/client/dfdaemon.md)。。

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

**2.** `Seed peer load limit` 推荐改成 10000 或者更高，可以提高 Seed Peer 之间的 P2P Cache 命中率。

点击 `UPDATE CLUSTER` 按钮更改 `Seed peer load limit` 为 10000。详情参考 [update-cluster](https://d7y.io/docs/next/advanced-guides/web-console/cluster/#update-cluster)。

![update-cluster](../../resource/operations/best-practices/deployment-best-practices/update-cluster.png)

更改 `Seed peer load limit` 成功。
![cluster](../../resource/operations/best-practices/deployment-best-practices/cluster.png)

**3.** 开启 Prefetch，Nydus 会发起 1MB 左右的 HTTP Range 请求实现按需下载，开启 Prefetch 的情况下 Seed Peer 可以在接受到 HTTP Range 请求后预取完整的资源，
提高缓存命中率，详情参考 [dfdaemon.yaml](../../reference/configuration/client/dfdaemon.md)。

```yaml
proxy:
  # 当请求使用 Range Header，请求部分数据的时候，可以预先获取非 Range 内的数据。
  prefetch: false
```

**4.** 调整 Proxy 的 `readBufferSize` 值，默认为 32KB，可以适当调至 64KB，这样可以减少 Proxy 请求时间，详情参考 [dfdaemon.yaml](../../reference/configuration/client/dfdaemon.md)。。

```yaml
proxy:
  # 从磁盘读取 piece 的缓冲区大小，默认为32KB。
  readBufferSize: 32768
```

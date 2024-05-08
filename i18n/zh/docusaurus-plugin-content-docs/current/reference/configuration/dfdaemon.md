---
id: dfdaemon
title: Dfdaemon
---

## 配置 Dfdaemon YAML 文件

Linux 环境下默认 Dfdaemon 配置路径为 `/etc/dragonfly/dfdaemon.yaml`, Darwin 环境下默认 Dfdaemon 配置路径为 `$HOME/.dragonfly/config/dfdaemon.yaml`。

```yaml
# dfdaemon 的主机配置。
host:
  ## 机房信息。
  idc: ''
  ## 地理信息, 通过 "|" 符号分隔。
  location: ''
  ## 主机名称。
  # hostname: ""
  ## 访问 IP 地址。
  # ip: ""

# dfdaemon 的服务器配置。
server:
  # pluginDir 是存放插件的目录位置。
  pluginDir: /var/lib/dragonfly/plugins/dfdaemon/
  # 存放缓存文件的目录位置。
  cacheDir: /var/cache/dragonfly/dfdaemon/

# dfdaemon 的下载配置。
download:
  # dfdaemon 的下载服务器配置。
  server:
    # ssocketPath 是 dfdaemon GRPC 服务的 unix socket 路径。
    socketPath: /var/run/dragonfly/dfdaemon.sock
  # 下载速度的速率限制，单位为 bps（字节每秒），默认为 10Gbps。
  rateLimit: 10000000000
  # 回源下载 piece 的超时时间。
  pieceTimeout: 180s
  # 下载 piece 的并发数量。
  concurrentPieceCount: 16

# dfdaemon 的上传配置。
upload:
  # dfdaemon 的上传服务器配置。
  server:
    # 指定固定端口，也可以指定端口。
    port: 4000
    ## GRPC 服务器的监听 ip。
    # ip: ""
  # 上传速度的速率限制，单位为 bps（字节每秒），默认为 10Gbps。
  rateLimit: 10000000000

# dfdaemon 的管理器配置。
manager:
  # Manager 服务地址。
  addrs: []

# dfdaemon 的调度程序配置。
scheduler:
  # 向 scheduler 宣布 peer 的时间间隔。
  # 向 scheduler 提供 peer 信息进行调度，peer 信息包括 cpu, memory, 等...
  announceInterval: 300s
  # 调度的超时时间，如果调度超时 dfdaemon 将回源。
  # 如果 enableBackToSource 为 true 则下载，否则 dfdaemon 将返回下载失败。
  scheduleTimeout: 30s
  # scheduler 的最大数量。
  maxScheduleCount: 5

# dfdaemon 的 seed peer 配置。
seedPeer:
  # dfdaemon 开启 seed peer 模式。
  enable: true
  # seed peer 类型，包括 super, strong 和 weak。
  type: super
  # 注册的 seed peer 集群 ID。
  clusterID: 1
  # 与 manager 保持活动的时间间隔。
  keepaliveInterval: 15s

# dynconfig is the dynamic configuration for dfdaemon.
dynconfig:
  # manager 刷新动态配置的时间间隔。
  refreshInterval: 300s

# dfdaemon 的存储配置。
storage:
  # 存储任务元数据和内容的目录。
  dir: /var/lib/dragonfly/
  # 将 piece 写入磁盘的缓冲区大小，默认为 16KB。
  writeBufferSize: 16384
  # 从磁盘读取 piece 的缓冲区大小，默认为 16KB。
  readBufferSize: 16384

# dfdaemon 的 gc 配置。
gc:
  # 进行 gc 的时间间隔。
  interval: 900s
  # policy is the gc policy.
  policy:
    # taskTTL 是任务的 ttl。
    taskTTL: 21600s
    # 磁盘使用率的高阈值百分比。
    # 如果磁盘使用率大于阈值，dfdaemon 将执行 gc。
    distHighThresholdPercent: 80
    # 磁盘使用率的下阈值百分比。
    # 如果磁盘使用率低于阈值，dfdaemon 将停止 gc。
    distLowThresholdPercent: 60

# dfdaemon 的代理配置。
proxy:
  server:
    # proxy 服务监听端口。
    port: 4001
    ## proxy 的 IP 地址。
    # ip: ""
    ## caCert 是 PEM 格式的 root CA 证书路径，用于 proxy 服务器生成服务器证书。
    ## 如果 ca_cert 为空，proxy 将通过 rcgen::generate_simple_self_signed 生成一个简单的 CA 证书。
    ## 当客户端通过 proxy 请求时，客户端不应验证服务器证书并将 insecure 设置为 true。
    ## 如果 ca_cert 不为空，proxy 将使用 CA 证书签署服务器证书。如果安装了 openssl，
    ## 您可以使用 openssl 生成 root CA 证书并使系统信任 root CA 证书。
    ## 然后将 ca_cert 和 ca_key 设置为 root CA 证书和密钥路径。 dfdaemon 生成服务器证书 和密钥，并使用 rootCA 证书签署服务器证书。
    ## 当 client 通过代理请求时，proxy 可以拦截服务器证书的请求。
    # caCert: ""
    ## caKey 是代理服务器生成服务器证书的 PEM 格式的 root CA 密钥路径。
    ## 如果 ca_key 为空，proxy 将通过 rcgen::generate_simple_self_signed 生成一个简单的 CA 密钥。
    ## 当客户端通过 proxy 请求时，客户端不应验证服务器证书并将 insecure 设置为 true。
    ## 如果 ca_cert 不为空，proxy 将使用 CA 证书签署服务器证书。如果安装了 openssl，
    ## 您可以使用 openssl 生成 root CA 证书并使系统信任 root CA 证书。
    ##  然后将 ca_cert 和 ca_key 设置为 root CA 证书和密钥路径。 dfdaemon 生成服务器证书 和密钥，并使用 rootCA 证书签署服务器证书。
    ## 当 client 通过代理请求时，proxy 可以拦截服务器证书的请求。
    # caKey: ""
  # rules是代理服务器的 rules 列表。
  # regex 是请求 url 的正则表达式。
  # useTLS 指示代理后端是否使用 tls。
  # redirect 是重定向 URL。
  # FilteredQueryParams 是过滤后的查询参数，用于生成任务 id。
  # 当过滤器为["Signature", "Expires", "ns"]时，例如：
  # http://example.com/xyz?Expires=e1&Signature=s1&ns=docker.io 和 http://example.com/xyz?Expires=e2&Signature=s2&ns=docker.io
  # 将生成相同的 task id.
  # 默认值包括过滤后的s3、gcs、oss、obs、cos的查询参数。
  rules:
    - regex: 'blobs/sha256.*'
      # useTLS: false
      # redirect: ""
      # filteredQueryParams: []
  # registryMirror is implementation of the registry mirror in the proxy.
  registryMirror:
    # registry mirror 的默认地址。 proxy 会启动一个 registry 镜像服务，供 client 拉取镜像。
    # client 可以使用配置中的 registry 镜像的默认地址来拉取镜像。 “X-Dragonfly-Registry”标头可以代替 registry mirror 的默认地址。
    addr: https://index.docker.io
    ## certs 是 registry 的 PEM 格式的 client 证书路径。
    ## 如果 registry 使用自签名证书，client 应设置 registry mirror 的证书。
    # certs: ""
  # disableBackToSource 表示是否禁止下载失败时下载回源。
  disableBackToSource: false
  # 当请求使用 Range Header，请求部分数据的时候，可以预先获取非 Range 内的数据。
  prefetch: false
  # 从磁盘读取片段的缓冲区大小，默认为 16KB。
  readBufferSize: 16384

# dfdaemon 的运行状况配置。
health:
  # health 服务器配置。
  server:
    # health 服务监听端口。
    port: 4003
    ## health IP 地址。
    # ip: ""

# dfdaemon 的指标配置。
metrics:
  # metrics 服务器配置。
  server:
    # metrics  服务监听端口。
    port: 4002
    ## metrics 服务器 IP 地址。
    # ip: ""

# pprof 的统计数据配置。
stats:
  server:
    # stats 监听端口。
    port: 4004
    ## stats IP 地址。
    # ip: ""
## dfdaemon 的 tracing 配置。
# tracing:
## addr 为上报 tracing 日志的地址。
# addr: ""
```

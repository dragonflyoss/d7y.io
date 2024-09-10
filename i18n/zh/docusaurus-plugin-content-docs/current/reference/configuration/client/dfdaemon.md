---
id: dfdaemon
title: Dfdaemon
slug: /reference/configuration/client/dfdaemon/
---

## 配置 Dfdaemon YAML 文件

Linux 环境下默认 Dfdaemon 配置路径为 `/etc/dragonfly/dfdaemon.yaml`。

```yaml
# verbose 是否日志输出到 Stdout。
verbose: true
log:
  # 指定日志记录级别 [trace、debug、info、warn、error]。
  level: info
# Dfdaemon 的主机配置。
host:
  ## 机房信息。
  idc: ''
  ## 地理信息, 通过 "|" 符号分隔。
  location: ''
  ## 主机名称。
  # hostname: ""
  ## 访问 IP 地址。
  # ip: ""
server:
  # 存放插件的目录位置。
  pluginDir: /var/lib/dragonfly/plugins/dfdaemon/
  # 存放缓存文件的目录位置。
  cacheDir: /var/cache/dragonfly/dfdaemon/
download:
  server:
    # dfdaemon GRPC 服务的 Unix 套接字路径。
    socketPath: /var/run/dragonfly/dfdaemon.sock
  # 下载速度的默认速率限制，单位为 KiB/MiB/GiB 每秒，默认为 10GiB/s。
  rateLimit: 10GiB
  # 从源下载 piece 的超时时间。
  pieceTimeout: 30s
  # 下载 piece 的并发数量。
  concurrentPieceCount: 10
upload:
  server:
    # GRPC 服务器的端口。
    port: 4000
    ## GRPC 服务器的监听 IP。
    # ip: ""
  # 上传速度的默认速率限制，单位为 KiB/MiB/GiB 每秒，默认为 10GiB/s。
  rateLimit: 10GiB
manager:
  # Manager 服务地址。
  addrs: []
scheduler:
  # 向 scheduler 宣布 peer 的时间间隔。
  # Announcer 向 scheduler 提供 peer 信息进行调度，peer 信息包括 CPU, 内存等。
  announceInterval: 1m
  # 调度的超时时间，如果调度超时 dfdaemon 将回源。
  # 如果将 enableBackToSource 为 true，dfdaemon 将回源下载，否则 dfdaemon 将返回下载失败。
  scheduleTimeout: 30s
  # 开始 scheduler 的最大数量。
  maxScheduleCount: 5
  # 当调度失败时是否启用回源下载。
  enableBackToSource: true
seedPeer:
  # Dfdaemon 开启 seed peer 模式。
  enable: true
  # Seed peer 类型，包括 super, strong 和 weak。
  type: super
  # 注册的 seed peer 集群 ID。
  clusterID: 1
  # 与 manager 活跃的时间间隔。
  keepaliveInterval: 15s
dynconfig:
  # Manager 刷新动态配置的时间间隔。
  refreshInterval: 1m
storage:
  # 存储任务元数据和内容的目录。
  dir: /var/lib/dragonfly/
  # Dfdaemon 重新启动时是否保留任务的元数据和内容。
  keep: true
  # 将 piece 写入磁盘的缓冲区大小，默认为128KB。
  writeBufferSize: 131072
  # 从磁盘读取 piece 的缓冲区大小，默认为128KB。
  readBufferSize: 131072
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
proxy:
  server:
    # 代理服务监听端口。
    port: 4001
    ## 代理服务的 IP 地址。
    # ip: ""
    ## caCert 是 PEM 格式的根 CA 证书路径，用于 proxy 服务器生成服务器证书。
    ## 如果 ca_cert 为空，proxy 将通过 rcgen::generate_simple_self_signed 生成一个简单的 CA 证书。
    ## 当客户端通过 proxy 请求时，客户端不应验证服务器证书并将 insecure 设置为 true。
    ## 如果 ca_cert 不为空，proxy 将使用 CA 证书签署服务器证书。如果安装了 openssl，
    ## 您可以使用 openssl 生成根 CA 证书并使系统信任根 CA 证书。
    ## 然后将 ca_cert 和 ca_key 设置为根 CA 证书和密钥路径。dfdaemon 生成服务器证书和密钥，并使用根 CA 证书签署服务器证书。
    ## 当 client 通过代理请求时，proxy 可以拦截服务器证书的请求。
    # caCert: ""
    ## caKey 是代理服务器生成服务器证书的 PEM 格式的根 CA 密钥路径。
    ## 如果 ca_key 为空，proxy 将通过 rcgen::generate_simple_self_signed 生成一个简单的 CA 密钥。
    ## 当客户端通过 proxy 请求时，客户端不应验证服务器证书并将 insecure 设置为 true。
    ## 如果 ca_cert 不为空，proxy 将使用 CA 证书签署服务器证书。如果安装了 openssl，
    ## 您可以使用 openssl 生成根 CA 证书并使系统信任根 CA 证书。
    ##  然后将 ca_cert 和 ca_key 设置为根 CA 证书和密钥路径。 dfdaemon 生成服务器证书 和密钥，并使用根 CA 证书签署服务器证书。
    ## 当 client 通过代理请求时，proxy 可以拦截服务器证书的请求。
    # caKey: ""
  # rules 是代理服务器的正则列表。
  # regex 是请求 URL 的正则表达式。
  # useTLS 指示代理后端是否使用 TLS。
  # redirect 是重定向 URL。
  # FilteredQueryParams 是过滤后的查询参数，用于生成任务 ID。
  # 当过滤器为["Signature", "Expires", "ns"]时，例如：
  # http://example.com/xyz?Expires=e1&Signature=s1&ns=docker.io 和 http://example.com/xyz?Expires=e2&Signature=s2&ns=docker.io
  # 将生成相同的任务 ID.
  # 默认值包括过滤后的s3、gcs、oss、obs、cos的查询参数。
  # `X-Dragonfly-Use-P2P` 可以代替 rules 中的正则匹配，如果值为 `true`，则直接使用 P2P 下载资源。如果值为 `false`，但
  # rules 中的正则匹配成功，则仍然使用 P2P 下载资源。
  rules:
    - regex: 'blobs/sha256.*'
      # useTLS: false
      # redirect: ""
      # filteredQueryParams: []
  registryMirror:
    # 镜像中心地址。
    # Proxy 会启动一个镜像 registry 服务客户端拉取镜像。
    # Client 可以使用镜像 registry 的默认地址配置来拉取图像。
    # “X-Dragonfly-Registry”标头可以代替镜像 registry 的默认地址。
    addr: https://index.docker.io
    ##  ## certs 是 registry 的 PEM 格式的客户端证书路径。
    ## 如果 registry 使用自签名证书，client 应该为镜像 registry 设置证书。
    # certs: ""
  # 默认禁止下载失败时进行下载回源。
  disableBackToSource: false
  # 当请求使用 Range Header，请求部分数据的时候，可以预先获取非 Range 内的数据。
  prefetch: false
  # 从磁盘读取 piece 的缓冲区大小，默认为32KB。
  readBufferSize: 32768
security:
  # 是否启用安全选项。
  enable: false
metrics:
  server:
    # 数据收集服务监听端口。
    port: 4002
    ## 数据收集服务 IP 地址。
    # ip: ""
## dfdaemon 的跟踪配置。
# tracing:
## addr 为上报跟踪日志的地址。
# addr: ""
```

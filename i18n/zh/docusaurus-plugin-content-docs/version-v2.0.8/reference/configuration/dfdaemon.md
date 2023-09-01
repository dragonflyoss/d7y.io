---
id: dfdaemon
title: Dfdaemon
---

## 配置 Dfdaemon YAML 文件

Linux 环境下默认 Dfdaemon 配置路径为 `/etc/dragonfly/dfget.yaml`, Darwin 环境下默认 Dfdaemon 配置路径为 `$HOME/.dragonfly/config/dfget.yaml`。

```yaml
# Daemon 存活时间, 设置为 0 秒时，daemon 将不会退出。
# Dfget daemon 可以由 dfget 拉起。
aliveTime: 0s

# Daemon gc 间隔。
gcInterval: 1m0s

# 服务工作目录。
# Linux 上默认目录 /usr/local/dragonfly。
# macOS(仅开发、测试), 默认目录是 /Users/$USER/.dragonfly。
workHome: ''

# 服务的日志目录。
# Linux 上默认目录 /var/log/dragonfly。
# macOS(仅开发、测试), 默认目录是 /Users/$USER/.dragonfly/logs。
logDir: ''

# 服务的动态配置缓存目录。
# Linux 上默认目录 /var/cache/dragonfly。
# macOS(仅开发、测试), 默认目录是 /Users/$USER/.dragonfly/cache。
cacheDir: ''

# 服务的插件目录。
# Linux 上默认目录 /usr/local/dragonfly/plugins。
# macOS(仅开发、测试), 默认目录是 /Users/$USER/.dragonfly/plugins。
pluginDir: ''

# 服务的存储目录。
# Linux 上默认目录为 /var/lib/dragonfly。
# macOS(仅开发、测试), 默认目录是 /Users/$USER/.dragonfly/data/。
dataDir: ''

# 当 daemon 退出是, 是否保存缓存数据。
# 保留缓存数据在升级 daemon 的时候比较有用。
# 默认为 false。
keepStorage: false

# console 是否在控制台程序中显示日志。
console: false

# verbose 是否使用调试级别的日志、是否启用 pprof。
verbose: false

# pprof-port pprof 监听的端口，仅在 verbose 为 true 时可用。
pprof-port: -1

# Jaeger 地址。
# 默认使用空字符串（不配置 jaeger）, 例如: http://jaeger.dragonfly.svc:14268/api/traces。
jaeger: ''

# 调度器地址。
# 尽量使用同一个地区的调度器。
# Daemon 将会根据 task id 来进行一致性 hash 来选择所有配置的调度器。
scheduler:
  manager:
    # 通过 manager 接口动态获取 scheduler 列表。
    enable: true
    # Manager 服务地址。
    netAddrs:
      - type: tcp
        addr: manager-service:65003
    # Scheduler 列表刷新时间。
    refreshInterval: 5m
    # Seed peer 配置。
    seedPeer:
      # Dfdaemon 开启 seed peer 模式。
      enable: false
      # Seed peer 类型，包括 super, strong 和 weak。
      type: super
      # 注册的 seed peer 集群 ID。
      clusterID: 1
      keepAlive:
        # 保持心跳的时间间隔。
        internal: 5s
  # 调度超时。
  scheduleTimeout: 30s
  # 是否禁用回源，禁用回源后，在调度失败时不在 daemon 回源，直接返错。
  disableAutoBackSource: false
  # 调度器地址实例。
  # netAddrs:
  #  - type: tcp
  #    addr: scheduler-service:8002

# 用于注册到调度器的 daemon 信息。
host:
  # # 访问 IP 地址。
  # # 其他 daemon 可以通过这个 IP 地址连接过来。
  # advertiseIP: 127.0.0.1
  # 地理信息, 通过 "|" 符号分隔。
  location: ''
  # 机房信息。
  idc: ''
  # 安全域信息，不同安全域之间网络隔离。
  securityDomain: ''
  # 网络拓扑结构，通过 "|" 符号分隔。
  netTopology: ''
  # 主机名称。
  # hostname: ""

# 下载服务选项。
download:
  # 是否计算文件摘要，设置为 false 的话，会节省内存。
  calculateDigest: true
  # 总下载限速。
  totalRateLimit: 1024Mi
  # 单个任务下载限速。
  perPeerRateLimit: 512Mi
  # 单个 Piece 下载超时时间。
  pieceDownloadTimeout: 30s
  # 当请求使用 Range Header，请求部分数据的时候，可以预先获取非 Range 内的数据。
  prefetch: false
  # golang transport 选项。
  transportOption:
    # 连接超时时间。
    dialTimeout: 2s
    # 保活时间。
    keepAlive: 30s
    # 等同于 http.Transport.MaxIdleConns。
    maxIdleConns: 100
    # 等同于 http.Transport.IdleConnTimeout。
    idleConnTimeout: 90s
    # 等同于 http.Transport.ResponseHeaderTimeout。
    responseHeaderTimeout: 2s
    # 等同于 http.Transport.TLSHandshakeTimeout。
    tlsHandshakeTimeout: 1s
    # 等同于 http.Transport.ExpectContinueTimeout。
    expectContinueTimeout: 2s
  # 回源并发选项, 默认不并发。
  # 一般设置 thresholdSize 和 goroutineCount 就够用了。
  concurrent:
    # 开启并发的阈值，大于此值则使用并发方式回源。
    thresholdSize: 10M
    # 开启并发的下载速度阈值，大于此值则使用并发方式回源。
    thresholdSpeed: 2M
    # 每个任务并发回源的协程数量。
    goroutineCount: 4
    # 初次失败等待时间，单位：秒，默认是 0.5 秒。
    initBackoff: 0.5
    # 最大失败等待时间，单位：秒，默认是 3 秒。
    maxBackoff: 3
    # 最多失败重试次数，默认是 3 次。
    maxAttempts: 3
  # 下载 GRPC 配置。
  downloadGRPC:
    # 安全选项。
    security:
      insecure: true
      cacert: ''
      cert: ''
      key: ''
      tlsVerify: true
      tlsConfig: null
    # 下载服务监听地址，dfget 下载文件将通过该地址连接到 daemon。
    # 目前只支持 unix domain socket。
    unixListen:
      # linux 上默认路径为 /var/run/dfdaemon.sock。
      # macos(仅开发、测试), 默认目录是 /tmp/dfdaemon.sock。
      socket: ''
  # Peer grpc 选项。
  # Peer 之间通信和下载配置。
  peerGRPC:
    security:
      insecure: true
      cacert: ''
      cert: ''
      key: ''
      tlsVerify: true
    tcpListen:
      # # 监听地址。
      # listen: 0.0.0.0
      # 监听端口。
      # 指定固定端口，也可以指定端口范围。
      port: 65000
#     port:
#       start: 65000
#       end: 65009

# 上传服务选项。
upload:
  # 上传限速。
  rateLimit: 1024Mi
  security:
    insecure: true
    cacert: ''
    cert: ''
    key: ''
    tlsVerify: false
  tcpListen:
    # # 监听地址。
    # listen: 0.0.0.0
    # 监听端口。
    # 指定固定端口，也可以指定端口范围。
    port: 65002
#   port:
#     start: 65020
#     end: 65029

# 对象存储服务。
objectStorage:
  # 开启对象存储服务。
  enable: false
  # 通过 filter 参数过滤 url 中的 querystring 从而生成唯一的 Task ID。
  # 例如：defaultFilter: "Expires&Signature&ns":
  #  http://localhost/xyz?Expires=111&Signature=222&ns=docker.io and http://localhost/xyz?Expires=333&Signature=999&ns=docker.io
  # 是相同的 task。
  filter: 'Expires&Signature&ns'
  # 最大副本数量，上传对象文件的时候，设置最多复制到 Seed Peer 上的副本数量。
  maxReplicas: 3
  # 对象存储服务安全设置。
  security:
    insecure: true
    tlsVerify: true
  tcpListen:
    # # 监听地址。
    # listen: 0.0.0.0
    # 监听端口。
    port: 65004

# 任务存储选项。
storage:
  # Task data 过期时间。
  # 超过指定时间没有访问之后，缓存数据将会被清理。
  taskExpireTime: 6h
  # storage strategy when process task data
  # io.d7y.storage.v2.simple : download file to data directory first, then copy to output path, this is default action
  #                           the download file in date directory will be the peer data for uploading to other peers
  # io.d7y.storage.v2.advance: download file directly to output path with postfix, hard link to final output,
  #                            avoid copy to output path, fast than simple strategy, but:
  #                            the output file with postfix will be the peer data for uploading to other peers
  #                            when user delete or change this file, this peer data will be corrupted
  # default is io.d7y.storage.v2.simple
  strategy: io.d7y.storage.v2.simple
  # 磁盘 GC 阈值，缓存数据超过阈值后，最旧的缓存数据将会被清理。
  diskGCThreshold: 50Gi
  # 磁盘利用率 GC 阈值，磁盘利用率超过阈值后，最旧的缓存数据将会被清理。
  # 例如, diskGCThresholdPercent=80, 当磁盘利用率超过 80% 的时候，会进行清理最旧的缓存数据。
  diskGCThresholdPercent: 80
  # 相同 task id 的 peer task 是否复用缓存。
  multiplex: true

# 健康检查服务选项。
health:
  security:
    insecure: true
    cacert: ''
    cert: ''
    key: ''
    tlsVerify: false
  tcpListen:
    # 健康度检查路径，默认为 /server/ping。
    path: /server/ping
    # # 监听地址。
    # listen: 0.0.0.0
    # 监听端口。
    # 指定固定端口，也可以指定端口范围。
    port: 40901
#   port:
#     start: 40901
#     end: 40901

# 代理服务详细选项。
proxy:
  # 哈希 URL 的时候的过滤选项。
  # 例如：defaultFilter: "Expires&Signature&ns":
  #  http://localhost/xyz?Expires=111&Signature=222&ns=docker.io and http://localhost/xyz?Expires=333&Signature=999&ns=docker.io
  # 是相同的 task, 也可以通过代理增加 X-Dragonfly-Filter Header 覆盖默认的 Filter。
  defaultFilter: 'Expires&Signature&ns'
  # 为 URL 对应的任务打标记。
  # 当下载任务的 URL 相同，但 defaultTag 不同时，会根据 defaultTag 进行区分, 生成的 task 是不同的。
  # 也可以通过代理增加 X-Dragonfly-Tag Header 覆盖默认的 Filter。
  defaultTag: ''
  security:
    insecure: true
    cacert: ''
    cert: ''
    key: ''
    tlsVerify: false
  tcpListen:
    # 监听的网络命名空间, 例如：/proc/1/ns/net。
    # 主要用在部署 kubernetes 中的时候，daemon 不使用 host network 时，监听宿主机的端口。
    # 仅支持 Linux。
    namespace: ''
    # # 监听地址。
    # listen: 0.0.0.0
    # 监听端口。
    port: 65001
  registryMirror:
    # 开启时，使用 header 里的 "X-Dragonfly-Registry" 替换 url 里的 host。
    dynamic: true
    # 镜像中心地址。
    url: https://index.docker.io
    # 忽略镜像中心证书错误。
    insecure: true
    # 镜像中心证书。
    certs: []
    # 是否直连镜像中心，true 的话，流量不再走 p2p。
    direct: false
    # 如果使用 dragonfly 的情况下是否使用 proxies 配置。
    useProxies: false

  proxies:
    # 代理镜像 blobs 信息。
    - regx: blobs/sha256.*
    # 访问 some-registry 的时候，转换成 https 协议。
    - regx: some-registry/
      useHTTPS: true
    # 直接透传流量，不走蜻蜓。
    - regx: no-proxy-reg
      direct: true
    # 转发流量到指定地址。
    - regx: some-registry
      redirect: another-registry
    # the same with url rewrite like apache ProxyPass directive.
    - regx: ^http://some-registry/(.*)
      redirect: http://another-registry/$1

  hijackHTTPS:
    # Https 劫持的证书和密钥。
    # 建议自签 CA 并更新主机证书链。
    cert: ''
    key: ''
    # 需要走蜻蜓 p2p 的流量。
    hosts:
      - regx: mirror.aliyuncs.com:443 # 正则匹配
        # 忽略证书错误。
        insecure: true
        # 可选：对端证书。
        certs: []
  # 同时下载任务数, 0 代表不限制。
  maxConcurrency: 0
  # 白名单，如果设置了，仅白名单内可以走代理，其他的都拒绝。
  whiteList:
    # 主机信息。
    - host: ''
      # 正则匹配。
      regx:
      # 端口白名单。
      ports:
      # - 80
      # - 443
  # 为 proxy 设置基础认证。
  basicAuth:
    username: 'admin'
    password: 'password'

security:
  # 自动获取 Manager 签发的客户端证书。
  autoIssueCert: false
  # caCert 配置根证书, GRPC 在 TLS 握手时使用, 格式为 PEM 的字符串形式。
  caCert: ''
  # tlsVerify 是否需要验证服务端证书。
  tlsVerify: false
  # tlsPolicy 控制 GRPC 的握手行为：
  #   force: 代表 TLS 握手过程中需要调用 ClientHandshake 和 ServerHandshake，强制双向 TLS 握手。
  #   prefer: 代表服务端支持 TLS 或非 TLS 方式握手，客户端强制 TLS 握手。
  #   default: 代表服务端支持 TLS 和非 TLS 方式握手，客户端也支持 TLS 和非 TLS 方式握手。
  #   prefer: 代表服务端支持 ServerHandshake 或非 TLS 方式，客户端强制 TLS。
  # 注意: 如果已经部署过 dragonfly 服务，想要在已有服务上面升级支持通信使用 TLS。那么首先第一步设置 tlsPolicy
  # 为 default，然后升级各个服务。然后第二部设置 tlsPolicy 为 prefer 然后升级各个服务。上面两步结束，那 Manager、
  # Scheduler、Seed Peer 和 Peer 之间通信以及下载流量就都支持 TLS 了。
  tlsPolicy: 'prefer'
  certSpec:
    # validityPeriod 是颁发证书的有效时长。
    validityPeriod: 4320h
# 数据收集服务地址。
# metrics: ':8000'

network:
  # 开启 IPv6。
  enableIPv6: false

# 广播服务选项，它会将当前 Peer 的主机信息，包括 CPU、Memory 等提供给调度器，
# 当调度的时候会根据这些主机信息进行节点调度。
announcer:
  # schedulerInterval 是广播间隔时长。
  schedulerInterval: 30s
```

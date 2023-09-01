---
id: scheduler
title: Scheduler
---

## 配置 Scheduler YAML 文件

Linux 环境下默认 Scheduler 配置路径为 `/etc/dragonfly/scheduler.yaml`, Darwin 环境下默认 Scheduler 配置路径为 `$HOME/.dragonfly/config/scheduler.yaml`。

```yaml
# Scheduler 服务实例配置信息。
server:
  # # 访问 IP 地址。
  # # 其他服务可以通过这个 IP 地址连接过来。
  # advertiseIP: 127.0.0.1
  # # 监听 IP.
  # listenIP: 0.0.0.0
  # # 服务地址。
  # host: localhost
  # 服务监听端口。
  port: 8002
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
  # Linux 上默认目录 /var/lib/dragonfly。
  # macOS(仅开发、测试), 默认目录是 /Users/$USER/.dragonfly/data。
  dataDir: ''

# Scheduler 调度策略配置。
scheduler:
  # Algorithm 使用不同调度算法配置，当前默认支持 "default" 和 "ml" 两种类型。
  # "default" 为基于规则的调度算法, "ml" 为基于机器学习的调度算法。
  # 也支持用户 plugin 扩展的方式，值为 "plugin"。
  # 并且在 dragonfly 工作目录 plugins 中添加编译好的 `d7y-scheduler-plugin-evaluator.so` 文件。
  algorithm: default
  # 单个任务允许客户端回源的数量。
  backToSourceCount: 3
  # 调度回源重试次数限制。
  retryBackToSourceLimit: 5
  # 调度重试次数限制。
  retryLimit: 10
  # 调度重试时间间隔。
  retryInterval: 50ms
  # 数据回收策略。
  gc:
    # 单个 Piece 下载超时时间。
    pieceDownloadTimeout: 30m
    # Peer 的回收间隔。
    peerGCInterval: 10s
    # 不活跃的 Peer 的存活时间。如果当前 Peer 被其他 Peer 下载成功，那么会重置 PeerTTL 时间。
    peerTTL: 24h
    # Task 的回收间隔。如果 Task 下的 Peer 都被释放掉，那么 Task 也会被释放。
    taskGCInterval: 30m
    # Host 的回收间隔。
    hostGCInterval: 6h
    # 不活跃的 Host 的存活时间。如果 Host 发送心跳至 Scheduler，那么会重置 HostTTL 时间。
    hostTTL: 1h

# 动态数据配置。
dynConfig:
  # 动态数据刷新间隔时间。
  refreshInterval: 1m

# 实例主机信息。
host:
  # 实例所在机房。
  idc: ''
  # 实例所在的地理位置信息。
  location: ''

# Manager 配置。
manager:
  # Manager 访问地址。
  addr: manager-service:65003
  # 注册的 scheduler 集群 ID。
  schedulerClusterID: 1
  # Manager 心跳配置。
  keepAlive:
    # 保持心跳的时间间隔。
    interval: 5s

# Seed peer 配置。
seedPeer:
  # 启动 seed peer 作为 P2P 网络节点,
  # 如果值为 false 第一次回源请求不通过 seed peer 而是通过 peer 直接回源,
  # 而且无法使用预热功能。
  enable: true

# Machinery 异步任务配置，配置参考 https://github.com/RichardKnop/machinery。
job:
  # 启动 job 服务。
  enable: true
  # Global 通道 worker 数量。
  globalWorkerNum: 500
  # Scheduler 通道 worker 数量。
  schedulerWorkerNum: 500
  # Local 通道 worker 数量。
  localWorkerNum: 1000
  # Redis 配置。
  redis:
    # 服务地址。
    addrs:
      - dragonfly:6379
    # 哨兵模式的 Master Name。
    masterName: ''
    # 用户名
    username: ''
    # 密码。
    password: ''
    # Broker 数据库。
    brokerDB: 1
    # Backend 数据库。
    backendDB: 2

# 存储任务下载信息。
storage:
  # 设置单个存储文件大小，单位为 megabytes。
  maxSize: 100
  # 保留最大副本数。
  maxBackups: 10
  # 缓冲区限制，如果缓冲区写满，一次性写入存储文件中。
  bufferSize: 100

# 开启数据收集服务。
metrics:
  # 启动数据收集服务。
  enable: true
  # 数据服务地址。
  addr: ':8000'
  # 收集 host 数据。
  enableHost: false

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
    # dnsNames 是证书的 dnsNames 列表.
    dnsNames:
      - 'dragonfly-scheduler'
      - 'dragonfly-scheduler.dragonfly-system.svc'
      - 'dragonfly-scheduler.dragonfly-system.svc.cluster.local'
    # ipAddresses 是证书的 ipAddresses 列表.
    ipAddresses:
    # validityPeriod 是颁发证书的有效时长。
    validityPeriod: 4320h

network:
  # 开启 IPv6。
  enableIPv6: false

# console 是否在控制台程序中显示日志。
console: false

# verbose 是否使用调试级别的日志、是否启用 pprof。
verbose: false

# pprof-port pprof 监听的端口，仅在 verbose 为 true 时可用。
pprof-port: -1

# Jaeger 地址
# 默认使用空字符串（不配置 jaeger）, 例如: http://jaeger.dragonfly.svc:14268/api/traces。
jaeger: ''
```

---
id: manager
title: Manager
---

## 配置 Manager YAML 文件

Linux 环境下默认 Manager 配置路径为 `/etc/dragonfly/manager.yaml`, Darwin 环境下默认 Manager 配置路径为 `$HOME/.dragonfly/config/manager.yaml`。

```yaml
# 服务配置。
server:
  # GRPC 服务配置。
  grpc:
    # # 访问 IP 地址。
    # # 其他服务可以通过这个 IP 地址连接过来。
    # advertiseIP: 127.0.0.1
    # # 监听 IP.
    # listenIP: 0.0.0.0
    # 监听的端口, manager 会从 start 到 end 之间的按顺序中选择一个可用端口。
    port:
      start: 65003
      end: 65003
  # rest 服务配置。
  rest:
    # 标准的 rest 服务地址: ip:port, ip 不配置则默认为0.0.0.0。
    addr: :8080
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

# 认证配置。
auth:
  # JWT 配置，用户登录使用。
  jwt:
    # 给用户展示的 Realm 名字，默认值是 Dragonfly。
    realm: 'Dragonfly'
    # 用户登录时 JWT 使用的密钥，默认值是 dragonfly 的 base64 编码值。
    # 生产环境不能直接使用，一定要更改其值。
    key: 'ZHJhZ29uZmx5Cg=='
    # JWT Token 的过期时间，默认值是 2 天。
    timeout: 48h
    # JWT Token 刷新时间，默认值是 2 天。
    maxRefresh: 48h

# 数据库配置。
database:
  # 数据库类型，支持 mysql、mariadb 以及 postgres。
  type: mysql
  # Mysql 配置。
  mysql:
    user: dragonfly
    password: dragonfly
    host: dragonfly
    port: 3306
    dbname: manager
    migrate: true
  # Postgres 配置。
  postgres:
    user: dragonfly
    password: dragonfly
    host: dragonfly
    port: 3306
    dbname: manager
    sslMode: disable
    timezone: UTC
    migrate: true
  # tls:
  #   # 客户端证书文件路径。
  #   cert: /etc/ssl/certs/cert.pem
  #   # 客户端私钥文件路径。
  #   key: /etc/ssl/private/key.pem
  #   # CA 证书文件路径。
  #   ca: /etc/ssl/certs/ca.pem
  #   # 客户端是否验证服务端的证书链和 hostname。
  #   insecureSkipVerify: true
  # redis 配置。
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
    # 数据库。
    db: 0
    # broker 数据库。
    brokerDB: 1
    # backend 数据库。
    backendDB: 2

# 缓存配置。
cache:
  # Redis 缓存配置。
  redis:
    # ttl 配置。
    ttl: 5m
  # 本地缓存配置。
  local:
    # LFU 缓存大小。
    size: 200000
    # ttl 配置。
    ttl: 3m

# 对象存储服务。
objectStorage:
  # 开启对象存储服务。
  enable: false
  # 对象存储 Backend 类型，支持 s3 和 oss。
  name: s3
  # 对象存储 Backend 区域。
  region: ''
  # 对象存储 Backend 地址。
  endpoint: ''
  # access key。
  accessKey: ''
  # access key 的密钥。
  secretKey: ''
  # s3ForcePathStyle 设置 S3 的访问路径风格, 默认为 true。
  # 参考文档 https://github.com/aws/aws-sdk-go/blob/main/aws/config.go#L118。
  s3ForcePathStyle: true

# 数据收集服务。
metrics:
  # 启动数据收集服务。
  enable: true
  # 数据服务地址。
  addr: ':8000'
  # 开启 peer gauge 数据。
  enablePeerGauge: true

security:
  # 自动获取 Manager 签发的客户端证书。
  autoIssueCert: false
  # caCert 配置中间证书, GRPC 在 TLS 握手时使用, 格式为 PEM 的字符串形式。
  caCert: ''
  # caKey 配置中间证书的密钥, 在给客户端签发证书时使用, 格式为 PEM 的字符串形式。
  caKey: ''
  # tlsPolicy 控制 GRPC 的握手行为：
  #   force: 代表 TLS 握手过程中需要调用 ClientHandshake 和 ServerHandshake，强制双向 TLS 握手。
  #   prefer: 代表服务端支持 TLS 或非 TLS 方式握手，客户端强制 TLS 握手。
  #   default: 代表服务端支持 TLS 和非 TLS 方式握手，客户端也支持 TLS 和非 TLS 方式握手。
  #   prefer: 代表服务端支持 ServerHandshake 或非 TLS 方式，客户端强制 TLS。
  tlsPolicy: 'prefer'
  certSpec:
    # dnsNames 是证书的 dnsNames 列表.
    dnsNames:
      - 'dragonfly-manager'
      - 'dragonfly-manager.dragonfly-system.svc'
      - 'dragonfly-manager.dragonfly-system.svc.cluster.local'
    # ipAddresses 是证书的 ipAddresses 列表.
    ipAddresses:
    # validityPeriod 是颁发证书的有效时长。
    validityPeriod: 87600h

network:
  # 开启 IPv6。
  enableIPv6: false

# console 是否在控制台程序中显示日志。
console: false

# verbose 是否使用调试级别的日志、是否启用 pprof。
verbose: false

# pprof-port pprof 监听的端口，仅在 verbose 为 true 时可用。
pprof-port: -1

# Jaeger 地址。
# 默认使用空字符串（不配置 jaeger）, 例如: http://jaeger.dragonfly.svc:14268/api/traces。
jaeger: ''
```

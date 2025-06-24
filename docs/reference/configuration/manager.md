---
id: manager
title: Manager
slug: /reference/configuration/manager/
---

## Configure Manager YAML File {#configure-manager-yaml-file}

The default path for the manager yaml configuration file is `/etc/dragonfly/manager.yaml` in linux,
and the default path is `$HOME/.dragonfly/config/manager.yaml` in darwin.

```yaml
# Current server info used for server.
server:
  # GRPC server configure.
  grpc:
    # # Access ip for other services,
    # # when local ip is different with access ip, advertiseIP should be set.
    # advertiseIP: 127.0.0.1
    # # Listen ip.
    # listenIP: 0.0.0.0
    # Listen port.
    # when this port is not available, manager will try next port.
    port:
      start: 65003
      end: 65003
  # # GRPC server tls configuration.
  # tls:
  #   # CA certificate file path for mTLS.
  #   caCert: /etc/ssl/certs/ca.crt
  #   # Certificate file path for mTLS.
  #   cert: /etc/ssl/certs/server.crt
  #   # Key file path for mTLS.
  #   key: /etc/ssl/private/server.pem
  # REST server configure
  rest:
    # REST server address
    addr: :8080
  # # REST server tls configuration.
  # tls:
  #   # Certificate file path.
  #   cert: /etc/ssl/certs/server.crt
  #   # Key file path.
  #   key: /etc/ssl/private/server.pem
  # WorkHome is working directory.
  # In linux, default value is /usr/local/dragonfly.
  # In macos(just for testing), default value is /Users/$USER/.dragonfly.
  workHome: ''
  # logLevel specifies the logging level for the manager.
  # Default: "info"
  # Supported values: "debug", "info", "warn", "error", "panic", "fatal"
  logLevel: "info"
  # logDir is the log directory.
  # In linux, default value is /var/log/dragonfly.
  # In macos(just for testing), default value is /Users/$USER/.dragonfly/logs.
  logDir: ''
  # cacheDir is dynconfig cache directory.
  # In linux, default value is /var/cache/dragonfly.
  # In macos(just for testing), default value is /Users/$USER/.dragonfly/cache.
  cacheDir: ''
  # pluginDir is the plugin directory.
  # In linux, default value is /usr/local/dragonfly/plugins.
  # In macos(just for testing), default value is /Users/$USER/.dragonfly/plugins.
  pluginDir: ''

# Auth configuration.
auth:
  # JWT configuration used for sigining.
  jwt:
    # Realm name to display to the user, default value is Dragonfly.
    realm: 'Dragonfly'
    # Key is secret key used for signing, default value is
    # encoded base64 of dragonfly.
    # Please change the key in production.
    key: 'ZHJhZ29uZmx5Cg=='
    # Timeout is duration that a jwt token is valid,
    # default duration is two days.
    timeout: 48h
    # MaxRefresh field allows clients to refresh their token
    # until MaxRefresh has passed, default duration is two days.
    maxRefresh: 48h

# Database info used for server.
database:
  # Database type, supported types include mysql, mariadb and postgres.
  type: mysql
  # Mysql configure.
  mysql:
    user: dragonfly
    password: dragonfly
    host: dragonfly
    port: 3306
    dbname: manager
    migrate: true
  # Postgres configure.
  postgres:
    user: dragonfly
    password: dragonfly
    host: dragonfly
    port: 5432
    dbname: manager
    sslMode: disable
    timezone: UTC
    migrate: true
  # tlsConfig: preferred
  # tls:
  #   # Client certificate file path.
  #   cert: /etc/ssl/certs/cert.pem
  #   # Client key file path.
  #   key: /etc/ssl/private/key.pem
  #   # CA file path.
  #   ca: /etc/ssl/certs/ca.pem
  #   # Whether a client verifies the server's certificate chain and hostname.
  #   insecureSkipVerify: true
  # Redis configure.
  redis:
    # Redis addresses.
    addrs:
      - dragonfly:6379
    # Redis sentinel master name.
    masterName: ''
    # Redis username.
    username: ''
    # Redis password.
    password: ''
    # Redis DB.
    db: 0
    # Redis broker DB.
    brokerDB: 1
    # Redis backend DB.
    backendDB: 2

# Manager server cache.
cache:
  # Redis cache configure.
  redis:
    # Cache ttl configure.
    ttl: 5m
  # Local cache configure.
  local:
    # LFU cache size.
    size: 30000
    # Cache ttl configure.
    ttl: 3m

# Job configuration.
job:
  # rateLimit configuration.
  rateLimit:
    # fillInterval is the interval for refilling the bucket.
    fillInterval: 1m
    # capacity is the maximum number of requests that can be consumed in a single fillInterval.
    capacity: 5
    # quantum is the number of tokens taken from the bucket for each request.
    quantum: 5
  # Sync peers configuration.
  syncPeers:
    # Interval is the interval for syncing all peers information from the scheduler and
    # display peers information in the manager console.
    interval: 24h
    # Timeout is the timeout for syncing peers information from the single scheduler.
    timeout: 10m
  # Preheat configuration.
  preheat:
    # registryTimeout is the timeout for requesting registry to get token and manifest.
    registryTimeout: 1m
    tls:
      # insecureSkipVerify controls whether a client verifies the server's certificate chain and hostname.
      insecureSkipVerify: false
    # # caCert is the CA certificate for preheat tls handshake, it can be path or PEM format string.
    # caCert: ''

# Prometheus metrics.
metrics:
  # Manager enable metrics service.
  enable: true
  # Metrics service address.
  addr: ':8000'
  # Enable peer gauge metrics.
  enablePeerGauge: true

# Network configuration.
network:
  # Enable ipv6.
  enableIPv6: false

# Console shows log on console.
console: true

# Listen port for pprof, default is -1 (meaning disabled).
pprofPort: -1

# tracing is the tracing configuration for dfdaemon.
# tracing:
#   # Protocol specifies the communication protocol for the tracing server.
#   # Supported values: "http", "https", "grpc" (default: None).
#   # This determines how tracing logs are transmitted to the server.
#   protocol: grpc
#   # endpoint is the endpoint to report tracing log, example: "localhost:4317".
#   endpoint: localhost:4317
#   # headers is the grpc's headers to send with tracing log.
#   headers: {}
```

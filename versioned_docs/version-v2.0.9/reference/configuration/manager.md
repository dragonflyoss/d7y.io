---
id: manager
title: Manager
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
  # REST server configure
  rest:
    # REST server address
    addr: :8080
  # WorkHome is working directory.
  # In linux, default value is /usr/local/dragonfly.
  # In macos(just for testing), default value is /Users/$USER/.dragonfly.
  workHome: ''
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
  #   # Whether a client verifies the server's certificate chain and host name.
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
    size: 200000
    # Cache ttl configure.
    ttl: 3m

# Object storage service.
objectStorage:
  # Enable object storage.
  enable: false
  # Name is object storage name of type, it can be s3, oss or obs.
  name: s3
  # Region is storage region.
  region: ''
  # Endpoint is datacenter endpoint.
  endpoint: ''
  # AccessKey is access key ID.
  accessKey: ''
  # SecretKey is access key secret.
  secretKey: ''
  # s3ForcePathStyle sets force path style for s3, true by default.
  # Set this to `true` to force the request to use path-style addressing,
  # i.e., `http://s3.amazonaws.com/BUCKET/KEY`. By default, the S3 client
  # will use virtual hosted bucket addressing when possible
  # (`http://BUCKET.s3.amazonaws.com/KEY`).
  # Refer to https://github.com/aws/aws-sdk-go/blob/main/aws/config.go#L118.
  s3ForcePathStyle: true

# Prometheus metrics.
metrics:
  # Manager enable metrics service.
  enable: true
  # Metrics service address.
  addr: ':8000'
  # Enable peer gauge metrics.
  enablePeerGauge: true

security:
  # autoIssueCert indicates to issue client certificates for all grpc call.
  # If AutoIssueCert is false, any other option in Security will be ignored.
  autoIssueCert: false
  # caCert is the CA certificate for all grpc tls handshake, it can be path or PEM format string.
  caCert: ''
  # caKey is the CA private key, it can be path or PEM format string.
  caKey: ''
  # tlsPolicy controls the grpc shandshake behaviors:
  #   force: both ClientHandshake and ServerHandshake are only support tls
  #   prefer: ServerHandshake supports tls and insecure (non-tls), ClientHandshake will only support tls
  #   default: ServerHandshake supports tls and insecure (non-tls), ClientHandshake will only support insecure (non-tls)
  # Notice: If the drgaonfly service has been deployed, a two-step upgrade is required.
  # The first step is to set tlsPolicy to default, and then upgrade the dragonfly services.
  # The second step is to set tlsPolicy to prefer, and then completely upgrade the dragonfly services.
  tlsPolicy: 'prefer'
  certSpec:
    # dnsNames is a list of dns names be set on the certificate.
    dnsNames:
      - 'dragonfly-manager'
      - 'dragonfly-manager.dragonfly-system.svc'
      - 'dragonfly-manager.dragonfly-system.svc.cluster.local'
    # ipAddresses is a list of ip addresses be set on the certificate.
    ipAddresses:
    # validityPeriod is the validity period  of certificate.
    validityPeriod: 87600h

network:
  # Enable ipv6.
  enableIPv6: false

# Console shows log on console.
console: false

# Whether to enable debug level logger and enable pprof.
verbose: false

# Listen port for pprof, only valid when the verbose option is true
# default is -1. If it is 0, pprof will use a random port.
pprof-port: -1

# Jaeger endpoint url, like: http://jaeger.dragonfly.svc:14268/api/traces.
jaeger: ''
```

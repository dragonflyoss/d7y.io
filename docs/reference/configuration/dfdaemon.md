---
id: dfdaemon
title: Dfdaemon
---

## Configure Dfdaemon YAML File {#configure-dfdaemon-yaml-file}

The default path for the dfdaemon yaml configuration file is `/etc/dragonfly/dfdaemon.yaml` in linux,
and the default path is `$HOME/.dragonfly/config/dfdaemon.yaml` in darwin.

```yaml
# host is the host configuration for dfdaemon.
host:
  ## idc is the idc of the host.
  idc: ''
  ## location is the location of the host.
  location: ''
  ## hostname is the hostname of the host.
  # hostname: ""
  ## ip is the advertise ip of the host.
  # ip: ""

# server is the server configuration for dfdaemon.
server:
  # pluginDir is the directory to store plugins.
  pluginDir: /var/lib/dragonfly/plugins/dfdaemon/
  # cacheDir is the directory to store cache files.
  cacheDir: /var/cache/dragonfly/dfdaemon/

# download is the download configuration for dfdaemon.
download:
  # server is the download server configuration for dfdaemon.
  server:
    # socketPath is the unix socket path for dfdaemon GRPC service.
    socketPath: /var/run/dragonfly/dfdaemon.sock
  # rateLimit is the rate limit of the download speed in bps(bytes per second), default is 10Gbps.
  rateLimit: 10000000000
  # pieceTimeout is the timeout for downloading a piece from source.
  pieceTimeout: 180s
  # concurrentPieceCount is the number of concurrent pieces to download.
  concurrentPieceCount: 16

# upload is the upload configuration for dfdaemon.
upload:
  # server is the upload server configuration for dfdaemon.
  server:
    # port is the port to the grpc server.
    port: 4000
    ## ip is the listen ip of the grpc server.
    # ip: ""
  # rateLimit is the rate limit of the upload speed in bps(bytes per second), default is 10Gbps.
  rateLimit: 10000000000

# manager is the manager configuration for dfdaemon.
manager:
  # addrs is manager addresses.
  addrs: []

# scheduler is the scheduler configuration for dfdaemon.
scheduler:
  # announceInterval is the interval to announce peer to the scheduler.
  # Announcer will provide the scheduler with peer information for scheduling,
  # peer information includes cpu, memory, etc.
  announceInterval: 300s
  # scheduleTimeout is the timeout for scheduling. If the scheduling timesout, dfdaemon will back-to-source
  # download if enableBackToSource is true, otherwise dfdaemon will return download failed.
  scheduleTimeout: 30s
  # maxScheduleCount is the max count of schedule.
  maxScheduleCount: 5

# seedPeer is the seed peer configuration for dfdaemon.
seedPeer:
  # enable indicates whether enable seed peer.
  enable: true
  # type is the type of seed peer.
  type: super
  # clusterID is the cluster id of the seed peer cluster.
  clusterID: 1
  # keepaliveInterval is the interval to keep alive with manager.
  keepaliveInterval: 15s

# dynconfig is the dynamic configuration for dfdaemon.
dynconfig:
  # refreshInterval is the interval to refresh dynamic configuration from manager.
  refreshInterval: 300s

# storage is the storage configuration for dfdaemon.
storage:
  # dir is the directory to store task's metadata and content.
  dir: /var/lib/dragonfly/
  # writeBufferSize is the buffer size for writing piece to disk, default is 16KB.
  writeBufferSize: 16384
  # readBufferSize is the buffer size for reading piece from disk, d efault is 16KB.
  readBufferSize: 16384

# gc is the gc configuration for dfdaemon.
gc:
  # interval is the interval to do gc.
  interval: 900s
  # policy is the gc policy.
  policy:
    # taskTTL is the ttl of the task.
    taskTTL: 21600s
    # distHighThresholdPercent is the high threshold percent of the disk usage.
    # If the disk usage is greater than the threshold, dfdaemon will do gc.
    distHighThresholdPercent: 80
    # distLowThresholdPercent is the low threshold percent of the disk usage.
    # If the disk usage is less than the threshold, dfdaemon will stop gc.
    distLowThresholdPercent: 60

# proxy is the proxy configuration for dfdaemon.
proxy:
  server:
    # port is the port to the proxy server.
    port: 4001
    ## ip is the listen ip of the proxy server.
    # ip: ""
    ## caCert is the root CA cert path with PEM format for the proxy server to generate the server cert.
    ## If ca_cert is empty, proxy will generate a smaple CA cert by rcgen::generate_simple_self_signed.
    ## When client requests via the proxy, the client should not verify the server cert and set
    ## insecure to true. If ca_cert is not empty, proxy will sign the server cert with the CA cert. If openssl is installed,
    ## you can use openssl to generate the root CA cert and make the system trust the root CA cert.
    ## Then set the ca_cert and ca_key to the root CA cert and key path. Dfdaemon generates the server cert
    ## and key, and signs the server cert with the root CA cert. When client requests via the proxy,
    ## the proxy can intercept the request by the server cert.
    # caCert: ""
    ## caKey is the root CA key path with PEM format for the proxy server to generate the server cert.
    ## If ca_key is empty, proxy will generate a smaple CA key by rcgen::generate_simple_self_signed.
    ## When client requests via the proxy, the client should not verify the server cert and set
    ## insecure to true. If ca_key is not empty, proxy will sign the server cert with the CA cert. If openssl is installed,
    ## you can use openssl to generate the root CA cert and make the system trust the root CA cert.
    ## Then set the ca_cert and ca_key to the root CA cert and key path. Dfdaemon generates the server cert
    ## and key, and signs the server cert with the root CA cert. When client requests via the proxy,
    ## the proxy can intercept the request by the server cert.
    # caKey: ""
  # rules is the list of rules for the proxy server.
  # regex is the regex of the request url.
  # useTLS indicates whether use tls for the proxy backend.
  # redirect is the redirect url.
  # filteredQueryParams is the filtered query params to generate the task id.
  # When filter is ["Signature", "Expires", "ns"], for example:
  # http://example.com/xyz?Expires=e1&Signature=s1&ns=docker.io and http://example.com/xyz?Expires=e2&Signature=s2&ns=docker.io
  # will generate the same task id.
  # Default value includes the filtered query params of s3, gcs, oss, obs, cos.
  rules:
    - regex: 'blobs/sha256.*'
      # useTLS: false
      # redirect: ""
      # filteredQueryParams: []
  # registryMirror is implementation of the registry mirror in the proxy.
  registryMirror:
    # addr is the default address of the registry mirror. Proxy will start a registry mirror service for the
    # client to pull the image. The client can use the default address of the registry mirror in
    # configuration to pull the image. The `X-Dragonfly-Registry` header can instead of the default address
    # of registry mirror.
    addr: https://index.docker.io
    ## certs is the client certs path with PEM format for the registry.
    ## If registry use self-signed cert, the client should set the
    ## cert for the registry mirror.
    # certs: ""
  # disableBackToSource indicates whether disable to download back-to-source when download failed.
  disableBackToSource: false
  # prefetch pre-downloads full of the task when download with range request.
  prefetch: false
  # readBufferSize is the buffer size for reading piece from disk, default is 16KB.
  readBufferSize: 16384

# health is the health configuration for dfdaemon.
health:
  # port is the port to the health server.
  server:
    # port is the port to the health server.
    port: 4003
    ## ip is the listen ip of the health server.
    # ip: ""

# metrics is the metrics configuration for dfdaemon.
metrics:
  # port is the port to the metrics server.
  server:
    # port is the port to the metrics server.
    port: 4002
    ## ip is the listen ip of the metrics server.
    # ip: ""

# stats is the stats configuration for pprof.
stats:
  # port is the port to the stats server.
  server:
    # port is the port to the stats server.
    port: 4004
    ## ip is the listen ip of the stats server.
    # ip: ""
## tracing is the tracing configuration for dfdaemon.
# tracing:
## addr is the address to report tracing log.
# addr: ""
```

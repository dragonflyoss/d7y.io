---
id: dfdaemon
title: Dfdaemon
slug: /reference/configuration/client/dfdaemon/
---

## Configure Dfdaemon YAML File {#configure-dfdaemon-yaml-file}

Configure `dfdaemon.yaml`, the default path is `/etc/dragonfly/dfdaemon.yaml`.

```yaml
# host is the host configuration for dfdaemon.
host:
  # idc is the idc of the host.
  idc: ''
  # location is the location of the host.
  location: ''
# # hostname is the hostname of the host.
# hostname: ""
# # ip is the advertise ip of the host.
# ip: ""
#
  # schedulerClusterID is the ID of the cluster to which the scheduler belongs.
  # NOTE: This field is used to identify the cluster to which the scheduler belongs.
  # If this flag is set, the idc, location, hostname and ip will be ignored when listing schedulers.
  schedulerClusterID: 1

server:
  # pluginDir is the directory to store plugins.
  pluginDir: /var/lib/dragonfly/plugins/dfdaemon/
  # cacheDir is the directory to store cache files.
  cacheDir: /var/cache/dragonfly/dfdaemon/
  # BBR-inspired adaptive rate limiter configuration for gRPC servers (download & upload).
  # When system CPU or memory usage exceeds the configured thresholds, the limiter
  # estimates capacity via `max_pass × min_rt × bucket_count / 1000` and sheds
  # incoming requests whose in-flight count exceeds this estimate. A cooldown
  # period prevents rapid oscillation between shedding and accepting.
  adaptiveRateLimit:
    # Number of time buckets in the rolling window for metric aggregation.
    bucketCount: 50
    # Duration of each time bucket (e.g., 200ms).
    bucketInterval: 200ms
    # CPU usage percentage threshold (0–100) above which the system is
    # considered overloaded. If threshold is 100, CPU usage is ignored
    # for overload detection.
    cpuThreshold: 100
    # Memory usage percentage threshold (0–100) above which the system is
    # considered overloaded. If threshold is 100, Memory usage is ignored
    # for overload detection.
    memoryThreshold: 90
    # Duration to continue shedding incoming requests after the first drop
    # event, preventing rapid oscillation between shedding and accepting.
    shedCooldown: 5s
    # How often the background task collects CPU/memory usage metrics.
    collectInterval: 3s

download:
  # protocol that peers use to download piece, supported values: "tcp", "quic".
  # When dfdaemon acts as a parent, it announces this protocol so downstream
  # peers fetch pieces using it.
  #
  # QUIC: Recommended for high-bandwidth, long-RTT, or lossy networks.
  # TCP: Recommended for high-bandwidth, low-RTT, or local-area network (LAN) environments.
  protocol: tcp
  server:
    # socketPath is the unix socket path for dfdaemon GRPC service.
    socketPath: /var/run/dragonfly/dfdaemon.sock
    # The rate limit for the requests on the download gRPC server.
    #
    # This limit applies to the total number of gRPC requests per second, including:
    # - Multiple requests within a single connection.
    # - Single requests across different connections.
    requestRateLimit: 400
    # The buffer size for the request channel on the download gRPC server.
    #
    # This controls the capacity of the bounded channel used to queue
    # incoming gRPC requests before they are processed. If the buffer is full,
    # new requests will return a `RESOURCE_EXHAUSTED` error.
    requestBufferSize: 50
  # bandwidthLimit is the default rate limit of the download speed in KB/MB/GB per second, default is 50GB/s.
  bandwidthLimit: 50GB
  # backToSourceBandwidthLimit is the rate limit of the back to source speed in KB/MB/GB per second, default is 50GB/s.
  backToSourceBandwidthLimit: 50GB
  # pieceTimeout is the timeout for downloading a piece from source.
  pieceTimeout: 360s
  # collectedPieceTimeout is the timeout for collecting one piece from the parent in the stream.
  collectedPieceTimeout: 360s
  # concurrentPieceCount is the number of concurrent pieces to download.
  concurrentPieceCount: 32

upload:
  server:
    # port is the port to the grpc server.
    port: 4000
  # # ip is the listen ip of the grpc server.
  # ip: ""
  # # CA certificate file path for mTLS.
  # caCert: /etc/ssl/certs/ca.crt
  # # GRPC server certificate file path for mTLS.
  # cert: /etc/ssl/certs/server.crt
  # # GRPC server key file path for mTLS.
  # key: /etc/ssl/private/server.pem
  #
    # The rate limit for the requests on the upload gRPC server.
    #
    # This limit applies to the total number of gRPC requests per second, including:
    # - Multiple requests within a single connection.
    # - Single requests across different connections.
    requestRateLimit: 400
    # The buffer size for the request channel on the upload gRPC server.
    #
    # This controls the capacity of the bounded channel used to queue
    # incoming gRPC requests before they are processed. If the buffer is full,
    # new requests will return a `RESOURCE_EXHAUSTED` error.
    requestBufferSize: 50
# # Client configuration for remote peer's upload server.
# client:
#   # CA certificate file path for mTLS.
#   caCert: /etc/ssl/certs/ca.crt
#   # GRPC client certificate file path for mTLS.
#   cert: /etc/ssl/certs/client.crt
#   # GRPC client key file path for mTLS.
#   key: /etc/ssl/private/client.pem
  # disableShared indicates whether disable to share data for other peers.
  disableShared: false
  # bandwidthLimit is the default rate limit of the upload speed in KB/MB/GB per second, default is 50GB/s.
  bandwidthLimit: 50GB

# manager:
  # # addr is manager address. The addr is optional. If the addr is not configured,
  # # dfdaemon runs without the manager, and the dynamic configuration is loaded
  # # from the local dynconfig.yaml file instead of being fetched from the manager,
  # # refer to Configure Dfdaemon Dynconfig YAML File.
  # addr: http://manager-service:65003
# # CA certificate file path for mTLS.
# caCert: /etc/ssl/certs/ca.crt
# # GRPC client certificate file path for mTLS.
# cert: /etc/ssl/certs/client.crt
# # GRPC client key file path for mTLS.
# key: /etc/ssl/private/client.pem

scheduler:
  # announceInterval is the interval to announce peer to the scheduler.
  # Announcer will provide the scheduler with peer information for scheduling,
  # peer information includes cpu, memory, etc.
  announceInterval: 1m
  # scheduleTimeout is timeout for the scheduler to respond to a scheduling request from dfdaemon, default is 3 hours.
  #
  # If the scheduler's response time for a scheduling decision exceeds this timeout,
  # dfdaemon will encounter a `TokioStreamElapsed(Elapsed(()))` error.
  #
  # Behavior upon timeout:
  #   - If `enable_back_to_source` is `true`, dfdaemon will attempt to download directly
  #     from the source.
  #   - Otherwise (if `enable_back_to_source` is `false`), dfdaemon will report a download failure.
  #
  # **Important Considerations Regarding Timeout Triggers**:
  # This timeout isn't solely for the scheduler's direct response. It can also be triggered
  # if the overall duration of the client's interaction with the scheduler for a task
  # (e.g., client downloading initial pieces and reporting their status back to the scheduler)
  # exceeds `schedule_timeout`. During such client-side processing and reporting,
  # the scheduler might be awaiting these updates before sending its comprehensive
  # scheduling response, and this entire period is subject to the `schedule_timeout`.
  #
  # **Configuration Guidance**:
  # To prevent premature timeouts, `schedule_timeout` should be configured to a value
  # greater than the maximum expected time for the *entire scheduling interaction*.
  # This includes:
  #   1. The scheduler's own processing and response time.
  #   2. The time taken by the client to download any initial pieces and download all pieces finished,
  #      as this communication is part of the scheduling phase.
  #
  # Setting this value too low can lead to `TokioStreamElapsed` errors even if the
  # network and scheduler are functioning correctly but the combined interaction time
  # is longer than the configured timeout.
  scheduleTimeout: 3h
  # maxScheduleCount is the max count of schedule.
  maxScheduleCount: 5
  # enableBackToSource indicates whether enable back-to-source download, when the scheduling failed.
  enableBackToSource: true
# # CA certificate file path for mTLS.
# caCert: /etc/ssl/certs/ca.crt
# # GRPC client certificate file path for mTLS.
# cert: /etc/ssl/certs/client.crt
# # GRPC client key file path for mTLS.
# key: /etc/ssl/private/client.pem

seedPeer:
  server:
    # port is the port to the tcp server.
    tcpPort: 4005
    # port is the port to the quic server.
    quicPort: 4006
  # enable indicates whether enable seed peer.
  enable: true
  # type is the type of seed peer.
  type: super

dynconfig:
  # refreshInterval is the interval to refresh dynamic configuration from the manager,
  # or from the local dynconfig.yaml file when the manager address is not configured.
  refreshInterval: 1m

storage:
  # dir is the directory to store task's metadata and content.
  dir: /var/lib/dragonfly/
  # keep indicates whether keep the task's metadata and content when the dfdaemon restarts.
  keep: true
  # writeBufferSize is the buffer size for writing piece to disk, default is 512KiB.
  writeBufferSize: 524288
  # readBufferSize is the buffer size for reading piece from disk, default is 512KiB.
  readBufferSize: 524288
  # writePieceTimeout is the timeout for writing a piece to storage(e.g., disk or cache).
  writePieceTimeout: 360s
  # writebackMode is the mode of initiating writeback of written piece ranges to disk.
  # sync awaits sync_file_range per piece write, async enqueues ranges to a dedicated
  # background task and off leaves writeback to the kernel, default is async.
  writebackMode: async
  server:
    # port is the port to the quic server.
    quicPort: 4006
    # tcp_fastopen indicates whether enable tcp fast open, refer to https://datatracker.ietf.org/doc/html/rfc7413.
    # Please check `net.ipv4.tcp_fastopen` sysctl is set to `3` to enable tcp fast open for both client and server.
    tcpFastopen: false
    # port is the port to the tcp server.
    tcpPort: 4005
    # # ip is the listen ip of the storage server.
    # ip: ""

gc:
  # interval is the interval to do gc.
  interval: 900s
  policy:
    # Task ttl is the ttl of the task. If the task's access time exceeds the ttl, dfdaemon
    # will delete the task cache.
    taskTTL: 720h
    # Persistent task ttl is the ttl of the persistent task. If the persistent task's ttl is None
    # in DownloadPersistentTask grpc request, dfdaemon will use persistent_task_ttl as the
    # persistent task's ttl.
    persistentTaskTTL: 24h
    # Persistent cache task ttl is the ttl of the persistent cache task. If the persistent cache
    # task's ttl is None in DownloadPersistentTask grpc request, dfdaemon will use
    # persistent_cache_task_ttl as the persistent cache task's ttl.
    persistentCacheTaskTTL: 24h
    # # diskThreshold optionally defines a specific disk capacity to be used as the base for
    # # calculating GC trigger points with `diskHighThresholdPercent` and `diskLowThresholdPercent`.
    # #
    # # - If a value is provided (e.g., "500GB"), the percentage-based thresholds (`diskHighThresholdPercent`,
    # #   `diskLowThresholdPercent`) are applied relative to this specified capacity.
    # # - If not provided or set to 0 (the default behavior), these percentage-based thresholds are applied
    # #   relative to the total actual disk space.
    # #
    # # This allows dfdaemon to effectively manage a logical portion of the disk for its cache,
    # # rather than always considering the entire disk volume.
    # diskThreshold: 10TiB
    #
    # diskHighThresholdPercent is the high threshold percent of the disk usage.
    # If the disk usage is greater than the threshold, dfdaemon will do gc.
    diskHighThresholdPercent: 90
    # diskLowThresholdPercent is the low threshold percent of the disk usage.
    # If the disk usage is less than the threshold, dfdaemon will stop gc.
    diskLowThresholdPercent: 70

proxy:
  server:
    # port is the port to the proxy server.
    port: 4001
    # requestRateLimit is the rate limit of the proxy server, default is 400 req/s.
    requestRateLimit: 400
  # # ip is the listen ip of the proxy server.
  # ip: ""
  # # caCert is the root CA cert path with PEM format for the proxy server to generate the server cert.
  # # If ca_cert is empty, proxy will generate a sample CA cert by rcgen::generate_simple_self_signed.
  # # When client requests via the proxy, the client should not verify the server cert and set
  # # insecure to true. If ca_cert is not empty, proxy will sign the server cert with the CA cert. If openssl is installed,
  # # you can use openssl to generate the root CA cert and make the system trust the root CA cert.
  # # Then set the ca_cert and ca_key to the root CA cert and key path. Dfdaemon generates the server cert
  # # and key, and signs the server cert with the root CA cert. When client requests via the proxy,
  # # the proxy can intercept the request by the server cert.
  #
  # caCert: ""
  # # caKey is the root CA key path with PEM format for the proxy server to generate the server cert.
  # # If ca_key is empty, proxy will generate a sample CA key by rcgen::generate_simple_self_signed.
  # # When client requests via the proxy, the client should not verify the server cert and set
  # # insecure to true. If ca_key is not empty, proxy will sign the server cert with the CA cert. If openssl is installed,
  # # you can use openssl to generate the root CA cert and make the system trust the root CA cert.
  # # Then set the ca_cert and ca_key to the root CA cert and key path. Dfdaemon generates the server cert
  # # and key, and signs the server cert with the root CA cert. When client requests via the proxy,
  # # the proxy can intercept the request by the server cert.
  #
  # caKey: ""
  # # basic_auth is the basic auth configuration for HTTP proxy in dfdaemon. If basic_auth is not
  # # empty, the proxy will use the basic auth to authenticate the client by Authorization
  # # header. The value of the Authorization header is "Basic base64(username:password)", refer
  # # to https://en.wikipedia.org/wiki/Basic_access_authentication.
  # basicAuth:
  #   # username is the username for basic auth.
  #   username: "admin"
  #   # password is the password for basic auth.
  #   password: "dragonfly"
  #
  # rules is the list of rules for the proxy server, and the first rule whose
  # regex matches the request url applies.
  # - regex: the regular expression matched against the request url.
  # - schedulingPolicy: how the download interacts with the scheduler, default is
  #   "auto". "auto" downloads small files, whose content length is less than or
  #   equal to the min piece length, from the source directly, skipping the
  #   scheduler. "always" downloads through the scheduler even for small files,
  #   so that the peer announces the task to the scheduler and other peers can
  #   discover it as a parent. It is useful for sharing small artifacts, such as
  #   OCI image manifests.
  # - useTLS: whether to use tls when the proxy connects to the backend.
  # - redirect: the url to redirect the request to.
  # - filteredQueryParams: the query params ignored when generating the task id.
  #   For example, when the filter is ["Signature", "Expires", "ns"],
  #   http://example.com/xyz?Expires=e1&Signature=s1&ns=docker.io and
  #   http://example.com/xyz?Expires=e2&Signature=s2&ns=docker.io generate the
  #   same task id. The default value includes the filtered query params of
  #   s3, gcs, oss, obs and cos.
  #
  # The following `X-Dragonfly-*` request headers override the rules on a
  # per-request basis:
  # - `X-Dragonfly-Use-P2P`: forces P2P distribution when the url matches no
  #   rule. If the url matches a rule, the request uses P2P distribution
  #   regardless of the header value.
  # - `X-Dragonfly-Scheduling-Policy`: overrides the schedulingPolicy of the
  #   matched rule.
  rules:
    - regex: 'blobs/sha256.*'
      schedulingPolicy: auto
      # useTLS: false
      # redirect: ""
      # filteredQueryParams: []
    - regex: 'manifests/sha256.*'
      schedulingPolicy: auto
      # useTLS: false
      # redirect: ""
      # filteredQueryParams: []
  registryMirror:
    # addr is the default address of the registry mirror. Proxy will start a registry mirror service for the
    # client to pull the image. The client can use the default address of the registry mirror in
    # configuration to pull the image. The `X-Dragonfly-Registry` header can instead of the default address
    # of registry mirror.
    addr: https://index.docker.io
    # enableTaskIDBasedBlobDigest indicates whether to use the digest for task ID calculation
    # when downloading from OCI registries. When enabled for OCI blob URLs (e.g., /v2/<name>/blobs/sha256:<digest>)
    # and OCI manifest URLs referenced by a digest (e.g., /v2/<name>/manifests/sha256:<digest>),
    # the task ID is derived from the digest rather than the full URL. This enables deduplication across
    # registries - the same blob or manifest from different registries shares one task ID, eliminating
    # redundant downloads and storage.
    enableTaskIDBasedBlobDigest: true
  # # cert is the client cert path with PEM format for the registry.
  # # If registry use self-signed cert, the client should set the
  # # cert for the registry mirror.
  # cert: ""
  # disableBackToSource indicates whether disable to download back-to-source when download failed.
  disableBackToSource: false
  # prefetch pre-downloads full of the task when download with range request.
  # X-Dragonfly-Prefetch priority is higher than prefetch in config.
  # If the value is "true", the range request will prefetch the entire file.
  # If the value is "false", the range request will fetch the range content.
  prefetch: false
  # prefetchBandwidthLimit is the rate limit of the prefetch speed in KB/MB/GB per second, default is 10GB/s.
  # The prefetch request has lower priority so limit the rate to avoid occupying the bandwidth impact other download tasks.
  prefetchBandwidthLimit: 10GB
  # readBufferSize is the buffer size for reading piece from disk, default is 512KiB.
  readBufferSize: 524288

metrics:
  server:
    # port is the port to the metrics server.
    port: 4002
  # # ip is the listen ip of the metrics server.
  # ip: ""

stats:
  server:
    # port is the port to the stats server.
    port: 4004
  # # ip is the listen ip of the stats server.
  # ip: ""

health:
  server:
    # port is the port to the health server.
    port: 4003
  # # ip is the listen ip of the health server.
  # ip: ""

backend:
  # requestHeader is the user customized request header which will be applied to the request when proxying to the origin server.
  requestHeader: {}
  # The maximum number of retry attempts when a chunk request to the backend
  # storage fails. Once this limit is reached, the request will be considered
  # failed and an error will be returned.
  maxRetries: 1
  # enableCacheTemporaryRedirect enables caching of 307 redirect URLs.
  #
  # Motivation: Dragonfly splits a download URL into multiple pieces and performs multiple
  # requests. Without caching, each piece request may trigger the same 307 redirect again,
  # repeating the redirect flow and adding extra latency. Caching the resolved redirect URL
  # reduces repeated redirects and improves request performance.
  enableCacheTemporaryRedirect: true
  # cacheTemporaryRedirectTTL is the TTL for cached 307 redirect URLs. After
  # this duration, the cached redirect target will expire and be re-resolved.
  cacheTemporaryRedirectTTL: 600s
  # Put concurrent chunk count specifies the maximum number of chunks to upload in parallel
  # to backend storage. Higher values can improve upload throughput by maximizing bandwidth utilization,
  # but increase memory usage and backend load. Lower values reduce resource consumption but may
  # underutilize available bandwidth. Tune based on your network capacity and backend concurrency limits.
  putConcurrentChunkCount: 16
  # Put chunk size specifies the size of each chunk when uploading data to backend storage.
  # Larger chunks reduce the total number of requests and API overhead, but require more memory
  # for buffering and may delay upload start. Smaller chunks reduce memory footprint and provide
  # faster initial response, but increase request overhead and API costs. Choose based on your
  # network conditions, available memory, and backend pricing/performance characteristics.
  putChunkSize: 8MiB
  # Put timeout specifies the maximum duration allowed for uploading a single object
  # (potentially consisting of multiple chunks) to the backend storage. If the upload
  # does not complete within this time window, the operation will be canceled and
  # treated as a failure.
  putTimeout: 900s

# tracing is the tracing configuration for dfdaemon.
# tracing:
#   # Protocol specifies the communication protocol for the tracing server.
#   # Supported values: "http", "https", "grpc" (default: None).
#   # This determines how tracing logs are transmitted to the server.
#   protocol: grpc
#   # endpoint is the endpoint to report tracing log, example: "localhost:4317".
#   endpoint: localhost:4317
#   # path is the path to report tracing log, example: "/v1/traces" if the protocol is "http" or "https".
#   path: "/v1/traces"
#   # headers is the grpc's headers to send with tracing log.
#   headers: {}

# Network configuration.
network:
  # enableIPv6 indicates whether to enable IPv6 networking.
  enableIPv4: false
```

## Configure Dfdaemon Dynconfig YAML File {#configure-dfdaemon-dynconfig-yaml-file}

When `manager.addr` is not configured, dfdaemon runs without the manager and loads the
dynamic configuration from a local `dynconfig.yaml` file (typically mounted as a
Kubernetes ConfigMap) instead of fetching it from the manager.

Configure `dynconfig.yaml`, the default path is `/etc/dragonfly/dynconfig.yaml`. The path can
be overridden with the `--dynconfig` flag or the `DFDAEMON_DYNCONFIG` environment variable.
If the file does not exist, it is generated with the default values on startup. The
configuration is refreshed periodically according to the `dynconfig.refreshInterval` in
`dfdaemon.yaml`, default is `1m`.

Scheduler discovery supports two modes: if the static address list `scheduler.addrs` is
non-empty, it takes precedence; otherwise dfdaemon resolves the scheduler headless service
address `scheduler.addr` via DNS to obtain the list of scheduler addresses. Each discovered
scheduler is health-checked, and unhealthy schedulers are filtered out.

```yaml
scheduler:
  # addr is the address of the scheduler headless service with port, resolved via DNS
  # to discover all scheduler addresses.
  addr: 'scheduler-headless.default.svc:8002'
# # addrs is the static list of scheduler addresses with port.
# # When non-empty, it takes precedence over addr.
# addrs: ['192.168.1.10:8002', '192.168.1.11:8002']

# clientConfig is the block list configuration for clients running as normal peers.
clientConfig:
  blockList:
    task:
      download:
        # applications is the blocked application names.
        applications: []
        # urls is the blocked URL regex patterns.
        urls: []
        # tags is the blocked tags.
        tags: []
        # priorities is the blocked priorities.
        priorities: []
    persistentTask:
      upload:
        applications: []
        urls: []
        tags: []
      download:
        applications: []
        urls: []
        tags: []
        priorities: []
    persistentCacheTask:
      upload:
        applications: []
        urls: []
        tags: []
      download:
        applications: []
        urls: []
        tags: []
        priorities: []

# seedClientConfig is the block list configuration for clients running as seed peers,
# the structure is the same as clientConfig.
seedClientConfig:
  blockList:
    task:
      download:
        applications: []
        urls: []
        tags: []
        priorities: []
    persistentTask:
      upload:
        applications: []
        urls: []
        tags: []
      download:
        applications: []
        urls: []
        tags: []
        priorities: []
    persistentCacheTask:
      upload:
        applications: []
        urls: []
        tags: []
      download:
        applications: []
        urls: []
        tags: []
        priorities: []
```

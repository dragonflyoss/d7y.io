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

  # scheduler_cluster_id is the ID of the cluster to which the scheduler belongs.
  # NOTE: This field is used to identify the cluster to which the scheduler belongs.
  # If this flag is set, the idc, location, hostname and ip will be ignored when listing schedulers.
  schedulerClusterID: 1

server:
  # pluginDir is the directory to store plugins.
  pluginDir: /var/lib/dragonfly/plugins/dfdaemon/
  # cacheDir is the directory to store cache files.
  cacheDir: /var/cache/dragonfly/dfdaemon/

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
    # request_rate_limit is the rate limit of the download request in the download grpc server, default is 5000 req/s.
    requestRateLimit: 5000
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
    # request_rate_limit is the rate limit of the upload request in the upload grpc server, default is 5000 req/s.
    requestRateLimit: 5000
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

manager:
  # addr is manager address.
  addr: http://manager-service:65003
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
  # schedule_timeout is timeout for the scheduler to respond to a scheduling request from dfdaemon, default is 3 hours.
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
  # refreshInterval is the interval to refresh dynamic configuration from manager.
  refreshInterval: 1m

storage:
  # dir is the directory to store task's metadata and content.
  dir: /var/lib/dragonfly/
  # keep indicates whether keep the task's metadata and content when the dfdaemon restarts.
  keep: true
  # writeBufferSize is the buffer size for writing piece to disk, default is 4MiB.
  writeBufferSize: 4194304
  # readBufferSize is the buffer size for reading piece from disk, default is 4MiB.
  readBufferSize: 4194304
  # writePieceTimeout is the timeout for writing a piece to storage(e.g., disk or cache).
  writePieceTimeout: 360s
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
    #
    # diskThreshold: 10TiB
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
  # # ip is the listen ip of the proxy server.
  # ip: ""
  # # caCert is the root CA cert path with PEM format for the proxy server to generate the server cert.
  # # If ca_cert is empty, proxy will generate a smaple CA cert by rcgen::generate_simple_self_signed.
  # # When client requests via the proxy, the client should not verify the server cert and set
  # # insecure to true. If ca_cert is not empty, proxy will sign the server cert with the CA cert. If openssl is installed,
  # # you can use openssl to generate the root CA cert and make the system trust the root CA cert.
  # # Then set the ca_cert and ca_key to the root CA cert and key path. Dfdaemon generates the server cert
  # # and key, and signs the server cert with the root CA cert. When client requests via the proxy,
  # # the proxy can intercept the request by the server cert.
  #
  # caCert: ""
  # # caKey is the root CA key path with PEM format for the proxy server to generate the server cert.
  # # If ca_key is empty, proxy will generate a smaple CA key by rcgen::generate_simple_self_signed.
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
  # rules is the list of rules for the proxy server.
  # regex is the regex of the request url.
  # useTLS indicates whether use tls for the proxy backend.
  # redirect is the redirect url.
  # filteredQueryParams is the filtered query params to generate the task id.
  # When filter is ["Signature", "Expires", "ns"], for example:
  # http://example.com/xyz?Expires=e1&Signature=s1&ns=docker.io and http://example.com/xyz?Expires=e2&Signature=s2&ns=docker.io
  # will generate the same task id.
  # Default value includes the filtered query params of s3, gcs, oss, obs, cos.
  # `X-Dragonfly-Use-P2P` header can instead of the regular expression of the rule. If the value is "true",
  # the request will use P2P technology to distribute the content. If the value is "false",
  # but url matches the regular expression in rules. The request will also use P2P technology to distribute the content.
  rules:
    - regex: blobs/sha256.*
      # useTLS: false
      # redirect: ""
      # filteredQueryParams: []
  registryMirror:
    # addr is the default address of the registry mirror. Proxy will start a registry mirror service for the
    # client to pull the image. The client can use the default address of the registry mirror in
    # configuration to pull the image. The `X-Dragonfly-Registry` header can instead of the default address
    # of registry mirror.
    addr: https://index.docker.io
    # enableTaskIDBasedBlobDigest indicates whether to use the blob digest for task ID calculation
    # when downloading from OCI registries. When enabled for OCI blob URLs (e.g., /v2/<name>/blobs/sha256:<digest>),
    # the task ID is derived from the blob digest rather than the full URL. This enables deduplication across
    # registries - the same blob from different registries shares one task ID, eliminating redundant downloads
    # and storage.
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
  # readBufferSize is the buffer size for reading piece from disk, default is 4MiB.
  readBufferSize: 4194304

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

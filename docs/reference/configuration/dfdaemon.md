---
id: dfdaemon
title: Dfdaemon
---

## Configure Dfdaemon YAML File {#configure-dfdaemon-yaml-file}

The default path for the dfdaemon yaml configuration file is `/etc/dragonfly/dfget.yaml` in linux,
and the default path is `$HOME/.dragonfly/config/dfget.yaml` in darwin.

```yaml
# Daemon alive time, when sets 0s, daemon will not auto exit
# it is useful for longtime running.
aliveTime: 0s

# Daemon gc task running interval.
gcInterval: 1m0s

# WorkHome is working directory.
# In linux, default value is /usr/local/dragonfly.
# In macos(just for testing), default value is /Users/$USER/.dragonfly.
workHome: ''

# workHomeMode is used to set the file mode bits for the workHome directory.
# The default is 0755.
workHomeMode: 0755

# logDir is the log directory.
# In linux, default value is /var/log/dragonfly.
# In macos(just for testing), default value is /Users/$USER/.dragonfly/logs.
logDir: ''

# cacheDir is dynconfig cache directory.
# In linux, default value is /var/cache/dragonfly.
# In macos(just for testing), default value is /Users/$USER/.dragonfly/cache.
cacheDir: ''

# cacheDirMode is used to set the file mode bits for the cacheDir directory.
# The default is 0755.
cacheDirMode: 0755

# pluginDir is the plugin directory.
# In linux, default value is /usr/local/dragonfly/plugins.
# In macos(just for testing), default value is /Users/$USER/.dragonfly/plugins.
pluginDir: ''

# dataDir is the download data directory.
# In linux, default value is /var/lib/dragonfly.
# In macos(just for testing), default value is /Users/$USER/.dragonfly/data.
dataDir: ''

# dataDirMode is used to set the file mode bits for the dataDir directory.
# The default is 0755.
dataDirMode: 0755

# When daemon exit, keep peer task data or not.
# it is usefully when upgrade daemon service, all local cache will be saved
# default is false.
keepStorage: false

# Console shows log on console.
console: false

# Whether to enable debug level logger and enable pprof.
verbose: false

# Listen port for pprof, only valid when the verbose option is true
# default is -1. If it is 0, pprof will use a random port.
pprof-port: -1

# Jaeger endpoint url, like: http://jaeger.dragonfly.svc:14268/api/traces.
jaeger: ''

# All addresses of all schedulers
# the schedulers of all daemons should be same in one region or zone.
# daemon will send tasks to a fixed scheduler by hashing the task url and meta data.
# caution: only tcp is supported.
scheduler:
  manager:
    # Get scheduler list dynamically from manager.
    enable: true
    # Manager service addresses.
    netAddrs:
      - type: tcp
        addr: manager-service:65003
    # Scheduler list refresh interval.
    refreshInterval: 10m
    # Seed peer configuration.
    seedPeer:
      # Dfdaemon enabled seed peer mode.
      enable: false
      # Seed peer type includes super, strong and weak.
      type: super
      # Seed peer cluster id.
      clusterID: 1
      keepAlive:
        # Keep alive internal.
        internal: 5s
  # Schedule timeout.
  scheduleTimeout: 30s
  # When true, only scheduler says back source, daemon can back source.
  disableAutoBackSource: false
  # Below example is a stand address.
  # netAddrs:
  #  - type: tcp
  #    addr: scheduler-service:8002

# Current host info used for scheduler.
host:
  # # Access ip for other peers,
  # # when local ip is different with access ip, advertiseIP should be set.
  # advertiseIP: 127.0.0.1
  # Geographical location, separated by "|" characters.
  location: ''
  # IDC deployed by daemon.
  idc: ''
  # Daemon hostname.
  # hostname: ""

# Download service option.
download:
  # Calculate digest when transfer files, set false to save memory.
  calculateDigest: true
  # Total download limit per second.
  totalRateLimit: 1024Mi
  # Per peer task download limit per second.
  perPeerRateLimit: 512Mi
  # Download piece timeout.
  pieceDownloadTimeout: 30s
  # When request data with range header, prefetch data not in range.
  prefetch: false
  # Golang transport option for downloading pieces from other peers.
  transportOption:
    # Dial timeout.
    dialTimeout: 2s
    # Keep alive.
    keepAlive: 30s
    # Same with http.Transport.MaxIdleConns.
    maxIdleConns: 100
    # Same with http.Transport.IdleConnTimeout.
    idleConnTimeout: 90s
    # Same with http.Transport.ResponseHeaderTimeout.
    responseHeaderTimeout: 2s
    # Same with http.Transport.TLSHandshakeTimeout.
    tlsHandshakeTimeout: 1s
    # Same with http.Transport.ExpectContinueTimeout.
    expectContinueTimeout: 2s
  # Resource clients option for back source, the key is the scheme of resource client.
  # This option supports after v2.0.9.
  resourceClients:
    # The https resource.
    https:
      # # Upstream proxy, default is none.
      # proxy: http://127.0.0.1
      # Dial timeout. Default: 30s.
      dialTimeout: 30s
      # Keep alive. Default: 30s.
      keepAlive: 30s
      # Same with http.Transport.MaxIdleConns.
      maxIdleConns: 100
      # Same with http.Transport.IdleConnTimeout. Default: 90s.
      idleConnTimeout: 90s
      # Same with http.Transport.ResponseHeaderTimeout. Default: 30s.
      responseHeaderTimeout: 30s
      # Same with http.Transport.TLSHandshakeTimeout.
      tlsHandshakeTimeout: 30s
      # Same with http.Transport.ExpectContinueTimeout. Default: 10s.
      expectContinueTimeout: 10s
      # Same with http.Transport.TLSClientConfig.InsecureSkipVerify.
      # Caution: the value default is true, please keep it false in production.
      # We will make the vaule false by default in futrue.
      insecureSkipVerify: true
    # The http resources, most of it is same with https scheme.
    http:
      # # Upstream proxy, default is none.
      # proxy: http://127.0.0.1
      # Dial timeout. Default: 30s.
      dialTimeout: 30s
      # Keep alive. Default: 30s.
      keepAlive: 30s
      # Same with http.Transport.MaxIdleConns.
      maxIdleConns: 100
      # Same with http.Transport.IdleConnTimeout. Default: 90s.
      idleConnTimeout: 90s
      # Same with http.Transport.ResponseHeaderTimeout. Default: 30s.
      responseHeaderTimeout: 30s
      # Same with http.Transport.TLSHandshakeTimeout.
      tlsHandshakeTimeout: 30s
      # Same with http.Transport.ExpectContinueTimeout. Default: 10s.
      expectContinueTimeout: 10s
    # The singularity oras resources, most of it is same with https scheme.
    oras:
      # # Upstream proxy, default is none.
      # proxy: http://127.0.0.1
      # Dial timeout. Default: 30s.
      dialTimeout: 30s
      # Keep alive. Default: 30s.
      keepAlive: 30s
      # Same with http.Transport.MaxIdleConns.
      maxIdleConns: 100
      # Same with http.Transport.IdleConnTimeout. Default: 90s.
      idleConnTimeout: 90s
      # Same with http.Transport.ResponseHeaderTimeout. Default: 30s.
      responseHeaderTimeout: 30s
      # Same with http.Transport.TLSHandshakeTimeout.
      tlsHandshakeTimeout: 30s
      # Same with http.Transport.ExpectContinueTimeout. Default: 10s.
      expectContinueTimeout: 10s
      # Same with http.Transport.TLSClientConfig.InsecureSkipVerify.
      # Caution: the value default is true, please keep it false in production.
      # We will make the vaule false by default in futrue.
      insecureSkipVerify: true
  # Concurrent option for back source, default: empty.
  # if you want to enable concurrent option, thresholdSize and goroutineCount is enough, keep other options empty is okay.
  concurrent:
    # thresholdSize indicates the threshold to download pieces concurrently.
    thresholdSize: 10M
    # thresholdSpeed indicates the threshold download speed to download pieces concurrently.
    thresholdSpeed: 2M
    # goroutineCount indicates the concurrent goroutine count for every task.
    goroutineCount: 4
    # initBackoff second for every piece failed, default: 0.5.
    initBackoff: 0.5
    # maxBackoff second for every piece failed, default: 3.
    maxBackoff: 3
    # maxAttempts for every piece failed,default: 3.
    maxAttempts: 3
  # Download grpc option.
  downloadGRPC:
    # Security option.
    security:
      insecure: true
      cacert: ''
      cert: ''
      key: ''
      tlsVerify: true
      tlsConfig: null
    # Download service listen address
    # current, only support unix domain socket.
    unixListen:
      # In linux, default value is /var/run/dfdaemon.sock.
      # In macos(just for testing), default value is /tmp/dfdaemon.sock.
      # If change the default path, need to specify the changed path through --daemon-sock
      # when using dfget to download.
      socket: ''
  # Peer grpc option.
  # Peer grpc service send pieces info to other peers.
  peerGRPC:
    security:
      insecure: true
      cacert: ''
      cert: ''
      key: ''
      tlsVerify: true
    tcpListen:
      # # Listen address.
      # listen: 0.0.0.0
      # Listen port, daemon will try to listen,
      # when this port is not available, daemon will try next port.
      port: 65000
      # If want to limit upper port, please use blow format.
#     port:
#       start: 65000
#       end: 65009

# Upload service option.
upload:
  # Upload limit per second.
  rateLimit: 1024Mi
  security:
    insecure: true
    cacert: ''
    cert: ''
    key: ''
    tlsVerify: false
  tcpListen:
    # # Listen address.
    # listen: 0.0.0.0
    # Listen port, daemon will try to listen,
    # when this port is not available, daemon will try next port.
    port: 65002
    # If want to limit upper port, please use blow format.
#   port:
#     start: 65020
#     end: 65029

# Object storage service.
objectStorage:
  # Enable object storage service.
  enable: false
  # Filter is used to generate a unique Task ID by
  # filtering unnecessary query params in the URL,
  # it is separated by & character.
  # When filter: "Expires&Signature&ns", for example:
  #  http://localhost/xyz?Expires=111&Signature=222&ns=docker.io and http://localhost/xyz?Expires=333&Signature=999&ns=docker.io
  # is same task.
  filter: 'Expires&Signature&ns'
  # maxReplicas is the maximum number of replicas of an object cache in seed peers.
  maxReplicas: 3
  # Object storage service security option.
  security:
    insecure: true
    tlsVerify: true
  tcpListen:
    # # Listen address.
    # listen: 0.0.0.0
    # Listen port.
    port: 65004

# Peer task storage option.
storage:
  # Task data expire time,
  # when there is no access to a task data, this task will be gc.
  taskExpireTime: 6h
  # Storage strategy when process task data.
  # io.d7y.storage.v2.simple : download file to data directory first, then copy to output path, this is default action
  #                           the download file in date directory will be the peer data for uploading to other peers.
  # io.d7y.storage.v2.advance: download file directly to output path with postfix, hard link to final output,
  #                            avoid copy to output path, fast than simple strategy, but:
  #                            the output file with postfix will be the peer data for uploading to other peers
  #                            when user delete or change this file, this peer data will be corrupted.
  # default is io.d7y.storage.v2.simple.
  strategy: io.d7y.storage.v2.simple.
  # Disk quota gc threshold, when the quota of all tasks exceeds the gc threshold, the oldest tasks will be reclaimed.
  diskGCThreshold: 50Gi
  # Disk used percent gc threshold, when the disk used percent exceeds, the oldest tasks will be reclaimed.
  # eg, diskGCThresholdPercent=80, when the disk usage is above 80%, start to gc the oldest tasks.
  diskGCThresholdPercent: 80
  # Set to ture for reusing underlying storage for same task id.
  multiplex: true

# Health service option.
health:
  security:
    insecure: true
    cacert: ''
    cert: ''
    key: ''
    tlsVerify: false
  tcpListen:
    # Health path, default value is /server/ping.
    path: /server/ping
    # # Listen address.
    # listen: 0.0.0.0
    # Listen port, daemon will try to listen,
    # when this port is not available, daemon will try next port.
    port: 40901
    # If want to limit upper port, please use blow format.
#   port:
#     start: 40901
#     end: 40901

# Proxy service detail option.
proxy:
  # Filter for hash url.
  # when defaultFilter: "Expires&Signature&ns", for example:
  #  http://localhost/xyz?Expires=111&Signature=222&ns=docker.io and http://localhost/xyz?Expires=333&Signature=999&ns=docker.io
  # is same task, it is also possible to override the default filter by adding
  # the X-Dragonfly-Filter header through the proxy.
  defaultFilter: 'Expires&Signature&ns'
  # Tag the task.
  # when the value of the default tag is different,
  # the same download url can be divided into different tasks according to the tag,
  # it is also possible to override the default tag by adding
  # the X-Dragonfly-Tag header through the proxy.
  defaultTag: ''
  security:
    insecure: true
    cacert: ''
    cert: ''
    key: ''
    tlsVerify: false
  tcpListen:
    # namespace stands the linux net namespace, like /proc/1/ns/net.
    # It's useful for running daemon in pod with ip allocated and listening the special port in host net namespace.
    # Linux only.
    namespace: ''
    # # Listen address.
    # listen: 0.0.0.0
    # Listen port, daemon will try to listen,
    # when this port is not available, daemon will try next port.
    port: 65001
    # If want to limit upper port, please use blow format.
  #   port:
  #     start: 65020
  #     end: 65029
  registryMirror:
    # When enable, using header "X-Dragonfly-Registry" for remote instead of url.
    dynamic: true
    # URL for the registry mirror.
    url: https://index.docker.io
    # Whether to ignore https certificate errors.
    insecure: true
    # Optional certificates if the remote server uses self-signed certificates.
    certs: []
    # Whether to request the remote registry directly.
    direct: false
    # Whether to use proxies to decide if dragonfly should be used.
    useProxies: false

  proxies:
    # Proxy all http image layer download requests with dfget.
    - regx: blobs/sha256.*
    # Change http requests to some-registry to https and proxy them with dfget.
    - regx: some-registry/
      useHTTPS: true
    # Proxy requests directly, without dfget.
    - regx: no-proxy-reg
      direct: true
    # Proxy requests with redirect.
    - regx: some-registry
      redirect: another-registry
    # The same with url rewrite like apache ProxyPass directive.
    - regx: ^http://some-registry/(.*)
      redirect: http://another-registry/$1

  hijackHTTPS:
    # Key pair used to hijack https requests.
    cert: ''
    key: ''
    hosts:
      - regx: mirror.aliyuncs.com:443 # regexp to match request hosts
        # Whether to ignore https certificate errors.
        insecure: true
        # Optional certificates if the host uses self-signed certificates.
        certs: []
  # Max tasks to download same time, 0 is no limit.
  maxConcurrency: 0
  whiteList:
    # The host of the whitelist.
    - host: ''
      # Match whitelist hosts.
      regx:
      # Port that need to be added to the whitelist.
      ports:
  # Setup basic auth for proxy.
  basicAuth:
    username: 'admin'
    password: 'password'

security:
  # autoIssueCert indicates to issue client certificates for all grpc call.
  # If AutoIssueCert is false, any other option in Security will be ignored.
  autoIssueCert: false
  # caCert is the root CA certificate for all grpc tls handshake, it can be path or PEM format string.
  caCert: ''
  # tlsVerify indicates to verify certificates.
  tlsVerify: false
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
    # ipAddresses is a list of ip addresses be set on the certificate.
    ipAddresses:
    # validityPeriod is the validity period  of certificate.
    validityPeriod: 4320h
# Prometheus metrics address.
# ":" is necessary for metrics value
# metrics: ':8000'

network:
  # Enable ipv6.
  enableIPv6: false

# Announcer will provide the scheduler with peer information for scheduling.
# Peer information includes cpu, memory, etc.
announcer:
  # schedulerInterval is the interval of announcing scheduler.
  schedulerInterval: 30s

# Network topology configuration.
networkTopology:
  # Enable network topology service. It will get destination hosts from the scheduler
  # according to the value of Interval, and probe destination hosts.
  enable: true
  probe:
    # interval is the interval of probing hosts.
    interval: 20m
```

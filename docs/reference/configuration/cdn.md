---
id: cdn
title: CDN
---

## Configure CDN YAML File {#configure-cdn-yaml-file}

The default path for the cdn yaml configuration file is `/etc/dragonfly/cdn.yaml` in linux,
and the default path is `$HOME/.dragonfly/config/cdn.yaml` in darwin.

```yaml
base:
  # listenPort is the port cdn server listens on.
  # default: 8003
  listenPort: 8003

  # DownloadPort is the port for download files from cdn.
  # And you should start a file server firstly which listens on the download port.
  # default: 8001
  downloadPort: 8001

  # SystemReservedBandwidth is the network bandwidth reserved for system software.
  # default: 20 MB, in format of G(B)/g/M(B)/m/K(B)/k/B, pure number will also be parsed as Byte.
  systemReservedBandwidth: 20M

  # MaxBandwidth is the network bandwidth that cdn can use.
  # default: 1G, in format of G(B)/g/M(B)/m/K(B)/k/B, pure number will also be parsed as Byte.
  maxBandwidth: 1G

  # AdvertiseIP is used to set the ip that we advertise to other peer in the p2p-network.
  # By default, the first non-loop address is advertised.
  advertiseIP:

  # FailAccessInterval is the interval time after failed to access the URL.
  # If a task failed to be downloaded from the source, it will not be retried in the time since the last failure.
  # default: 3m
  failAccessInterval: 3m

  # GCInitialDelay is the delay time from the start to the first GC execution.
  # default: 6s
  gcInitialDelay: 6s

  # GCMetaInterval is the interval time to execute GC meta.
  # default: 2m0s
  gcMetaInterval: 2m

  # TaskExpireTime when a task is not accessed within the taskExpireTime,
  # and it will be treated to be expired.
  # default: 3m0s
  taskExpireTime: 3m

  # storageMode is the Mode of storage policy, [disk/hybrid]
  storageMode: disk

  # logDir is the log storage directory
  # in linux, default value is /var/log/dragonfly
  # in macos(just for testing), default value is /Users/$USER/.dragonfly/logs
  logDir: ''

  # manager configuration
  manager:
    addr: manager-service:65003
    cdnClusterID: 1
    keepAlive:
      interval: 5s

  # host configuration
  host:
    location:
    idc:

  # enable prometheus metrics
  # metrics:
  #  # metrics service address
  #  addr: ":8000"

plugins:
  storagedriver:
    - name: disk
      enable: true
      config:
        baseDir: /Users/${USER_HOME}/ftp
    - name: memory
      enable: false
      config:
        baseDir: /dev/shm/dragonfly
  storagemanager:
    - name: disk
      enable: true
      config:
        gcInitialDelay: 0s
        gcInterval: 15s
        driverConfigs:
          disk:
            gcConfig:
              youngGCThreshold: 100.0GB
              fullGCThreshold: 5.0GB
              cleanRatio: 1
              intervalThreshold: 2h0m0s
    - name: hybrid
      enable: false
      config:
        gcInitialDelay: 0s
        gcInterval: 15s
        driverConfigs:
          disk:
            gcConfig:
              youngGCThreshold: 100.0GB
              fullGCThreshold: 5.0GB
              cleanRatio: 1
              intervalThreshold: 2h0m0s
          memory:
            gcConfig:
              youngGCThreshold: 100.0GB
              fullGCThreshold: 5.0GB
              cleanRatio: 3
              intervalThreshold: 2h0m0s

# console shows log on console
console: false

# whether to enable debug level logger and enable pprof
verbose: false

# listen port for pprof, only valid when the verbose option is true
# default is -1. If it is 0, pprof will use a random port.
pprof-port: -1

# jaeger endpoint url, like: http://jaeger.dragonfly.svc:14268/api/traces
jaeger: ''

# service name used in tracer
# default: dragonfly-cdn
service-name: dragonfly-cdn
```

## Configure Nginx {#configure-nginx}

<!-- markdownlint-disable -->

```nginx
worker_rlimit_nofile        100000;

events {
    use                     epoll;
    worker_connections      20480;
}

http {
    include                 mime.types;
    default_type            application/octet-stream;
    root                    /home/admin/cai/htdocs;
    sendfile                on;
    tcp_nopush              on;

    server_tokens           off;
    keepalive_timeout       5;

    client_header_timeout   1m;
    send_timeout            1m;
    client_max_body_size    3m;

    index                   index.html index.htm;
    access_log              off;
    log_not_found           off;

    gzip                    on;
    gzip_http_version       1.0;
    gzip_comp_level         6;
    gzip_min_length         1024;
    gzip_proxied            any;
    gzip_vary               on;
    gzip_disable            msie6;
    gzip_buffers            96 8k;
    gzip_types              text/xml text/plain text/css application/javascript application/x-javascript application/rss+xml application/json;

    proxy_set_header        Host $host;
    proxy_set_header        X-Real-IP $remote_addr;
    proxy_set_header        Web-Server-Type nginx;
    proxy_set_header        WL-Proxy-Client-IP $remote_addr;
    proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_redirect          off;
    proxy_buffers           128 8k;
    proxy_intercept_errors  on;

    server {
        listen              8001;
        location / {
            root /home/admin/ftp;
        }
    }
}
```

<!-- markdownlint-restore -->

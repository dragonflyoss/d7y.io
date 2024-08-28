---
id: dfdaemon
title: Dfdaemon
slug: /reference/commands/client/dfdaemon/
---

Dragonfly 中的高性能 P2P 下载守护进程，可以下载不同协议的资源。当用户触发文件下载任务时，
dfdaemon 将从其他 peer 下载文件片段。同时，它将充当上传者，支持其他节点从它下载片段（如果它拥有这些片段）。

## Dfdaemon 可选参数

<!-- markdownlint-disable -->

```text
 -c, --config <CONFIG>
          Specify config file to use

          [default: /etc/dragonfly/dfdaemon.yaml]

      --lock-path <LOCK_PATH>
          Specify the lock file path

          [default: /var/lock/dragonfly/dfdaemon.lock]

  -l, --log-level <LOG_LEVEL>
          Specify the logging level [trace, debug, info, warn, error]

          [default: info]

      --log-dir <LOG_DIR>
          Specify the log directory

          [default: /var/log/dragonfly/dfdaemon]

      --log-max-files <LOG_MAX_FILES>
          Specify the max number of log files

          [default: 24]

      --verbose
          Specify whether to print log

  -h, --help
          Print help (see a summary with '-h')

  -V, --version
          Print version
```

<!-- markdownlint-restore -->

## 例子

### 使用 Proxy 下载

#### 使用 HTTP 协议下载

编辑配置文件 Linux 环境下默认 Dfdaemon 配置路径为 `/etc/dragonfly/dfdaemon.yaml`，
参考文档 [Dfdaemon](../../configuration/client/dfdaemon.md)。

> 注意：可以根据下载路径修改 `proxy.rules.regex` 来调整路由匹配规则。

```yaml
proxy:
  server:
    port: 4001
  rules:
    - regex: '.*example.*'
```

```shell
curl -v -x 127.0.0.1:4001 http://<host>:<port>/<path> --output /path/to/example
```

#### 使用 HTTPS 协议下载

##### 使用 Insecure HTTPS 协议下载

编辑配置文件 Linux 环境下默认 Dfdaemon 配置路径为 `/etc/dragonfly/dfdaemon.yaml`，
参考文档 [Dfdaemon](../../configuration/client/dfdaemon.md)。

> 注意：可以根据下载路径修改 `proxy.rules.regex` 来调整路由匹配规则。

```yaml
proxy:
  server:
    port: 4001
  rules:
    - regex: '.*example.*'
```

使用 Insecure HTTPS 请求下载文件

```shell
curl -v -x 127.0.0.1:4001 https://<host>:<port>/<path> --insecure --output /path/to/example
```

##### 使用自签 CA 证书进行 HTTPS 协议下载

手动生成自签名证书。

```shell
openssl req -x509 -sha256 -days 36500 -nodes -newkey rsa:4096 -keyout ca.key -out ca.crt
```

信任自签名证书。

- Ubuntu:

```shell
cp ca.crt /usr/local/share/ca-certificates/ca.crt
update-ca-certificates
```

- Red Hat (CentOS etc):

```shell
cp ca.crt /etc/pki/ca-trust/source/anchors/ca.crt
update-ca-trust
```

编辑配置文件 Linux 环境下默认 Dfdaemon 配置路径为 `/etc/dragonfly/dfdaemon.yaml`，
参考文档 [Dfdaemon](../../configuration/client/dfdaemon.md)。

> 注意：可以根据下载路径修改 `proxy.rules.regex` 来调整路由匹配规则。

```yaml
server:
  port: 4001
  caCert: ca.crt
  caKey: ca.key
rules:
  - regex: '.*example.*'
```

使用 HTTPS 请求下载文件

```shell
curl -v -x 127.0.0.1:4001 https://<host>:<port>/<path> --output /path/to/example
```

## Dfdaemon 日志

```text
1. 终端日志输出需要增加命令行参数 --verbose
2. 正常情况日志目录: /var/log/dragonfly/dfdaemon/
```

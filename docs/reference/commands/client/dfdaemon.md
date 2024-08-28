---
id: dfdaemon
title: Dfdaemon
slug: /reference/commands/client/dfdaemon/
---

A high performance P2P download daemon in Dragonfly that can download resources of different protocols.
When user triggers a file downloading task, dfdaemon will download the pieces of file from other peers.
Meanwhile, it will act as an uploader to support other peers to download pieces from it if it owns them.

## Options {#dfdaemon-options}

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

## Example

### Download with Proxy

#### Download with HTTP protocol

```shell
curl -v -x 127.0.0.1:4001 http://<host>:<port>/<path> --output /tmp/file.txt
```

#### Download with HTTPS protocol

##### Download with Insecure HTTPS protocol

Configure Dfdaemon yaml file, The default path in Linux is `/etc/dragonfly/dfdaemon.yaml` in linux,
refer to [Dfdaemon](../../configuration/client/dfdaemon.md).

> Notice: set `cproxy.rules.regex` to match the download path.

```yaml
manager:
  addrs:
    - http://dragonfly-manager:65003

upload:
  server:
    port: 4000

metrics:
  server:
    port: 4002

proxy:
  server:
    port: 4001
  rules:
    - regex: 'blobs/sha256.*'
```

Run Dfdaemon as Seed Peer:

```bash
# View Dfdaemon cli help docs.
dfdaemon --help

# Setup Dfdaemon, it is recommended to start Dfdaemon via systemd.
dfdaemon
```

Download with Insecure HTTPS protocol:

```shell
curl -v -x 127.0.0.1:4001 https://<host>:<port>/<path> --insecure --output /tmp/file.txt
```

##### Download with using custom CA certificates HTTPS protocol

Generate a CA certificates:

```shell
openssl req -x509 -sha256 -days 36500 -nodes -newkey rsa:4096 -keyout ca.key -out ca.crt
```

Configure Dfdaemon yaml file, The default path in Linux is `/etc/dragonfly/dfdaemon.yaml` in linux,
refer to [Dfdaemon](../../configuration/client/dfdaemon.md).

> Notice: set `cproxy.rules.regex` to match the download path.

```yaml
manager:
  addrs:
    - http://dragonfly-manager:65003

dynconfig:
  refreshInterval: 30s
scheduler:
  announceInterval: 30s

upload:
  server:
    port: 5000

metrics:
  server:
    port: 5002

proxy:
  server:
    port: 5001
    caCert: ca.crt
    caKey: ca.key
  rules:
    - regex: 'blobs/sha256.*'
```

Run Dfdaemon as Seed Peer:

```bash
# View Dfdaemon cli help docs.
dfdaemon --help

# Setup Dfdaemon, it is recommended to start Dfdaemon via systemd.
dfdaemon
```

Download with HTTPS protocol:

```shell
curl -v -x 127.0.0.1:4001 https://<host>:<port>/<path> --output /tmp/file.txt
```

## Log {#log}

```text
1. set option --verbose if you want to print logs to Terminal
2. log path: /var/log/dragonfly/dfdaemon/
```

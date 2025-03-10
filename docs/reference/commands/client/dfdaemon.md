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

When the dfdameon setups, it setups a HTTP proxy. Users can download traffic is proxied to P2P networks via the HTTP Proxy.

#### Download with HTTP protocol

Configure `dfdaemon.yaml`, the default path is `/etc/dragonfly/dfdaemon.yaml`,
refer to [Dfdaemon](../../configuration/client/dfdaemon.md).

> Notice: set `proxy.rules.regex` to match the download path.
If the regex matches, intercepts download traffic and forwards it to the P2P network.

```yaml
proxy:
  server:
    port: 4001
  rules:
    - regex: 'example.*'
```

```shell
curl -v -x 127.0.0.1:4001 http://example.com/file.txt --output /tmp/file.txt
```

#### Download with HTTPS protocol

##### Download with Insecure HTTPS protocol

Configure `dfdaemon.yaml`, the default path is `/etc/dragonfly/dfdaemon.yaml`,
refer to [Dfdaemon](../../configuration/client/dfdaemon.md).

> Notice: set `proxy.rules.regex` to match the download path.
> If the regex matches, intercepts download traffic and forwards it to the P2P network.

```yaml
proxy:
  server:
    port: 4001
  rules:
    - regex: 'example.*'
```

Download with Insecure HTTPS protocol:

```shell
curl -v -x 127.0.0.1:4001 https://example.com/file.txt --insecure --output /tmp/file.txt
```

##### Download with HTTPS protocol by using custom CA certificates

Generate a CA certificates:

```shell
openssl req -x509 -sha256 -days 36500 -nodes -newkey rsa:4096 -keyout ca.key -out ca.crt
```

Trust the certificate at the OS level.

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

Configure `dfdaemon.yaml`, the default path is `/etc/dragonfly/dfdaemon.yaml`,
refer to [Dfdaemon](../../configuration/client/dfdaemon.md).

> Notice: set `proxy.rules.regex` to match the download path.
> If the regex matches, intercepts download traffic and forwards it to the P2P network.

```yaml
proxy:
  server:
    port: 4001
    caCert: ca.crt
    caKey: ca.key
  rules:
    - regex: 'example.*'
```

Download with HTTPS protocol:

```shell
curl -v -x 127.0.0.1:4001 https://example.com/file.txt --output /tmp/file.txt
```

## Log {#log}

```text
1. set option --verbose if you want to print logs to Terminal
2. log path: /var/log/dragonfly/dfdaemon/
```

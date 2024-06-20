---
id: faq
title: FAQ
---

## Change log level {#change-log-level}

Send `SIGUSR1` signal to dragonfly process to change log level

```shell
kill -s SIGUSR1 <pid of dfdaemon, scheduler or manager>
```

stdout:

```text
change log level to debug
change log level to fatal
change log level to panic
change log level to dpanic
change log level to error
change log level to warn
change log level to info
```

> The change log level event will print in stdout and `core.log` file, but if the level is greater than `info`, stdout only.

## Download slower than without Dragonfly {#download-slower-than-without-dragonfly}

**1.** Confirm limit rate in [dfdaemon.yaml](./reference/configuration/dfdaemon.md)

```yaml
download:
  server:
    # -- socketPath is the unix socket path for dfdaemon GRPC service.
    socketPath: /var/run/dragonfly/dfdaemon.sock
  # -- rateLimit is the default rate limit of the download speed in bps(bytes per second), default is 20Gbps.
  rateLimit: 20000000000
  # --   pieceTimeout is the timeout for downloading a piece from source.
  pieceTimeout: 30s
  # -- concurrentPieceCount is the number of concurrent pieces to download.
  concurrentPieceCount: 10
upload:
  server:
    # -- port is the port to the grpc server.
    port: 4000
    ## ip is the listen ip of the grpc server.
    # ip: ""
  # -- rateLimit is the default rate limit of the upload speed in bps(bytes per second), default is 20Gbps.
  rateLimit: 20000000000
```

**2.** Confirm source connection speed in dfdaemon

## 500 Internal Server Error {#500-internal-server-error}

**1.** Check error logs in /var/log/dragonfly/dfdaemon/

**2.** Check source connectivity(dns error or certificate error)

Example:

```shell
curl https://example.harbor.local/
```

When curl says error, please check the details in output.

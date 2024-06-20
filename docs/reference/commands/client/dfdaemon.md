---
id: dfdaemon
title: Dfdaemon
slug: /reference/commands/client/dfdaemon/
---

## Dfdaemon {#dfdaemon}

A high performance P2P download daemon in Dragonfly that can download resources of different protocols.
When user triggers a file downloading task, dfdaemon will download the pieces of file from other peers.
Meanwhile, it will act as an uploader to support other peers to download pieces from it if it owns them.

### Options {#dfdaemon-options}

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

### Log configuration {#dfdaemon-log-configuration}

```text
log path: /var/log/dragonfly/dfdaemon/
```

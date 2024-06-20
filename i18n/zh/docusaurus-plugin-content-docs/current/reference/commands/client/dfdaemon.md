---
id: dfdaemon
title: Dfdaemon
slug: /reference/commands/client/dfdaemon/
---

## Dfdaemon

Dragonfly 中的高性能 P2P 下载守护进程，可以下载不同协议的资源。当用户触发文件下载任务时，
dfdaemon 将从其他 peer 下载文件片段。同时，它将充当上传者，支持其他节点从它下载片段（如果它拥有这些片段）。

### Dfdaemon 可选参数

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

### Dfdaemon 日志

```text
正常情况日志目录: /var/log/dragonfly/dfdaemon/
```

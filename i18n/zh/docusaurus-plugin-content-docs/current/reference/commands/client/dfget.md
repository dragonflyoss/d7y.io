---
id: dfget
title: Dfget
slug: /reference/commands/client/dfget/
---

`dfget` 是 Dragonfly 中用来下载和上传文件的客户端。

### 用法

dfget 是 Dragonfly 中用来下载和上传文件的客户端，也是 p2p 网络中的一个 peer。当用户发起文件下载请求时，
dfget 将从其他 peer 下载文件。同时，它也能作为上传者，让其他 peer 下载它已拥有的那部分文件。
此外，dfget 还提供了一些高级功能，如网络带宽限制、加密传输等。

```shell
dfget -O <OUTPUT> <URL>
dfget [command]
```

### 可选参数

<!-- markdownlint-disable -->

```text
Usage: dfget [OPTIONS] --output <OUTPUT> <URL>

Arguments:
  <URL>
          Specify the URL to download

Options:
  -O, --output <OUTPUT>
          Specify the output path of downloading file

  -e, --endpoint <ENDPOINT>
          Endpoint of dfdaemon's GRPC server

          [default: /var/run/dragonfly/dfdaemon.sock]

      --timeout <TIMEOUT>
          Specify the timeout for downloading a file

          [default: 2h]

      --piece-length <PIECE_LENGTH>
          Specify the byte length of the piece

          [default: 4194304]

  -d, --digest <DIGEST>
          Verify the integrity of the downloaded file using the specified digest, e.g. md5:86d3f3a95c324c9479bd8986968f4327

          [default: ]

  -p, --priority <PRIORITY>
          Specify the priority for scheduling task

          [default: 6]

      --application <APPLICATION>
          Caller application which is used for statistics and access control

          [default: ]

      --tag <TAG>
          Different tags for the same url will be divided into different tasks

          [default: ]

  -H, --header <HEADER>
          Specify the header for downloading file, e.g. --header='Content-Type: application/json' --header='Accept: application/json'

      --filtered-query-param <FILTERED_QUERY_PARAMS>
          Filter the query parameters of the downloaded URL. If the download URL is the same, it will be scheduled as the same task, e.g. --filtered-query-param='signature' --filtered-query-param='timeout'

      --disable-back-to-source
          Disable back-to-source download when dfget download failed

  -l, --log-level <LOG_LEVEL>
          Specify the logging level [trace, debug, info, warn, error]

          [default: info]

      --log-dir <LOG_DIR>
          Specify the log directory

          [default: /var/log/dragonfly/dfget]

      --log-max-files <LOG_MAX_FILES>
          Specify the max number of log files

          [default: 24]

      --verbose
          Specify whether to print log

  -c, --dfdaemon-config <DFDAEMON_CONFIG>
          Specify dfdaemon's config file to use

          [default: /etc/dragonfly/dfdaemon.yaml]

      --dfdaemon-lock-path <DFDAEMON_LOCK_PATH>
          Specify the dfdaemon's lock file path

          [default: /var/lock/dragonfly/dfdaemon.lock]

      --dfdaemon-log-level <DFDAEMON_LOG_LEVEL>
          Specify the dfdaemon's logging level [trace, debug, info, warn, error]

          [default: info]

      --dfdaemon-log-dir <DFDAEMON_LOG_DIR>
          Specify the dfdaemon's log directory

          [default: /var/log/dragonfly/dfdaemon]

      --dfdaemon-log-max-files <DFDAEMON_LOG_MAX_FILES>
          Specify the dfdaemon's max number of log files

          [default: 24]

  -h, --help
          Print help (see a summary with '-h')

  -V, --version
          Print version
```

<!-- markdownlint-restore -->

### 例子

#### 使用 HTTP 协议下载

```text
dfget -O /path/to/output http://example.com/object
```

### 日志

```text
1. 终端日志输出需要增加命令行参数 --verbose
2. 正常情况日志目录: /var/log/dragonfly/dfget/
```

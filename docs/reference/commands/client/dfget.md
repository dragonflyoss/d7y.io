---
id: dfget
title: Dfget
slug: /reference/commands/client/dfget/
---

## Dfget {#dfget}

`dfget` is the client of Dragonfly used to download and upload files.

### Usage {#usage}

dfget is the client of Dragonfly which takes
a role of peer in a P2P network. When user triggers a file downloading
task, dfget will download the pieces of
file from other peers. Meanwhile, it will act as an uploader to support other
peers to download pieces from it if it owns them.
In addition, dfget has the abilities to provide more advanced
functionality, such as network bandwidth limit,
transmission encryption and so on.

```shell
dfget -O <OUTPUT> <URL>
dfget [command]
```

### Options {#options}

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

### Example {#example}

#### Download with HTTP protocol {#downlad-with-http}

```shell
dfget -O /path/to/output http://example.com/object
```

#### Download with OSS protocol {#downlad-with-oss}

Dragonfly supports download objects from Alibaba Cloud Object Storage Service (OSS).
You can download via `dfget` command.

All arguments is necessary to download from private OSS bucket.

Header explain:

`Endpoint`: OSS Endpoint, refer: [Alibaba Cloud](https://www.alibabacloud.com/help/en/object-storage-service/latest/regions-and-endpoints).

`AccessKeyID`: OSS AccessKey ID.

`AccessKeySecret`: OSS AccessKey Secret.

`--filter "Expires&Signature"` is used for generating unique task id for same object
in different machines.

`/path/to/output` is download storage path.

`oss://bucket/path/to/object` is the object bucket and path.

```shell
dfget --header "Endpoint: https://oss-cn-hangzhou.aliyuncs.com" \
    --header "AccessKeyID: your_access_key_id" \
    --header "AccessKeySecret: your_access_key_secret" \
    --output /path/to/output oss://bucket/path/to/object \
    --filtered-query-param "Expires&Signature"
```

### Log configuration {#log-configuration}

```text
log path: /var/log/dragonfly/dfget/
```

<!-- markdownlint-restore -->

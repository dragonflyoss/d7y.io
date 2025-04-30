---
id: dfcache
title: Dfcache
slug: /reference/commands/client/dfcache/
---

`dfcache` is the cache client to of dragonfly that communicates with dfdaemon and operates on files in P2P network,
and it can copy multiple replicas during import. P2P cache is effectively used for fast read and write cache.

## Usage

Import a file into Dragonfly P2P network.

```shell
dfcache import <PATH>
```

Export a file from Dragonfly P2P network.

```shell
dfcache export <ID> -O <OUTPUT> <PATH>
```

Get file information in Dragonfly P2P network.

```shell
dfcache stat <ID>
```

## Options {#dfdaemon-options}

### dfcache

<!-- markdownlint-disable -->

```shell
A cache command line based on P2P technology in Dragonfly that can import file and export file in P2P network, and it can copy multiple replicas during import. P2P cache is effectively used for fast read and write cache.

Usage: dfcache
       dfcache <COMMAND>

Commands:
  import  Import a file into Dragonfly P2P network
  export  Export a file from Dragonfly P2P network
  stat    Stat a file in Dragonfly P2P network
  help    Print this message or the help of the given subcommand(s)

Options:
  -V, --version
          Print version information

  -h, --help
          Print help (see a summary with '-h')
```

<!-- markdownlint-restore -->

### dfcache import

<!-- markdownlint-disable -->

```shell
Import a local file into Dragonfly P2P network and copy multiple replicas during import. If import successfully, it will return a task ID.

Usage: dfcache import [OPTIONS] <PATH>

Arguments:
  <PATH>
          Specify the path of the file to import

Options:
      --content-for-calculating-task-id <CONTENT_FOR_CALCULATING_TASK_ID>
          Specify the content used to calculate the persistent cache task ID. If it is set, use its value to calculate the task ID, Otherwise, calculate the persistent cache task ID based on url, piece-length, tag, application, and filtered-query-params.

      --persistent-replica-count <PERSISTENT_REPLICA_COUNT>
          Specify the replica count of the persistent cache task

          [default: 2]

      --piece-length <PIECE_LENGTH>
          Specify the piece length for downloading file. If the piece length is not specified, the piece length will be calculated according to the file size. Different piece lengths will be divided into different persistent cache tasks. The value needs to be set with human readable format and needs to be greater than or equal to 4mib, for example: 4mib, 1gib

      --application <APPLICATION>
          Different applications for the same url will be divided into different persistent cache tasks

      --tag <TAG>
          Different tags for the same file will be divided into different persistent cache tasks

      --ttl <TTL>
          Specify the ttl of the persistent cache task, maximum is 7d and minimum is 1m

          [default: 1h]

      --timeout <TIMEOUT>
          Specify the timeout for importing a file

          [default: 30m]

  -e, --endpoint <ENDPOINT>
          Endpoint of dfdaemon's GRPC server

          [default: /var/run/dragonfly/dfdaemon.sock]

  -l, --log-level <LOG_LEVEL>
          Specify the logging level [trace, debug, info, warn, error]

          [default: info]

      --log-dir <LOG_DIR>
          Specify the log directory

          [default: /var/log/dragonfly/dfcache]

      --log-max-files <LOG_MAX_FILES>
          Specify the max number of log files

          [default: 6]

      --verbose
          Specify whether to print log

  -h, --help
          Print help (see a summary with '-h')
```

<!-- markdownlint-restore -->

### dfcache export

<!-- markdownlint-disable -->

```shell
Export a file from Dragonfly P2P network by task ID. If export successfully, it will return the local file path.

Usage: dfcache export [OPTIONS] --output <OUTPUT> <ID>

Arguments:
  <ID>
          Specify the persistent cache task ID to export

Options:
      --transfer-from-dfdaemon
          Specify whether to transfer the content of downloading file from dfdaemon's unix domain socket. If it is true, dfcache will call dfdaemon to download the file, and dfdaemon will return the content of downloading file to dfcache via unix domain socket, and dfcache will copy the content to the output path. If it is false, dfdaemon will download the file and hardlink or copy the file to the output path.

      --force-hard-link
          Specify whether the download file must be hard linked to the output path. If hard link is failed, download will be failed. If it is false, dfdaemon will copy the file to the output path if hard link is failed.

      --application <APPLICATION>
          Caller application which is used for statistics and access control

          [default: ]

      --tag <TAG>
          Different tags for the same file will be divided into different persistent cache tasks

          [default: ]

  -O, --output <OUTPUT>
          Specify the output path of exporting file

      --timeout <TIMEOUT>
          Specify the timeout for exporting a file

          [default: 2h]

  -e, --endpoint <ENDPOINT>
          Endpoint of dfdaemon's GRPC server

          [default: /var/run/dragonfly/dfdaemon.sock]

  -l, --log-level <LOG_LEVEL>
          Specify the logging level [trace, debug, info, warn, error]

          [default: info]

      --log-dir <LOG_DIR>
          Specify the log directory

          [default: /var/log/dragonfly/dfcache]

      --log-max-files <LOG_MAX_FILES>
          Specify the max number of log files

          [default: 6]

      --verbose
          Specify whether to print log

  -h, --help
          Print help (see a summary with '-h')
```

<!-- markdownlint-restore -->

### dfcache stat

<!-- markdownlint-disable -->

```shell
Stat a file in Dragonfly P2P network by task ID. If stat successfully, it will return the file information.

Usage: dfcache stat [OPTIONS] <ID>

Arguments:
  <ID>
          Specify the persistent cache task ID to stat

Options:
  -e, --endpoint <ENDPOINT>
          Endpoint of dfdaemon's GRPC server

          [default: /var/run/dragonfly/dfdaemon.sock]

  -l, --log-level <LOG_LEVEL>
          Specify the logging level [trace, debug, info, warn, error]

          [default: info]

      --log-dir <LOG_DIR>
          Specify the log directory

          [default: /var/log/dragonfly/dfcache]

      --log-max-files <LOG_MAX_FILES>
          Specify the max number of log files

          [default: 6]

      --verbose
          Specify whether to print log

  -h, --help
          Print help (see a summary with '-h')
```

<!-- markdownlint-restore -->

## Example

### Import file

When importing a file with default parameters, the persistent replica count defaults to 2 and the ttl defaults to 1h.

```shell
dfcache import <PATH>
```

### Import the file and set the persistent replica and TTL

Using the `--persistent-replica-count` and `--ttl` parameters,
users can set the number of replicas and the lifetime for the persistent cache task.

```shell
dfcache import --persistent-replica-count 3 --ttl 2h <PATH>
```

### Import large file

The default ID is calculated based on the CRC32 of the file, which can take a long time to compute for larger files.
You can specify the `--content-for-calculating-task-id` option to define the uniqueness of the file,
and by calculating the unique ID using CRC32, the computation time can be significantly reduced.
For example, `--content-for-calculating-task-id` can be set to the filename, but the filename must guarantee uniqueness.

```shell
dfcache import --content-for-calculating-task-id <CONTENT_FOR_CALCULATING_TASK_ID> <PATH>
```

## Log

```text
1. set option --verbose if you want to print logs to Terminal
2. log path: /var/log/dragonfly/dfcache/
```

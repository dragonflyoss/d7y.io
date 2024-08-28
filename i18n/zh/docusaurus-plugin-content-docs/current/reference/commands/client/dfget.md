---
id: dfget
title: Dfget
slug: /reference/commands/client/dfget/
---

`dfget` 是 Dragonfly 中用来下载和上传文件的客户端。dfget 上传和下载过程中需要使用 dfdaemon GRPC 服务的 unix socket,
使用 dfget 必须开启 dfdaemon。

## 用法

dfget 是 Dragonfly 中用来下载和上传文件的客户端，也是 p2p 网络中的一个 peer。当用户发起文件下载请求时，
dfget 将从其他 peer 下载文件。同时，它也能作为上传者，让其他 peer 下载它已拥有的那部分文件。
此外，dfget 还提供了一些高级功能，如网络带宽限制、加密传输等。

```shell
dfget -O <OUTPUT> <URL>
dfget [command]
```

## 可选参数

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

      --storage-region <STORAGE_REGION>
          Specify the region for the Object Storage Service

      --storage-endpoint <STORAGE_ENDPOINT>
          Specify the endpoint for the Object Storage Service

      --storage-access-key-id <STORAGE_ACCESS_KEY_ID>
          Specify the access key ID for the Object Storage Service

      --storage-access-key-secret <STORAGE_ACCESS_KEY_SECRET>
          Specify the access key secret for the Object Storage Service

      --storage-session-token <STORAGE_SESSION_TOKEN>
          Specify the session token for Amazon Simple Storage Service(S3)

      --storage-credential <STORAGE_CREDENTIAL>
          Specify the credential for Google Cloud Storage Service(GCS)

      --storage-predefined-acl <STORAGE_PREDEFINED_ACL>
          Specify the predefined ACL for Google Cloud Storage Service(GCS)

          [default: publicRead]

      --max-files <MAX_FILES>
          Specify the max count of file to download when downloading a directory. If the actual file count is greater than this value, the downloading will be rejected

          [default: 10]

      --max-concurrent-requests <MAX_CONCURRENT_REQUESTS>
          Specify the max count of concurrent download files when downloading a directory

          [default: 5]

  -l, --log-level <LOG_LEVEL>
          Specify the logging level [trace, debug, info, warn, error]

          [default: info]

      --log-dir <LOG_DIR>
          Specify the log directory

          [default: /var/log/dragonfly/dfget]

      --log-max-files <LOG_MAX_FILES>
          Specify the max number of log files

          [default: 6]

      --verbose
          Specify whether to print log

  -h, --help
          Print help (see a summary with '-h')

  -V, --version
          Print version
```

<!-- markdownlint-restore -->

## 例子

### 使用 HTTP 协议下载

```shell
dfget https://<host>:<port>/<path> -O /tmp/file.txt
```

<!-- markdownlint-disable -->

### 使用 S3 协议下载

```shell
# 下载文件
dfget s3://<bucket>/<path> -O /tmp/file.txt --storage-access-key-id=<access_key_id> --storage-access-key-secret=<access_key_secret>

# 下载目录
dfget s3://<bucket/<path>/ -O /tmp/path/ --storage-access-key-id=<access_key_id> --storage-access-key-secret=<access_key_secret>
```

### 使用 GCS 协议下载

```shell
# 下载文件
dfget gs://<bucket>/<path> -O /tmp/file.txt --storage-credential-path=<credential_path> --storage-endpoint=<endpoint>

# 下载目录
dfget gs://<bucket>/<path>/ -O /tmp/path/ --storage-credential-path=<credential_path> --storage-endpoint=<endpoint>
```

### 使用 ABS 协议下载

```shell
# 下载文件
dfget abs://<container>/<path> -O /tmp/file.txt --storage-access-key-id=<account_name> --storage-access-key-secret=<account_key> --storage-endpoint=<endpoint>

# 下载目录
dfget abs://<container>/<path>/ -O /tmp/path/ --storage-access-key-id=<account_name> --storage-access-key-secret=<account_key> --storage-endpoint=<endpoint>
```

### 使用 OSS 协议下载

```shell
# 下载文件
dfget oss://<bucket>/<path> -O /tmp/file.txt --storage-access-key-id=<access_key_id> --storage-access-key-secret=<access_key_secret> --storage-endpoint=<endpoint>

# 下载目录
dfget oss://<bucket>/<path>/ -O /tmp/path/ --storage-access-key-id=<access_key_id> --storage-access-key-secret=<access_key_secret> --storage-endpoint=<endpoint>
```

### 使用 OBS 协议下载

```shell
# 下载文件
dfget obs://<bucket>/<path> -O /tmp/file.txt --storage-access-key-id=<access_key_id> --storage-access-key-secret=<access_key_secret> --storage-endpoint=<endpoint>

# 下载目录
dfget obs://<bucket>/<path>/ -O /tmp/path/ --storage-access-key-id=<access_key_id> --storage-access-key-secret=<access_key_secret> --storage-endpoint=<endpoint>
```

### 使用 COS 协议下载

> 注意: endpoint 不需要添加 `BucketName-APPID`，--storage-endpoint=cos.region.myqcloud.com 即可。

```shell
# 下载文件
dfget cos://<bucket>/<path> -O /tmp/file.txt --storage-access-key-id=<access_key_id> --storage-access-key-secret=<access_key_secret> --storage-endpoint=<endpoint>

# 下载目录
dfget cos://<bucket>/<path>/ -O /tmp/path/ --storage-access-key-id=<access_key_id> --storage-access-key-secret=<access_key_secret> --storage-endpoint=<endpoint>
```

<!-- markdownlint-restore -->

## 日志

```text
1. 终端日志输出需要增加命令行参数 --verbose
2. 正常情况日志目录: /var/log/dragonfly/dfget/
```

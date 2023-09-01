---
id: dfdaemon
title: Dfdaemon
---

## dfget

`dfget` 是 Dragonfly 中用来下载和上传文件的客户端。

### 用法

dfget 是 Dragonfly 中用来下载和上传文件的客户端，也是 p2p 网络中的一个 peer。当用户发起文件下载请求时，
dfget 将从其他 peer 下载文件。同时，它也能作为上传者，让其他 peer 下载它已拥有的那部分文件。
此外，dfget 还提供了一些高级功能，如网络带宽限制、加密传输等。

```shell
dfget url -O path [flags]
dfget [command]
```

### 子命令

```text
  completion  generate the autocompletion script for the specified shell
  daemon      start the client daemon of dragonfly
  doc         generate documents
  help        Help about any command
  plugin      show plugin
  version     show version
```

### 可选参数

<!-- markdownlint-disable -->

```text
      --accept-regex string   Recursively download only. Specify a regular expression to accept the complete URL. In this case, you have to enclose the pattern into quotes to prevent your shell from expanding it
      --config string         the path of configuration file with yaml extension name, it can also be set by env var: DFGET_CONFIG
      --console               whether logger output records to the stdout
      --daemon-sock string    Download socket path of daemon. In linux, default value is /var/run/dfdaemon.sock, in macos(just for testing), default value is /tmp/dfdaemon.sock
      --digest string         Check the integrity of the downloaded file with digest, in format of md5:xxx or sha256:yyy
      --disable-back-source   Disable downloading directly from source when the daemon fails to download file
      --filter string         Filter the query parameters of the url, P2P overlay is the same one if the filtered url is same, in format of key&sign, which will filter 'key' and 'sign' query parameters
  -H, --header strings        url header, eg: --header='Accept: *' --header='Host: abc'
  -h, --help                  help for dfget
      --jaeger string         jaeger endpoint url, like: http://localhost:14250/api/traces
      --level uint            Recursively download only. Set the maximum number of subdirectories that dfget will recurse into. Set to 0 for no limit (default 5)
  -l, --list                  Recursively download only. List all urls instead of downloading them.
      --logdir string         Dfget log directory
      --original-offset       Range request only. Download ranged data into target file with original offset. Daemon will make a hardlink to target file. Client can download many ranged data into one file for same url. When enabled, back source in client will be disabled
  -O, --output string         Destination path which is used to store the downloaded file, it must be a full path
      --pprof-port int        listen port for pprof, 0 represents random port (default -1)
      --range string          Download range. Like: 0-9, stands download 10 bytes from 0 -9, [0:9] in real url
      --ratelimit string      The downloading network bandwidth limit per second in format of G(B)/g/M(B)/m/K(B)/k/B, pure number will be parsed as Byte, 0 is infinite (default "100.0MB")
  -r, --recursive             Recursively download all resources in target url, the target source client must support list action
      --reject-regex string   Recursively download only. Specify a regular expression to reject the complete URL. In this case, you have to enclose the pattern into quotes to prevent your shell from expanding it
      --service-name string   name of the service for tracer (default "dragonfly-dfget")
  -b, --show-progress         Show progress bar, it conflicts with --console
      --tag string            Different tags for the same url will be divided into different P2P overlay, it conflicts with --digest
      --timeout duration      Timeout for the downloading task, 0 is infinite
  -u, --url string            Download one file from the url, equivalent to the command's first position argument
      --verbose               whether logger use debug level
      --workhome string       Dfget working directory
```

<!-- markdownlint-restore -->

### 例子

#### 使用 HTTP 协议下载

```text
dfget -O /path/to/output -u "http://example.com/object"
```

#### 使用 OSS 协议下载

蜻蜓支持从阿里云对象存储服务（OSS）直接下载对象。直接使用 `dfget` 命令即可。

示例中所有的参数都是必须。

Header 解释:

`Endpoint`: OSS Endpoint, 参考: [Alibaba Cloud](https://www.alibabacloud.com/help/en/object-storage-service/latest/regions-and-endpoints)

`AccessKeyID`: OSS AccessKey ID

`AccessKeySecret`: OSS AccessKey Secret

`--filter "Expires&Signature"` 是用来为相同对象在不同机器上下载的时候生成唯一任务 ID 使用的。

`oss://bucket/path/to/object` 是指定桶和路径的.

```shell
dfget --header "Endpoint: https://oss-cn-hangzhou.aliyuncs.com" \
    --header "AccessKeyID: id" \
    --header "AccessKeySecret: secret" \
    --url oss://bucket/path/to/object \
    --output /path/to/output \
    --filter "Expires&Signature"
```

### 日志

```text
1. 终端日志输出需要增加命令行参数 --console
2. 正常情况日志目录: /var/log/dragonfly/dfget/
```

## dfget daemon

### Daemon 可选参数

<!-- markdownlint-disable -->

```text

      --accept-regex string   Recursively download only. Specify a regular expression to accept the complete URL. In this case, you have to enclose the pattern into quotes to prevent your shell from expanding it
      --config string         the path of configuration file with yaml extension name, default is /etc/dragonfly/dfget.yaml, it can also be set by env var: DFGET_CONFIG
      --console               whether logger output records to the stdout
      --digest string         Check the integrity of the downloaded file with digest, in format of md5:xxx or sha256:yyy
      --disable-back-source   Disable downloading directly from source when the daemon fails to download file
      --filter string         Filter the query parameters of the url, P2P overlay is the same one if the filtered url is same, in format of key&sign, which will filter 'key' and 'sign' query parameters
  -H, --header strings        url header, eg: --header='Accept: *' --header='Host: abc'
  -h, --help                  help for dfget
      --jaeger string         jaeger endpoint url, like: http://localhost:14250/api/traces
      --level uint            Recursively download only. Set the maximum number of subdirectories that dfget will recurse into. Set to 0 for no limit (default 5)
      --limit string          The downloading network bandwidth limit per second in format of G(B)/g/M(B)/m/K(B)/k/B, pure number will be parsed as Byte, 0 is infinite (default "0.0B")
  -l, --list                  Recursively download only. List all urls instead of downloading them.
      --logdir string         Dfget log directory
  -O, --output string         Destination path which is used to store the downloaded file, it must be a full path
      --pprof-port int        listen port for pprof, 0 represents random port (default -1)
  -r, --recursive             Recursively download all resources in target url, the target source client must support list action
      --reject-regex string   Recursively download only. Specify a regular expression to reject the complete URL. In this case, you have to enclose the pattern into quotes to prevent your shell from expanding it
      --service-name string   name of the service for tracer (default "dragonfly-dfget")
  -b, --show-progress         Show progress bar, it conflicts with --console
      --tag string            Different tags for the same url will be divided into different P2P overlay, it conflicts with --digest
      --timeout duration      Timeout for the downloading task, 0 is infinite
  -u, --url string            Download one file from the url, equivalent to the command's first position argument
      --verbose               whether logger use debug level
      --workhome string       Dfget working directory
```

<!-- markdownlint-restore -->

### Daemon 日志

```text
1. 终端日志输出需要增加命令行参数 --console
2. 正常情况日志目录: /var/log/dragonfly/daemon/
```

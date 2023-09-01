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

### 例子

```text
dfget --schedulers 127.0.0.1:8002 -O /path/to/output -u "http://example.com/object"
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
           The caller name which is mainly used for statistics and access control
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

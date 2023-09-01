---
id: dfstore
title: Dfstore
---

## dfstore {#dfstore}

`dfstore` 是 dragonfly 存储客户端.

### 用法 {#usage}

可以依赖不同类型的对象存储作为 Backend，提供稳定的存储方案，现在支持 `S3` 和 `OSS`。

`dfstore` 依赖 Backend 对象存储服务结合 P2P 本身的加速特点。
可做到快写快读，并且能够节省回源以及跨机房流量，减少源站压力。

```shell
dfstore [command]
```

### 可用子命令 {#available-commands}

```shell
  completion  Generate the autocompletion script for the specified shell
  cp          copies a local file or dragonfly object to another location locally or in dragonfly object storage.
  help        Help about any command
  rm          remove object from P2P storage system.
  version     show version
```

### 全局参数 {#global-options}

<!-- markdownlint-disable -->

```text
  -e, --endpoint string   endpoint of object storage service (default "http://127.0.0.1:65004")
  -h, --help              help for dfstore
```

### 子命令 {#subcommands}

#### Copy 命令 {#dfstore-copy}

可以将本地文件复制到 dragonfly 对象存储服务, 也可以将 dragonfly 对象存储服务中存储的文件复制到本地。

<!-- markdownlint-disable -->

```text
Usage:
  dfstore cp <source> <target> [flags]

Flags:
      --filter string      filter is used to generate a unique task id by filtering unnecessary query params in the URL, it is separated by & character
  -h, --help               help for cp
      --max-replicas int   maxReplicas is the maximum number of replicas of an object cache in seed peers (default 3)
  -m, --mode int           mode is the mode in which the backend is written, when the value is 0, it represents AsyncWriteBack, and when the value is 1, it represents WriteBack
```

#### Remove 命令 {#dfstore-remove}

从 dragonfly 对象存储服务中移除文件。

<!-- markdownlint-disable -->

```text
Usage:
  dfstore rm <target> [flags]

Flags:
  -h, --help   help for rm
```

### 示例 {#example}

```shell
# 上传 baz.jpg 图片到 S3 或 OSS 的 dragonfly 桶中的路径 /bar/foo/baz.jpg。
dfstore cp ./baz.jpg dfs://dragonfly/bar/foo/baz.jpg

# 下载 baz.jpg 图片从 S3 或 OSS 的 dragonfly 桶中的路径 /bar/foo/baz.jpg。
dfstore cp dfs://dragonfly/bar/foo/baz.jpg ./baz.jpg

# 删除 S3 或 OSS 的 dragonfly 桶中的 /bar/foo/baz.jpg 图片。
dfstore rm dfs://dragonfly/bar/foo/baz.jpg
```

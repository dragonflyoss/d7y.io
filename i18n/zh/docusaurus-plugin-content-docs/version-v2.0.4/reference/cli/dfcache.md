---
id: dfcache
title: Dfcache
---

## dfcache {#dfcache}

`dfcache` 是 dragonfly 的缓存客户端

### 用法 {#usage}

dfcache 是 dragonfly 的缓存客户端，它与 dfdaemon 交互来对 P2P 网络中的文件进行操
作，其中 P2P 网络充当缓存系统。

dfcache 和 dfget 的区别在于，dfget 从给定 URL 下载文件，文件可能在 P2P 网络中的
其他 Peer 或 Seed Peer 上，是 dfget 负责从 P2P 网络或者回源下载文件； 但是 dfcache 只能
导出或下载已被其他 Peer 导入/添加到 P2P 网络中的文件，是用户负责回源并将文件添
加到 P2P 网络中。

```shell
dfcache [subcommand] [flags]
```

### 子命令 {#available-commands}

```shell
  completion  generate the autocompletion script for the specified shell
  delete      delete file from P2P cache system
  doc         generate documents
  export      export file from P2P cache system
  help        Help about any command
  import      import file into P2P cache system
  plugin      show plugin
  stat        stat checks if a file exists in P2P cache system
  version     show version
```

### 全局参数 {#global-options}

<!-- markdownlint-disable -->

```text
           The caller name which is mainly used for statistics and access control
  -i, --cid string            content or cache ID, e.g. sha256 digest of the content
      --config string         the path of configuration file with yaml extension name, default is /etc/dragonfly/dfcache.yaml, it can also be set by env var: DFCACHE_CONFIG
      --console               whether logger output records to the stdout
  -h, --help                  help for dfcache
      --jaeger string         jaeger endpoint url, like: http://localhost:14250/api/traces
      --logdir string         Dfcache log directory
      --pprof-port int        listen port for pprof, 0 represents random port (default -1)
      --service-name string   name of the service for tracer (default "dragonfly-dfcache")
  -t, --tag string            different tags for the same cid will be recognized as different  files in P2P network
      --timeout duration      Timeout for this cache operation, 0 is infinite
      --verbose               whether logger use debug level
      --workhome string       Dfcache working directory
```

### Stat 命令 {#dfcache-stat}

<!-- markdownlint-disable -->

```text
Usage:
  dfcache stat <-i cid> [flags]

Flags:
  -h, --help    help for stat
  -l, --local   only check task exists locally, and don't check other peers in P2P network
```

### Import 命令 {#dfcache-import}

<!-- markdownlint-disable -->

```text
Usage:
  dfcache import <-i cid> <file>|<-I file> [flags]

Flags:
  -h, --help           help for import
  -I, --input string   import the given file into P2P network
```

### Export 命令 {#dfcache-export}

<!-- markdownlint-disable -->

```text
Usage:
  dfcache export <-i cid> <output>|<-O output> [flags]

Flags:
  -h, --help            help for export
  -l, --local           only export file from local cache
  -O, --output string   export file path
```

### Delete 命令 {#dfcache-delete}

<!-- markdownlint-disable -->

```text
Usage:
  dfcache delete <-i cid> [flags]

Flags:
  -h, --help   help for delete
```

### 示例 {#example}

```shell
# 添加文件到cache系统中
dfcache import --cid sha256:xxxxxx --tag testtag /path/to/file

# 检查文件是否在cache系统中
dfcache stat --cid testid --local  # only check local cache
dfcache stat --cid testid          # check other peers as well

# 从cache系统中下载/导出文件
dfcache export --cid testid -O /path/to/output

# 从cache系统中删除文件
dfcache delete -i testid -t testtag
```

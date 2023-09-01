---
id: cdn
title: CDN
---

CDN 是一个长时间运行的服务进程，它缓存从源下载的数据，以避免重复从源下载相同的文件

## 用法

```text
cdn [flags]
cdn [command]
```

## 子命令

```text
completion  generate the autocompletion script for the specified shell
doc         generate documents
help        Help about any command
plugin      show plugin
version     show version
```

## 可选参数

<!-- markdownlint-disable -->

```text
      --config string         the path of configuration file with yaml extension name, default is /etc/dragonfly/cdn.yaml, it can also be set by env var: CDN_CONFIG
      --console               whether logger output records to the stdout
  -h, --help                  help for cdn
      --jaeger string         jaeger endpoint url, like: http://localhost:14250/api/traces
      --pprof-port int        listen port for pprof, 0 represents random port (default -1)
      --service-name string   name of the service for tracer (default "dragonfly-cdn")
      --verbose               whether logger use debug level
```

<!-- markdownlint-restore -->

## 日志

```text
1. 终端日志输出需要增加命令行参数 --console
2. 正常情况日志目录: /var/log/dragonfly/cdn/
```

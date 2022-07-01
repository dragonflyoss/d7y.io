---
id: scheduler
title: Scheduler
---

Scheduler 是一个常驻后台运行的进程，用于接收和管理客户端的下载任务，
通知 Seed Peer 进行回源， 在下载过程中生成维护 P2P 网络，给客户端推送适合的下载节点

## 用法

```text
scheduler [flags]
scheduler [command]
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
    --config string         the path of configuration file with yaml extension name, default is /etc/dragonfly/scheduler.yaml, it can also be set by env var: SCHEDULER_CONFIG
    --console               whether logger output records to the stdout
-h, --help                  help for scheduler
    --jaeger string         jaeger endpoint url, like: http://localhost:14250/api/traces
    --pprof-port int        listen port for pprof, 0 represents random port (default -1)
    --service-name string   name of the service for tracer (default "dragonfly-scheduler")
    --verbose               whether logger use debug level
```

<!-- markdownlint-restore -->

## 日志

```text
1. 终端日志输出需要增加命令行参数 --console
2. 正常情况日志目录: /var/log/dragonfly/scheduler/
```

---
id: manager
title: Manager
---

Manager 是一个常驻后台运行的进程，它在蜻蜓中扮演各个子系统集群大脑的角色， 用于管理各个系统模块依赖的动态配置，以及提供心跳保活、监控大盘和产品化的功能。

## 用法

```text
manager [flags]
manager [command]
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
    --config string         the path of configuration file with yaml extension name, default is /etc/dragonfly/manager.yaml, it can also be set by env var: MANAGER_CONFIG
    --console               whether logger output records to the stdout
-h, --help                  help for manager
    --jaeger string         jaeger endpoint url, like: http://localhost:14250/api/traces
    --pprof-port int        listen port for pprof, 0 represents random port (default -1)
    --service-name string   name of the service for tracer (default "dragonfly-manager")
    --verbose               whether logger use debug level
```

<!-- markdownlint-restore -->

## 日志

```text
1. 终端日志输出需要增加命令行参数 --console
2. 正常情况日志目录: /var/log/dragonfly/manager/
```

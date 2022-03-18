---
id: manager
title: Manager
---

Manager is a process that runs in the background
and plays the role of the brain of each subsystem cluster in Dragonfly.
It is used to manage the dynamic
configuration of each system module and provide functions
such as heartbeat keeping alive, monitoring the market, and product functions.

## Try it {#try-it}

```text
manager [flags]
manager [command]
```

## Log configuration {#log-configuration}

```text
1. set option --console if you want to print logs to Terminal
2. log path: /var/log/dragonfly/manager/
```

## Runtime metrics monitoring {#runtime-metrics-monitoring}

```text
manager --pprof-port port
```

## Swagger support {#swagger-support}

endpoint: /swagger/doc.json

## Prometheus metrics monitoring {#prometheus-metrics-monitoring}

endpoint: /metrics

## HealthCheck {#healthcheck}

endpoint: /healthy/

## Enable jaeger {#enable-jaeger}

```text
manager --jaeger  http://localhost:14250/api/traces
```

## Available Commands {#available-commands}

```text
completion  generate the autocompletion script for the specified shell
doc         generate documents
help        Help about any command
plugin      show plugin
version     show version
```

## Options {#options}

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

## Manager Config {#manager-config}

[Config Example](../configuration/manager.md)

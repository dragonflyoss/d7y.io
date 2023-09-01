---
id: scheduler
title: Scheduler
---

Scheduler is a long-running process which receives
and manages download tasks from the client,
notify the seed peer to return to the source, generate and maintain a
P2P network during the download process,
and push suitable download nodes to the client

## Usage {#usage}

```text
scheduler [flags]
scheduler [command]
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
      --config string         the path of configuration file with yaml extension name, default is /etc/dragonfly/scheduler.yaml, it can also be set by env var: SCHEDULER_CONFIG
      --console               whether logger output records to the stdout
  -h, --help                  help for scheduler
      --jaeger string         jaeger endpoint url, like: http://localhost:14250/api/traces
      --pprof-port int        listen port for pprof, 0 represents random port (default -1)
      --service-name string   name of the service for tracer (default "dragonfly-scheduler")
      --verbose               whether logger use debug level
```

<!-- markdownlint-restore -->

## Log configuration {#log-configuration}

```text
1. set option --console if you want to print logs to Terminal
2. log path: /var/log/dragonfly/scheduler/
```

---
id: dfcache
title: Dfcache
---

## dfcache {#dfcache}

`dfcache` is the P2P cache client of dragonfly

### Usage {#usage}

dfcache is the cache client to of dragonfly that communicates with dfdaemon and
operates on files in P2P network, where the P2P network acts as a cache system.

The difference between dfcache and dfget is that, dfget downloads file from a
given URL, the file might be on other peers in P2P network or a seed peer, it's
the P2P network's responsibility to download file from source; but dfcache
could only export or download a file that has been imported or added into P2P
network by other peer, it's the user's responsibility to go back to source and
add file into P2P network.

```shell
dfcache [subcommand] [flags]
```

### Available Commands {#available-commands}

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

### Global Options {#global-options}

<!-- markdownlint-disable -->

```text
      --callsystem string     The caller name which is mainly used for statistics and access control
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

### Stat {#dfcache-stat}

<!-- markdownlint-disable -->

```text
Usage:
  dfcache stat <-i cid> [flags]

Flags:
  -h, --help    help for stat
  -l, --local   only check task exists locally, and don't check other peers in P2P network
```

### Import {#dfcache-import}

<!-- markdownlint-disable -->

```text
Usage:
  dfcache import <-i cid> <file>|<-I file> [flags]

Flags:
  -h, --help           help for import
  -I, --input string   import the given file into P2P network
```

### Export {#dfcache-export}

<!-- markdownlint-disable -->

```text
Usage:
  dfcache export <-i cid> <output>|<-O output> [flags]

Flags:
  -h, --help            help for export
  -l, --local           only export file from local cache
  -O, --output string   export file path
```

### Delete {#dfcache-delete}

<!-- markdownlint-disable -->

```text
Usage:
  dfcache delete <-i cid> [flags]

Flags:
  -h, --help   help for delete
```

### Example {#example}

```shell
# add a file into cache system
dfcache import --cid sha256:xxxxxx --tag testtag /path/to/file

# check if a file exists in cache system
dfcache stat --cid testid --local  # only check local cache
dfcache stat --cid testid          # check other peers as well

# export/download a file from cache system
dfcache export --cid testid -O /path/to/output

# delete a file from cache system, both local cache and P2P network
dfcache delete -i testid -t testtag
```

---
id: dfstore
title: Dfstore
---

## dfstore {#dfstore}

`dfstore` is a storage client for dragonfly.

### Usage {#usage}

It can rely on different types of object storage,
such as S3 or OSS, to provide stable object storage capabilities.

`dfstore` uses the entire P2P network as a cache when storing objects.
Rely on S3 or OSS as the backend to ensure storage reliability.
In the process of object storage, P2P Cache is effectively used for fast read and write storage.

```shell
dfstore [command]
```

### Available Commands {#available-commands}

```shell
  completion  Generate the autocompletion script for the specified shell
  cp          copies a local file or dragonfly object to another location locally or in dragonfly object storage.
  help        Help about any command
  rm          remove object from P2P storage system.
  version     show version
```

### Global Options {#global-options}

<!-- markdownlint-disable -->

```text
  -e, --endpoint string   endpoint of object storage service (default "http://127.0.0.1:65004")
  -h, --help              help for dfstore
```

### Subcommands {#subcommands}

#### Copy {#dfstore-copy}

Copies a local file or dragonfly object to another location locally or in dragonfly object storage.

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

#### Remove {#dfstore-remove}

Remove object from P2P storage system.

<!-- markdownlint-disable -->

```text
Usage:
  dfstore rm <target> [flags]

Flags:
  -h, --help   help for rm
```

### Example {#example}

```shell
# Upload baz.jpg image to /bar/foo/baz.jpg in S3 or OSS dragonfly bucket.
dfstore cp ./baz.jpg dfs://dragonfly/bar/foo/baz.jpg

# Download baz.jpg image from /bar/foo/baz.jpg in S3 or OSS `dragonfly` bucket.
dfstore cp dfs://dragonfly/bar/foo/baz.jpg ./baz.jpg

# Delete /bar/foo/baz.jpg image in S3 or OSS dragonfly bucket.
dfstore rm dfs://dragonfly/bar/foo/baz.jpg
```

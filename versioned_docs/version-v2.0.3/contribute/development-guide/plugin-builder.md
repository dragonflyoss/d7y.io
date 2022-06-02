---
id: plugin-builder
title: Out-of-tree Plugin Builder
slug: /contribute/development-guide/plugin-builder/
---

This document describes the out-of-tree plugin builder, which can build dragonfly with out-of-tree plugin.

> When build plugin, the image which use the plugin need rebuild

## Build Builder Image {#build-builder-image}

```shell
cd Dragonfly2
docker build -t dragonfly-plugin-builder -f build/plugin-builder/Dockerfile .
```

## Build Plugin {#build-plugin}

> Available plugin type: resource, scheduler, manager
> When type is scheduler, plugin name includes evaluator
> When type is manager, plugin name includes search

### Example {#example}

#### 1. Resource Plugin Example {#1-resource-plugin-example}

- Build plugin dfget

```shell
PLUGIN_TYPE=resource
# custom protocol
PLUGIN_NAME=dfs
PLUGIN_PATH=`pwd`/pkg/source/testdata/plugin

docker run --entrypoint=/bin/bash \
  -v "$PLUGIN_PATH":/go/src/plugin \
  -v `pwd`/artifacts/:/artifacts \
  dragonfly-plugin-builder \
  /build.sh "$PLUGIN_TYPE" "$PLUGIN_NAME" /go/src/plugin
```

- Build dfdaemon image

```shell
docker build -t dfdaemon -f build/plugin-builder/images/dfdaemon/Dockerfile .
```

#### 2. Scheduler Plugin Example {#2-scheduler-plugin-example}

- Build plugin, scheduler

```shell
PLUGIN_TYPE=scheduler
PLUGIN_NAME=evaluator
PLUGIN_PATH=`pwd`/scheduler/scheduler/evaluator/testdata/plugin

docker run --entrypoint=/bin/bash \
  -v "$PLUGIN_PATH":/go/src/plugin \
  -v `pwd`/artifacts/:/artifacts \
  dragonfly-plugin-builder \
  /build.sh "$PLUGIN_TYPE" "$PLUGIN_NAME" /go/src/plugin
```

- Build scheduler image

```shell
docker build -t scheduler -f build/plugin-builder/images/scheduler/Dockerfile .
```

#### 3. Manager Plugin Example {#3-manager-plugin-example}

- Build plugin, manager

```shell
PLUGIN_TYPE=manager
PLUGIN_NAME=searcher
PLUGIN_PATH=`pwd`/manager/searcher/testdata/plugin

docker run --entrypoint=/bin/bash \
  -v "$PLUGIN_PATH":/go/src/plugin \
  -v `pwd`/artifacts/:/artifacts \
  dragonfly-plugin-builder \
  /build.sh "$PLUGIN_TYPE" "$PLUGIN_NAME" /go/src/plugin
```

- Build manager image

```shell
docker build -t manager -f build/plugin-builder/images/manager/Dockerfile .
```

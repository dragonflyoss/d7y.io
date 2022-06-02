---
id: plugin-builder
title: 外置插件构建工具
slug: /contribute/development-guide/plugin-builder/
---

该文档描述用于构建外置插件的构建工具。

> 当构建插件的时候，镜像需要被重新构建。

## 构建镜像

```shell
cd Dragonfly2
docker build -t dragonfly-plugin-builder -f build/plugin-builder/Dockerfile .
```

## 构建插件

> 插件类型包括: resource、manager 以及 scheduler
> 当类型为 scheduler 时，包含插件名 evaluator
> 当类型为 manager 时，包含插件名 search

### 示例

#### 1. 资源插件示例

- 为 dfget 构建插件

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

- 构建 dfdaemon 镜像

```shell
docker build -t dfdaemon -f build/plugin-builder/images/dfdaemon/Dockerfile .
```

#### 2. Scheduler 插件示例

- 构建 scheduler 插件

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

- 构建 scheduler 镜像

```shell
docker build -t scheduler -f build/plugin-builder/images/scheduler/Dockerfile .
```

#### 3. Manager 插件示例

- 构建 manager 插件

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

- 构建 manager 镜像

```shell
docker build -t manager -f build/plugin-builder/images/manager/Dockerfile .
```

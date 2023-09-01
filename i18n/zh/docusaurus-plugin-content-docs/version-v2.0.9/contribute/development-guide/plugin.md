---
id: plugin
title: 插件开发
slug: /contribute/development-guide/plugin/
---

目前蜻蜓支持两类插件：

- 内置插件：代码在蜻蜓代码中，使用时需要重新构建所有组件的代码

- 外置插件：代码在蜻蜓代码之外，仅需要构建插件代码即可，无需重新构建蜻蜓代码

内置插件比较容器开发、构建和运行，刚接触蜻蜓的用户推荐使用这种机制去扩展蜻蜓。

## 内置插件

> 内置插件目前还在开发中，仅在主分支中支持。

## 内置 Dfget 的资源插件

资源插件是用作下载自定义协议资源使用，例如 `dfget -u d7yfs://host:56001/path/to/resource`。

所有的资源插件需要实现接口 `d7y.io/dragonfly/v2/pkg/source.ResourceClient` 并注册到管理器。

<!-- markdownlint-disable -->

```golang
// ResourceClient defines the API interface to interact with source.
type ResourceClient interface {
	// GetContentLength get length of resource content
	// return source.UnknownSourceFileLen if response status is not StatusOK and StatusPartialContent
	GetContentLength(request *Request) (int64, error)

	// IsSupportRange checks if resource supports breakpoint continuation
	// return false if response status is not StatusPartialContent
	IsSupportRange(request *Request) (bool, error)

	// IsExpired checks if a resource received or stored is the same.
	// return false and non-nil err to prevent the source from exploding if
	// fails to get the result, it is considered that the source has not expired
	IsExpired(request *Request, info *ExpireInfo) (bool, error)

	// Download downloads from source
	Download(request *Request) (*Response, error)

	// GetLastModified gets last modified timestamp milliseconds of resource
	GetLastModified(request *Request) (int64, error)
}
```

<!-- markdownlint-restore -->

### 内置插件示例

#### 1. 内置插件代码

样例代码 `Dragonfly2/pkg/source/clients/example/dfs.go`:

<!-- markdownlint-disable -->

```golang

package example

import (
	"bytes"
	"io"

	"d7y.io/dragonfly/v2/pkg/source"
)

const scheme = "dfs"

var data = "hello world"

type client struct {
}

func init() {
	if err := source.Register(scheme, New(), nil); err != nil {
		panic(err)
	}
}

func New() source.ResourceClient {
	return &client{}
}

func (c *client) GetContentLength(request *source.Request) (int64, error) {
	return int64(len(data)), nil
}

func (c *client) IsSupportRange(request *source.Request) (bool, error) {
	return false, nil
}

func (c *client) IsExpired(request *source.Request, info *source.ExpireInfo) (bool, error) {
	panic("implement me")
}

func (c *client) Download(request *source.Request) (*source.Response, error) {
	return source.NewResponse(io.NopCloser(bytes.NewBufferString(data))), nil
}

func (c *client) GetLastModified(request *source.Request) (int64, error) {
	panic("implement me")
}

```

<!-- markdownlint-restore -->

#### 2. 注册到管理器

示例代码 `pkg/source/loader/dfs.go`:

<!-- markdownlint-disable -->

```golang
package loader

import (
	_ "d7y.io/dragonfly/v2/pkg/source/clients/example" // Register dfs client
)
```

<!-- markdownlint-restore -->

#### 3. 构建并查看插件

手动构建:

```shell
# 构建 dfget
make build-dfget
# 验证 dfget
bin/`go env GOOS`_`go env GOARCH`/dfget plugin
```

示例输出:

```text
source plugin: dfs, location: in-tree
source plugin: http, location: in-tree
source plugin: https, location: in-tree
source plugin: oss, location: in-tree
search plugin in /Users/d7y/.dragonfly/plugins
no out of tree plugin found
```

`source plugin: dfs, location: in-tree` 就代码我们新增的插件.

## 外置插件

编译后的插件默认放置路径为 `/usr/local/dragonfly/plugins/`。

Dragonfly 外置插件使用 Golang Plugin 方式进行集成, 参考文档:[https://pkg.go.dev/plugin#section-documentation](https://pkg.go.dev/plugin#section-documentation)。

### 外置 Dfget 的资源插件

资源插件是用作下载自定义协议资源使用，例如 `dfget -u d7yfs://host:56001/path/to/resource`。

所有的资源插件需要实现接口 `d7y.io/dragonfly/v2/pkg/source.ResourceClient` 和一个函数

<!-- markdownlint-disable -->

`func DragonflyPluginInit(option map[string]string) (interface{}, map[string]string, error)`.

<!-- markdownlint-restore -->

<!-- markdownlint-disable -->

```golang
// ResourceClient defines the API interface to interact with source.
type ResourceClient interface {
    // GetContentLength get length of resource content
    // return source.UnknownSourceFileLen if response status is not StatusOK and StatusPartialContent
    GetContentLength(request *Request) (int64, error)

    // IsSupportRange checks if resource supports breakpoint continuation
    // return false if response status is not StatusPartialContent
    IsSupportRange(request *Request) (bool, error)

    // IsExpired checks if a resource received or stored is the same.
    // return false and non-nil err to prevent the source from exploding if
    // fails to get the result, it is considered that the source has not expired
    IsExpired(request *Request, info *ExpireInfo) (bool, error)

    // Download downloads from source
    Download(request *Request) (*Response, error)

    // GetLastModified gets last modified timestamp milliseconds of resource
    GetLastModified(request *Request) (int64, error)
}
```

<!-- markdownlint-restore -->

#### 示例代码

##### 1. main.go

<!-- markdownlint-disable -->

```golang
package main

import (
	"bytes"
	"io"

	"d7y.io/dragonfly/v2/pkg/source"
)

var data = "hello world"

var _ source.ResourceClient = (*client)(nil)

var (
	buildCommit = "unknown"
	buildTime   = "unknown"
	vendor      = "d7y"
)

type client struct {
}

func (c *client) GetContentLength(request *source.Request) (int64, error) {
	return int64(len(data)), nil
}

func (c *client) IsSupportRange(request *source.Request) (bool, error) {
	return false, nil
}

func (c *client) IsExpired(request *source.Request, info *source.ExpireInfo) (bool, error) {
	panic("implement me")
}

func (c *client) Download(request *source.Request) (*source.Response, error) {
	return source.NewResponse(io.NopCloser(bytes.NewBufferString(data))), nil
}

func (c *client) DownloadWithExpireInfo(request *source.Request) (io.ReadCloser, *source.ExpireInfo, error) {
	return io.NopCloser(bytes.NewBufferString(data)), nil, nil
}

func (c *client) GetLastModified(request *source.Request) (int64, error) {
	panic("implement me")
}

func DragonflyPluginInit(option map[string]string) (interface{}, map[string]string, error) {
	return &client{}, map[string]string{
		"scheme":      "d7yfs",
		"type":        "resource",
		"name":        "d7yfs",
		"buildCommit": buildCommit,
		"buildTime":   buildTime,
		"vendor":      vendor,
	}, nil
}


```

<!-- markdownlint-restore -->

##### 2. go.mod

<!-- markdownlint-disable -->

```
module example.com/d7yfs

go 1.20

require d7y.io/dragonfly/v2 v2.0.1

require (
        github.com/go-http-utils/headers v0.0.0-20181008091004-fed159eddc2a // indirect
        github.com/pkg/errors v0.9.1 // indirect
        go.uber.org/atomic v1.9.0 // indirect
        go.uber.org/multierr v1.5.0 // indirect
        go.uber.org/zap v1.16.0 // indirect
        google.golang.org/grpc v1.39.0 // indirect
        gopkg.in/yaml.v3 v3.0.0-20210107192922-496545a6307b // indirect
)

// fix golang build error: `plugin was built with a different version of package d7y.io/dragonfly/v2/internal/dflog`
replace d7y.io/dragonfly/v2 => /Dragonfly2
```

<!-- markdownlint-restore -->

#### 构建

> 构建插件使用 plugin-builder docker 镜像, 参考文档 [this document](./plugin-builder.md)。
> 在 plugin-builder 镜像中构建 `go.mod` 将要被忽略。

##### 1. 构建插件使用 Dragonfly 项目指定的 Commit

> 使用脚本更新 `D7Y_COMMIT`。

<!-- markdownlint-disable -->

```shell
# golang plugin need cgo
# original Dragonfly2 image is built with CGO_ENABLED=0 for alpine linux
# "dfdaemon" need to re-compile with CGO_ENABLED=1
export CGO_ENABLED="1"

# ensure same commit of code base
D7Y_COMMIT=01798aa08a6b4510210dd0a901e9f89318405440
git clone https://github.com/dragonflyoss/Dragonfly2.git /Dragonfly2 && git reset --hard ${D7Y_COMMIT}
(cd /Dragonfly2 && make build-dfget)

# build plugin
BUILD_TIME=$(date -u '+%Y-%m-%dT%H:%M:%SZ')
BUILD_COMMIT=$(git rev-parse --short HEAD)
go mod tidy
go build -ldflags="-X main.buildTime=${BUILD_TIME} -X main.buildCommit=${BUILD_COMMIT}" \
    -buildmode=plugin -o=/usr/local/dragonfly/plugins/d7y-resource-plugin-d7yfs.so ./main.go
```

<!-- markdownlint-restore -->

##### 2. 验证插件

```shell
/Dragonfly2/bin/linux_amd64/dfget plugin
```

示例输出:

<!-- markdownlint-disable -->

```text
search plugin in /usr/local/dragonfly/plugins
resource plugin d7yfs, location: d7y-resource-plugin-d7yfs.so, attribute: {"buildCommit":"bb65f13","buildTime":"2021-12-13T08:53:04Z","name":"d7yfs","scheme":"d7yfs","type":"resource","vendor":"d7y"}
```

<!-- markdownlint-restore -->

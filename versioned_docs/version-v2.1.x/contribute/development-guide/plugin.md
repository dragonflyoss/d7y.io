---
id: plugin
title: Plugin Develop
slug: /contribute/development-guide/plugin/
---

There are two types plugin in dragonfly:

- In-tree plugin: The source code need be placed in dragonfly and then rebuild all components

- Out-of-tree plugin: The source code can be out of dragonfly code, just need to rebuild with same golang compile environment

In-tree plugin is easy to develop, build and run. New plugin users should use this mechanism to extend dragonfly.

## In-tree Plugin {#in-tree-plugin}

> In-tree plugin is working in progress, only supported in main branch.

### In-tree Resource Plugin for Dfget {#in-tree-resource-plugin-for-dfget}

The resource plugin is used to download custom resource like `dfget -u dfs://host:56001/path/to/resource`.

All resource plugins need to implement `d7y.io/dragonfly/v2/pkg/source.ResourceClient`
and register it to manager

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

### In-tree Example Code {#in-tree-example-code}

#### 1. In-tree Plugin code {#in-tree-plugin-code}

Example code `Dragonfly2/pkg/source/clients/example/dfs.go`:

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

#### 2. Register to client manager {#register-to-client-manager}

Example code `pkg/source/loader/dfs.go`:

<!-- markdownlint-disable -->

```golang
package loader

import (
	_ "d7y.io/dragonfly/v2/pkg/source/clients/example" // Register dfs client
)
```

<!-- markdownlint-restore -->

#### 3. Build and list plugins {#build-and-list-plugins}

Build manually:

```shell
# build dfget
make build-dfget
# verify with dfget plugin command
bin/`go env GOOS`_`go env GOARCH`/dfget plugin
```

Example output:

```text
source plugin: dfs, location: in-tree
source plugin: http, location: in-tree
source plugin: https, location: in-tree
source plugin: oss, location: in-tree
search plugin in /Users/d7y/.dragonfly/plugins
no out of tree plugin found
```

The `source plugin: dfs, location: in-tree` is the new plugin we added.

## Out-of-tree Plugin {#out-of-tree-plugin}

All compiled out-of-tree plugins need to place in `/usr/local/dragonfly/plugins/`.

Dragonfly2 use golang plugin to build its out-of-tree plugins, refer: [https://pkg.go.dev/plugin#section-documentation](https://pkg.go.dev/plugin#section-documentation).

### Resource Plugin for Dfget {#resource-plugin-for-dfget}

The resource plugin is used to download custom resource like `dfget -u d7yfs://host:56001/path/to/resource`.

All resource plugins need to implement `d7y.io/dragonfly/v2/pkg/source.ResourceClient`
and a function

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

#### Example Code {#example-code}

##### 1. main.go {#1-maingo}

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

##### 2. go.mod {#2-gomod}

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

#### Build {#build}

> We have created a plugin builder in docker, follow [this document](./plugin-builder.md).
> With the plugin builder, `go.mod` will be ignored.

##### 1. Build plugin with target Dragonfly2 commit {#1-build-plugin-with-target-dragonfly2-commit}

> Update `D7Y_COMMIT` in the following script.

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

##### 2. Validate plugin {#2-validate-plugin}

```shell
/Dragonfly2/bin/linux_amd64/dfget plugin
```

Example output:

<!-- markdownlint-disable -->

```text
search plugin in /usr/local/dragonfly/plugins
resource plugin d7yfs, location: d7y-resource-plugin-d7yfs.so, attribute: {"buildCommit":"bb65f13","buildTime":"2021-12-13T08:53:04Z","name":"d7yfs","scheme":"d7yfs","type":"resource","vendor":"d7y"}
```

<!-- markdownlint-restore -->

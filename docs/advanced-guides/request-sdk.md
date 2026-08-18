---
id: request-sdk
title: Request SDK
slug: /advanced-guides/request-sdk/
---

[![Crates.io](https://img.shields.io/crates/v/dragonfly-client-request.svg)](https://crates.io/crates/dragonfly-client-request)
[![Go Reference](https://pkg.go.dev/badge/d7y.io/dragonfly-sdk/client-request/go.svg)](https://pkg.go.dev/d7y.io/dragonfly-sdk/client-request/go)
[![GitHub](https://img.shields.io/badge/GitHub-View%20Source-blue?logo=github)](https://github.com/dragonflyoss/dragonfly-sdk)

## Background

A SDK for routing User requests to Seed Peers using consistent hashing, replacing the previous Kubernetes Service load balancing approach.

For example, when Nydus downloads layer chunks via HTTP Range requests through Kubernetes Service load balancing:

- Same layer may be downloaded multiple times (once per Seed Peer).
- Low cache hit rate due to requests being distributed across different Seed Peers.
- Prefetch functionality cannot be effectively utilized.

![service](../resource/advanced-guides/request-sdk/service.svg)

### Goals

- Reduce redundant origin downloads.
- Improve chunk cache hit rate.
- Provide SDK integration with clear error handling.

## Architecture

![sdk](../resource/advanced-guides/request-sdk/sdk.svg)

### Task ID-Based Routing

- Generate Task ID from the request URL and metadata, identical across the Rust and Go SDKs.
- Route all chunks of the same layer to the same Seed Peer via consistent hashing.

### Consistent Hash Implementation

- **Element format**: `IP:Port`.
- **Key format**: `Task ID`.
- Uses virtual nodes for load distribution.
- Seed Peers run as StatefulSet ensuring stable IP/Port.

## SDKs

The SDKs are maintained in the [dragonfly-sdk](https://github.com/dragonflyoss/dragonfly-sdk) repository,
sending requests to remote servers via the Dragonfly P2P network, supporting streaming and buffered GET requests
and preheating files or OCI images through seed peers.

| Package                                                                                                        | Description                                                                                                            |
| :------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------- |
| [dragonfly-client-request (Rust)](https://github.com/dragonflyoss/dragonfly-sdk/tree/main/client-request/rust) | Request library for the Dragonfly client, published on [crates.io](https://crates.io/crates/dragonfly-client-request). |
| [client-request (Go)](https://github.com/dragonflyoss/dragonfly-sdk/tree/main/client-request/go)               | Go implementation of the request library, generating identical task ids and seed peer selections as the Rust crate.    |

## Usage

### Rust

Add the dependency to your `Cargo.toml`:

```toml
[dependencies]
dragonfly-client-request = "1.5.1"
```

Send a GET request via the Dragonfly and process the response body as a stream:

```rust
use dragonfly_client_request::{Builder, Client, GetRequest};
use futures::TryStreamExt;

let client = Builder::default()
    .scheduler_endpoint("http://127.0.0.1:8002".to_string())
    .build()
    .await?;

let response = client
    .get(&GetRequest {
        url: "https://example.com/file.txt".to_string(),
        ..Default::default()
    })
    .await?;

// The body is a stream of zero-copy `Bytes` chunks.
let mut body = response.body.unwrap();
while let Some(chunk) = body.try_next().await? {
    // Consume the chunk...
}
```

Or write the response body directly into a buffer for smaller or fixed-size responses:

```rust
use bytes::BytesMut;

let mut buf = BytesMut::new();
let response = client
    .get_into(
        &GetRequest {
            url: "https://example.com/file.txt".to_string(),
            ..Default::default()
        },
        &mut buf,
    )
    .await?;
```

Preheat with multiple replicas and scatter downloads across them. Preheating
writes the file to the given number of distinct seed peers, and downloading
scatters each request across those replicas by picking a random one, retrying
on the others up to the max retries. Preheating fails when the available seed
peers are fewer than the replicas, while downloading clamps the replicas to
the available seed peers. The default replicas is 2:

```rust
use dragonfly_client_request::PreheatRequest;

client
    .preheat(&PreheatRequest {
        url: "https://example.com/file.txt".to_string(),
        replicas: 3,
        ..Default::default()
    })
    .await?;

let response = client
    .get(&GetRequest {
        url: "https://example.com/file.txt".to_string(),
        replicas: 3,
        ..Default::default()
    })
    .await?;
```

Look up the endpoints of the seed peers serving a request, then download from
the looked-up endpoints directly with `ClientWithEndpoints`, scattering each
request across them by picking a random one, retrying on the others up to the
max retries. `ClientWithEndpoints` never connects to the scheduler or syncs
seed peers, sending requests only to the given endpoints, so the endpoints
can also be provided by an external system:

```rust
use dragonfly_client_request::{BuilderWithEndpoints, ClientWithEndpoints};

let request = GetRequest {
    url: "https://example.com/file.txt".to_string(),
    ..Default::default()
};

let endpoints = client.lookup_endpoints(&request).await?;

let client_with_endpoints = BuilderWithEndpoints::default()
    .endpoints(endpoints)
    .max_retries(3)
    .build()?;
let response = client_with_endpoints.get(&request).await?;

// Or write the response body directly into a buffer:
// let response = client_with_endpoints.get_into(&request, &mut buf).await?;
```

The `preheat` feature enables preheating OCI images by resolving manifests from
the registry and triggering seed peers to download each blob:

```toml
[dependencies]
dragonfly-client-request = { version = "1.5.1", features = ["preheat"] }
```

```rust
use dragonfly_client_request::PreheatImageRequest;

client
    .preheat_image(&PreheatImageRequest {
        image: "docker.io/library/nginx:latest".to_string(),
        ..Default::default()
    })
    .await?;
```

For more details, please refer to [dragonfly-client-request](https://crates.io/crates/dragonfly-client-request)
and the [runnable examples](https://github.com/dragonflyoss/dragonfly-sdk/tree/main/client-request/rust/examples).

### Go

Install the package:

```console
go get d7y.io/dragonfly-sdk/client-request/go
```

Send a GET request via the Dragonfly:

```go
import (
    "context"

    dfclient "d7y.io/dragonfly-sdk/client-request/go"
)

func main() {
    ctx := context.Background()
    client, err := dfclient.New(ctx, "http://127.0.0.1:8002")
    if err != nil {
        panic(err)
    }
    defer client.Close()

    resp, err := client.Get(ctx, dfclient.NewGetRequest("https://example.com/file.txt"))
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()
    // Read resp.Body...
}
```

Optional request parameters are set with `With*` options:

```go
req := dfclient.NewGetRequest(
    "https://example.com/file.txt",
    dfclient.WithGetRequestTag("tag"),
    dfclient.WithGetRequestApplication("app"),
    dfclient.WithGetRequestTimeout(30*time.Second),
)
```

Preheat a file or an OCI image to the seed peers:

```go
if err := client.Preheat(ctx, dfclient.NewPreheatRequest("https://example.com/file.txt")); err != nil {
    panic(err)
}

if err := client.PreheatImage(ctx, dfclient.NewPreheatImageRequest("docker.io/library/nginx:latest")); err != nil {
    panic(err)
}
```

Preheat with multiple replicas and scatter downloads across them:

```go
if err := client.Preheat(ctx, dfclient.NewPreheatRequest("https://example.com/file.txt", dfclient.WithPreheatRequestReplicas(3))); err != nil {
    panic(err)
}

resp, err := client.Get(ctx, dfclient.NewGetRequest("https://example.com/file.txt", dfclient.WithGetRequestReplicas(3)))
if err != nil {
    panic(err)
}
defer resp.Body.Close()
```

Look up the endpoints of the seed peers serving a request, then download from
the looked-up endpoints directly with `ClientWithEndpoints`, scattering each
request across them by picking a random one, retrying on the others up to the
max retries. `ClientWithEndpoints` never connects to the scheduler or syncs
seed peers, sending requests only to the given endpoints, so the endpoints
can also be provided by an external system:

```go
req := dfclient.NewGetRequest("https://example.com/file.txt")
endpoints, err := client.LookupEndpoints(ctx, req)
if err != nil {
    panic(err)
}

clientWithEndpoints, err := dfclient.NewWithEndpoints(ctx, endpoints, dfclient.WithClientWithEndpointsMaxRetries(3))
if err != nil {
    panic(err)
}

resp, err := clientWithEndpoints.Get(ctx, req)
if err != nil {
    panic(err)
}
defer resp.Body.Close()

// Or write the response body directly into a writer:
// resp, err := clientWithEndpoints.GetInto(ctx, req, w)
```

For more details, please refer to [pkg.go.dev](https://pkg.go.dev/d7y.io/dragonfly-sdk/client-request/go)
and the [runnable examples](https://github.com/dragonflyoss/dragonfly-sdk/tree/main/client-request/go/examples).

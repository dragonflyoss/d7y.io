---
id: deployment-best-practices
title: Deployment Best Practices
slug: /operations/best-practices/deployment-best-practices/
---

This document outlines how we plan to set up capacity planning and performance optimization for Dragonfly.

## Capacity Planning

A big factor in planning capacity is: Maximum expected file/image storage capacity,
And you need to have a clear understanding of the memory size, number of CPU cores,
and disk capacity of the machine you currently have available.

If you don't have a clear capacity plan, you can use the estimates below to predict your capacity,
but it will vary based on your job needs.

### Manager

The Deployment Manager will estimate the amount of resources used based on the number of Peers.

> Run a minimum of 3 replicas.

<!-- markdownlint-disable -->

| Total Number of Peer | CPU core | Estimated memory | Disk  |
| -------------------- | -------- | ---------------- | ----- |
| 1K                   | 8C       | 16G              | 200Gi |
| 5K                   | 16C      | 32G              | 200Gi |
| 10K                  | 16C      | 64G              | 200Gi |

<!-- markdownlint-restore -->

### Scheduler

The deployment Scheduler estimates the amount of resources used based on download requests (seconds).

> Run a minimum of 3 replicas.

<!-- markdownlint-disable -->

| Download request（sec） | CPU core | Estimated memory | Disk  |
| ----------------------- | -------- | ---------------- | ----- |
| 1K/s                    | 8C       | 16G              | 200Gi |
| 3K/s                    | 16C      | 32G              | 200Gi |
| 5K/s                    | 32C      | 64G              | 200Gi |

<!-- markdownlint-restore -->

### Client

<!-- markdownlint-disable -->

The deployment Client estimates the amount of resources used based on download requests (seconds).

> If it is a Seed Peer, at least 3 copies should be run. The Disk size is based on the total size of different files/images in the Cache.

| Download request（sec） | CPU core | Estimated memory | Disk  |
| ----------------------- | -------- | ---------------- | ----- |
| 500/s                   | 8C       | 16G              | 500Gi |
| 1K/s                    | 8C       | 16G              | 3Ti   |
| 3K/s                    | 16C      | 32G              | 5Ti   |
| 5K/s                    | 32C      | 64G              | 10Ti  |

<!-- markdownlint-restore -->

### Cluster

The following data is an estimate of the amount of resources used. Based on our experience using it,
but will vary based on your job needs.

<!-- markdownlint-disable -->

| Total Number of Peer | Manager            | Scheduler          | Seed Peer         | Peer        |
| -------------------- | ------------------ | ------------------ | ----------------- | ----------- |
| 500                  | 4C-8G-200Gi \* 3   | 8C-16G-200Gi \* 3  | 8C-16G-1Ti \* 3   | 4C-8G-500Gi |
| 1K                   | 8C-16G-200Gi \* 3  | 8C-16G-200Gi \* 3  | 8C-16G-3Ti \* 3   | 4C-8G-500Gi |
| 3K                   | 16C-32G-200Gi \* 3 | 16C-32G-200Gi \* 3 | 16C-32G-5Ti \* 3  | 4C-8G-500Gi |
| 5K                   | 16C-64G-200Gi \* 3 | 32C-64G-200Gi \* 3 | 32C-64G-10Ti \* 3 | 4C-8G-500Gi |

<!-- markdownlint-restore -->

## Performance tuning

### Rate Limit

#### Upload Rate

Mainly used for node P2P sharing of Piece bandwidth.
it is recommended that the configuration be the same as the upstream bandwidth of the machine.
Please refer to [dfdaemon.yaml](../../reference/configuration/client/dfdaemon.md).

```yaml
upload:
  server:
    # -- port is the port to the grpc server.
    port: 4000
    ## ip is the listen ip of the grpc server.
    # ip: ""
  # -- rateLimit is the default rate limit of the upload speed in bps(bytes per second), default is 20Gbps.
  rateLimit: 20000000000
```

#### Download Rate

It mainly affects the bandwidth of the node returning to the source and the bandwidth downloaded from Remote Peer.
It is recommended that the configuration be the same as the downlink bandwidth of the machine.
Please refer to [dfdaemon.yaml](../../reference/configuration/client/dfdaemon.md).

```yaml
download:
  server:
    # -- socketPath is the unix socket path for dfdaemon GRPC service.
    socketPath: /var/run/dragonfly/dfdaemon.sock
  # -- rateLimit is the default rate limit of the download speed in bps(bytes per second), default is 20Gbps.
  rateLimit: 20000000000
```

### Piece concurrency

When a node downloads a single task,
the number of concurrent pieces downloaded back to the source and the
number of concurrent pieces downloaded from the Remote Peer.
The larger the number of Piece concurrency, the faster the task download, and the more CPU and Memory will be consumed.
The user adjusts the number of Piece concurrency according to the actual situation.
and adjust the client’s CPU and memory configuration.
Please refer to [dfdaemon.yaml](../../reference/configuration/client/dfdaemon.md).

```yaml
download:
  # --   pieceTimeout is the timeout for downloading a piece from source.
  pieceTimeout: 30s
  # -- concurrentPieceCount is the number of concurrent pieces to download.
  concurrentPieceCount: 10
```

### Force GC

Mainly used for task GC in the node disk, `taskTTL` is calculated by itself according to the cache time required by the task.
Please refer to [dfdaemon.yaml](../../reference/configuration/client/dfdaemon.md).

```yaml
gc:
  # interval is the interval to do gc.
  interval: 900s
  policy:
    # taskTTL is the ttl of the task.
    taskTTL: 21600s
    # distHighThresholdPercent is the high threshold percent of the disk usage.
    # If the disk usage is greater than the threshold, dfdaemon will do gc.
    distHighThresholdPercent: 80
    # distLowThresholdPercent is the low threshold percent of the disk usage.
    # If the disk usage is less than the threshold, dfdaemon will stop gc.
    distLowThresholdPercent: 60
```

### Nydus

When Dragonfly is used as a Nydus cache, only the Manager, Scheduler and Seed Peer need to be deployed.
Nydus will split the file into roughly 1MB chunks and load the file on demand.
Therefore, Seed Peer's HTTP proxy is used as Nydus' caching server,
And the P2P transmission method is used during the transmission process to reduce return-to-origin
requests and return-to-origin bandwidth.
Please refer to [nydus](../integrations/container-runtime/nydus.md)

**1.** When `proxy.rules.regex` matches the Nydus repository URL.
Only then can download traffic be forwarded to the P2P network.
Please refer to [dfdaemon.yaml](../../reference/configuration/client/dfdaemon.md).

```yaml
proxy:
  # rules is the list of rules for the proxy server.
  # regex is the regex of the request url.
  # useTLS indicates whether use tls for the proxy backend.
  # redirect is the redirect url.
  # filteredQueryParams is the filtered query params to generate the task id.
  # When filter is ["Signature", "Expires", "ns"], for example:
  # http://example.com/xyz?Expires=e1&Signature=s1&ns=docker.io and http://example.com/xyz?Expires=e2&Signature=s2&ns=docker.io
  # will generate the same task id.
  # Default value includes the filtered query params of s3, gcs, oss, obs, cos.
  rules:
    - regex: 'blobs/sha256.*'
      # useTLS: false
      # redirect: ""
      # filteredQueryParams: []
```

**2.** It is recommended to change the `Seed peer load limit` to 10000 or higher,
which can improve the P2P Cache hit rate between Seed Peers.

Click the `UPDATE CLUSTER` button to change the `Seed peer load limit` to 10000.
Please refer to [update-cluster](https://d7y.io/docs/next/advanced-guides/web-console/cluster/#update-cluster).

![update-cluster](../../resource/operations/best-practices/deployment-best-practices/update-cluster.png)

Changed `Seed peer load limit` successfully.

![cluster](../../resource/operations/best-practices/deployment-best-practices/cluster.png)

**3.** Nydus will initiate an HTTP Range request of about 1MB to load on demand. When Prefetch is turned on,
the Seed Peer can prefetch the complete resource after receiving the HTTP Range request.
Please refer to [dfdaemon.yaml](../../reference/configuration/client/dfdaemon.md).

```yaml
proxy:
  # prefetch pre-downloads full of the task when download with range request.
  prefetch: false
```

**4.** When the download speed is slow,
you can adjust the `readBufferSize` value of Proxy to 64KB in order to reduce the Proxy request time.
Please refer to [dfdaemon.yaml](../../reference/configuration/client/dfdaemon.md).

```yaml
proxy:
  # -- readBufferSize is the buffer size for reading piece from disk, default is 32KB.
  readBufferSize: 32768
```

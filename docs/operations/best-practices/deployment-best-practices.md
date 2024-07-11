---
id: deployment-best-practices
title: Deployment Best Practices
slug: /operations/best-practices/deployment-best-practices/
---

Documentation on how to set up capacity planning and performance tuning for Dragonfly.

## Capacity Planning

A big factor in planning capacity is: highest expected storage capacity.
And you need to have a clear understanding of the memory size, CPU core count,
and disk capacity of the machine you currently have.

If you don't have a clear capacity plan, you can use the estimates below to predict your capacity.

### Manager

The deployment Manager estimates the amount of resources used based on the number of peers.

> Run a minimum of 3 replicas.

<!-- markdownlint-disable -->

| Total Number of Peer | CPU | Memory | Disk  |
| -------------------- | --- | ------ | ----- |
| 1K                   | 8C  | 16G    | 200Gi |
| 5K                   | 16C | 32G    | 200Gi |
| 10K                  | 16C | 64G    | 200Gi |

<!-- markdownlint-restore -->

### Scheduler

The deployment Scheduler estimates the amount of resources used based on download requests per second.

> Run a minimum of 3 replicas.

<!-- markdownlint-disable -->

| Request Per Second | CPU | Memory | Disk  |
| ------------------ | --- | ------ | ----- |
| 1K                 | 8C  | 16G    | 200Gi |
| 3K                 | 16C | 32G    | 200Gi |
| 5K                 | 32C | 64G    | 200Gi |

<!-- markdownlint-restore -->

### Client

<!-- markdownlint-disable -->

The deployment Client estimates the amount of resources used based on download requests per second.

> If it is a Seed Peer, run a minimum of 3 replicas. Disk size is calculated based on different file storage capacities.

| Request Per Second | CPU | Memory | Disk  |
| ------------------ | --- | ------ | ----- |
| 500                | 8C  | 16G    | 500Gi |
| 1K                 | 8C  | 16G    | 3Ti   |
| 3K                 | 16C | 32G    | 5Ti   |
| 5K                 | 32C | 64G    | 10Ti  |

<!-- markdownlint-restore -->

### Cluster

Deploying a P2P cluster will estimate the amount of resources used by each service based on the number of Peers.

<!-- markdownlint-disable -->

| Total Number of Peer | Manager            | Scheduler          | Seed Peer         | Peer        |
| -------------------- | ------------------ | ------------------ | ----------------- | ----------- |
| 500                  | 4C/8G/200Gi \* 3   | 8C/16G/200Gi \* 3  | 8C/16G/1Ti \* 3   | 4C/8G/500Gi |
| 1K                   | 8C/16G/200Gi \* 3  | 8C/16G/200Gi \* 3  | 8C/16G/3Ti \* 3   | 4C/8G/500Gi |
| 3K                   | 16C/32G/200Gi \* 3 | 16C/32G/200Gi \* 3 | 16C/32G/5Ti \* 3  | 4C/8G/500Gi |
| 5K                   | 16C/64G/200Gi \* 3 | 32C/64G/200Gi \* 3 | 32C/64G/10Ti \* 3 | 4C/8G/500Gi |

<!-- markdownlint-restore -->

## Performance tuning

The following guidelines may help you to achieve better performance especially for large scale runs.

### Rate limits

#### Upstream bandwidth

Mainly used for node P2P sharing of Piece bandwidth. When the peak bandwidth is greater than the default upstream bandwidth,
`rateLimit` can be set higher to increase upload speed.
It is recommended that the configuration be the same as the downstream bandwidth of the machine.
Please refer to [dfdaemon.yaml](../../reference/configuration/client/dfdaemon.md).

```yaml
upload:
  # -- rateLimit is the default rate limit of the upload speed in bps(bytes per second), default is 20Gbps.
  rateLimit: 20000000000
```

#### Downstream bandwidth

Mainly used for node back-to-source bandwidth and download bandwidth from Remote Peer.
When the peak bandwidth is greater than the default upstream bandwidth,
`rateLimit` can be set higher to increase download speed.
It is recommended that the configuration be the same as the upstream bandwidth of the machine.
Please refer to [dfdaemon.yaml](../../reference/configuration/client/dfdaemon.md).

```yaml
download:
  # -- rateLimit is the default rate limit of the download speed in bps(bytes per second), default is 20Gbps.
  rateLimit: 20000000000
```

### Concurrency Control

Mainly used for downloading a single task on a node,
the number of concurrent Piece downloads back-to-source and concurrent number of Piece downloads from Remote Peer.
The larger the number of Piece concurrency, the faster the task download, and the more CPU and Memory will be consumed.
The user adjusts the number of Piece concurrency according to the actual situation.
and adjust the client’s CPU and memory configuration.
Please refer to [dfdaemon.yaml](../../reference/configuration/client/dfdaemon.md).

```yaml
download:
  # -- concurrentPieceCount is the number of concurrent pieces to download.
  concurrentPieceCount: 10
```

### GC

Mainly used for Task cache GC in node disk, taskTTL is evaluated based on actual cache time.
To avoid cases where GC would be problematic or potentially catastrophi,
it is recommended to use the default values ​​for `distHighThresholdPercent` and `distLowThresholdPercent`,
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

When using Nydus to download a file, Nydus will split the file into chunks of about 1MB and load them on demand.
When using Seed Peer HTTP Proxy as Nydus cache server,
the P2P transmission method is used to reduce back-to-source requests and back-to-source bandwidth,
further improving download speeds.
When Dragonfly is used as a cache server for Nydus, the configuration needs to be optimized.

**1.** `proxy.rules.regex` regularly matches the Nydus storage warehouse URL,
intercepts the download traffic and forwards it to the P2P network.
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

**2.** Change `Seed Peer Load Limit` to 10000 or higher to improve the P2P cache hit rate between Seed Peers.

Click the `UPDATE CLUSTER` button to change the `Seed Peer Load Limit` to 10000.
Please refer to [update-cluster](https://d7y.io/docs/next/advanced-guides/web-console/cluster/#update-cluster).

![update-cluster](../../resource/operations/best-practices/deployment-best-practices/update-cluster.png)

Changed `Seed Peer Load Limit` successfully.

![cluster](../../resource/operations/best-practices/deployment-best-practices/cluster.png)

**3.** Nydus will initiate an HTTP range request of about 1MB to achieve on-demand loading.
When Prefetch enabled, the Seed Peer can prefetch the complete resource after receiving the HTTP range request,
improving the cache hit rate.
Please refer to [dfdaemon.yaml](../../reference/configuration/client/dfdaemon.md).

```yaml
proxy:
  # prefetch pre-downloads full of the task when download with range request.
  prefetch: true
```

**4.** When the download speed is slow,
you can adjust the `readBufferSize` value of Proxy to 64KB in order to reduce the Proxy request time.
Please refer to [dfdaemon.yaml](../../reference/configuration/client/dfdaemon.md).

```yaml
proxy:
  # -- readBufferSize is the buffer size for reading piece from disk, default is 32KB.
  readBufferSize: 32768
```

---
id: rate-limit
title: Rate Limits
slug: /advanced-guides/rate-limit/
---

This document describes how to configure rate limiting for Dragonfly.

The following diagram illustrates the usage of download rate limit, upload rate limit,
and prefetch rate limit for the client.

![rate-limit](../resource/advanced-guides/rate-limit/rate-limit.webp)

## Bandwidth

### Outbound Bandwidth

Used for P2P sharing of piece bandwidth.
If the peak bandwidth is greater than the default outbound bandwidth,
you can set `bandwidthLimit` higher to increase the upload speed.
It is recommended that the configuration be the same as the inbound bandwidth of the machine.
Please refer to [dfdaemon config](../reference/configuration/client/dfdaemon.md).

```yaml
upload:
  # -- bandwidthLimit is the default rate limit of the upload speed in KB/MB/GB per second, default is 50GB/s.
  bandwidthLimit: 50GB
```

### Inbound Bandwidth

Used for back-to-source bandwidth and download bandwidth from remote peer.
If the peak bandwidth is greater than the default inbound bandwidth,
`bandwidthLimit` can be set higher to increase download speed.
It is recommended that the configuration be the same as the outbound bandwidth of the machine.
Please refer to [dfdaemon config](../reference/configuration/client/dfdaemon.md).

```yaml
download:
  # -- bandwidthLimit is the default rate limit of the download speed in KB/MB/GB per second, default is 50GB/s.
  bandwidthLimit: 50GB
```

### Back To Source Bandwidth

Used to limit bandwidth specifically for downloading content directly from the source.
This allows controlling the back-to-source traffic separately from P2P download traffic,
which helps reduce the load on source servers and prevents overwhelming them during peak usage.
Please refer to [dfdaemon config](../reference/configuration/client/dfdaemon.md).

```yaml
download:
  # backToSourceBandwidthLimit is the rate limit of the back to source speed in KB/MB/GB per second, default is 50GB/s.
  backToSourceBandwidthLimit: 50GB
```

### Prefetch Bandwidth

Download bandwidth used for prefetch requests, which can prevent network overload
and reduce competition with other active download tasks,
thereby enhancing overall system performance.
refer to [dfdaemon config](../reference/configuration/client/dfdaemon.md).

```yaml
proxy:
  # prefetchBandwidthLimit is the rate limit of the prefetch speed in KB/MB/GB per second, default is 10GB/s.
  # The prefetch request has lower priority so limit the rate to avoid occupying the bandwidth impact other download tasks.
  prefetchBandwidthLimit: 10GB
```

## Request

### Upload Request

Used to rate limit upload requests in grpc server.
Please refer to [dfdaemon config](../reference/configuration/client/dfdaemon.md).

```yaml
upload:
  server:
    # request_rate_limit is the rate limit of the upload request in the upload grpc server, default is 4000 req/s.
    requestRateLimit: 4000
```

### Download Request

Used to rate limit download requests in grpc server.
Please refer to [dfdaemon config](../reference/configuration/client/dfdaemon.md).

```yaml
download:
  server:
    # request_rate_limit is the rate limit of the download request in the download grpc server, default is 4000 req/s.
    requestRateLimit: 4000
```

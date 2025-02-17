---
id: ddos-attacks
title: DDoS attacks
slug: /operations/best-practices/security/ddos-attacks/
---

This document outlines the DDoS attacks for the Dragonfly system. DDoS is where an attacker uses multiple sources, such as distributed groups of malware infected computers, routers, IoT devices and other endpoints to orchestrate an attack against a target, preventing legitimate users from accessing the target.

## DDoS attacks

According to analysis of Dragonfly architecture, DDoS attackers can be divided into the following types:

- Consumes the bandwidth of target network or service.

- Send a massive amount of traffic to the target network with the
  goal of consuming so much bandwidth that users are denied access.

- Bandwitdh depletion attack: Flood Attack and Amplification attack.

## What can Dragonfly do against DDoS attacks?

Dragonfly can implement rate limiting to reduce the impact of attacks.

### Rate limit

Dragonfly provides three types of rate limits, namely Outbound Bandwidth,
Inbound Bandwidth and Prefetch Bandwidth.

#### Outbound Bandwidth

Used for P2P sharing of piece bandwidth.
If the peak bandwidth is greater than the default outbound bandwidth,
you can set `rateLimit` higher to increase the upload speed,
It is recommended that the configuration be the same as the inbound bandwidth of the machine.
'requestRateLimit' is the rate limit of the upload request in the upload grpc server.
Please refer to [dfdaemon config](../../../reference/configuration/client/dfdaemon.md).

```yaml
upload:
  server:
    # request_rate_limit is the rate limit of the upload request in the upload grpc server, default is 4000 req/s.
    requestRateLimit: 4000
  # rateLimit is the default rate limit of the upload speed in KiB/MiB/GiB per second, default is 10GiB/s.
  rateLimit: 10GiB
```

#### Inbound Bandwidth

Used for back-to-source bandwidth and download bandwidth from remote peer.
If the peak bandwidth is greater than the default inbound bandwidth,
`rateLimit` can be set higher to increase download speed,
It is recommended that the configuration be the same as the outbound bandwidth of the machine.
`requestRateLimit` is the rate limit of the download request in the download grpc server.
Please refer to [dfdaemon config](../../../reference/configuration/client/dfdaemon.md).

```yaml
download:
  server:
    # request_rate_limit is the rate limit of the download request in the download grpc server, default is 4000 req/s.
    requestRateLimit: 4000
  # rateLimit is the default rate limit of the download speed in KiB/MiB/GiB per second, default is 10GiB/s.
  rateLimit: 10GiB
```

#### Prefetch Bandwidth

Download bandwidth used for prefetch requests, which can prevent network overload
and reduce competition with other active download tasks,
thereby enhancing overall system performance.
refer to [dfdaemon config](../../../reference/configuration/client/dfdaemon.md).

```yaml
proxy:
  # prefetchRateLimit is the rate limit of the prefetch speed in KiB/MiB/GiB per second, default is 2GiB/s.
  # The prefetch request has lower priority so limit the rate to avoid occupying the bandwidth impact other download tasks.
  prefetchRateLimit: 2GiB
```

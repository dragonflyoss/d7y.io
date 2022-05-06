---
id: nydus
title: Nydus
---

This document will help you experience how to use dragonfly with nydus.

## Install Dragonfly {#install-dragonfly}

First, deploy the dragonfly service according to different environments. Please refer to [Quick Start](../../getting-started/quick-start.md)

## Enable dragonfly for nydus {#enable-dragonfly-for-nydus}

Configure nydus configuration file. Please refer to [Enable Nydus P2P Proxy](https://github.com/dragonflyoss/image-service/blob/master/docs/nydusd.md#enable-p2p-proxy-for-storage-backend)

Add `device.backend.config.proxy` field to enable dragonfly HTTP proxy for storage backend. For example,
use dragonfly2 distribution service to reduce network workload and latency in
large scale container cluster (enable centralized dfdaemon mode).

```json
{
  "device": {
    "backend": {
      "type": "registry",
      "config": {
        "proxy": {
          // Access remote storage backend via dragonfly proxy, e.g. Dragonfly dfdaemon server URL
          "url": "http://dragonfly-proxy:65001",
          // Fallback to remote storage backend if dragonfly proxy ping failed
          "fallback": true,
          // Endpoint of dragonfly proxy health checking
          "ping_url": "http://dragonfly-proxy:40901/server/ping",
          // Interval of dragonfly proxy health checking, in seconds
          "check_interval": 5
        },
        ...
      }
    },
    ...
  },
  ...
}
```

Once the configuration is loaded successfully on nydusd starting, we will see the log as shown below:

<!-- markdownlint-disable -->

```text
INFO [storage/src/backend/connection.rs:136] backend config: CommonConfig { proxy: ProxyConfig { url: "http://dragonfly-proxy:65001", ping_url: "http://dragonfly-proxy:40901/server/ping", fallback: true, check_interval: 5 }, timeout: 5, connect_timeout: 5, retry_limit: 0 }
```

<!-- markdownlint-restore -->

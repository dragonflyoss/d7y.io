---
id: nydus
title: Nydus
---

本文档将帮助您将 Dragonfly 与 Nydus 一起使用。

## 安装 Dragonfly

首先基于不同环境部署 dragonfly 服务，参考文档[快速开始](../../getting-started/quick-start.md)。

## Nydus 开启 Dragonfly 代理

配置 Nydus 配置文件，参考文档 [开启 Nydus P2P 加速](https://github.com/dragonflyoss/image-service/blob/master/docs/nydusd.md#enable-p2p-proxy-for-storage-backend)

增加 `device.backend.config.proxy` 配置开启 Dragonfly 存储代理。推荐使用 dfdaemon 中心化部署方式进行加速。

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

加速成功，日志输出如下:

<!-- markdownlint-disable -->

```text
INFO [storage/src/backend/connection.rs:136] backend config: CommonConfig { proxy: ProxyConfig { url: "http://dragonfly-proxy:65001", ping_url: "http://dragonfly-proxy:40901/server/ping", fallback: true, check_interval: 5 }, timeout: 5, connect_timeout: 5, retry_limit: 0 }
```

<!-- markdownlint-restore -->

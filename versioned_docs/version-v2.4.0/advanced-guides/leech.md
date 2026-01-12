---
id: leech
title: Leech
slug: /advanced-guides/leech/
---

This document explains that peers download files or data but do not upload anything.

If the user configures the client to disable sharing, it will become a leech.
Configure `dfdaemon.yaml`, the default path is `/etc/dragonfly/dfdaemon.yaml`,
refer to [dfdaemon config](../reference/configuration/client/dfdaemon.md).

```yaml
upload:
  # disableShared indicates whether disable to share data for other peers.
  disableShared: true
```

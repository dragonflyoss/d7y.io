---
id: blocklist
title: Blocklist
slug: /advanced-guides/blocklist/
---

This document describes how to configure the blocklist for Dragonfly. The blocklist can be configured in
the manager console to disable specific downloads, serving as an emergency measure to mitigate the impact
of sudden abnormal requests on the service. When a blocked download is intercepted, gRPC downloads will
return a `PermissionDenied` error code, and HTTP proxy downloads will return a `FORBIDDEN` status.
The following diagram illustrates the blocklist configuration interface in the manager console.

![blocklist](../resource/advanced-guides/blocklist/blocklist.png)

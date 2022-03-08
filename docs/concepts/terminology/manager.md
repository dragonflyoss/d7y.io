---
id: manager
title: Manager
---

Used to manage the dynamic configuration that each module depends on,
and provide keepalive and metrics functions.

## Relationship

- CDN cluster and Scheduler cluster have a `1:N` relationship
- CDN cluster and CDN instance have a `1:N` relationship
- Scheduler cluster and Scheduler instance have a `1:N` relationship

![manager-relationship](../../resource/manager-console/relationship.jpg)

When the Scheduler instance starts,
it reports to the manager the Scheduler Cluster ID.

When the CDN instance starts,
it reports to the manager the CDN Cluster ID.

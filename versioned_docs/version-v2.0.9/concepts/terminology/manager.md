---
id: manager
title: Manager
---

It plays the role of manager in the multi-P2P cluster deployment process.
Used to manage the dynamic configuration that each module depends on,
and provide keepalive and metrics functions.

## Features {#features}

- Stores dynamic configuration for consumption by seed peer cluster, scheduler cluster and dfdaemon.
- Maintain the relationship between seed peer cluster and scheduler cluster.
- Provide async task management features for image preheat combined with harbor.
- Keepalive with scheduler instance and seed peer instance.
- Filter the optimal scheduler cluster for dfdaemon.
- Provides a visual console, which is helpful for users to manage the P2P cluster.

## Relationship {#relationship}

- Seed peer cluster and Scheduler cluster have a `1:N` relationship
- Seed peer cluster and Seed peer instance have a `1:N` relationship
- Scheduler cluster and Scheduler instance have a `1:N` relationship

## Manage multiple P2P networks {#manage-multiple-p2p-networks}

Manager can manage multiple P2P networks.
Usually, a P2P network includes a scheduler cluster, a seed peer clsuter and many dfdaemons.
The service network must be available in a P2P network.

![manage-multiple-p2p-networks](../../resource/architecture/manage-multiple-p2p-networks.png)

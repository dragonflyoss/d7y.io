---
id: architecture
title: Architecture
slug: /operations/architecture/architecture/
---

## Positioning {#positioning}

Provide efficient, stable, secure, low-cost file and
image distribution services to be the best practice and
standard solution in cloud native architectures.

## Features {#features}

- Based on the multi-feature intelligent scheduling system, it not only improves the
  download efficiency but also ensures the system stability.
- By adapting to support different source protocols (HDFS,
  storage services of various cloud vendors, Maven, YUM, etc.).
- Support more distribution modes, such as active pull, active push,
  sync, preheat, etc.
- Separation between systems, support separate deployment to
  meet the needs of different scenarios
- Based on the newly designed P2P protocol framework of grpc,
  with better efficiency and stability.
- Customized P2P protocol based on GRPC is efficient and stable.
- Support user RBAC and multi-tenant isolation.
- Improve distribution efficiency by dynamically compressing files during distribution.
- The client supports third-party client integration
  of Dragonfly's P2P capabilities through the C/S mode.
- Support features such as task management, data visualization, and control of multiple P2P clusters.
- Integration with cloud native ecosystem, such as Harbor, Nydus, etc.
- Support AI infrastructure to efficiently distribute models and datasets, and integrated with the AI ecosystem.

## Architecture {#architecture}

![arch](../../resource/operations/architecture/arch.png)

## Subsystem features {#subsystem-features}

### Manager {#manager}

- Stores dynamic configuration for consumption by seed peer cluster, scheduler cluster and client.
- Maintain the relationship between seed peer cluster and scheduler cluster.
- Provide async task management features for image preheat combined with harbor.
- Keepalive with scheduler instance and seed peer instance.
- Filter the optimal scheduler cluster for client.
- Provides a visual console, which is helpful for users to manage the P2P cluster.
- Clearing P2P task cache.

### Scheduler {#scheduler}

- Based on the multi-feature intelligent scheduling system selects the optimal parent peer.
- Build a scheduling directed acyclic graph for the P2P cluster.
- Remove abnormal peer based on peer multi-feature evaluation results.
- In the case of scheduling failure, notice peer back-to-source download.
- Provide metadata storage to support file writing and seeding.

### Client {#client}

- Serve gRPC for `dfget` with downloading feature,
  and provide adaptation to different source protocols.
- It can be used as seed peer. Turning on the Seed Peer mode can be used as
  a back-to-source download peer in a P2P cluster,
  which is the root peer for download in the entire cluster.
- Serve proxy for container registry mirror and any other http backend.
- Download object like via `http`, `https` and other custom protocol.
- Supports RDMA for faster network transmission in the P2P network.
  It can better support the loading of AI inference models into memory.

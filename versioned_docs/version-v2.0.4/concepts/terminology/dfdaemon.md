---
id: dfdaemon
title: Dfdaemon
---

Dfdaemon is the peer client in P2P network. It will be launched by `dfget` command or be running with `dfget daemon`.

## Features {#features}

- Serve gRPC for `dfget` with downloading feature,
  and provide adaptation to different source protocols.
- It can be used as seed peer. Turning on the Seed Peer mode can be used as
  a back-to-source download peer in a P2P cluster,
  which is the root peer for download in the entire cluster.
- Serve proxy for container registry mirror and any other http backend.
- Download object like via `http`, `https` and other custom protocol.

## Relationship {#relationship}

- Dfdaemon registers itself to Manager for fetching Scheduler.
- Dfdaemon registers P2P tasks to Scheduler.
- Dfdaemon uploads data to other Dfdaemon.

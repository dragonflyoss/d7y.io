---
id: dfdaemon
title: Dfdaemon
---

Dfdaemon is the peer client in P2P network. It will be launched by `dfget` command or be running with `dfget daemon`.

## Features {#features}

- Serve gRPC for `dfget` with downloading feature
- Serve proxy for container registry mirror and any other http backend
- Download object like via `http`, `https` and other custom protocol

## Relationship {#relationship}

- Dfdaemon registers itself to Manager for fetching Scheduler
- Dfdaemon registers P2P tasks to Scheduler
- Dfdaemon uploads data to other Dfdaemon

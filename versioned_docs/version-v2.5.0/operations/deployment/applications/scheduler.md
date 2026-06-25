---
id: scheduler
title: Scheduler
slug: /operations/deployment/applications/scheduler/
---

Scheduler selects the optimal parent peer for current peer to be downloaded
and triggers the seed peer back-to-source download or Client back-to-source download at the appropriate time.

## Features {#features}

- Based on the multi-feature intelligent scheduling system selects the optimal parent peer.
- Build a scheduling directed acyclic graph for the P2P cluster.
- Remove abnormal peer based on peer multi-feature evaluation results.
- In the case of scheduling failure, notice peer back-to-source download.
- Provide metadata storage to support file writing and seeding.

## Scheduling {#scheduling}

Scheduler maintains task, peer and host resources.

- Peer: a download task for Client
- Host: host information for Client, host and peer have a `1:N` relationship
- Task: a download task, task and peer have a `1:N` relationship

The scheduling process is actually to build a directed acyclic graph according to the peer's load.

![scheduler-dag](../../../resource/operations/deployment/applications/scheduler/scheduler-dag.png)

### Load-Aware Scheduling Algorithm {#bandwidth-aware-scheduling-algorithm}

A two-stage scheduling algorithm combining central scheduling with node-level secondary scheduling to
optimize P2P download performance based on real-time load awareness.

#### Architecture {#architecture}

![scheduling](../../../resource/operations/deployment/applications/scheduler/scheduling.svg)

#### Stage 1: Central Scheduling {#stage-1-central-scheduling}

The Scheduler evaluates and returns the top N parent for concurrent piece downloads.

##### Total Score Formula {#stage-1-total-score-formula}

```text
TotalScore = (IDCAffinityScore × 0.2) + (LocationAffinityScore × 0.1) + (LoadQualityScore × 0.6) + (HostTypeScore × 0.1)
```

| Name                    | Weight | Description                             |
| ----------------------- | ------ | --------------------------------------- |
| IDC Affinity Score      | 0.2    | Data center proximity preference        |
| Location Affinity Score | 0.1    | Geographic location matching            |
| Load Quality Score      | 0.6    | Load evaluation                         |
| Host Type Score         | 0.1    | Node type preference (seed, peer, etc.) |

###### Load Quality Score

```text
LoadQualityScore = (PeakBandwidthUsage × 0.5) + (BandwidthDurationRatio × 0.3) + (ConcurrentEfficiency × 0.2)
```

| Name                     | Weight | Description |
| ------------------------ | ------ | ----------- |
| Peak Bandwidth Usage     | 0.5    |             |
| Bandwidth Duration Ratio | 0.3    |             |
| Concurrent Efficiency    | 0.2    |             |

#### Stage 2: Secondary Scheduling {#stage-2-secondary-scheduling}

Real-time parent selection performed by the peer for each piece based on load quality.

![parent-selector](../../../resource/operations/deployment/applications/scheduler/parent-selector.svg)

While the central scheduler provides initial candidate selection, the Parent Selector enables dynamic adaptation to:

- Real-time load: Network conditions fluctuate rapidly during downloads.
- Reduced central load: Distributes scheduling decisions across peers.
- Lower latency: Local decisions avoid round-trip delays to central scheduler.

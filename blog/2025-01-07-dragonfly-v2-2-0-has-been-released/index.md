---
title: Dragonfly v2.2.0 has been released
tags: [dragonfly, container image, OCI, nydus, nydus-snapshotter, containerd]
hide_table_of_contents: false
---

CNCF projects highlighted in this post <https://www.cncf.io/blog/2025/01/07/dragonfly-v2-2-0-has-been-released/>

<!-- [![Dragonfly logo](https://landscape.cncf.io/logos/60b07adb6812ca92688c7a1c33b13001022b0dd73cd3b8e64a415e4f003cde16.svg)](https://www.cncf.io/projects/dragonfly "Go to Dragonfly") -->

Dragonfly v2.2.0 is released! 🎉🎉🎉 Thanks the [contributors](https://github.com/dragonflyoss/dragonfly/graphs/contributors) who made this release happend and welcome you to visit [d7y.io](https://d7y.io/) website.

## Features

### Client written in Rust

The client is written in Rust, offering advantages such as ensuring memory safety, improving performance, etc. The client is a submodule of Dragonfly, refer to [dragonflyoss/client](https://github.com/dragonflyoss/client).

![scheduler schema](https://www.cncf.io/wp-content/uploads/2024/12/Screenshot-2024-12-28-at-10.51.22.png)

![second scheduler schema](https://www.cncf.io/wp-content/uploads/2024/12/Screenshot-2024-12-28-at-10.52.11.jpg)

### Client supports bandwidth rate limiting for prefetching

Client now supports rate limiting for prefetch requests, which can prevent network overload and reduce competition with other active download tasks, thereby enhancing overall system performance. Refer to the [documentation](https://d7y.io/docs/next/reference/configuration/client/dfdaemon/) to configure the proxy.prefetchRateLimit option.

![code](https://www.cncf.io/wp-content/uploads/2025/01/unnamed-64.jpg)

The following diagram illustrates the usage of download rate limit, upload rate limir, and prefetct rate limit for the client.

![rate limit](https://www.cncf.io/wp-content/uploads/2024/12/dragonfly-1.png)

### Client supports leeching

If the user configures the client to disable sharing, it will become a leech.

![code](https://www.cncf.io/wp-content/uploads/2025/01/unnamed-66.jpg)

### Optimize client’s performance for handling a large number of small I/Os by Nydus

- Add the X-Dragonfly-Prefetch HTTP header. If X-Dragonfly-Prefetch is set to true and it is a range request, the client will prefetch the entire task. This feature allows Nydus to control which requests need prefetching.
- The client’s HTTP proxy adds an independent cache to reduce requests to the gRPC server, thereby reducing request latency.
- Increase the memory cache size in RocksDB and enable prefix search for quickly searching piece metadata.
- Use the CRC-32-Castagnoli algorithm with hardware acceleration to reduce the hash calculation cost for piece content.
- Reuse the gRPC connections for downloading and optimize the download logic.

### Defines the V2 of the P2P transfer protocol

Define the V2 of the P2P transfer protocol to make it more standard, clearer, and better performing, refer to [dragonflyoss/api](https://github.com/dragonflyoss/api).

### Enhanced Harbor Integration with P2P Preheating

Dragonfly improves its integration with Harbor v2.13 for preheating images, includes the following enhancements:

- Support for preheating multi architecture images.
- User can select the preheat scope for multi-granularity preheating. (Single Seed Peer, All Seed Peers, All Peers)
- User can specify the scheduler cluster ids for preheating images to the desired Dragonfly clusters.

Refer to [documentation](https://d7y.io/docs/next/advanced-guides/preheat/) for more details.

![create P2P Provider policy](https://www.cncf.io/wp-content/uploads/2025/01/unnamed-65.png)

### Task Manager

User can search all peers of cached task by task ID or download URL, and delete the cache on the selected peers, refer to the [documentation](https://d7y.io/docs/next/advanced-guides/task-manager/).

![dragonfly dashboard](https://www.cncf.io/wp-content/uploads/2024/12/dragonfly-2.png)

### Peer Manager

Manager will regularly synchronize peers’ information and also allows for manual refreshes. Additionally, it will display peers’ information on the Manager Console.

![dragonfly dashboard](https://www.cncf.io/wp-content/uploads/2024/12/dragonfly-3.png)

### Add hostname regexes and CIDRs to cluster scopes for matching clients

When the client starts, it reports its hostname and IP to the Manager. The Manager then returns the best matching cluster (including schedulers and seed peers) to the client based on the cluster scopes configuration.

![Creating a cluster on the Dragonfly dashboard](https://www.cncf.io/wp-content/uploads/2025/01/unnamed-67.png)

### Supports distributed rate limiting for creating jobs across different clusters

User can configure rate limiting for job creation across different clusters in the Manager Console.

![creating a cluster on the dragonfly dashboard](https://www.cncf.io/wp-content/uploads/2025/01/unnamed-68.png)

### Support preheating images using self-signed certificates

Preheating requires calling the container registry to parse the image manifest and construct the URL for downloading blobs. If the container registry uses a self-signed certificate, user can configure the self-signed certificate in the Manager’s config for calling to the container registry.

![code](https://www.cncf.io/wp-content/uploads/2025/01/unnamed-69.jpg)

### Support mTLS for gRPC calls between services

By setting self-signed certificates in the configurations of the Manager, Scheduler, Seed Peer, and Peer, gRPC calls between services will use mTLS.

### Observability

Dragonfly is recommending to use prometheus for monitoring. Prometheus and grafana configurations are maintained in the [dragonflyoss/monitoring](https://github.com/dragonflyoss/monitoring/) repository.

Grafana dashboards are listed below:

<table><tbody><tr><td><strong>Name</strong></td><td><strong>ID</strong></td><td><strong>Link</strong></td><td><strong>Description</strong></td></tr><tr><td>Dragonfly Manager</td><td>15945</td><td><a href="https://grafana.com/grafana/dashboards/15945">https://grafana.com/grafana/dashboards/15945</a></td><td>Grafana dashboard for dragonfly manager.</td></tr><tr><td>Dragonfly Scheduler</td><td>15944</td><td><a href="https://grafana.com/grafana/dashboards/15944">https://grafana.com/grafana/dashboards/15944</a></td><td>Granafa dashboard for dragonfly scheduler.</td></tr><tr><td>Dragonfly Client</td><td>21053</td><td><a href="https://grafana.com/grafana/dashboards/21053">https://grafana.com/grafana/dashboards/21053</a></td><td>Grafana dashboard for dragonfly client and dragonfly seed client.</td></tr><tr><td>Dragonfly Seed Client</td><td>21054</td><td><a href="https://grafana.com/grafana/dashboards/21054">https://grafana.com/grafana/dashboards/21054</a></td><td>Grafana dashboard for dragonfly seed client.</td></tr></tbody></table>

![dashboard](https://www.cncf.io/wp-content/uploads/2025/01/unnamed-70.jpg)

![creating a cluster on the dragonfly dashboard](https://www.cncf.io/wp-content/uploads/2025/01/unnamed-71.jpg)

## Nydus

Nydus v2.3.0 is released, refer to [Nydus Image Service v2.3.0](https://github.com/dragonflyoss/nydus/releases/tag/v2.3.0) for more details.

- builder: support –parent-bootstrap for merge.
- builder/nydusd: support batch chunks mergence.
- nydusify/nydus-snapshotter: support OCI reference types.
- nydusify: support export/import for remote images.
- nydusify: support –push-chunk-size for large size image.
- nydusd/nydus-snapshotter: support basic failover and hot upgrade.
- nydusd: support overlay writable mount for fusedev.

## Console

Console v0.2.0 is released, featuring a redesigned UI and an improved interaction flow. Additionally, more functional pages have been added, such as preheating, task manager, PATs(Personal Access Tokens) manager, etc. Refer to the [documentation](https://d7y.io/docs/next/advanced-guides/web-console/) for more details.

![cluster overview](https://www.cncf.io/wp-content/uploads/2025/01/unnamed-72.png)

![deeper dive image into cluster-1 on dashboard](https://www.cncf.io/wp-content/uploads/2025/01/unnamed-73.png)

## Document

Refactor the website documentation to make Dragonfly simpler and more practical for users, refer to [d7y.io](https://d7y.io/).

![dragonfly website](https://www.cncf.io/wp-content/uploads/2025/01/unnamed-74.png)

## Significant bug fixes

The following content only highlights the significant bug fixes in this release.

- Fix the thread safety issue that occurs when constructing the DAG(Directed Acyclic Graph) during scheduling.
- Fix the memory leak caused by the OpenTelemetry library.
- Avoid hot reload when dynconfig refresh data from Manager.
- Prevent concurrent download requests from causing failures in state machine transitions.
- Use context.Background() to avoid stream cancel by dfdaemon.
- Fix the database performance issue caused by clearing expired jobs when there are too many job records.
- Reuse the gRPC connection pool to prevent redundant request construction.

## AI Infrastructure

### Model Spec

The Dragonfly community is collaboratively defining the OCI Model Specification. OCI Model Specification aims to provide a standard way to package, distribute and run AI models in a cloud native environment. The goal of this specification is to package models in an OCI artifact to take advantage of OCI distribution and ensure efficient model deployment, refer to [CloudNativeAI/model-spec](https://github.com/CloudNativeAI/model-spec) for more details.

![OCI Model Specification image](https://www.cncf.io/wp-content/uploads/2024/12/Screenshot-2024-12-28-at-10.53.54.jpg)

![node](https://www.cncf.io/wp-content/uploads/2024/12/Screenshot-2024-12-28-at-10.54.33.jpg)

### Support accelerated distribution of AI models in Hugging Face Hub(Git LFS)

Distribute large files downloaded via the Git LFS protocol through Dragonfly P2P, refer to the [documentation](https://d7y.io/docs/next/operations/integrations/hugging-face/).

![hugging face hub clusters](https://www.cncf.io/wp-content/uploads/2024/12/Screenshot-2024-12-28-at-10.55.27.jpg)

## Maintainers

The community has added four new Maintainers, hoping to help more contributors participate in the community.

- [Han Jiang](https://github.com/CormickKneey): He works for Kuaishou and will focus on the engineering work for Dragonfly.
- [Yuan Yang](https://github.com/yyzai384): He works for Alibaba Group and will focus on the engineering work for Dragonfly.

## Other

You can see [CHANGELOG](https://github.com/dragonflyoss/dragonfly/blob/main/CHANGELOG.md) for more details.

## Links

- Dragonfly Website: [https://d7y.io/](https://d7y.io/)
- Dragonfly Repository: [https://github.com/dragonflyoss/dragonfly](https://github.com/dragonflyoss/dragonfly)
- Dragonfly Client Repository: [https://github.com/dragonflyoss/client](https://github.com/dragonflyoss/client)
- Dragonfly Console Repository: [https://github.com/dragonflyoss/console](https://github.com/dragonflyoss/console)
- Dragonfly Charts Repository: [https://github.com/dragonflyoss/helm-charts](https://github.com/dragonflyoss/helm-charts)
- Dragonfly Monitor Repository: [https://github.com/dragonflyoss/monitoring](https://github.com/dragonflyoss/monitoring)

<!-- ## Dragonfly Github

![QR code](https://www.cncf.io/wp-content/uploads/2025/01/unnamed-75.png) -->

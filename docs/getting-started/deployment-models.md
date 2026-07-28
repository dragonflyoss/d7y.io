---
id: deployment-models
title: Deployment Models
slug: /getting-started/deployment-models/
---

Dragonfly supports multiple deployment models, and the available features depend on
which components are deployed. Choose the deployment model according to the features you need.

## Lightweight deployment {#lightweight-deployment}

Deploy the Scheduler, Seed Client and Client only, without the Manager and its MySQL and
Redis dependencies. The scheduler and client load the dynamic configuration from the local
`dynconfig.yaml` file mounted as a ConfigMap instead of fetching it from the Manager, and
clients discover schedulers via the scheduler headless service, refer to
[scheduler config](../reference/configuration/scheduler.md) and
[dfdaemon config](../reference/configuration/client/dfdaemon.md).

It is the recommended deployment model for most scenarios that only need the P2P
distribution capabilities (e.g., small Kubernetes clusters, edge environments, or CI systems).
It supports the task distribution and preheating via `dfctl`, refer to
[Kubernetes](./quick-start/kubernetes.md) and [Preheat](../advanced-guides/preheat.md).

## Lightweight deployment with Redis {#lightweight-deployment-with-redis}

Deploy Redis in addition to the lightweight deployment, and configure the scheduler's
`database.redis.addrs` to use it. The persistent task and persistent cache task features
store metadata in Redis, so they are only available when the scheduler is deployed with Redis.

For the helm charts, set `redis.enable` to `true` to deploy Redis with the chart, or set
`externalRedis.addrs` to use an existing Redis, refer to
[Create Dragonfly cluster with Redis based on helm charts](./installation/helm-charts.md#create-dragonfly-cluster-with-redis-based-on-helm-charts).

## Deployment with Manager {#deployment-with-manager}

Deploy the Manager along with MySQL and Redis in addition to the Scheduler, Seed Client and
Client. The Manager provides the control plane of Dragonfly: the web console, Open API,
preheating jobs and multi-cluster management, refer to
[Kubernetes with Manager](./quick-start/kubernetes-with-manager.md) and
[Multi-cluster Kubernetes with Manager](./quick-start/multi-cluster-kubernetes-with-manager.md).

## Feature Matrix {#feature-matrix}

<!-- markdownlint-disable -->

| Feature                                                                  | Lightweight | Lightweight with Redis | With Manager |
| ------------------------------------------------------------------------ | ----------- | ---------------------- | ------------ |
| [Blocklisk](../advanced-guides/blocklist.md)                             | Yes         | Yes                    | Yes          |
| [Task](../concepts/task.md)                                              | Yes         | Yes                    | Yes          |
| Persistent task                                                          | No          | Yes                    | Yes          |
| [Persistent cache task](../concepts/persistent-cache-task.md)            | No          | Yes                    | Yes          |
| [Preheat via dfctl](../advanced-guides/preheat.md)                       | Yes         | Yes                    | Yes          |
| [Preheat via Open API](../advanced-guides/open-api/preheat.md)           | No          | No                     | Yes          |
| [Preheat via web console](../advanced-guides/web-console/job/preheat.md) | No          | No                     | Yes          |
| [Web console](../advanced-guides/web-console.md)                         | No          | No                     | Yes          |
| Open API                                                                 | No          | No                     | Yes          |
| [Personal access tokens](../advanced-guides/personal-access-tokens.md)   | No          | No                     | Yes          |

<!-- markdownlint-restore -->

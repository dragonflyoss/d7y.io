---
id: preheat
title: Preheat
slug: /advanced-guides/preheat/
---

Preheating downloads files or images to the seed peers or peers ahead of time,
so that the following downloads hit the cache of the P2P cluster directly.

Dragonfly provides different ways to preheat depending on the deployment model,
refer to [Deployment Models](../getting-started/deployment-models.md):

- **Without Manager**: use `dfctl` to preheat, which calls the scheduler gRPC directly.
- **With Manager**: use the Open API or the web console to preheat.

## Preheat via dfctl {#preheat-via-dfctl}

In the lightweight deployment (without the Manager), use `dfctl task preheat` to preheat.
It calls the scheduler gRPC directly and triggers the seed peers or peers to download the
task, refer to [dfctl](../reference/commands/client/dfctl.md).

Preheat a file task:

```shell
dfctl task preheat https://example.com/file.txt --scheduler-endpoint http://scheduler-service:8002
```

Preheat an image task:

<!-- markdownlint-disable -->

```shell
dfctl task preheat oci://docker.io/library/alpine:3.19 --scheduler-endpoint http://scheduler-service:8002 --username <USERNAME> --password <PASSWORD>
```

<!-- markdownlint-restore -->

The scope of preheating can be specified with the `--scope` flag:

- `single_seed_peer`: preheat to a single seed peer.
- `all_seed_peers`: preheat to all seed peers, default value. The `--ip`, `--count` and
  `--percentage` flags can limit the seed peers to preheat.
- `all_peers`: preheat to all peers. The `--ip`, `--count` and `--percentage` flags can
  limit the peers to preheat.

Preheat an image task to all peers:

<!-- markdownlint-disable -->

```shell
dfctl task preheat oci://docker.io/library/alpine:3.19 --scheduler-endpoint http://scheduler-service:8002 --scope all_peers
```

<!-- markdownlint-restore -->

In kubernetes, `dfctl` is included in the client image, so you can preheat by executing
`dfctl` in a client pod:

<!-- markdownlint-disable -->

```shell
# Find pod name.
export POD_NAME=$(kubectl get pods --namespace dragonfly-system -l "app=dragonfly,release=dragonfly,component=client" -o jsonpath={.items[0].metadata.name})

# Preheat an image task.
kubectl -n dragonfly-system exec -it ${POD_NAME} -- dfctl task preheat oci://docker.io/library/alpine:3.19 --scheduler-endpoint http://dragonfly-scheduler.dragonfly-system.svc.cluster.local:8002
```

<!-- markdownlint-restore -->

## Preheat via Open API {#preheat-via-open-api}

In the deployment with Manager, use the Open API to create a preheat job. The Manager
distributes the preheat job to the schedulers, and the schedulers trigger the seed peers
or peers to download the task, refer to [Open API preheat](./open-api/preheat.md).

## Preheat via web console {#preheat-via-web-console}

In the deployment with Manager, you can also create and manage preheat jobs in the
web console, refer to [web console preheat](./web-console/job/preheat.md).

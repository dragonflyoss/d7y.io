---
id: kubernetes
title: Kubernetes
description: Dragonfly Quick Start
slug: /getting-started/quick-start/kubernetes/
---

Dragonfly Quick Start document aims to help you to
quick start Dragonfly journey. This experiment is quite easy and
simplified.

You can have a quick start following [Helm Charts](../../setup/install/helm-charts.md).
We recommend to use `Containerd with CRI` and `CRI-O` client.

This table describes some container runtimes version and documents.

<!-- markdownlint-disable -->

| Runtime                 | Version | Document                                         | CRI Support | Pull Command                                |
| ----------------------- | ------- | ------------------------------------------------ | ----------- | ------------------------------------------- |
| Containerd<sup>\*</sup> | v1.1.0+ | [Link](../../setup/runtime/containerd/mirror.md) | Yes         | crictl pull docker.io/library/alpine:latest |
| Containerd without CRI  | v1.1.0  | [Link](../../setup/runtime/containerd/proxy.md)  | No          | ctr image pull docker.io/library/alpine     |
| CRI-O                   | All     | [Link](../../setup/runtime/cri-o.md)             | Yes         | crictl pull docker.io/library/alpine:latest |

<!-- markdownlint-restore -->

`containerd` is recommended.

## Setup kubernetes cluster {#setup-kubernetes-cluster}

[Kind](https://kind.sigs.k8s.io/) is recommended if no Kubernetes cluster is available for testing.

Create kind multi-node cluster configuration file `kind-config.yaml`, configuration content is as follows:

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
  - role: control-plane
  - role: worker
  - role: worker
```

Create a kind multi-node cluster using the configuration file:

```shell
kind create cluster --config kind-config.yaml
```

Switch the context of kubectl to kind cluster:

```shell
kubectl config use-context kind-kind
```

## Kind loads dragonfly image {#kind-loads-dragonfly-image}

Pull dragonfly latest images:

```shell
docker pull dragonflyoss/scheduler:latest
docker pull dragonflyoss/manager:latest
docker pull dragonflyoss/dfdaemon:latest
```

Kind cluster loads dragonfly latest images:

```shell
kind load docker-image dragonflyoss/scheduler:latest
kind load docker-image dragonflyoss/manager:latest
kind load docker-image dragonflyoss/dfdaemon:latest
```

## Create dragonfly cluster based on helm charts {#create-dragonfly-cluster-based-on-helm-charts}

Create helm charts configuration file `charts-config.yaml`, configuration content is as follows:

```yaml
containerRuntime:
  containerd:
    enable: true
    injectConfigPath: true
    registries:
      - 'https://ghcr.io'

scheduler:
  replicas: 1
  metrics:
    enable: true
  config:
    verbose: true
    pprofPort: 18066

seedPeer:
  replicas: 1
  metrics:
    enable: true
  config:
    verbose: true
    pprofPort: 18066

dfdaemon:
  config:
    verbose: true
    pprofPort: 18066
    # ":" is necessary for metrics value
    metrics: :8000

manager:
  replicas: 1
  metrics:
    enable: true
  config:
    verbose: true
    pprofPort: 18066

jaeger:
  enable: true
```

Create a dragonfly cluster using the configuration file:

<!-- markdownlint-disable -->

```shell
$ helm repo add dragonfly https://dragonflyoss.github.io/helm-charts/
$ helm install --wait --create-namespace --namespace dragonfly-system --version 0.8.8 dragonfly dragonfly/dragonfly -f charts-config.yaml
NAME: dragonfly
LAST DEPLOYED: Mon Oct 17 18:43:55 2022
NAMESPACE: dragonfly-system
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
1. Get the scheduler address by running these commands:
  export SCHEDULER_POD_NAME=$(kubectl get pods --namespace dragonfly-system -l "app=dragonfly,release=dragonfly,component=scheduler" -o jsonpath={.items[0].metadata.name})
  export SCHEDULER_CONTAINER_PORT=$(kubectl get pod --namespace dragonfly-system $SCHEDULER_POD_NAME -o jsonpath="{.spec.containers[0].ports[0].containerPort}")
  kubectl --namespace dragonfly-system port-forward $SCHEDULER_POD_NAME 8002:$SCHEDULER_CONTAINER_PORT
  echo "Visit http://127.0.0.1:8002 to use your scheduler"

2. Get the dfdaemon port by running these commands:
  export DFDAEMON_POD_NAME=$(kubectl get pods --namespace dragonfly-system -l "app=dragonfly,release=dragonfly,component=dfdaemon" -o jsonpath={.items[0].metadata.name})
  export DFDAEMON_CONTAINER_PORT=$(kubectl get pod --namespace dragonfly-system $DFDAEMON_POD_NAME -o jsonpath="{.spec.containers[0].ports[0].containerPort}")
  You can use $DFDAEMON_CONTAINER_PORT as a proxy port in Node.

3. Configure runtime to use dragonfly:
  https://d7y.io/docs/getting-started/quick-start/kubernetes/


4. Get Jaeger query URL by running these commands:
  export JAEGER_QUERY_PORT=$(kubectl --namespace dragonfly-system get services dragonfly-jaeger-query -o jsonpath="{.spec.ports[0].port}")
  kubectl --namespace dragonfly-system port-forward service/dragonfly-jaeger-query 16686:$JAEGER_QUERY_PORT
  echo "Visit http://127.0.0.1:16686/search?limit=20&lookback=1h&maxDuration&minDuration&service=dragonfly to query download events"
```

<!-- markdownlint-restore -->

Check that dragonfly is deployed successfully:

```shell
$ kubectl get po -n dragonfly-system
NAME                                 READY   STATUS    RESTARTS        AGE
dragonfly-dfdaemon-65rz7             1/1     Running   5 (6m17s ago)   8m43s
dragonfly-dfdaemon-rnvsj             1/1     Running   5 (6m23s ago)   8m43s
dragonfly-jaeger-7d58dfcfc8-qmn8c    1/1     Running   0               8m43s
dragonfly-manager-6f8b4f5c66-qq8sd   1/1     Running   0               8m43s
dragonfly-mysql-0                    1/1     Running   0               8m43s
dragonfly-redis-master-0             1/1     Running   0               8m43s
dragonfly-redis-replicas-0           1/1     Running   0               8m43s
dragonfly-redis-replicas-1           1/1     Running   0               7m33s
dragonfly-redis-replicas-2           1/1     Running   0               5m50s
dragonfly-scheduler-0                1/1     Running   0               8m43s
dragonfly-seed-peer-0                1/1     Running   3 (5m56s ago)   8m43s
```

## Containerd pull image back-to-source for the first time through dragonfly {#containerd-pull-image-back-to-source-for-the-first-time-through-dragonfly}

Pull `ghcr.io/dragonflyoss/dragonfly2/scheduler:v2.0.5` image in `kind-worker` node:

```shell
docker exec -i kind-worker /usr/local/bin/crictl pull ghcr.io/dragonflyoss/dragonfly2/scheduler:v2.0.5
```

Expose jaeger's port `16686`:

```shell
kubectl --namespace dragonfly-system port-forward service/dragonfly-jaeger-query 16686:16686
```

Visit the Jaeger page in [http://127.0.0.1:16686/search](http://127.0.0.1:16686/search), Search for tracing with Tags
`http.url="/v2/dragonflyoss/dragonfly2/scheduler/blobs/sha256:8a9fba45626f402c12bafaadb718690187cae6e5d56296a8fe7d7c4ce19038f7?ns=ghcr.io"`:

![download-back-to-source-search-tracing](../../resource/getting-started/download-back-to-source-search-tracing.jpg)

Tracing details:

![download-back-to-source-tracing](../../resource/getting-started/download-back-to-source-tracing.jpg)

When pull image back-to-source for the first time through dragonfly, it takes `5.58s` to
download the `f643e116a03d9604c344edb345d7592c48cc00f2a4848aaf773411f4fb30d2f5` layer.

## Containerd pull image hits the cache of local peer {#containerd-pull-image-hits-the-cache-of-local-peer}

Delete `ghcr.io/dragonflyoss/dragonfly2/scheduler:v2.0.5` image in `kind-worker` node:

```shell
docker exec -i kind-worker /usr/local/bin/crictl rmi ghcr.io/dragonflyoss/dragonfly2/scheduler:v2.0.5
```

Pull `ghcr.io/dragonflyoss/dragonfly2/scheduler:v2.0.5` image in `kind-worker` node:

```shell
docker exec -i kind-worker /usr/local/bin/crictl pull ghcr.io/dragonflyoss/dragonfly2/scheduler:v2.0.5
```

Expose jaeger's port `16686`:

```shell
kubectl --namespace dragonfly-system port-forward service/dragonfly-jaeger-query 16686:16686
```

Visit the Jaeger page in [http://127.0.0.1:16686/search](http://127.0.0.1:16686/search), Search for tracing with Tags
`http.url="/v2/dragonflyoss/dragonfly2/scheduler/blobs/sha256:8a9fba45626f402c12bafaadb718690187cae6e5d56296a8fe7d7c4ce19038f7?ns=ghcr.io"`:

![hit-local-peer-cache-search-tracing](../../resource/getting-started/hit-local-peer-cache-search-tracing.jpg)

Tracing details:

![hit-local-peer-cache-tracing](../../resource/getting-started/hit-local-peer-cache-tracing.jpg)

When pull image hits cache of local peer, it takes `65.24ms` to
download the `f643e116a03d9604c344edb345d7592c48cc00f2a4848aaf773411f4fb30d2f5` layer.

## Containerd pull image hits the cache of remote peer {#containerd-pull-image-hits-the-cache-of-remote-peer}

Pull `ghcr.io/dragonflyoss/dragonfly2/scheduler:v2.0.5` image in `kind-worker2` node:

```shell
docker exec -i kind-worker2 /usr/local/bin/crictl pull ghcr.io/dragonflyoss/dragonfly2/scheduler:v2.0.5
```

Expose jaeger's port `16686`:

```shell
kubectl --namespace dragonfly-system port-forward service/dragonfly-jaeger-query 16686:16686
```

Visit the Jaeger page in [http://127.0.0.1:16686/search](http://127.0.0.1:16686/search), Search for tracing with Tags
`http.url="/v2/dragonflyoss/dragonfly2/scheduler/blobs/sha256:8a9fba45626f402c12bafaadb718690187cae6e5d56296a8fe7d7c4ce19038f7?ns=ghcr.io"`:

![hit-remote-peer-cache-search-tracing](../../resource/getting-started/hit-remote-peer-cache-search-tracing.jpg)

Tracing details:

![hit-remote-peer-cache-tracing](../../resource/getting-started/hit-remote-peer-cache-tracing.jpg)

When pull image hits cache of remote peer, it takes `117.98ms` to
download the `f643e116a03d9604c344edb345d7592c48cc00f2a4848aaf773411f4fb30d2f5` layer.

## Preheat image {#preheat-image}

Expose manager's port `8080`:

```shell
kubectl --namespace dragonfly-system port-forward service/dragonfly-manager 8080:8080
```

Preheat `ghcr.io/dragonflyoss/dragonfly2/manager:v2.0.5` image:

```shell
curl --location --request POST 'http://127.0.0.1:8080/api/v1/jobs' \
--header 'Content-Type: application/json' \
--data-raw '{
    "type": "preheat",
    "args": {
        "type": "image",
        "url": "https://ghcr.io/v2/dragonflyoss/dragonfly2/manager/manifests/v2.0.5"
    }
}'
```

The command-line log returns the preheat job id:

```shell
{"id":1,"created_at":"0001-01-01T00:00:00Z","updated_at":"0001-01-01T00:00:00Z","task_id":"group_b376a5cc-adef-4d69-996a-417cd57eeb8e","bio":"","type":"preheat","state":"PENDING","args":{"filter":"","headers":null,"tag":"","type":"image","url":"https://ghcr.io/v2/dragonflyoss/dragonfly2/manager/manifests/v2.0.5"},"result":null,"user_id":0,"seed_peer_clusters":null,"scheduler_clusters":[{"id":1,"created_at":"2022-10-17T12:12:30Z","updated_at":"2022-10-17T12:12:30Z","name":"scheduler-cluster-1","bio":"","config":{"filter_parent_limit":4,"filter_parent_range_limit":40},"client_config":{"load_limit":50,"parallel_count":4},"scopes":{},"is_default":true,"seed_peer_clusters":null,"application_id":0,"security_group_id":0,"jobs":null}]}⏎
```

Polling the preheating status with job id:

```bash
curl --request GET 'http://127.0.0.1:8080/api/v1/jobs/1'
```

If the status is `SUCCESS`, the preheating is successful:

```bash
{"id":1,"created_at":"2022-10-17T13:04:25Z","updated_at":"2022-10-17T13:07:10Z","task_id":"group_15e1bcd5-9a21-4b65-a173-45aef94bdf14","bio":"","type":"preheat","state":"SUCCESS","args":{"filter":"","headers":null,"tag":"","type":"image","url":"https://ghcr.io/v2/dragonflyoss/dragonfly2/manager/manifests/v2.0.5"},"result":{"CreatedAt":"2022-10-17T13:04:25.065178071Z","GroupUUID":"group_15e1bcd5-9a21-4b65-a173-45aef94bdf14","JobStates":[{"CreatedAt":"2022-10-17T13:04:25.065178071Z","Error":"","Results":[],"State":"SUCCESS","TTL":0,"TaskName":"preheat","TaskUUID":"task_e68c9479-4b00-4375-9769-9037b3e41b23"},{"CreatedAt":"2022-10-17T13:04:25.065884164Z","Error":"","Results":[],"State":"SUCCESS","TTL":0,"TaskName":"preheat","TaskUUID":"task_8c9a274f-cd61-4956-bc5d-7df13ce376d9"},{"CreatedAt":"2022-10-17T13:04:25.066427992Z","Error":"","Results":[],"State":"SUCCESS","TTL":0,"TaskName":"preheat","TaskUUID":"task_9724b6be-c36a-446b-bb88-ecf3524d61a1"},{"CreatedAt":"2022-10-17T13:04:25.067040353Z","Error":"","Results":[],"State":"SUCCESS","TTL":0,"TaskName":"preheat","TaskUUID":"task_5eca1397-e991-401e-bc17-c4a707eef92c"},{"CreatedAt":"2022-10-17T13:04:25.067651957Z","Error":"","Results":[],"State":"SUCCESS","TTL":0,"TaskName":"preheat","TaskUUID":"task_1ae407b7-be7f-44a1-a15e-84812df1090e"},{"CreatedAt":"2022-10-17T13:04:25.06822093Z","Error":"","Results":[],"State":"SUCCESS","TTL":0,"TaskName":"preheat","TaskUUID":"task_08589296-f6ef-4229-9752-be6dd4716421"}],"State":"SUCCESS"},"user_id":0,"seed_peer_clusters":[],"scheduler_clusters":[{"id":1,"created_at":"2022-10-17T12:12:30Z","updated_at":"2022-10-17T12:12:30Z","name":"scheduler-cluster-1","bio":"","config":{"filter_parent_limit":4,"filter_parent_range_limit":40},"client_config":{"load_limit":50,"parallel_count":4},"scopes":{},"is_default":true,"seed_peer_clusters":null,"application_id":0,"security_group_id":0,"jobs":null}]}
```

Pull `ghcr.io/dragonflyoss/dragonfly2/manager:v2.0.5` image in `kind-worker` node:

```shell
docker exec -i kind-worker /usr/local/bin/crictl pull ghcr.io/dragonflyoss/dragonfly2/manager:v2.0.5
```

Expose jaeger's port `16686`:

```shell
kubectl --namespace dragonfly-system port-forward service/dragonfly-jaeger-query 16686:16686
```

Visit the Jaeger page in [http://127.0.0.1:16686/search](http://127.0.0.1:16686/search), Search for tracing with Tags
`http.url="/v2/dragonflyoss/dragonfly2/manager/blobs/sha256:ceba1302dd4fbd8fc7fd7a135c8836c795bc3542b9b134597eba13c75d2d2cb0?ns=ghcr.io"`:

![hit-preheat-cache-search-tracing](../../resource/getting-started/hit-preheat-cache-search-tracing.jpg)

Tracing details:

![hit-preheat-cache-tracing](../../resource/getting-started/hit-preheat-cache-tracing.jpg)

When pull image hits preheat cache, it takes `246.03ms` to
download the `ceba1302dd4fbd8fc7fd7a135c8836c795bc3542b9b134597eba13c75d2d2cb0` layer.

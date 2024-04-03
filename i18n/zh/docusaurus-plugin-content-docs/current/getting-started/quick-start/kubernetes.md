---
id: kubernetes
title: Kubernetes
description: Kubernetes
slug: /getting-started/quick-start/kubernetes/
---

文档的目标是帮助您快速开始使用 Helm 部署 Dragonfly。

## 容器运行时

您可以根据 [Helm Charts](../installation/helm-charts.md)文档中的内容快速搭建 Dragonfly 的 Kubernetes 集群。
我们推荐使用 `containerd`。

| 容器运行时                | 版本要求 |  文档                                             |
| ----------------------- | ------- | ------------------------------------------------ |
| containerd              | v1.1.0+ | [Link](../../setup/runtime/containerd/mirror.md) |
| Docker                  | v20.0.1+| [Link](../../setup/runtime/docker.md)            |
| CRI-O                   | All     | [Link](../../setup/runtime/cri-o.md)             |

## 准备 Kubernetes 集群

如果没有可用的 Kubernetes 集群进行测试，推荐使用 [Kind](https://kind.sigs.k8s.io/)。

创建 Kind 多节点集群配置文件 `kind-config.yaml`，配置如下:

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
  - role: control-plane
  - role: worker
  - role: worker
```

使用配置文件创建 Kind 集群:

```shell
kind create cluster --config kind-config.yaml
```

切换 Kubectl 的 context 到 Kind 集群:

```shell
kubectl config use-context kind-kind
```

## Kind 加载 Dragonfly 镜像

下载 Dragonfly latest 镜像:

```shell
docker pull dragonflyoss/scheduler:latest
docker pull dragonflyoss/manager:latest
docker pull dragonflyoss/dfdaemon:latest
```

Kind 集群加载 Dragonfly latest 镜像:

```shell
kind load docker-image dragonflyoss/scheduler:latest
kind load docker-image dragonflyoss/manager:latest
kind load docker-image dragonflyoss/dfdaemon:latest
```

## 基于 Helm Charts 创建 Dragonfly P2P 集群

创建 Helm Charts 配置文件 `charts-config.yaml`，配置如下:

```yaml
containerRuntime:
  containerd:
    enable: true
    injectConfigPath: true
    registries:
      - 'https://ghcr.io'

scheduler:
  image: dragonflyoss/scheduler
  tag: latest
  replicas: 1
  metrics:
    enable: true
  config:
    verbose: true
    pprofPort: 18066

seedPeer:
  image: dragonflyoss/dfdaemon
  tag: latest
  replicas: 1
  metrics:
    enable: true
  config:
    verbose: true
    pprofPort: 18066

dfdaemon:
  image: dragonflyoss/dfdaemon
  tag: latest
  metrics:
    enable: true
  config:
    verbose: true
    pprofPort: 18066

manager:
  image: dragonflyoss/manager
  tag: latest
  replicas: 1
  metrics:
    enable: true
  config:
    verbose: true
    pprofPort: 18066

jaeger:
  enable: true
```

使用配置文件部署 Dragonfly Helm Charts:

<!-- markdownlint-disable -->

```shell
$ helm repo add dragonfly https://dragonflyoss.github.io/helm-charts/
$ helm install --wait --create-namespace --namespace dragonfly-system dragonfly dragonfly/dragonfly -f charts-config.yaml
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

检查 Dragonfly 是否部署成功:

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

## containerd 通过 Dragonfly 首次回源拉镜像

在 `kind-worker` Node 下载 `ghcr.io/dragonflyoss/dragonfly2/scheduler:v2.0.5` 镜像:

```shell
docker exec -i kind-worker /usr/local/bin/crictl pull ghcr.io/dragonflyoss/dragonfly2/scheduler:v2.0.5
```

暴露 Jaeger `16686` 端口:

```shell
kubectl --namespace dragonfly-system port-forward service/dragonfly-jaeger-query 16686:16686
```

进入 Jaeger 页面 [http://127.0.0.1:16686/search](http://127.0.0.1:16686/search)，搜索 Tags 值为
`http.url="/v2/dragonflyoss/dragonfly2/scheduler/blobs/sha256:8a9fba45626f402c12bafaadb718690187cae6e5d56296a8fe7d7c4ce19038f7?ns=ghcr.io"`
Tracing:

![download-back-to-source-search-tracing](../../resource/getting-started/download-back-to-source-search-tracing.jpg)

Tracing 详细内容:

![download-back-to-source-tracing](../../resource/getting-started/download-back-to-source-tracing.jpg)

集群内首次回源时，下载 `f643e116a03d9604c344edb345d7592c48cc00f2a4848aaf773411f4fb30d2f5` 层需要消耗时间为 `5.58s`

## containerd 下载镜像命中 Dragonfly 远程 Peer 的缓存

删除 Node 为 `kind-worker` 的 dfdaemon，为了清除 Dragonfly 本地 Peer 的缓存。

<!-- markdownlint-disable -->

```shell
# 获取 Pod Name
export POD_NAME=$(kubectl get pods --namespace dragonfly-system -l "app=dragonfly,release=dragonfly,component=dfdaemon" -o=jsonpath='{.items[?(@.spec.nodeName=="kind-worker")].metadata.name}' | head -n 1 )

# 删除 Pod
kubectl delete pod ${POD_NAME} -n dragonfly-system
```

<!-- markdownlint-restore -->

删除 `kind-worker` Node 的 containerd 中镜像 `ghcr.io/dragonflyoss/dragonfly2/scheduler:v2.0.5` 的缓存:

```shell
docker exec -i kind-worker /usr/local/bin/crictl rmi ghcr.io/dragonflyoss/dragonfly2/scheduler:v2.0.5
```

在 `kind-worker` Node 下载 `ghcr.io/dragonflyoss/dragonfly2/scheduler:v2.0.5` 镜像:

```shell
docker exec -i kind-worker /usr/local/bin/crictl pull ghcr.io/dragonflyoss/dragonfly2/scheduler:v2.0.5
```

暴露 Jaeger `16686` 端口:

```shell
kubectl --namespace dragonfly-system port-forward service/dragonfly-jaeger-query 16686:16686
```

进入 Jaeger 页面 [http://127.0.0.1:16686/search](http://127.0.0.1:16686/search)，搜索 Tags 值为
`http.url="/v2/dragonflyoss/dragonfly2/scheduler/blobs/sha256:8a9fba45626f402c12bafaadb718690187cae6e5d56296a8fe7d7c4ce19038f7?ns=ghcr.io"`
Tracing:

![hit-remote-peer-cache-search-tracing](../../resource/getting-started/hit-remote-peer-cache-search-tracing.jpg)

Tracing 详细内容:

![hit-remote-peer-cache-tracing](../../resource/getting-started/hit-remote-peer-cache-tracing.jpg)

命中远程 Peer 缓存时，下载 `f643e116a03d9604c344edb345d7592c48cc00f2a4848aaf773411f4fb30d2f5` 层需要消耗时间为 `117.98ms`

## containerd 下载镜像命中 Dragonfly 本地 Peer 的缓存

删除 `kind-worker` Node 的 containerd 中镜像 `ghcr.io/dragonflyoss/dragonfly2/scheduler:v2.0.5` 的缓存:

```shell
docker exec -i kind-worker /usr/local/bin/crictl rmi ghcr.io/dragonflyoss/dragonfly2/scheduler:v2.0.5
```

在 `kind-worker` Node 下载 `ghcr.io/dragonflyoss/dragonfly2/scheduler:v2.0.5` 镜像:

```shell
docker exec -i kind-worker /usr/local/bin/crictl pull ghcr.io/dragonflyoss/dragonfly2/scheduler:v2.0.5
```

暴露 Jaeger `16686` 端口:

```shell
kubectl --namespace dragonfly-system port-forward service/dragonfly-jaeger-query 16686:16686
```

进入 Jaeger 页面 [http://127.0.0.1:16686/search](http://127.0.0.1:16686/search)，搜索 Tags 值为
`http.url="/v2/dragonflyoss/dragonfly2/scheduler/blobs/sha256:8a9fba45626f402c12bafaadb718690187cae6e5d56296a8fe7d7c4ce19038f7?ns=ghcr.io"`
Tracing:

![hit-local-peer-cache-search-tracing](../../resource/getting-started/hit-local-peer-cache-search-tracing.jpg)

Tracing 详细内容:

![hit-local-peer-cache-tracing](../../resource/getting-started/hit-local-peer-cache-tracing.jpg)

命中本地 Peer 缓存时，下载 `f643e116a03d9604c344edb345d7592c48cc00f2a4848aaf773411f4fb30d2f5` 层需要消耗时间为 `65.24ms`

## 预热镜像

暴露 Manager 8080 端口:

```shell
kubectl --namespace dragonfly-system port-forward service/dragonfly-manager 8080:8080
```

使用 Open API 之前请先申请 Personal Access Token，并且 Access Scopes 选择为 `job`，参考文档 [personal-access-tokens](../../reference/personal-access-tokens.md)。

使用 Open API 预热镜像 `ghcr.io/dragonflyoss/dragonfly2/manager:v2.0.5`，参考文档 [preheat](../../reference/preheat.md)。

```shell
curl --location --request POST 'http://127.0.0.1:8080/oapi/v1/jobs' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer your_personal_access_token' \
--data-raw '{
    "type": "preheat",
    "args": {
        "type": "image",
        "url": "https://ghcr.io/v2/dragonflyoss/dragonfly2/manager/manifests/v2.0.5",
        "filteredQueryParams": "Expires&Signature",
        "username": "your_registry_username",
        "password": "your_registry_password"
    }
}'
```

命令行日志返回预热任务 ID:

```shell
{"id":1,"created_at":"0001-01-01T00:00:00Z","updated_at":"0001-01-01T00:00:00Z","task_id":"group_b376a5cc-adef-4d69-996a-417cd57eeb8e","bio":"","type":"preheat","state":"PENDING","args":{"filteredQueryParams":"","headers":null,"tag":"","type":"image","url":"https://ghcr.io/v2/dragonflyoss/dragonfly2/manager/manifests/v2.0.5"},"result":null,"user_id":0,"seed_peer_clusters":null,"scheduler_clusters":[{"id":1,"created_at":"2022-10-17T12:12:30Z","updated_at":"2022-10-17T12:12:30Z","name":"scheduler-cluster-1","bio":"","config":{"filter_parent_limit":4,"filter_parent_range_limit":40},"client_config":{"load_limit":50,"parallel_count":4},"scopes":{},"is_default":true,"seed_peer_clusters":null,"application_id":0,"security_group_id":0,"jobs":null}]}⏎
```

使用预热任务 ID 轮训查询任务是否成功:

```shell
curl --request GET 'http://127.0.0.1:8080/oapi/v1/jobs/1' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer your_personal_access_token'
```

如果返回预热任务状态为 `SUCCESS`，表示预热成功:

```bash
{"id":1,"created_at":"2022-10-17T13:04:25Z","updated_at":"2022-10-17T13:07:10Z","task_id":"group_15e1bcd5-9a21-4b65-a173-45aef94bdf14","bio":"","type":"preheat","state":"SUCCESS","args":{"filteredQueryParams":"","headers":null,"tag":"","type":"image","url":"https://ghcr.io/v2/dragonflyoss/dragonfly2/manager/manifests/v2.0.5"},"result":{"CreatedAt":"2022-10-17T13:04:25.065178071Z","GroupUUID":"group_15e1bcd5-9a21-4b65-a173-45aef94bdf14","JobStates":[{"CreatedAt":"2022-10-17T13:04:25.065178071Z","Error":"","Results":[],"State":"SUCCESS","TTL":0,"TaskName":"preheat","TaskUUID":"task_e68c9479-4b00-4375-9769-9037b3e41b23"},{"CreatedAt":"2022-10-17T13:04:25.065884164Z","Error":"","Results":[],"State":"SUCCESS","TTL":0,"TaskName":"preheat","TaskUUID":"task_8c9a274f-cd61-4956-bc5d-7df13ce376d9"},{"CreatedAt":"2022-10-17T13:04:25.066427992Z","Error":"","Results":[],"State":"SUCCESS","TTL":0,"TaskName":"preheat","TaskUUID":"task_9724b6be-c36a-446b-bb88-ecf3524d61a1"},{"CreatedAt":"2022-10-17T13:04:25.067040353Z","Error":"","Results":[],"State":"SUCCESS","TTL":0,"TaskName":"preheat","TaskUUID":"task_5eca1397-e991-401e-bc17-c4a707eef92c"},{"CreatedAt":"2022-10-17T13:04:25.067651957Z","Error":"","Results":[],"State":"SUCCESS","TTL":0,"TaskName":"preheat","TaskUUID":"task_1ae407b7-be7f-44a1-a15e-84812df1090e"},{"CreatedAt":"2022-10-17T13:04:25.06822093Z","Error":"","Results":[],"State":"SUCCESS","TTL":0,"TaskName":"preheat","TaskUUID":"task_08589296-f6ef-4229-9752-be6dd4716421"}],"State":"SUCCESS"},"user_id":0,"seed_peer_clusters":[],"scheduler_clusters":[{"id":1,"created_at":"2022-10-17T12:12:30Z","updated_at":"2022-10-17T12:12:30Z","name":"scheduler-cluster-1","bio":"","config":{"filter_parent_limit":4,"filter_parent_range_limit":40},"client_config":{"load_limit":50,"parallel_count":4},"scopes":{},"is_default":true,"seed_peer_clusters":null,"application_id":0,"security_group_id":0,"jobs":null}]}
```

在 `kind-worker` Node 下载 `ghcr.io/dragonflyoss/dragonfly2/manager:v2.0.5` 镜像:

```shell
docker exec -i kind-worker /usr/local/bin/crictl pull ghcr.io/dragonflyoss/dragonfly2/manager:v2.0.5
```

暴露 Jaeger `16686` 端口:

```shell
kubectl --namespace dragonfly-system port-forward service/dragonfly-jaeger-query 16686:16686
```

进入 Jaeger 页面 [http://127.0.0.1:16686/search](http://127.0.0.1:16686/search)，搜索 Tags 值为
`http.url="/v2/dragonflyoss/dragonfly2/manager/blobs/sha256:ceba1302dd4fbd8fc7fd7a135c8836c795bc3542b9b134597eba13c75d2d2cb0?ns=ghcr.io"`
Tracing:

![hit-preheat-cache-search-tracing](../../resource/getting-started/hit-preheat-cache-search-tracing.jpg)

Tracing 详细内容:

![hit-preheat-cache-tracing](../../resource/getting-started/hit-preheat-cache-tracing.jpg)

命中预热缓存时，下载 `ceba1302dd4fbd8fc7fd7a135c8836c795bc3542b9b134597eba13c75d2d2cb0` 层需要消耗时间为 `246.03ms`

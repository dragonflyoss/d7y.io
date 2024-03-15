---
id: helm-charts
title: Helm Charts
---

文档的目标是帮助您快速开始使用 Helm Charts 部署 Dragonfly。

更多的集成方案，例如 Docker、CRI-O、Singularity/Apptainer、Nydus、eStargz、Harbor、Git LFS、Hugging Face、TorchServe、Triton Server 等，
可以参考 [Integrations](../../setup/runtime/containerd.md) 文档。

## 环境准备

| 所需软件           | 版本要求 | 文档                                    |
| ------------------ | -------- | --------------------------------------- |
| Kubernetes cluster | 1.19+    | [kubernetes.io](https://kubernetes.io/) |
| Helm               | v3.8.0+  | [helm.sh](https://helm.sh/)             |
| containerd        | v1.5.0+  | [containerd.io](https://containerd.io/) |

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

切换 Kubectl 的 Context 到 Kind 集群:

```shell
kubectl config use-context kind-kind
```

## Kind 加载 Dragonfly 镜像

下载 Dragonfly Latest 镜像:

```shell
docker pull dragonflyoss/scheduler:latest
docker pull dragonflyoss/manager:latest
docker pull dragonflyoss/dfdaemon:latest
```

Kind 集群加载 Dragonfly Latest 镜像:

```shell
kind load docker-image dragonflyoss/scheduler:latest
kind load docker-image dragonflyoss/manager:latest
kind load docker-image dragonflyoss/dfdaemon:latest
```

## 基于 Helm Charts 创建 Dragonfly 集群

创建 Helm Charts 配置文件 `values.yaml`，并且设置容器运行时为 containerd。详情参考[配置文档](https://artifacthub.io/packages/helm/dragonfly/dragonfly#values)。

```yaml
containerRuntime:
  containerd:
    enable: true
    injectConfigPath: true
    registries:
      - 'https://docker.io'

jaeger:
  enable: true
```

使用配置文件部署 Dragonfly Helm Charts:

```shell
$ helm repo add dragonfly https://dragonflyoss.github.io/helm-charts/
$ helm install --create-namespace --namespace dragonfly-system dragonfly dragonfly/dragonfly -f values.yaml
NAME: dragonfly
LAST DEPLOYED: Mon Mar  4 16:23:15 2024
NAMESPACE: dragonfly-system
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
1. Get the scheduler address by running these commands:
  export SCHEDULER_POD_NAME=$(kubectl get pods --namespace dragonfly-system -l "app=dragonfly,release=dragonfly,
  component=scheduler" -o jsonpath={.items[0].metadata.name})
  export SCHEDULER_CONTAINER_PORT=$(kubectl get pod --namespace dragonfly-system $SCHEDULER_POD_NAME -o jsonpath="{.spec.containers[0].ports[0].containerPort}")
  kubectl --namespace dragonfly-system port-forward $SCHEDULER_POD_NAME 8002:$SCHEDULER_CONTAINER_PORT
  echo "Visit http://127.0.0.1:8002 to use your scheduler"

2. Get the dfdaemon port by running these commands:
  export DFDAEMON_POD_NAME=$(kubectl get pods --namespace dragonfly-system -l "app=dragonfly,release=dragonfly,
  component=dfdaemon" -o jsonpath={.items[0].metadata.name})
  export DFDAEMON_CONTAINER_PORT=$(kubectl get pod --namespace dragonfly-system $DFDAEMON_POD_NAME -o jsonpath="{.spec.containers[0].ports[0].containerPort}")
  You can use $DFDAEMON_CONTAINER_PORT as a proxy port in Node.

3. Configure runtime to use dragonfly:
  https://d7y.io/docs/getting-started/quick-start/kubernetes/

4. Get Jaeger query URL by running these commands:
  export JAEGER_QUERY_PORT=$(kubectl --namespace dragonfly-system get services dragonfly-jaeger-query -o jsonpath="{.spec.ports[0].port}")
  kubectl --namespace dragonfly-system port-forward service/dragonfly-jaeger-query 16686:$JAEGER_QUERY_PORT
  echo "Visit http://127.0.0.1:16686/search?limit=20&lookback=1h&maxDuration&minDuration&service=dragonfly
  to query download events"
```

检查 Dragonfly 是否部署成功:

```shell
$ kubectl get po -n dragonfly-system
NAME                                READY   STATUS    RESTARTS   AGE
dragonfly-dfdaemon-2j57h            1/1     Running   0          92s
dragonfly-dfdaemon-fg575            1/1     Running   0          92s
dragonfly-manager-6dbfb7b47-9cd6m   1/1     Running   0          92s
dragonfly-manager-6dbfb7b47-m9nkj   1/1     Running   0          92s
dragonfly-manager-6dbfb7b47-x2nzg   1/1     Running   0          92s
dragonfly-mysql-0                   1/1     Running   0          92s
dragonfly-redis-master-0            1/1     Running   0          92s
dragonfly-redis-replicas-0          1/1     Running   0          92s
dragonfly-redis-replicas-1          1/1     Running   0          55s
dragonfly-redis-replicas-2          1/1     Running   0          34s
dragonfly-scheduler-0               1/1     Running   0          92s
dragonfly-scheduler-1               1/1     Running   0          20s
dragonfly-scheduler-2               1/1     Running   0          10s
dragonfly-seed-peer-0               1/1     Running   0          92s
dragonfly-seed-peer-1               1/1     Running   0          31s
dragonfly-seed-peer-2               1/1     Running   0          11s
```

## containerd 通过 Dragonfly 下载镜像

在 `kind-worker` Node 下载 `alpine:3.19` 镜像。

```shell
docker exec -i kind-worker /usr/local/bin/crictl pull alpine:3.19
```

### 验证镜像下载成功

可以查看日志，判断 `alpine:3.19` 镜像正常拉取。

```shell
# 获取 Pod Name
export POD_NAME=$(kubectl get pods --namespace dragonfly-system -l "app=dragonfly,release=dragonfly,component=
dfdaemon" -o=jsonpath='{.items[?(@.spec.nodeName=="kind-worker")].metadata.name}' | head -n 1 )

# 获取 Peer ID
export PEER_ID=$(kubectl -n dragonfly-system exec -it ${POD_NAME} -- grep "alpine" /var/log/dragonfly/
daemon/core.log | awk -F'"peer":"' '{print $2}' | awk -F'"' '{print $1}' | head -n 1)

# 查看下载日志
kubectl -n dragonfly-system exec -it ${POD_NAME} -- grep ${PEER_ID} /var/log/dragonfly/
daemon/core.log | grep "peer task done"
```

日志输出例子:

```shell
{
  "level": "info",
  "ts": "2024-03-05 12:06:31.244",
  "caller": "peer/peertask_conductor.go:1349",
  "msg": "peer task done, cost: 2751ms",
  "peer": "10.244.1.2-54896-5c6cb404-0f2b-4ac6-a18f-d74167a766b4",
  "task": "0bff62286fe544f598997eed3ecfc8aa9772b8522b9aa22a01c06eef2c8eba66",
  "component": "PeerTask",
  "trace": "31fc6650d93ec3992ab9aad245fbef71"
}
```

## 性能测试

### containerd 通过 Dragonfly 首次回源拉镜像

在 `kind-worker` Node 下载 `alpine:3.19` 镜像。

```shell
docker exec -i kind-worker /usr/local/bin/crictl pull alpine:3.19
```

暴露 Jaeger `16686` 端口:

```shell
kubectl --namespace dragonfly-system port-forward service/dragonfly-jaeger-query 16686:16686
```

进入 Jaeger 页面 [http://127.0.0.1:16686/search](http://127.0.0.1:16686/search)，搜索 Tags 值为
`http.url="https://index.docker.io/v2/library/alpine/blobs/sha256:ace17d5d883e9ea5a21138d0608d60aa2376c68f616c55b0b7e73fba6d8556a3?ns=docker.io"`
Tracing:

![download-back-to-source-search-tracing](../../resource/getting-started/installation/download-back-to-source-search-tracing.png)
Tracing 详细内容:

![download-back-to-source-tracing](../../resource/getting-started/installation/download-back-to-source-tracing.png)

集群内首次回源时，下载 `ace17d5d883e9ea5a21138d0608d60aa2376c68f616c55b0b7e73fba6d8556a3` 层需要消耗时间为 `2.82s`。

### containerd 下载镜像命中 Dragonfly 远程 Peer 的缓存

删除 Node 为 `kind-worker` 的 dfdaemon, 为了清除 Dragonfly 本地 Peer 的缓存。

```shell
# 获取 Pod Name
export POD_NAME=$(kubectl get pods --namespace dragonfly-system -l "app=dragonfly,release=dragonfly,component=
dfdaemon" -o=jsonpath='{.items[?(@.spec.nodeName=="kind-worker")].metadata.name}' | head -n 1 )

# 删除 Pod
kubectl delete pod ${POD_NAME} -n dragonfly-system
```

删除 `kind-worker` Node 的 containerd 中镜像 `alpine:3.19` 的缓存:

```shell
docker exec -i kind-worker /usr/local/bin/crictl rmi alpine:3.19
```

在 `kind-worker` Node 下载 `alpine:3.19` 镜像:

```shell
docker exec -i kind-worker /usr/local/bin/crictl pull alpine:3.19
```

暴露 Jaeger `16686` 端口:

```shell
kubectl --namespace dragonfly-system port-forward service/dragonfly-jaeger-query 16686:16686
```

进入 Jaeger 页面 [http://127.0.0.1:16686/search](http://127.0.0.1:16686/search)，搜索 Tags 值为
`http.url="https://index.docker.io/v2/library/alpine/blobs/sha256:ace17d5d883e9ea5a21138d0608d60aa2376c68f616c55b0b7e73fba6d8556a3?ns=docker.io"`
Tracing:

![hit-remote-peer-cache-search-tracing](../../resource/getting-started/installation/hit-remote-peer-cache-search-tracing.png)

Tracing 详细内容:

![hit-remote-peer-cache-tracing](../../resource/getting-started/installation/hit-remote-peer-cache-tracing.png)

命中远程 Peer 缓存时，下载 `ace17d5d883e9ea5a21138d0608d60aa2376c68f616c55b0b7e73fba6d8556a3` 层需要消耗时间为 `341.72ms`。

### containerd 下载镜像命中 Dragonfly 本地 Peer 的缓存

删除 `kind-worker` Node 的 containerd 中镜像 `alpine:3.19` 的缓存:

```shell
docker exec -i kind-worker /usr/local/bin/crictl rmi alpine:3.19
```

在 `kind-worker` Node 下载 `alpine:3.19` 镜像:

```shell
docker exec -i kind-worker /usr/local/bin/crictl pull alpine:3.19
```

暴露 Jaeger `16686` 端口:

```shell
kubectl --namespace dragonfly-system port-forward service/dragonfly-jaeger-query 16686:16686
```

进入 Jaeger 页面 [http://127.0.0.1:16686/search](http://127.0.0.1:16686/search)，搜索 Tags 值为
`http.url="https://index.docker.io/v2/library/alpine/blobs/sha256:ace17d5d883e9ea5a21138d0608d60aa2376c68f616c55b0b7e73fba6d8556a3?ns=docker.io"`
Tracing:

![hit-local-peer-cache-search-tracing](../../resource/getting-started/installation/hit-local-peer-cache-search-tracing.png)

Tracing 详细内容:

![hit-local-peer-cache-tracing](../../resource/getting-started/installation/hit-local-peer-cache-tracing.png)

命中本地 Peer 缓存时下载 `ace17d5d883e9ea5a21138d0608d60aa2376c68f616c55b0b7e73fba6d8556a3` 层需要消耗时间为 `5.38ms`。

## 预热镜像

暴露 Manager 8080 端口:

```shell
kubectl --namespace dragonfly-system port-forward service/dragonfly-manager 8080:8080
```

使用 Open API 之前请先申请 Personal Access Token，并且 Access Scopes 选择为 `job`，参考文档 [personal-access-tokens](../../reference/personal-access-tokens.md)。

使用 Open API 预热镜像 `alpine:3.19`，参考文档 [preheat](../../reference/preheat.md)。

```shell
curl --location --request POST 'http://127.0.0.1:8080/oapi/v1/jobs' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer your_personal_access_token' \
--data-raw '{
    "type": "preheat",
    "args": {
        "type": "image",
        "url": "https://index.docker.io/v2/library/alpine/manifests/3.19",
        "filteredQueryParams": "Expires&Signature",
        "username": "your_registry_username",
        "password": "your_registry_password"
    }
}'
```

命令行日志返回预热任务 ID:

```shell
{"id":1,"created_at":"0001-01-01T00:00:00Z","updated_at":"0001-01-01T00:00:00Z","is_del":0,"task_id":"group_e9a1bc09-b988-4403-bf56-c4dc295b6a76","bio":"","type":"preheat","state":"PENDING","args":{"filteredQueryParams":"","headers":null,"password":"","platform":"","tag":"","type":"image","url":"https://registry-1.docker.io/v2/library/alpine/manifests/3.19","username":""},"result":null,"user_id":0,"user":{"id":0,"created_at":"0001-01-01T00:00:00Z","updated_at":"0001-01-01T00:00:00Z","is_del":0,"email":"","name":"","avatar":"","phone":"","state":"","location":"","bio":"","configs":null},"seed_peer_clusters":null,"scheduler_clusters":[{"id":1,"created_at":"2024-03-12T08:39:20Z","updated_at":"2024-03-12T08:39:20Z","is_del":0,"name":"cluster-1","bio":"","config":{"candidate_parent_limit":4,"filter_parent_limit":15},"client_config":{"load_limit":200},"scopes":{},"is_default":true,"seed_peer_clusters":null,"schedulers":null,"peers":null,"jobs":null}]}
```

使用预热任务 ID 轮训查询任务是否成功:

```shell
curl --request GET 'http://127.0.0.1:8080/oapi/v1/jobs/1' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer your_personal_access_token'
```

如果返回预热任务状态为 `SUCCESS`，表示预热成功:

```shell
{"id":1,"created_at":"2024-03-14T08:01:05Z","updated_at":"2024-03-14T08:01:29Z","is_del":0,"task_id":"group_e64477bd-3ec8-4898-bd4d-ce74f0f66564","bio":"","type":"preheat","state":"SUCCESS","args":{"filteredQueryParams":"Expires\u0026Signature","headers":null,"password":"liubo666.","platform":"","tag":"","type":"image","url":"https://index.docker.io/v2/library/alpine/manifests/3.19","username":"zhaoxinxin03"},"result":{"CreatedAt":"2024-03-14T08:01:05.08734184Z","GroupUUID":"group_e64477bd-3ec8-4898-bd4d-ce74f0f66564","JobStates":[{"CreatedAt":"2024-03-14T08:01:05.08734184Z","Error":"","Results":[],"State":"SUCCESS","TTL":0,"TaskName":"preheat","TaskUUID":"task_36d16ee6-dea6-426a-94d9-4e2aaedba97e"},{"CreatedAt":"2024-03-14T08:01:05.092529257Z","Error":"","Results":[],"State":"SUCCESS","TTL":0,"TaskName":"preheat","TaskUUID":"task_253e6894-ca21-4287-8cc7-1b2f5bcd52f5"}],"State":"SUCCESS"},"user_id":0,"user":{"id":0,"created_at":"0001-01-01T00:00:00Z","updated_at":"0001-01-01T00:00:00Z","is_del":0,"email":"","name":"","avatar":"","phone":"","state":"","location":"","bio":"","configs":null},"seed_peer_clusters":[],"scheduler_clusters":[{"id":1,"created_at":"2024-03-14T07:37:01Z","updated_at":"2024-03-14T07:37:01Z","is_del":0,"name":"cluster-1","bio":"","config":{"candidate_parent_limit":4,"filter_parent_limit":15},"client_config":{"load_limit":200},"scopes":{},"is_default":true,"seed_peer_clusters":null,"schedulers":null,"peers":null,"jobs":null}]}
```

在 `kind-worker` Node 下载 `alpine:3.19` 镜像:

```shell
docker exec -i kind-worker /usr/local/bin/crictl pull alpine:3.19
```

暴露 Jaeger `16686` 端口:

```shell
kubectl --namespace dragonfly-system port-forward service/dragonfly-jaeger-query 16686:16686
```

进入 Jaeger 页面 [http://127.0.0.1:16686/search](http://127.0.0.1:16686/search)，搜索 Tags 值为
`http.url="https://index.docker.io/v2/library/alpine/blobs/sha256:ace17d5d883e9ea5a21138d0608d60aa2376c68f616c55b0b7e73fba6d8556a3?ns=docker.io"`
Tracing:

![hit-preheat-cache-search-tracing](../../resource/getting-started/installation/hit-preheat-cache-search-tracing.png)

Tracing 详细内容:

![hit-preheat-cache-tracing](../../resource/getting-started/installation/hit-preheat-cache-tracing.png)

命中预热缓存时，下载 `ace17d5d883e9ea5a21138d0608d60aa2376c68f616c55b0b7e73fba6d8556a3` 层需要消耗时间为 `854.54ms`。

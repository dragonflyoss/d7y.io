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

| 容器运行时 | 版本要求 | 文档                                                                  |
| ---------- | -------- | --------------------------------------------------------------------- |
| containerd | v1.1.0+  | [Link](../../operations/integrations/container-runtime/containerd.md) |
| Docker     | v20.0.1+ | [Link](../../operations/integrations/container-runtime/docker.md)     |
| CRI-O      | All      | [Link](../../operations/integrations/container-runtime/cri-o.md)      |

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

下载 Dragonfly latest 镜像:

```shell
docker pull dragonflyoss/scheduler:latest
docker pull dragonflyoss/manager:latest
docker pull dragonflyoss/client:latest
docker pull dragonflyoss/dfinit:latest
```

Kind 集群加载 Dragonfly latest 镜像:

```shell
kind load docker-image dragonflyoss/scheduler:latest
kind load docker-image dragonflyoss/manager:latest
kind load docker-image dragonflyoss/client:latest
kind load docker-image dragonflyoss/dfinit:latest
```

## 基于 Helm Charts 创建 Dragonfly P2P 集群

创建 Helm Charts 配置文件 `charts-config.yaml`，配置如下:

```yaml
manager:
  image:
    repository: dragonflyoss/manager
    tag: latest
  metrics:
    enable: true
  config:
    verbose: true
    pprofPort: 18066

scheduler:
  image:
    repository: dragonflyoss/scheduler
    tag: latest
  metrics:
    enable: true
  config:
    verbose: true
    pprofPort: 18066

seedClient:
  image:
    repository: dragonflyoss/client
    tag: latest
  metrics:
    enable: true
  config:
    verbose: true

client:
  image:
    repository: dragonflyoss/client
    tag: latest
  metrics:
    enable: true
  config:
    verbose: true
  dfinit:
    enable: true
    image:
      repository: dragonflyoss/dfinit
      tag: latest
    config:
      containerRuntime:
        containerd:
          configPath: /etc/containerd/config.toml
          registries:
            - hostNamespace: docker.io
              serverAddr: https://index.docker.io
              capabilities: ['pull', 'resolve']
```

使用配置文件部署 Dragonfly Helm Charts:

<!-- markdownlint-disable -->

```shell
$ helm repo add dragonfly https://dragonflyoss.github.io/helm-charts/
$ helm install --wait --create-namespace --namespace dragonfly-system dragonfly dragonfly/dragonfly -f charts-config.yaml
NAME: dragonfly
LAST DEPLOYED: Tue Apr 16 11:23:00 2024
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
```

<!-- markdownlint-restore -->

检查 Dragonfly 是否部署成功:

```shell
$ kubectl get po -n dragonfly-system
NAME                                 READY   STATUS     RESTARTS      AGE
dragonfly-client-dhqfc               1/1     Running    0             13m
dragonfly-client-h58x6               1/1     Running    0             13m
dragonfly-manager-7b4fd85458-fjtpk   1/1     Running    0             13m
dragonfly-mysql-0                    1/1     Running    0             13m
dragonfly-redis-master-0             1/1     Running    0             13m
dragonfly-redis-replicas-0           1/1     Running    0             13m
dragonfly-redis-replicas-1           1/1     Running    0             11m
dragonfly-redis-replicas-2           1/1     Running    0             10m
dragonfly-scheduler-0                1/1     Running    0             13m
dragonfly-seed-client-0              1/1     Running    2 (76s ago)   13m
```

## containerd 通过 Dragonfly 下载镜像

在 `kind-worker` Node 下载 `alpine:3.19` 镜像:

```shell
docker exec -i kind-worker /usr/local/bin/crictl pull alpine:3.19
```

### 验证镜像下载成功

可以查看日志，判断 `alpine:3.19` 镜像正常拉取。

<!-- markdownlint-disable -->

```shell
# 获取 Pod Name
export POD_NAME=$(kubectl get pods --namespace dragonfly-system -l "app=dragonfly,release=dragonfly,component=client" -o=jsonpath='{.items[?(@.spec.nodeName=="kind-worker")].metadata.name}' | head -n 1 )

# 获取 Task ID
export TASK_ID=$(kubectl -n dragonfly-system exec ${POD_NAME} -- sh -c "grep -hoP 'library/alpine.*task_id=\"\K[^\"]+' /var/log/dragonfly/dfdaemon/* | head -n 1")

# 查看下载日志
kubectl -n dragonfly-system exec -it ${POD_NAME} -- sh -c "grep ${TASK_ID} /var/log/dragonfly/dfdaemon/* | grep 'download task succeeded'"

# 下载日志
kubectl -n dragonfly-system exec ${POD_NAME} -- sh -c "grep ${TASK_ID} /var/log/dragonfly/dfdaemon/*" > dfdaemon.log
```

<!-- markdownlint-restore -->

日志输出例子:

```shell
{
  2024-04-19T02:44:09.259458Z  INFO
  "download_task":"dragonfly-client/src/grpc/dfdaemon_download.rs:276":: "download task succeeded"
  "host_id": "172.18.0.3-kind-worker",
  "task_id": "a46de92fcb9430049cf9e61e267e1c3c9db1f1aa4a8680a048949b06adb625a5",
  "peer_id": "172.18.0.3-kind-worker-86e48d67-1653-4571-bf01-7e0c9a0a119d"
}
```

## 性能测试

### containerd 通过 Dragonfly 首次回源拉镜像

在 `kind-worker` Node 下载 `alpine:3.19` 镜像:

```shell
time docker exec -i kind-worker /usr/local/bin/crictl pull alpine:3.19
```

集群内首次回源时，下载 `alpine:3.19` 镜像要消耗时间为 `37.852s`。

### containerd 下载镜像命中 Dragonfly 远程 Peer 的缓存

删除 Node 为 `kind-worker` 的 client，为了清除 Dragonfly 本地 Peer 的缓存。

<!-- markdownlint-disable -->

```shell
# 获取 Pod Name
export POD_NAME=$(kubectl get pods --namespace dragonfly-system -l "app=dragonfly,release=dragonfly,component=client" -o=jsonpath='{.items[?(@.spec.nodeName=="kind-worker")].metadata.name}' | head -n 1 )

# 删除 Pod
kubectl delete pod ${POD_NAME} -n dragonfly-system
```

<!-- markdownlint-restore -->

删除 `kind-worker` Node 的 containerd 中镜像 `alpine:3.19` 的缓存:

```shell
docker exec -i kind-worker /usr/local/bin/crictl rmi alpine:3.19
```

在 `kind-worker` Node 下载 `alpine:3.19` 镜像:

```shell
time docker exec -i kind-worker /usr/local/bin/crictl pull alpine:3.19
```

命中远程 Peer 缓存时，下载 `alpine:3.19` 镜像要消耗时间为 `6.942s`。

### containerd 下载镜像命中 Dragonfly 本地 Peer 的缓存

删除 `kind-worker` Node 的 containerd 中镜像 `alpine:3.19` 的缓存:

```shell
docker exec -i kind-worker /usr/local/bin/crictl rmi alpine:3.19
```

在 `kind-worker` Node 下载 `alpine:3.19` 镜像:

```shell
time docker exec -i kind-worker /usr/local/bin/crictl pull alpine:3.19
```

命中本地 Peer 缓存时，下载 `alpine:3.19` 镜像需要消耗时间为 `5.540s`。

## 预热镜像

暴露 Manager 8080 端口:

```shell
kubectl --namespace dragonfly-system port-forward service/dragonfly-manager 8080:8080
```

使用 Open API 之前请先申请 Personal Access Token，并且 Access Scopes 选择为 `job`，参考文档 [personal-access-tokens](../../advanced-guides/personal-access-tokens.md)。

使用 Open API 预热镜像 `alpine:3.19`，参考文档 [preheat](../../advanced-guides/preheat.md)。

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

```json
{
  "id": 1,
  "created_at": "2024-04-18T08:51:55Z",
  "updated_at": "2024-04-18T08:51:55Z",
  "task_id": "group_2717f455-ff0a-435f-a3a7-672828d15a2a",
  "type": "preheat",
  "state": "PENDING",
  "args": {
    "filteredQueryParams": "Expires&Signature",
    "headers": null,
    "password": "",
    "pieceLength": 4194304,
    "platform": "",
    "tag": "",
    "type": "image",
    "url": "https://index.docker.io/v2/library/alpine/manifests/3.19",
    "username": ""
  },
  "scheduler_clusters": [
    {
      "id": 1,
      "created_at": "2024-04-18T08:29:15Z",
      "updated_at": "2024-04-18T08:29:15Z",
      "name": "cluster-1"
    }
  ]
}
```

使用预热任务 ID 轮训查询任务是否成功:

```shell
curl --request GET 'http://127.0.0.1:8080/oapi/v1/jobs/1' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer your_personal_access_token'
```

如果返回预热任务状态为 `SUCCESS`，表示预热成功:

```json
{
  "id": 1,
  "created_at": "2024-04-18T08:51:55Z",
  "updated_at": "2024-04-18T08:51:55Z",
  "task_id": "group_2717f455-ff0a-435f-a3a7-672828d15a2a",
  "type": "preheat",
  "state": "SUCCESS",
  "args": {
    "filteredQueryParams": "Expires&Signature",
    "headers": null,
    "password": "",
    "pieceLength": 4194304,
    "platform": "",
    "tag": "",
    "type": "image",
    "url": "https://index.docker.io/v2/library/alpine/manifests/3.19",
    "username": ""
  },
  "scheduler_clusters": [
    {
      "id": 1,
      "created_at": "2024-04-18T08:29:15Z",
      "updated_at": "2024-04-18T08:29:15Z",
      "name": "cluster-1"
    }
  ]
}
```

在 `kind-worker` Node 下载 `alpine:3.19` 镜像:

```shell
time docker exec -i kind-worker /usr/local/bin/crictl pull alpine:3.19
```

命中预热缓存时，下载 `alpine:3.19` 镜像需要消耗时间为 `2.952s`。

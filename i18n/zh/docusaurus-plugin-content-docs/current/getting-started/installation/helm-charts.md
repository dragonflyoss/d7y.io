---
id: helm-charts
title: Helm Charts
---

文档的目标是帮助您快速开始使用 Helm Charts 部署 Dragonfly。

您可以根据不同的容器运行时去选择配置 helm charts，推荐使用 `Containerd`。

## 环境准备

| 所需软件           | 版本要求 |
| ------------------ | -------- |
| Kubernetes cluster | 1.20+    |
| Helm               | v3.8.0+  |

## Containerd

### 准备 Kubernetes 集群

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

### Kind 加载 Dragonfly 镜像

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

### 基于 Helm Charts 创建 Dragonfly P2P 集群

创建 Helm Charts 配置文件 `values.yaml`，配置如下:

需要增加其他配置，参考[配置文档](https://artifacthub.io/packages/helm/dragonfly/dragonfly#values)。

```yaml
containerRuntime:
  containerd:
    enable: true
    injectConfigPath: true
    registries:
      - 'https://docker.io'
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

1. Get the dfdaemon port by running these commands:
  export DFDAEMON_POD_NAME=$(kubectl get pods --namespace dragonfly-system -l "app=dragonfly,release=dragonfly,
  component=dfdaemon" -o jsonpath={.items[0].metadata.name})
  export DFDAEMON_CONTAINER_PORT=$(kubectl get pod --namespace dragonfly-system $DFDAEMON_POD_NAME -o jsonpath="{.spec.containers[0].ports[0].containerPort}")
  You can use $DFDAEMON_CONTAINER_PORT as a proxy port in Node.

1. Configure runtime to use dragonfly:
  https://d7y.io/docs/getting-started/quick-start/kubernetes/
```

### 等待部署成功

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
dragonfly-scheduler-2               0/1     Running   0          10s
dragonfly-seed-peer-0               1/1     Running   0          92s
dragonfly-seed-peer-1               1/1     Running   0          31s
dragonfly-seed-peer-2               0/1     Running   0          11s
```

### 运行 Dragonfly

在 `kind-worker` Node 下载 `dragonflyoss/scheduler:latest` 镜像。

```shell
docker exec -i kind-worker /usr/local/bin/crictl pull dragonflyoss/scheduler:latest
```

拉取镜像后可以在 dfdaemon 查询日志:

```shell
# 显示 pod
kubectl -n dragonfly-system get pod -l component=dfdaemon -owide
# 显示日志
POD_NAME=<your-pod-name>
kubectl -n dragonfly-system exec -it ${POD_NAME} -- grep "peer task done" /var/log/dragonfly/daemon/core.log
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

## Docker

> **不推荐在 docker 环境中使用蜻蜓**：1. 拉镜像没有 fallback 机制，2. 在未来的 Kubernetes 中已经废弃。
> 因为当前 Kubernetes 里的 `daemonset` 并不支持 `Surging Rolling Update` 策略，
> 一旦旧的 dfdaemon pod 被删除后，新的 dfdaemon 就再也拉取不了了。

### 准备 Kubernetes 集群 {#docker-prepare-kubernetes-cluster}

如果没有可用的 Kubernetes 集群进行测试，推荐使用 [minikube](https://minikube.sigs.k8s.io/docs/start/)。
只需运行 `minikube start`。

### 基于 Helm Charts 创建 Dragonfly P2P 集群 {#docker-install-dragonfly}

创建 Helm Charts 配置文件 `values.yaml`，配置如下:

需要增加其他配置，参考[配置文档](https://artifacthub.io/packages/helm/dragonfly/dragonfly#values)。

```shell
containerRuntime:
  docker:
    enable: true
    restart: true
```

使用配置文件部署 Dragonfly Helm Charts:

```shell
$ helm repo add dragonfly https://dragonflyoss.github.io/helm-charts/
$ helm install --create-namespace --namespace dragonfly-system dragonfly dragonfly/dragonfly -f values.yaml
NAME: dragonfly
LAST DEPLOYED: Tue Mar  5 20:29:43 2024
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
```

### 等待部署成功 Wait Dragonfly Ready {#docker-wait-dragonfly-ready}

检查 Dragonfly 是否部署成功:

```shell
$ kubectl get po -n dragonfly-system
NAME                                READY   STATUS    RESTARTS   AGE
dragonfly-dfdaemon-vsggn            1/1     Running   0          123s
dragonfly-manager-6dbfb7b47-j5gpn   1/1     Running   0          123s
dragonfly-manager-6dbfb7b47-tgdxq   1/1     Running   0          123s
dragonfly-manager-6dbfb7b47-vz67b   1/1     Running   0          123s
dragonfly-mysql-0                   1/1     Running   0          123s
dragonfly-redis-master-0            1/1     Running   0          123s
dragonfly-redis-replicas-0          1/1     Running   0          123s
dragonfly-redis-replicas-1          1/1     Running   0          123s
dragonfly-redis-replicas-2          1/1     Running   0          112s
dragonfly-scheduler-0               1/1     Running   0          123s
dragonfly-scheduler-1               1/1     Running   0          121s
dragonfly-scheduler-2               1/1     Running   0          121s
dragonfly-seed-peer-0               1/1     Running   0          123s
dragonfly-seed-peer-1               1/1     Running   0          121s
dragonfly-seed-peer-2               1/1     Running   0          121s
```

### 运行 Dragonfly {#docker-run-dragonfly}

在 `minikube` Node 下载 `dragonflyoss/scheduler:latest` 镜像。

```shell
docker exec -i minikube /bin/docker pull dragonflyoss/scheduler:latest
```

拉取镜像后可以在 dfdaemon 查询日志:

```shell
# 显示 pod
kubectl -n dragonfly-system get pod -l component=dfdaemon -owide
# 显示日志
POD_NAME=<your-pod-name>
kubectl -n dragonfly-system exec -it ${POD_NAME} -- grep "peer task done" /var/log/dragonfly/daemon/core.log
```

日志输出例子:

```shell
{
  "level": "info",
  "ts": "2024-03-05 12:46:29.542",
  "caller": "peer/peertask_conductor.go:1349",
  "msg": "peer task done, cost: 32068ms",
  "peer": "10.244.0.153-231511-f19680f9-4028-46b9-be8b-8eed156183a1",
  "task": "4d4eba4c9dca752f0381ffe5093a96fb4ffbd9b0b4ea43234d942025c451b76c",
  "component": "PeerTask",
  "trace": "e35cc32974a440297016a213aa2f0e48"
}
```

## Manager 控制台

使用默认用户名 `root`，密码 `dragonfly` 访问 `localhost:8080` 的 Manager 控制台地址，并且进入控制台。

需要绑定 Ingress 可以参考
[Helm Charts 配置选项](https://artifacthub.io/packages/helm/dragonfly/dragonfly#values)，
或者手动自行创建 Ingress。

控制台功能预览参考文档 [console preview](../../reference/manage-console.md)。

## 卸载 Dragonfly

如要卸载 Dragonfly，请执行以下命令：

```shell
helm delete dragonfly --namespace dragonfly-system
```

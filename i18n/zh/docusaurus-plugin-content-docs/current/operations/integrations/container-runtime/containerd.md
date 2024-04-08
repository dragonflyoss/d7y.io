---
id: containerd
title: containerd
slug: /setup/runtime/containerd
---

文档的目标是帮助您将 Dragonfly 的容器运行时设置为 containerd。

## 环境准备

| 所需软件           | 版本要求 | 文档                                    |
| ------------------ | -------- | --------------------------------------- |
| Kubernetes cluster | 1.19+    | [kubernetes.io](https://kubernetes.io/) |
| Helm               | v3.8.0+  | [helm.sh](https://helm.sh/)             |
| containerd         | v1.5.0+  | [containerd.io](https://containerd.io/) |

## 快速开始

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

### 基于 Helm Charts 创建 Dragonfly 集群

创建 Helm Charts 配置文件 `values.yaml`。详情参考[配置文档](https://artifacthub.io/packages/helm/dragonfly/dragonfly#values)。

```yaml
containerRuntime:
  containerd:
    enable: true
    injectConfigPath: true
    registries:
      - 'https://docker.io'
```

使用配置文件部署 Dragonfly Helm Charts:

<!-- markdownlint-disable -->

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

检查 Dragonfly 是否部署成功:

```shell
$ kubectl get po -n dragonfly-system
NAME                                 READY   STATUS    RESTARTS   AGE
dragonfly-dfdaemon-f859z             1/1     Running   0          160m
dragonfly-dfdaemon-gqn62             1/1     Running   0          160m
dragonfly-manager-6b6d4cdbbf-jkq5t   1/1     Running   0          160m
dragonfly-manager-6b6d4cdbbf-t4gsm   1/1     Running   0          160m
dragonfly-manager-6b6d4cdbbf-tcjz6   1/1     Running   0          160m
dragonfly-mysql-0                    1/1     Running   0          160m
dragonfly-redis-master-0             1/1     Running   0          160m
dragonfly-redis-replicas-0           1/1     Running   0          160m
dragonfly-redis-replicas-1           1/1     Running   0          159m
dragonfly-redis-replicas-2           1/1     Running   0          159m
dragonfly-scheduler-0                1/1     Running   0          160m
dragonfly-scheduler-1                1/1     Running   0          159m
dragonfly-scheduler-2                1/1     Running   0          158m
dragonfly-seed-peer-0                1/1     Running   0          160m
dragonfly-seed-peer-1                1/1     Running   0          159m
dragonfly-seed-peer-2                1/1     Running   0          158m
```

### containerd 通过 Dragonfly 下载镜像

在 `kind-worker` Node 下载 `alpine:3.19` 镜像。

```shell
docker exec -i kind-worker /usr/local/bin/crictl pull alpine:3.19
```

#### 验证镜像下载成功

可以查看日志，判断 `alpine:3.19` 镜像正常拉取。

```shell
# 获取 Pod Name
export POD_NAME=$(kubectl get pods --namespace dragonfly-system -l "app=dragonfly,release=dragonfly,component=dfdaemon" -o=jsonpath='{.items[?(@.spec.nodeName=="kind-worker")].metadata.name}' | head -n 1 )

# 获取 Peer ID
export PEER_ID=$(kubectl -n dragonfly-system exec -it ${POD_NAME} -- grep "alpine" /var/log/dragonfly/daemon/core.log | awk -F'"peer":"' '{print $2}' | awk -F'"' '{print $1}' | head -n 1)

# 查看下载日志
kubectl -n dragonfly-system exec -it ${POD_NAME} -- grep ${PEER_ID} /var/log/dragonfly/daemon/core.log | grep "peer task done"
```

如果正常日志输出如下:

```shell
{
  "level": "info",
  "ts": "2024-04-01 08:54:04.301",
  "caller": "peer/peertask_conductor.go:1349",
  "msg": "peer task done, cost: 2369ms",
  "peer": "10.244.1.27-647269-b9dbf87c-4b4f-44f2-ae4d-b78c07145801",
  "task": "0bff62286fe544f598997eed3ecfc8aa9772b8522b9aa22a01c06eef2c8eba66",
  "component": "PeerTask",
  "trace": "774255f145bf01f1e9d7d859b2fc4b2b"
}
```

## 更多配置

### 单镜像仓库

方法 1：使用 Helm Charts 部署，创建 Helm Charts 配置文件 valuse.yaml。详情参考[配置文档](https://artifacthub.io/packages/helm/dragonfly/dragonfly#values)。

```yaml
containerRuntime:
  containerd:
    enable: true
    injectConfigPath: true
    registries:
      - 'https://docker.io'
```

方法 2：更改 containerd 配置文件 `/etc/containerd/config.toml`，详细 containerd 参考文档 [configure-registry-endpoint](https://github.com/containerd/containerd/blob/v1.5.2/docs/cri/registry.md#configure-registry-endpoint)。

> 注意：config_path 为 containerd 查找 registry 配置文件路径。

```toml
# explicitly use v2 config format
version = 2

[plugins."io.containerd.grpc.v1.cri".registry]
  config_path = "/etc/containerd/certs.d"
```

创建 registry 配置文件 /etc/containerd/certs.d/docker.io/hosts.toml：

> 注意：该镜像 registry 为 `https://index.docker.io`。

```toml
server = "https://index.docker.io"

[host."http://127.0.0.1:65001"]
  capabilities = ["pull", "resolve"]
[host."http://127.0.0.1:65001".header]
  X-Dragonfly-Registry = ["https://index.docker.io"]
```

重新启动 containerd：

```shell
systemctl restart containerd
```

### 多镜像仓库

方法 1：使用 Helm Charts 部署，创建 Helm Charts 配置文件 valuse.yaml。详情参考[配置文档](https://artifacthub.io/packages/helm/dragonfly/dragonfly#values)。

```yaml
containerRuntime:
  containerd:
    enable: true
    injectConfigPath: true
    registries:
      - 'https://docker.io'
      - 'https://ghcr.io'
```

方法 2：更改 containerd 配置文件 `/etc/containerd/config.toml`，参考文档 [registry-configuration-examples](https://github.com/containerd/containerd/blob/main/docs/hosts.md#registry-configuration---examples)。

> 注意：config_path 为 containerd 查找 registry 配置文件路径。

```toml
# explicitly use v2 config format
version = 2

[plugins."io.containerd.grpc.v1.cri".registry]
  config_path = "/etc/containerd/certs.d"
```

创建 registry 配置文件 /etc/containerd/certs.d/docker.io/hosts.toml：

> 注意：该镜像 registry 为 `https://index.docker.io`。

```toml
server = "https://index.docker.io"

[host."http://127.0.0.1:65001"]
  capabilities = ["pull", "resolve"]
[host."http://127.0.0.1:65001".header]
  X-Dragonfly-Registry = ["https://index.docker.io"]
```

创建 registry 配置文件 /etc/containerd/certs.d/ghcr.io/hosts.toml：

> 注意：该镜像 registry 为 `https://ghcr.io`。

```toml
server = "https://ghcr.io"

[host."http://127.0.0.1:65001"]
  capabilities = ["pull", "resolve"]
[host."http://127.0.0.1:65001".header]
  X-Dragonfly-Registry = ["https://ghcr.io"]
```

重新启动 containerd：

```shell
systemctl restart containerd
```

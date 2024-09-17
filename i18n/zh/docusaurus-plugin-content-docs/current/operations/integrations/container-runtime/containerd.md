---
id: containerd
title: containerd
slug: /operations/integrations/container-runtime/containerd/
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

### 基于 Helm Charts 创建 Dragonfly 集群

创建 Helm Charts 配置文件 `values.yaml`。详情参考[配置文档](https://artifacthub.io/packages/helm/dragonfly/dragonfly#values)。

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
$ helm install --wait --create-namespace --namespace dragonfly-system dragonfly dragonfly/dragonfly -f values.yaml
NAME: dragonfly
LAST DEPLOYED: Mon Apr 28 10:59:19 2024
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
NAME                                 READY   STATUS    RESTARTS      AGE
dragonfly-client-54vm5               1/1     Running   0             37m
dragonfly-client-cvbln               1/1     Running   0             37m
dragonfly-manager-864774f54d-njdhx   1/1     Running   0             37m
dragonfly-mysql-0                    1/1     Running   0             37m
dragonfly-redis-master-0             1/1     Running   0             37m
dragonfly-redis-replicas-0           1/1     Running   0             37m
dragonfly-redis-replicas-1           1/1     Running   0             5m10s
dragonfly-redis-replicas-2           1/1     Running   0             4m44s
dragonfly-scheduler-0                1/1     Running   0             37m
dragonfly-seed-client-0              1/1     Running   2 (27m ago)   37m
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
export POD_NAME=$(kubectl get pods --namespace dragonfly-system -l "app=dragonfly,release=dragonfly,component=client" -o=jsonpath='{.items[?(@.spec.nodeName=="kind-worker")].metadata.name}' | head -n 1 )

# 获取 Peer ID
export TASK_ID=$(kubectl -n dragonfly-system exec ${POD_NAME} -- sh -c "grep -hoP 'library/alpine.*task_id=\"\K[^\"]+' /var/log/dragonfly/dfdaemon/* | head -n 1")

# 查看下载日志
kubectl -n dragonfly-system exec -it ${POD_NAME} -- sh -c "grep ${TASK_ID} /var/log/dragonfly/dfdaemon/* | grep 'download task succeeded'"
```

如果正常日志输出如下:

```shell
{
  2024-04-19T02:44:09.259458Z  INFO
  "download_task":"dragonfly-client/src/grpc/dfdaemon_download.rs:276":: "download task succeeded"
  "host_id": "172.18.0.3-kind-worker",
  "task_id": "a46de92fcb9430049cf9e61e267e1c3c9db1f1aa4a8680a048949b06adb625a5",
  "peer_id": "172.18.0.3-kind-worker-86e48d67-1653-4571-bf01-7e0c9a0a119d"
}
```

## 更多配置

### 多镜像仓库

**方法 1**：使用 Helm Charts 部署，创建 Helm Charts 配置文件 valuse.yaml。详情参考[配置文档](https://artifacthub.io/packages/helm/dragonfly/dragonfly#values)。

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
            - hostNamespace: ghcr.io
              serverAddr: https://ghcr.io
              capabilities: ['pull', 'resolve']
```

**方法 2**：更改 containerd 配置文件 `/etc/containerd/config.toml`，详情参考 [registry-configuration-examples](https://github.com/containerd/containerd/blob/main/docs/hosts.md#registry-configuration---examples)。

> 注意：config_path 为 containerd 查找 Registry 配置文件路径。

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

[host."http://127.0.0.1:4001"]
capabilities = ["pull", "resolve"]

[host."http://127.0.0.1:4001".header]
X-Dragonfly-Registry = "https://index.docker.io"
```

创建 registry 配置文件 /etc/containerd/certs.d/ghcr.io/hosts.toml：

> 注意：该镜像 registry 为 `https://ghcr.io`。

```toml
server = "https://ghcr.io"

[host."http://127.0.0.1:4001"]
capabilities = ["pull", "resolve"]

[host."http://127.0.0.1:4001".header]
X-Dragonfly-Registry = "https://ghcr.io"
```

重新启动 containerd：

```shell
systemctl restart containerd
```

### 私有镜像仓库

使用 Helm Charts 部署，创建 Helm Charts 配置文件 valuse.yaml。详情参考[配置文档](https://artifacthub.io/packages/helm/dragonfly/dragonfly#values)。

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
            - hostNamespace: your_private_registry_host_addr
              serverAddr: your_private_registry_server_addr
              capabilities: ['pull', 'resolve']
```

更改 containerd 配置文件 `/etc/containerd/config.toml`，详情参考 [configure-registry-credentials](https://github.com/containerd/containerd/blob/v1.5.2/docs/cri/registry.md#configure-registry-credentials)。

> 注意：`your_private_registry_host_addr` 为你的私有镜像仓库 host 地址。

```toml
[plugins."io.containerd.grpc.v1.cri".registry.configs."your_private_registry_host_addr".auth]
  username = "your_private_registry_username"
  password = "your_private_registry_password"
  auth = "your_private_registry_token"
[plugins."io.containerd.grpc.v1.cri".registry.configs."127.0.0.1:4001".auth]
  username = "your_private_registry_username"
  password = "your_private_registry_password"
  auth = "your_private_registry_token"
```

重新启动 containerd：

```shell
systemctl restart containerd
```

### 使用自签名证书的镜像中心

以 Harbor 为例子使用自签名证书的镜像中心。Harbor 生成自签名证书, 详情参考 [Harbor](https://goharbor.io/docs/2.11.0/install-config/configure-https/)。

#### 使用二进制文件安装 Dragonfly

复制 Harbor 的 ca.crt 文件至 `/etc/certs/yourdomain.crt` 文件。

```shell
cp ca.crt /etc/certs/yourdomain.crt
```

二进制文件安装 Dragonfly，详情参考 [Binaries](../../../getting-started/installation/binaries.md)。

##### 启动 Dfdaemon 作为 Seed Peer 并且配置自签名证书

更改 Dfdaemon 配置文件 `/etc/dragonfly/dfdaemon.yaml`，详情参考 [Dfdaemon](../../../reference/configuration/client/dfdaemon.md)。

```shell
manager:
  addrs:
    - http://dragonfly-manager:65003
seedPeer:
  enable: true
  type: super
  clusterID: 1
proxy:
  registryMirror:
    # 镜像中心地址。
    # Proxy 会启动一个 Mirror 服务供 Client 拉取镜像。
    # Client 可以使用配置中默认的 Mirror 服务来拉取镜像。
    # `X-Dragonfly-Registry` Header 可以代替默认 Mirror 服务。
    addr: https://yourdomain.com
    ## certs 是镜像中心 PEM 格式的证书路径。
    certs: /etc/certs/yourdomain.crt
```

##### 启动 Dfdaemon 作为 Peer 并且配置自签名证书

更改 Dfdaemon 配置文件 `/etc/dragonfly/dfdaemon.yaml`，详情参考 [Dfdaemon](../../../reference/configuration/client/dfdaemon.md)。

```shell
manager:
  addrs:
    - http://dragonfly-manager:65003
proxy:
  registryMirror:
    # 镜像中心地址。
    # Proxy 会启动一个 Mirror 服务供 Client 拉取镜像。
    # Client 可以使用配置中默认的 Mirror 服务来拉取镜像。
    # `X-Dragonfly-Registry` Header 可以代替默认 Mirror 服务。
    addr: https://yourdomain.com
    ## certs 是镜像中心 PEM 格式的证书路径。
    certs: /etc/certs/yourdomain.crt
```

##### 配置 containerd 的自签名证书

更改 containerd 配置文件 `/etc/containerd/config.toml`，详情参考 [registry-configuration-examples](https://github.com/containerd/containerd/blob/main/docs/hosts.md#registry-configuration---examples)。

```toml
# explicitly use v2 config format
version = 2

[plugins."io.containerd.grpc.v1.cri".registry]
  config_path = "/etc/containerd/certs.d"
```

创建 Registry 配置文件 `/etc/containerd/certs.d/yourdomain.com/hosts.toml`。

> 注意：`https://yourdomain.com` 为 Harbor 服务地址。

```toml
server = "https://yourdomain.com"

[host."http://127.0.0.1:4001"]
capabilities = ["pull", "resolve"]
ca = "/etc/certs/yourdomain.crt"

[host."http://127.0.0.1:4001".header]
X-Dragonfly-Registry = "https://yourdomain.com"
```

如果要跳过 TLS 验证, 详情参考 [bypass-tls-verification-example](https://github.com/containerd/containerd/blob/main/docs/hosts.md#bypass-tls-verification-example)。

```toml
server = "https://yourdomain.com"

[host."http://127.0.0.1:4001"]
capabilities = ["pull", "resolve"]
skip_verify = true

[host."http://127.0.0.1:4001".header]
X-Dragonfly-Registry = "https://yourdomain.com"
```

重新启动 containerd：

```shell
systemctl restart containerd
```

containerd 通过 Dragonfly 下载 Harbor 镜像:

```shell
crictl pull yourdomain.com/library/alpine:latest
```

#### 使用 Helm Charts 安装 Dragonfly

创建 Namespace:

```shell
kubectl create namespace dragonfly-system
```

##### 启用 Seed Peer 并且配置自签名证书

创建 Seed Client Secret 配置文件 `seed-client-secret.yaml` 配置如下:

> 注意：yourdomain.crt 为 Harbor 的 ca.crt。

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: seed-client-secret
  namespace: dragonfly-system
type: Opaque
data:
  # 此例中的实际数据被截断。
  yourdomain.crt: |
    MIIFwTCCA6mgAwIBAgIUdgmYyNCw4t+Lp/...
```

使用配置文件部署 Seed Client Secret:

```shell
kubectl apply -f seed-client-secret.yaml
```

创建 Helm Charts 配置文件 `values.yaml`, 果要跳过过 TLS 验证, 将 `client.dfinit.containerRuntime.containerd.registries.skipVerify` 设置为 `true`。

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
    proxy:
      registryMirror:
        certs: /etc/certs/yourdomain.crt
  extraVolumes:
    - name: logs
      emptyDir: {}
    - name: seed-client-secret
      secret:
        secretName: seed-client-secret
  extraVolumeMounts:
    - name: logs
      mountPath: /var/log/dragonfly/dfdaemon/
    - name: seed-client-secret
      mountPath: /etc/certs

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
            - hostNamespace: yourdomain.com
              serverAddr: https://yourdomain.com
              capabilities: ['pull', 'resolve']
              skipVerify: false
```

##### 启用 Peer 并且配置自签名证书

创建 Client Secret 配置文件 client-secret.yaml 配置如下:

> 注意：yourdomain.crt 为 Harbor 的 ca.crt。

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: client-secret
  namespace: dragonfly-system
type: Opaque
data:
  # 此例中的实际数据被截断。
  yourdomain.crt: |
    MIIFwTCCA6mgAwIBAgIUdgmYyNCw4t+Lp/...
```

使用配置文件部署 Client Secret:

```shell
kubectl apply -f client-secret.yaml
```

创建 Helm Charts 配置文件 `values.yaml`, 如果要跳过 TLS 验证, 将 `client.dfinit.containerRuntime.containerd.registries.skipVerify` 设置为 `true`。

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
    proxy:
      registryMirror:
        certs: /etc/certs/yourdomain.crt
  extraVolumes:
    - name: logs
      emptyDir: {}
    - name: client-secret
      secret:
        secretName: client-secret
  extraVolumeMounts:
    - name: logs
      mountPath: /var/log/dragonfly/dfdaemon/
    - name: client-secret
      mountPath: /etc/certs
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
            - hostNamespace: yourdomain.com
              serverAddr: https://yourdomain.com
              capabilities: ['pull', 'resolve']
              skipVerify: false
```

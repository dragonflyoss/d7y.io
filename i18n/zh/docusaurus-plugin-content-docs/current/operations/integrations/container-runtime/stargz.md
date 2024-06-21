---
id: stargz
title: eStargz
slug: /operations/integrations/container-runtime/stargz/
---

本文档将帮助您体验如何使用 Dragonfly 和 eStargz。

## 依赖

<!-- markdownlint-disable -->

| 所需软件           | 版本要求 | 文档                                                        |
| ------------------ | -------- | ----------------------------------------------------------- |
| Kubernetes cluster | 1.20+    | [kubernetes.io](https://kubernetes.io/)                     |
| Helm               | 3.8.0+   | [helm.sh](https://helm.sh/)                                 |
| containerd         | v1.4.3+  | [containerd.io](https://containerd.io/)                     |
| Nerdctl            | 0.22+    | [containerd/nerdctl](https://github.com/containerd/nerdctl) |

<!-- markdownlint-restore -->

## Dragonfly Kubernetes 集群搭建

基于 Kubernetes cluster 详细安装文档可以参考 [quick-start-kubernetes](../../../getting-started/quick-start/kubernetes.md)。

### 准备 Kubernetes 集群

如果没有可用的 Kubernetes 集群进行测试，推荐使用 [Kind](https://kind.sigs.k8s.io/)。

创建 Kind 多节点集群配置文件 `kind-config.yaml`，配置如下:

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
  - role: control-plane
  - role: worker
    extraPortMappings:
      - containerPort: 30950
        hostPort: 4001
      - containerPort: 30951
        hostPort: 4003
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
```

Kind 集群加载 Dragonfly latest 镜像:

```shell
kind load docker-image dragonflyoss/scheduler:latest
kind load docker-image dragonflyoss/manager:latest
kind load docker-image dragonflyoss/client:latest
```

### 基于 Helm Charts 创建 Dragonfly P2P 集群

创建 Helm Charts 配置文件 `charts-config.yaml` 并且开启 Peer 的预取功能, 配置如下:

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
      prefetch: true

client:
  image:
    repository: dragonflyoss/client
    tag: latest
  hostNetwork: true
  metrics:
    enable: true
  config:
    verbose: true
    security:
      enable: true
    proxy:
      prefetch: true
      server:
        port: 4001
      registryMirror:
        addr: https://index.docker.io
      rules:
        - regex: 'blobs/sha256.*'
```

使用配置文件部署 Dragonfly Helm Charts:

<!-- markdownlint-disable -->

```shell
$ helm repo add dragonfly https://dragonflyoss.github.io/helm-charts/
$ helm install --wait --create-namespace --namespace dragonfly-system dragonfly dragonfly/dragonfly -f charts-config.yaml
NAME: dragonfly
LAST DEPLOYED: Mon May 28 20:52:12 2024
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
NAME                                 READY   STATUS    RESTARTS      AGE
dragonfly-client-5vtn2               1/1     Running   0             74m
dragonfly-client-g648f               1/1     Running   0             74m
dragonfly-manager-58ff696785-kjl8r   1/1     Running   0             74m
dragonfly-mysql-0                    1/1     Running   0             74m
dragonfly-redis-master-0             1/1     Running   0             74m
dragonfly-redis-replicas-0           1/1     Running   0             74m
dragonfly-redis-replicas-1           1/1     Running   0             72m
dragonfly-redis-replicas-2           1/1     Running   0             72m
dragonfly-scheduler-0                1/1     Running   0             74m
dragonfly-scheduler-1                1/1     Running   0             66m
dragonfly-scheduler-2                1/1     Running   0             65m
dragonfly-seed-client-0              1/1     Running   4 (66m ago)   74m
dragonfly-seed-client-1              1/1     Running   0             65m
dragonfly-seed-client-2              1/1     Running   0             65m
```

创建 Peer Service 配置文件 `peer-service-config.yaml` 配置如下:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: peer
  namespace: dragonfly-system
spec:
  type: NodePort
  ports:
    - name: http-4001
      nodePort: 30950
      port: 4001
    - name: http-4003
      nodePort: 30951
      port: 4003
  selector:
    app: dragonfly
    component: client
    release: dragonfly
```

使用配置文件部署 Peer Service:

```shell
kubectl apply -f peer-service-config.yaml
```

## containerd 集成 Stargz

生产环境 containerd 集成 Stargz 详细文档可以参考
[stargz-setup-for-containerd-environment](https://github.com/containerd/stargz-snapshotter/blob/main/docs/INSTALL.md).
下面例子使用 Systemd 管理 `stargz-snapshotter` 服务。

### 使用二进制版本安装 Stargz

下载 `containerd-stargz-grpc` 二进制文件, 下载地址为 [stargz-snapshotter/releases](https://github.com/containerd/stargz-snapshotter/releases/latest):

> 注意: stargz-snapshotter_version 建议使用最新版本

```shell
STARGZ_SNAPSHOTTER_VERSION=<your_stargz-snapshotter_version>
wget -O stargz-snapshotter-linux-arm64.tgz https://github.com/containerd/stargz-snapshotter/releases/download/v$STARGZ_SNAPSHOTTER_VERSION/stargz-snapshotter-v$STARGZ_SNAPSHOTTER_VERSION-linux-arm64.tar.gz
```

解压压缩包：

```shell
# 将 containerd-stargz-grpc 和 ctr-remote 工具安装到 /usr/local/bin。
tar -C /usr/local/bin -xvf stargz-snapshotter-linux-arm64.tgz containerd-stargz-grpc ctr-remote
```

### containerd 集成 Stargz Snapshotter 插件

更改 containerd 配置文件 `/etc/containerd/config.toml`，详细文档参考
[configure-and-start-containerd](https://github.com/containerd/stargz-snapshotter/blob/main/docs/INSTALL.md#install-stargz-snapshotter-for-containerd-with-systemd)。

```toml
[plugins."io.containerd.grpc.v1.cri".containerd]
  snapshotter = "stargz"
  disable_snapshot_annotations = false

[proxy_plugins]
  [proxy_plugins.stargz]
    type = "snapshot"
    address = "/run/containerd-stargz-grpc/containerd-stargz-grpc.sock"
```

重新启动 containerd：

```shell
sudo systemctl restart containerd
```

验证 containerd 是否使用 `stargz-snapshotter` 插件:

```shell
$ ctr -a /run/containerd/containerd.sock plugin ls | grep stargz
io.containerd.snapshotter.v1          stargz                    -              ok
```

### Systemd 启动 Stargz Snapshotter 服务

创建 Stargz 配置文件 `config.toml`, `Stargz Mirror` 模式配置详细文档可以参考
[stargz-registry-mirrors](https://github.com/containerd/stargz-snapshotter/blob/main/docs/overview.md#registry-mirrors-and-insecure-connection).

`127.0.0.1:4001` 是 Dragonfly Peer 的 Proxy 地址，
`X-Dragonfly-Registry` 自定义 Header 是提供给 Dragonfly 回源的源站仓库地址。

在 `config.toml` 配置文件下设置 `host` 地址为你的实际地址，配置内容如下：

```toml
[[resolver.host."docker.io".mirrors]]
  host = "http://127.0.0.1:4001"
  insecure = true
  [resolver.host."docker.io".mirrors.header]
    X-Dragonfly-Registry = ["https://index.docker.io"]
```

复制配置文件至 `/etc/containerd-stargz-grpc/config.toml` 文件:

```shell
sudo mkdir /etc/containerd-stargz-grpc && cp config.toml /etc/containerd-stargz-grpc/config.toml
```

下载 Stargz Snapshotter Systemd 配置文件 `stargz-snapshotter.service`, 配置如下:

```shell
wget -O /etc/systemd/system/stargz-snapshotter.service https://raw.githubusercontent.com/containerd/stargz-snapshotter/main/script/config/etc/systemd/system/stargz-snapshotter.service
systemctl enable --now stargz-snapshotter
systemctl restart containerd
```

### 转换 Stargz 格式镜像

转换 `alpine:3.19` 镜像为 Stargz 格式镜像, 可以直接使用已经转换好的 `alpine:3.19` 镜像, 跳过该步骤。

登陆 Dockerhub:

```shell
docker login
```

转换 Stargz 镜像, `DOCKERHUB_REPO_NAME` 环境变量设置为用户个人的镜像仓库:

```shell
DOCKERHUB_REPO_NAME=<your_dockerhub_repo_name>
sudo nerdctl pull alpine:3.19
sudo nerdctl image convert --estargz --oci alpine:3.19 $DOCKERHUB_REPO_NAME/alpine:3.19-esgz
sudo nerdctl image push $DOCKERHUB_REPO_NAME/alpine:3.19-esgz
```

sudo nerdctl image push $DOCKERHUB_REPO_NAME/registry:2.8.3-esgz

### Stargz 通过 Dragonfly 下载镜像

使用 Nerdctl 运行 `alpine:3.19-esgz`, 过程中即通过 Stargz 和 Dragonfly 下载镜像:

```shell
sudo nerdctl --snapshotter stargz run --rm -it $DOCKERHUB_REPO_NAME/alpine:3.19-esgz
```

#### 验证镜像下载成功

搜索日志验证 Stargz 基于 Mirror 模式通过 Dragonfly 分发流量:

<!-- markdownlint-disable -->

```shell
$ journalctl -u stargz-snapshotter | grep 'remote-snapshot-prepared'
containerd-stargz-grpc[4049]: {"key":"default/73/extract-656625708-vmlX sha256:7c7f00c83139c0b82eae3452058c975fb5a086d1c7d9124c77dd7a66d499dc6a","level":"debug","msg":"prepared remote snapshot","parent":"default/72/sha256:413f24977d4a9ef3a4582e041dbf50a3d32f5f60d97c98225eb492883d9c4c75","remote-snapshot-prepared":"true","time":"2024-05-30T14:36:55.660116292Z"}
```

可以查看 Dragonfly 日志，判断 alpine:3.19 镜像正常拉取。

```shell
# 获取 Pod Name
export POD_NAME=$(kubectl get pods --namespace dragonfly-system -l "app=dragonfly,release=dragonfly,component=client" -o=jsonpath='{.items[?(@.spec.nodeName=="kind-worker")].metadata.name}' | head -n 1 )

# 获取 Peer ID
export TASK_ID=$(kubectl -n dragonfly-system exec ${POD_NAME} -- sh -c "grep -hoP 'alpine.*task_id=\"\K[^\"]+' /var/log/dragonfly/dfdaemon/* | head -n 1")

# 查看下载日志
kubectl -n dragonfly-system exec -it ${POD_NAME} -- sh -c "grep ${TASK_ID} /var/log/dragonfly/dfdaemon/* | grep 'download task succeeded'"
```

日志输出例子:

```shell
{
  2024-04-19T02:44:09.259458Z  INFO
  "download_task":"dragonfly-client/src/grpc/dfdaemon_download.rs:276":: "download task succeeded"
  "host_id": "172.18.0.3-minikube",
  "task_id": "a46de92fcb9430049cf9e61e267e1c3c9db1f1aa4a8680a048949b06adb625a5",
  "peer_id": "172.18.0.3-minikube-86e48d67-1653-4571-bf01-7e0c9a0a119d"
}
```

<!-- markdownlint-restore -->

## 性能测试

测试 Stargz Mirror 模式与 Dragonfly P2P 集成后的单机镜像下载的性能。
主要测试不同语言镜像运行版本命令的启动时间，例如 `python` 镜像运行启动命令为 `python -V`。
测试是在同一台机器上面做不同场景的测试。
由于机器本身网络环境、配置等影响，实际下载时间不具有参考价值，
但是不同场景下载时间所提升的比率是有重要意义的。

![stargz-mirror-dragonfly](../../../resource/operations/integrations/stargz-mirror-dragonfly.png)

- OCIv1: 使用 containerd 直接拉取镜像并且启动成功的数据。
- Stargz Cold Boot: 使用 containerd 通过 Stargz 拉取镜像，没有命中任何缓存并且启动成功的数据。
- Stargz & Dragonfly Cold Boot: 使用 containerd 通过 Stargz 拉取镜像，并且基于 Stargz Mirror 模式流量转发至 Dragonfly P2P，在没有命中任何缓存并且启动成功的数据。
- Hit Stargz Cache: 使用 containerd 通过 Stargz 拉取镜像，
  并且基于 Stargz Mirror 模式流量转发至 Dragonfly P2P，在命中 Stargz 的本地缓存的情况下并且成功启动的数据。

测试结果表明 Stargz Mirror 模式和 Dragonfly P2P 集成。使用 Stargz 下载镜像对比 `OCIv1` 的模式，
能够有效减少镜像下载时间。Stargz 冷启动和 Stargz & Dragonfly 冷启动数据基本接近。
最重要的是如果很大规模集群使用 Stargz 拉取镜像，
会将每个镜像层的下载分解按需产生很多 Range 请求。增加镜像仓库源站 `QPS`。
而 Dragonfly 可以基于 P2P 技术有效减少回源镜像仓库的请求数量和下载流量。
最优的情况，Dragonfly 可以保证大规模集群中每个下载任务只回源一次。

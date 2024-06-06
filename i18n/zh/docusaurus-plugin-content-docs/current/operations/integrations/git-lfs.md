---
id: git-lfs
title: Git LFS
slug: /operations/integrations/git-lfs/
---

## Git LFS 是什么?

[Git LFS](https://git-lfs.com/) 是 Git Large File Storage 的缩写，这是一个用来处理大型文件的 Git 扩展工具。
Git 在处理大量的小型文件时表现出色，但它并不擅长版本控制大型二进制文件，
比如视频、音频、数据集、模型资源等。如果这些大文件直接存储在 Git 仓库中，会导致仓库体积迅速膨胀，影响克隆和拉取操作的性能。

![git-lfs](../../resource/operations/integrations/git-lfs.png)

Git LFS 允许将大型文件的引用保存在 Git 仓库中，而将文件本身存储在一个单独的服务器上。
当克隆或检出含有大型文件的仓库时，Git LFS 会从那个单独的服务器上下载必要的大文件，而不是从 Git 仓库直接下载。
具体 Git LFS 实现分为客户端以及服务端两部分。客户端主要基于 `git lfs track` 进行操作，
规范可以参考 [Git LFS Specification](https://github.com/git-lfs/git-lfs/blob/main/docs/spec.md)。
服务端是基于 HTTP 协议遵守 [Git LFS API](https://github.com/git-lfs/git-lfs/tree/main/docs/api) 实现的。
通常情况下 Git LFS 的 Content Storage 也就是存储大文件的服务使用对象存储。

### Git LFS 应用

#### 大文件基于 Git LFS 管理

Github 以及 GitLab 对于大文件管理，通常是基于 Git LFS 进行管理的。

- GitHub 可以参考文档 [About Git Large File Storage](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-git-large-file-storage)
  使用。
- GitLab 可以参考文档 [Git Large File Storage](https://docs.gitlab.com/ee/topics/git/lfs/) 使用。

#### AI 模型以及数据集基于 Git LFS 管理

AI 场景下模型以及数据集大文件，通常是基于 Git LFS 进行管理的。比 [Hugging Face Hub](https://huggingface.co/)
以及 [ModelScope Hub](https://modelscope.cn/) 等平台，会基于 Git LFS 管理模型以及数据集。

- Hugging Face Hub 可以参考文档 [Getting Started with Repositories](https://huggingface.co/docs/hub/repositories-getting-started)
  使用。
- ModelScope Hub 可以参考文档 [Getting Started with ModelScope](https://modelscope.cn/docs/ModelScope%20Hub%E4%BD%BF%E7%94%A8%E6%96%87%E6%A1%A3)
  使用。

Hugging Face Hub 的 Python Library 实现了 Git LFS 对模型以及数据集进行预加载。
对于 Hugging Face Hub 的 Python Library 分发模型和数据集进行加速，
可以参考文档 [Hugging Face accelerates distribution of models and datasets based on Dragonfly](https://www.cncf.io/blog/2023/11/16/hugging-face-accelerates-distribution-of-models-and-datasets-based-on-dragonfly/)。

## Dragonfly 解决 Git LFS 存储仓库带宽瓶颈

通常开发者会基于 Git LFS 管理大文件，本文主要解决在 Git LFS 拉取大文件时，存在的中心化的存储仓库带宽瓶颈问题。
当使用 Git LFS 下载大文件的时候，文件相对较大且会有并发下载文件的场景。 这样很容易导致存储带宽被打满，从而引起下载过慢的情况。

![git-lfs-download](../../resource/operations/integrations/git-lfs-download.png)

这种方式比较好的解决方案是使用 Dragonfly 的 P2P 技术利用每个节点的闲置带宽缓解存储仓库的带宽压力，从而达到加速效果。
在最理想的情况下 Dragonfly 可以让整个 P2P 集群中只有一个节点回源下载模型，其他节点流量均使用集群内 P2P 内网带宽。

![git-lfs-p2p](../../resource/operations/integrations/git-lfs-p2p.png)

## 使用 Dragonfly 加速 Git LFS 大文件分发

通过将 Git LFS 的 HTTP 协议文件下载请求代理到 Dragonfly Peer 的 Proxy 服务，将文件下载流量转发至 P2P 网络中，从而减少回源流量，提升下载速度。下面使用文档基于 GitHub LFS 实现。

### 获取 Git LFS 的 Content Storage 地址

增加 `GIT_CURL_VERBOSE=1` 输出 `git clone` 的详细日志，方便获取 Git LFS 的 Content Storage 的地址。

```shell
GIT_CURL_VERBOSE=1 git clone git@github.com:{YOUR-USERNAME}/{YOUR-REPOSITORY}.git
```

从输出的日志中找 `trace git-lfs` 关键字，可以看到 Git LFS 下载文件的日志。关注 Git LFS 日志中 `actions` 为 `download` 的返回内容。

<!-- markdownlint-disable -->

```text
18:52:51.137490 trace git-lfs: HTTP: {"objects":[{"oid":"68ac0af011ce9c51a4c74c5ac9a40218e9e67bf55ebe13c8f2d758f710a3163a","size":19670194,"actions":{"download":{"href":"https://github-cloud.githubusercontent.com/alambic/media/730487717/68/ac/68ac0af011ce9c51a4c74c5ac9a40218e9e67bf55ebe13c8f2d758f710a3163a?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA5BA2674WPWWEFGQ5%2F20240605%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240605T105251Z&X-Amz-Expires=3600&X-Amz-Signature=35cf8e02f0d3e2da893aa46fa4929d79ce1abb18aea8e0fabfbb138706d7151818:52:51.137574 trace git-lfs: HTTP: &X-Amz-SignedHeaders=host&actor_id=0&key_id=0&repo_id=810214636&token=1","expires_at":"2024-06-05T11:52:51Z","expires_in":3600}}}]}
```

<!-- markdownlint-restore -->

可以在 `objects` 结构体中 `actions.download.href` 找到具体的下载 URL。这样可以发现 GitHub LFS 的 Content Storage 实际存储在
`github-cloud.githubusercontent.com`。

**Git LFS 关键信息:**

Git LFS 的 Content Storage 地址为 `github-cloud.githubusercontent.com`。

### 部署 Dragonfly

#### 依赖

| 所需软件           | 版本要求 | 文档                                    |
| ------------------ | -------- | --------------------------------------- |
| Kubernetes cluster | 1.20+    | [kubernetes.io](https://kubernetes.io/) |
| Helm               | 3.8.0+   | [helm.sh](https://helm.sh/)             |
| Git LFS            | 3.3.0+   | [git-lfs](https://git-lfs.com/)         |

#### Dragonfly Kubernetes 集群搭建

基于 Kubernetes cluster 详细安装文档可以参考 [quick-start-kubernetes](https://d7y.io/zh/docs/next/getting-started/quick-start/kubernetes/)。

##### 使用 Kind 安装 Kubernetes 集群

如果没有可用的 Kubernetes 集群进行测试，推荐使用 [Kind](https://kind.sigs.k8s.io/)。

创建 Kind 多节点集群配置文件 kind-config.yaml, 配置如下:

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
  - role: control-plane
  - role: worker
    extraPortMappings:
      - containerPort: 30950
        hostPort: 4001
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

##### Kind 加载 Dragonfly 镜像

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

##### 基于 Helm Charts 创建 Dragonfly P2P 集群

创建 Helm Charts 配置文件 charts-config.yaml。在 `client.config.proxy.rules.regex` 增加 `github-cloud.githubusercontent.com` 匹配规则，
将 Git LFS 的 Content Storage 的 HTTP 文件下载流量转发至 P2P 网络中。

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
  hostNetwork: true
  metrics:
    enable: true
  config:
    verbose: true
    security:
      enable: true
    proxy:
      server:
        port: 4001
      registryMirror:
        addr: https://index.docker.io
      rules:
        - regex: blobs/sha256.*
        - regex: github-cloud.githubusercontent.com.*
```

使用配置文件部署 Dragonfly Helm Charts:

<!-- markdownlint-disable -->

```shell
$ helm repo add dragonfly https://dragonflyoss.github.io/helm-charts/
$ helm install --wait --create-namespace --namespace dragonfly-system dragonfly dragonfly/dragonfly -f charts-config.yaml
NAME: dragonfly
LAST DEPLOYED: Mon June 5 12:53:14 2024
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
NAME                                 READY   STATUS    RESTARTS       AGE
dragonfly-client-6jgzn               1/1     Running   0              34m
dragonfly-client-qzcz9               1/1     Running   0              34m
dragonfly-manager-6bc4454d94-ldsk7   1/1     Running   0              34m
dragonfly-mysql-0                    1/1     Running   0              34m
dragonfly-redis-master-0             1/1     Running   0              34m
dragonfly-redis-replicas-0           1/1     Running   0              34m
dragonfly-redis-replicas-1           1/1     Running   0              34m
dragonfly-redis-replicas-2           1/1     Running   0              34m
dragonfly-scheduler-0                1/1     Running   0              34m
dragonfly-scheduler-1                1/1     Running   0              34m
dragonfly-scheduler-2                1/1     Running   0              34m
dragonfly-seed-client-0              1/1     Running   0              34m
dragonfly-seed-client-1              1/1     Running   0              34m
dragonfly-seed-client-2              1/1     Running   0              34m
```

创建 Peer Service 配置文件 peer-service-config.yaml 配置如下:

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
  selector:
    app: dragonfly
    component: client
    release: dragonfly
```

使用配置文件部署 Peer Service:

```shell
kubectl apply -f peer-service-config.yaml
```

### 通过 Dragonfly 分发 Git LFS 的下载文件流量

通过 Git 配置将请求代理到 Dragonfly Peer Proxy 的 `http://127.0.0.1:4001`。
主要基于 `http.proxy`、`lfs.transfer.enablehrefrewrite` 以及 `url.http://github-cloud.githubusercontent.com/.insteadOf` 属性设置代理。

> 注意：更换 `http.proxy` 地址为你的实际地址。

```shell
git config --global http.proxy http://127.0.0.1:4001
git config --global lfs.transfer.enablehrefrewrite true
git config --global url.http://github-cloud.githubusercontent.com/.insteadOf https://github-cloud.githubusercontent.com/
```

通过 Dragonfly Peer Proxy 转发 Git LFS 的下载流量至 P2P 网络，Git 克隆下载文件。

```shell
git clone git@github.com:{YOUR-USERNAME}/{YOUR-REPOSITORY}.git
```

### 验证下载文件通过 Dragonfly 分发

执行命令：

```shell
# 获取 Pod Name
export POD_NAME=$(kubectl get pods --namespace dragonfly-system -l "app=dragonfly,release=dragonfly,
component=client" -o=jsonpath='{.items[?(@.spec.nodeName=="kind-worker")].metadata.name}' | head -n 1 )

# 查看下载日志
kubectl -n dragonfly-system exec -it ${POD_NAME} -- grep "download task succeeded" /var/log/dragonfly/dfdaemon/*
```

日志输出例子：

<!-- markdownlint-disable -->

```
2024-06-03-13:2024-06-04T13:30:50.644228Z  INFO download_task: dragonfly-client/src/grpc/dfdaemon_download.rs:276: download task succeeded host_id="172.18.0.4-kind-worker" task_id="70c644474b6c986e3af27d742d3602469e88f8956956817f9f67082c6967dc1a" peer_id="172.18.0.4-kind-worker-39ee6e2b-a339-440b-b214-3e8a1a3f1e36"
```

<!-- markdownlint-restore -->

## 性能测试

测试 Git LFS 与 Dragonfly 集成后的单机大文件下载的性能。 由于机器本身网络环境、配置等影响，实际下载时间不具有参考价值， 但是不同场景下载时间所提升的比率是有重要意义的。

![git-lfs-dragonfly](../../resource/operations/integrations/git-lfs-dragonfly.png)

- Git LFS: 使用 Git LFS 直接下载大文件。
- Git LFS & Dragonfly Cold Boot: 使用 Git LFS 直接下载大文件，没有命中任何缓存。
- Hit Dragonfly Remote Peer Cache: 使用 Git LFS 直接下载大文件，在命中 Dragonfly 的远端 Peer 缓存。
- Hit Dragonfly Remote Local Cache: 使用 Git LFS 直接下载大文件，在命中 Dragonfly 的本地 Peer 缓存。

测试结果表明 Git LFS 和 Dragonfly 集成。 能够有效减少大文件下载时间。测试是在单机情况下基本在缓存命中情况下， 性能瓶颈在于磁盘。如果在多节点并发下载大文件的情况下，Dragonfly 效果会更加明显。

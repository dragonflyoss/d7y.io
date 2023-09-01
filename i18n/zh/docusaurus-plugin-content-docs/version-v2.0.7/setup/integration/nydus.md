---
id: nydus
title: Nydus
---

本文档将帮助您将 Dragonfly 与 Nydus 一起使用。

## 依赖

<!-- markdownlint-disable -->

| 所需软件           | 版本要求 | 文档                                                        |
| ------------------ | -------- | ----------------------------------------------------------- |
| Kubernetes cluster | 1.20+    | [kubernetes.io](https://kubernetes.io/)                     |
| Helm               | 3.8.0+   | [helm.sh](https://helm.sh/)                                 |
| Containerd         | v1.4.3+  | [containerd.io](https://containerd.io/)                     |
| Nerdctl            | 0.22+    | [containerd/nerdctl](https://github.com/containerd/nerdctl) |

**注意:** 如果没有可用的 Kubernetes 集群进行测试，推荐使用 [Kind](https://kind.sigs.k8s.io/)。

<!-- markdownlint-restore -->

## 安装 Dragonfly

基于 Kubernetes cluster 详细安装文档可以参考 [quick-start-kubernetes](../../getting-started/quick-start/kubernetes.md)。

### 使用 Kind 安装 Kubernetes 集群

创建 Kind 多节点集群配置文件 `kind-config.yaml`, 配置如下:

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
  - role: control-plane
  - role: worker
    extraPortMappings:
      - containerPort: 30950
        hostPort: 65001
      - containerPort: 30951
        hostPort: 40901
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

创建 Helm Charts 配置文件 `charts-config.yaml` 并且开启 Peer 的预取功能, 配置如下:

```yaml
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
    download:
      prefetch: true

dfdaemon:
  hostNetwork: true
  config:
    verbose: true
    pprofPort: 18066
    # metrics变量中要包含":"
    metrics: :8000
    download:
      prefetch: true
    proxy:
      defaultFilter: 'Expires&Signature&ns'
      security:
        insecure: true
      tcpListen:
        listen: 0.0.0.0
        port: 65001
      registryMirror:
        dynamic: true
        url: https://index.docker.io
      proxies:
        - regx: blobs/sha256.*

manager:
  replicas: 1
  metrics:
    enable: true
  config:
    verbose: true
    pprofPort: 18066
```

使用配置文件部署 Dragonfly Helm Charts:

<!-- markdownlint-disable -->

```shell
$ helm repo add dragonfly https://dragonflyoss.github.io/helm-charts/
$ helm install --wait --create-namespace --namespace dragonfly-system dragonfly dragonfly/dragonfly -f charts-config.yaml
NAME: dragonfly
LAST DEPLOYED: Wed Oct 19 04:23:22 2022
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
NAME                                 READY   STATUS    RESTARTS       AGE
dragonfly-dfdaemon-rhnr6             1/1     Running   4 (101s ago)   3m27s
dragonfly-dfdaemon-s6sv5             1/1     Running   5 (111s ago)   3m27s
dragonfly-manager-67f97d7986-8dgn8   1/1     Running   0              3m27s
dragonfly-mysql-0                    1/1     Running   0              3m27s
dragonfly-redis-master-0             1/1     Running   0              3m27s
dragonfly-redis-replicas-0           1/1     Running   1 (115s ago)   3m27s
dragonfly-redis-replicas-1           1/1     Running   0              95s
dragonfly-redis-replicas-2           1/1     Running   0              70s
dragonfly-scheduler-0                1/1     Running   0              3m27s
dragonfly-seed-peer-0                1/1     Running   2 (95s ago)    3m27s
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
    - name: http-65001
      nodePort: 30950
      port: 65001
    - name: http-40901
      nodePort: 30951
      port: 40901
  selector:
    app: dragonfly
    component: dfdaemon
    release: dragonfly
```

使用配置文件部署 Peer Service:

```shell
kubectl apply -f peer-service-config.yaml
```

## Containerd 集成 Nydus

生产环境 Containerd 集成 Nydus 详细文档可以参考
[nydus-setup-for-containerd-environment](https://github.com/dragonflyoss/image-service/blob/master/docs/containerd-env-setup.md#nydus-setup-for-containerd-environment)。
下面例子使用 Systemd 管理 `nydus-snapshotter` 服务。

### 下载安装 Nydus 工具

下载 `containerd-nydus-grpc` 二进制文件, 下载地址为 [nydus-snapshotter/releases](https://github.com/containerd/nydus-snapshotter/releases/latest):

```shell
NYDUS_SNAPSHOTTER_VERSION=0.3.3
wget https://github.com/containerd/nydus-snapshotter/releases/download/v$NYDUS_SNAPSHOTTER_VERSION/nydus-snapshotter-v$NYDUS_SNAPSHOTTER_VERSION-x86_64.tgz
tar zxvf nydus-snapshotter-v$NYDUS_SNAPSHOTTER_VERSION-x86_64.tgz
```

安装 `containerd-nydus-grpc` 工具:

```shell
sudo cp nydus-snapshotter/containerd-nydus-grpc /usr/local/bin/
```

下载 `nydus-image`、`nydusd` 以及 `nydusify` 二进制文件, 下载地址为 [dragonflyoss/image-service](https://github.com/dragonflyoss/image-service/releases/latest):

```shell
NYDUS_VERSION=2.1.1
wget https://github.com/dragonflyoss/image-service/releases/download/v$NYDUS_VERSION/nydus-static-v$NYDUS_VERSION-linux-amd64.tgz
tar zxvf nydus-static-v$NYDUS_VERSION-linux-amd64.tgz
```

安装 `nydus-image`、`nydusd` 以及 `nydusify` 工具:

```shell
sudo cp nydus-static/nydus-image nydus-static/nydusd nydus-static/nydusify /usr/local/bin/
```

### Containerd 集成 Nydus Snapshotter 插件

配置 Containerd 使用 `nydus-snapshotter` 插件, 详细文档参考
[configure-and-start-containerd](https://github.com/dragonflyoss/image-service/blob/master/docs/containerd-env-setup.md#configure-and-start-containerd)。

首先修改 Containerd 配置在 `/etc/containerd/config.toml` 添加下面内容:

```toml
[proxy_plugins]
  [proxy_plugins.nydus]
    type = "snapshot"
    address = "/run/containerd-nydus/containerd-nydus-grpc.sock"

[plugins.cri]
  [plugins.cri.containerd]
    snapshotter = "nydus"
    disable_snapshot_annotations = false
```

重启 Containerd 服务:

```shell
sudo systemctl restart containerd
```

验证 containerd 是否使用 `nydus-snapshotter` 插件:

```shell
$ ctr -a /run/containerd/containerd.sock plugin ls | grep nydus
io.containerd.snapshotter.v1          nydus                    -              ok
```

### Systemd 启动 Nydus Snapshotter 服务

Nydusd 的 Mirror 模式配置详细文档可以参考
[enable-mirrors-for-storage-backend](https://github.com/dragonflyoss/image-service/blob/master/docs/nydusd.md#enable-mirrors-for-storage-backend)。

`127.0.0.1:65001` 是 Dragonfly Peer 的 Proxy 地址，
`X-Dragonfly-Registry` 自定义 Header 是提供给 Dragonfly 回源的源站仓库地址。

创建 Nydusd 配置文件 `nydusd-config.json`, 配置如下:

```json
{
  "device": {
    "backend": {
      "type": "registry",
      "config": {
        "mirrors": [
          {
            "host": "http://127.0.0.1:65001",
            "auth_through": false,
            "headers": {
              "X-Dragonfly-Registry": "https://index.docker.io"
            },
            "ping_url": "http://127.0.0.1:40901/server/ping"
          }
        ],
        "scheme": "https",
        "skip_verify": false,
        "timeout": 10,
        "connect_timeout": 10,
        "retry_limit": 2
      }
    },
    "cache": {
      "type": "blobcache",
      "config": {
        "work_dir": "/var/lib/nydus/cache/"
      }
    }
  },
  "mode": "direct",
  "digest_validate": false,
  "iostats_files": false,
  "enable_xattr": true,
  "fs_prefetch": {
    "enable": true,
    "threads_count": 10,
    "merging_size": 131072,
    "bandwidth_rate": 1048576
  }
}
```

复制配置文件至 `/etc/nydus/config.json` 文件:

```shell
sudo mkdir /etc/nydus && cp nydusd-config.json /etc/nydus/config.json
```

创建 Nydus Snapshotter Systemd 配置文件 `nydus-snapshotter.service`, 配置如下:

```text
[Unit]
Description=nydus snapshotter
After=network.target
Before=containerd.service

[Service]
Type=simple
Environment=HOME=/root
ExecStart=/usr/local/bin/containerd-nydus-grpc --config-path /etc/nydus/config.json
Restart=always
RestartSec=1
KillMode=process
OOMScoreAdjust=-999
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

复制配置文件至 `/etc/systemd/system/` 目录:

```shell
sudo cp nydus-snapshotter.service /etc/systemd/system/
```

Systemd 启动 Nydus Snapshotter 服务:

<!-- markdownlint-disable -->

```shell
$ sudo systemctl enable nydus-snapshotter
$ sudo systemctl start nydus-snapshotter
$ sudo systemctl status nydus-snapshotter
● nydus-snapshotter.service - nydus snapshotter
     Loaded: loaded (/etc/systemd/system/nydus-snapshotter.service; enabled; vendor preset: enabled)
     Active: active (running) since Wed 2022-10-19 08:01:00 UTC; 2s ago
   Main PID: 2853636 (containerd-nydu)
      Tasks: 9 (limit: 37574)
     Memory: 4.6M
        CPU: 20ms
     CGroup: /system.slice/nydus-snapshotter.service
             └─2853636 /usr/local/bin/containerd-nydus-grpc --config-path /etc/nydus/config.json

Oct 19 08:01:00 kvm-gaius-0 systemd[1]: Started nydus snapshotter.
Oct 19 08:01:00 kvm-gaius-0 containerd-nydus-grpc[2853636]: time="2022-10-19T08:01:00.493700269Z" level=info msg="gc goroutine start..."
Oct 19 08:01:00 kvm-gaius-0 containerd-nydus-grpc[2853636]: time="2022-10-19T08:01:00.493947264Z" level=info msg="found 0 daemons running"
```

<!-- markdownlint-restore -->

### 转换 Nydus 格式镜像

转换 `python:3.9.15` 镜像为 Nydus 格式镜像, 可以直接使用已经转换好的 `dragonflyoss/python:3.9.15-nydus` 镜像, 跳过该步骤。
转换工具可以使用 [nydusify](https://github.com/dragonflyoss/image-service/blob/master/docs/nydusify.md) 也可以使用 [acceld](https://github.com/goharbor/acceleration-service)。

登陆 Dockerhub:

```shell
docker login
```

转换 Nydus 镜像, `DOCKERHUB_REPO_NAME` 环境变量设置为用户个人的镜像仓库:

```shell
DOCKERHUB_REPO_NAME=dragonflyoss
sudo nydusify convert --nydus-image /usr/local/bin/nydus-image --source python:3.9.15 --target $DOCKERHUB_REPO_NAME/python:3.9.15-nydus
```

### Nerdctl 运行 Nydus 镜像

使用 Nerdctl 运行 `python:3.9.15-nydus`, 过程中即通过 Nydus 和 Dragonfly 下载镜像:

```shell
sudo nerdctl --snapshotter nydus run --rm -it $DOCKERHUB_REPO_NAME/python:3.9.15-nydus
```

搜索日志验证 Nydus 基于 Mirror 模式通过 Dragonfly 分发流量:

<!-- markdownlint-disable -->

```shell
$ grep mirrors /var/lib/containerd-nydus/logs/**/*log
[2022-10-19 10:16:13.276548 +00:00] INFO [storage/src/backend/connection.rs:271] backend config: ConnectionConfig { proxy: ProxyConfig { url: "", ping_url: "", fallback: false, check_interval: 5, use_http: false }, mirrors: [MirrorConfig { host: "http://127.0.0.1:65001", headers: {"X-Dragonfly-Registry": "https://index.docker.io"}, auth_through: false }], skip_verify: false, timeout: 10, connect_timeout: 10, retry_limit: 2 }
```

<!-- markdownlint-restore -->

## 性能测试

测试 Nydus Mirror 模式与 Dragonfly P2P 集成后的单机镜像下载的性能。
主要测试不同语言镜像运行版本命令的启动时间，例如 `python` 镜像运行启动命令为 `python -V`。
测试是在同一台机器上面做不同场景的测试。
由于机器本身网络环境、配置等影响，实际下载时间不具有参考价值，
但是不同场景下载时间所提升的比率是有重要意义的。

![nydus-mirror-dragonfly](../../resource/setup/nydus-mirror-dragonfly.png)

- OCIv1: 使用 Containerd 直接拉取镜像并且启动成功的数据。
- Nydus Cold Boot: 使用 Containerd 通过 Nydus 拉取镜像，没有命中任何缓存并且启动成功的数据。
- Nydus & Dragonfly Cold Boot: 使用 Containerd 通过 Nydus 拉取镜像，并且基于 Nydus Mirror 模式流量转发至 Dragonfly P2P，在没有命中任何缓存并且启动成功的数据。
- Hit Dragonfly Remote Peer Cache: 使用 Containerd 通过 Nydus 拉取镜像，
  并且基于 Nydus Mirror 模式流量转发至 Dragonfly P2P，在命中 Dragonfly 的远端 Peer 缓存的情况下并且成功启动的数据。
- Hit Dragonfly Local Peer Cache: 使用 Containerd 通过 Nydus 拉取镜像，
  并且基于 Nydus Mirror 模式流量转发至 Dragonfly P2P，在命中 Dragonfly 的本地 Peer 缓存的情况下并且成功启动的数据。
- Hit Nydus Cache: 使用 Containerd 通过 Nydus 拉取镜像，
  并且基于 Nydus Mirror 模式流量转发至 Dragonfly P2P，在命中 Nydus 的本地缓存的情况下并且成功启动的数据。

测试结果表明 Nydus Mirror 模式和 Dragonfly P2P 集成。使用 Nydus 下载镜像对比 `OCIv1` 的模式，
能够有效减少镜像下载时间。Nydus 冷启动和 Nydus & Dragonfly 冷启动数据基本接近。
其他命中 Dragonfly Cache 的结果均好于只使用 Nydus 的情况。最重要的是如果很大规模集群使用 Nydus 拉取镜像，
会将每个镜像层的下载分解按需产生很多 Range 请求。增加镜像仓库源站 `QPS`。
而 Dragonfly 可以基于 P2P 技术有效减少回源镜像仓库的请求数量和下载流量。
最优的情况，Dragonfly 可以保证大规模集群中每个下载任务只回源一次。

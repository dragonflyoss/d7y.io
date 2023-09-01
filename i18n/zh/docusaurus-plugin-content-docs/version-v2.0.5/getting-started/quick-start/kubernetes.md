---
id: kubernetes
title: Kubernetes
description: 文档的目标是帮助您快速开始使用 Dragonfly
slug: /getting-started/quick-start/kubernetes/
---

文档的目标是帮助您快速开始使用 Dragonfly。

您可以根据 [Helm Charts](../../setup/install/helm-charts.md)
文档中的内容快速搭建 Dragonfly 的 Kubernetes 集群。
我们推荐使用 `Containerd with CRI` 和 `CRI-O` 客户端。

下表列出了一些容器的运行时、版本和文档。

<!-- markdownlint-disable -->

| Runtime                 | Version | Document                                         | CRI Support | Pull Command                                |
| ----------------------- | ------- | ------------------------------------------------ | ----------- | ------------------------------------------- |
| Containerd<sup>\*</sup> | v1.1.0+ | [Link](../../setup/runtime/containerd/mirror.md) | Yes         | crictl pull docker.io/library/alpine:latest |
| Containerd without CRI  | v1.1.0  | [Link](../../setup/runtime/containerd/proxy.md)  | No          | ctr image pull docker.io/library/alpine     |
| CRI-O                   | All     | [Link](../../setup/runtime/cri-o.md)             | Yes         | crictl pull docker.io/library/alpine:latest |

<!-- markdownlint-restore -->

推荐使用 `containerd`.

## Helm Chart 运行时配置

Dragonfly Helm 支持自动更改 docker 配置。

**支持指定仓库** 定制 values.yaml 文件:

```yaml
containerRuntime:
  docker:
    enable: true
    # -- Inject domains into /etc/hosts to force redirect traffic to dfdaemon.
    # Caution: This feature need dfdaemon to implement SNI Proxy,
    # confirm image tag is greater than v2.0.0.
    # When use certs and inject hosts in docker, no necessary to restart docker daemon.
    injectHosts: true
    registryDomains:
      - 'harbor.example.com'
      - 'harbor.example.net'
```

此配置允许 docker 通过 Dragonfly 拉取 `harbor.example.com` 和 `harbor.example.net` 域名镜像。
使用上述配置部署 Dragonfly 时，无需重新启动 docker。

优点：

- 支持 dfdaemon 自身平滑升级

> 这种模式下，当删除 dfdaemon pod 的时候，`preStop` 钩子将会清理已经注入到 `/etc/hosts` 下的所有主机信息，所有流量将会走原来的镜像中心。

限制:

- 只支持指定域名。

## 准备 Kubernetes 集群

如果没有可用的 Kubernetes 集群进行测试，推荐使用 [minikube](https://minikube.sigs.k8s.io/docs/start/)。
只需运行`minikube start`。

## 安装 Dragonfly

### 默认配置安装

```shell
helm repo add dragonfly https://dragonflyoss.github.io/helm-charts/
helm install --create-namespace --namespace dragonfly-system dragonfly dragonfly/dragonfly
```

### 等待部署成功

等待所有的服务运行成功。

```shell
kubectl -n dragonfly-system wait --for=condition=ready --all --timeout=10m pod
```

## Manager 控制台

控制台页面会在 `dragonfly-manager.dragonfly-system.svc.cluster.local:8080` 展示。

需要绑定 Ingress 可以参考 [Helm Charts 配置选项](https://artifacthub.io/packages/helm/dragonfly/dragonfly#values),
或者手动自行创建 Ingress。

控制台功能预览参考文档 [console preview](../../reference/manage-console.md)。

## 使用 Dragonfly

以上步骤执行完毕，可以使用 `crictl` 命令拉取镜像:

```shell
crictl harbor.example.com/library/alpine:latest
```

```shell
crictl pull docker.io/library/alpine:latest
```

拉取镜像后可以在 dfdaemon 查询日志:

```shell
# find pods
kubectl -n dragonfly-system get pod -l component=dfdaemon
# find logs
pod_name=dfdaemon-xxxxx
kubectl -n dragonfly-system exec -it ${pod_name} -- grep "peer task done" /var/log/dragonfly/daemon/core.log
```

日志输出例子:

```text
{
  "level": "info",
  "ts": "2022-09-07 12:04:26.485",
  "caller": "peer/peertask_conductor.go:1500",
  "msg": "peer task done, cost: 1ms",
  "peer": "10.140.2.175-5184-1eab18b6-bead-4b9f-b055-6c1120a30a33",
  "task": "b423e11ddb7ab19a3c2c4c98e5ab3b1699a597e974c737bb4004edeef6016ed2",
  "component": "PeerTask"
}
```

## 预热

为了使用 Dragonfly 的最佳体验, 你可以通过 [预热](../../reference/preheat.md) 提前下拉镜像。

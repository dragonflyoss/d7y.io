---
id: cri-o
title: CRI-O
slug: /operations/integrations/container-runtime/cri-o/
---

文档的目标是帮助您将 Dragonfly 的容器运行时设置为 CRI-O。

## 环境准备

| 所需软件           | 版本要求 | 文档                                    |
| ------------------ | -------- | --------------------------------------- |
| Kubernetes cluster | 1.19+    | [kubernetes.io](https://kubernetes.io/) |
| Helm               | v3.8.0+  | [helm.sh](https://helm.sh/)             |
| CRI-O              | v1.5.0+  | [cri-o.io](https://cri-o.io/)           |

## 快速开始

### 准备 Kubernetes 集群

如果没有可用的 Kubernetes 集群进行测试，推荐使用 [minikube](https://minikube.sigs.k8s.io/docs/)。

创建 minikube 集群:

```shell
minikube start --container-runtime=cri-o
```

### Minikube 加载 Dragonfly 镜像

下载 Dragonfly latest 镜像:

```shell
docker pull dragonflyoss/scheduler:latest
docker pull dragonflyoss/manager:latest
docker pull dragonflyoss/client:latest
docker pull dragonflyoss/dfinit:latest
```

Minikube 集群加载 Dragonfly latest 镜像:

```shell
minikube image load dragonflyoss/scheduler:latest
minikube image load dragonflyoss/manager:latest
minikube image load dragonflyoss/client:latest
minikube image load dragonflyoss/dfinit:latest
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
        crio:
          configPath: /etc/containers/registries.conf
          unqualifiedSearchRegistries: ['registry.fedoraproject.org', 'registry.access.redhat.com', 'docker.io']
          registries:
            - prefix: docker.io
              location: docker.io
```

使用配置文件部署 Dragonfly Helm Charts:

<!-- markdownlint-disable -->

```shell
$ helm repo add dragonfly https://dragonflyoss.github.io/helm-charts/
$ helm install --create-namespace --namespace dragonfly-system dragonfly dragonfly/dragonfly -f values.yaml
NAME: dragonfly
LAST DEPLOYED: Thu May 30 18:44:12 2024
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
dragonfly-client-62x4f               1/1     Running   0             70m
dragonfly-client-6zwl2               1/1     Running   0             70m
dragonfly-manager-864774f54d-v4wt6   1/1     Running   0             70m
dragonfly-mysql-0                    1/1     Running   0             70m
dragonfly-redis-master-0             1/1     Running   0             70m
dragonfly-redis-replicas-0           1/1     Running   0             70m
dragonfly-redis-replicas-1           1/1     Running   0             69m
dragonfly-redis-replicas-2           1/1     Running   0             69m
dragonfly-scheduler-0                1/1     Running   0             70m
dragonfly-seed-client-0              1/1     Running   2 (69m ago)   70m
```

### CRI-O 通过 Dragonfly 下载镜像

在 `minikube` Node 下载 `alpine:3.19` 镜像。

```shell
docker exec -i minikube /usr/bin/crictl pull alpine:3.19
```

#### 验证镜像下载成功

可以查看日志，判断 `alpine:3.19` 镜像正常拉取。

```shell
# 获取 Pod Name
export POD_NAME=$(kubectl get pods --namespace dragonfly-system -l "app=dragonfly,release=dragonfly,component=client" -o=jsonpath='{.items[?(@.spec.nodeName=="minikube")].metadata.name}' | head -n 1 )

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
  "host_id": "172.18.0.3-minikube",
  "task_id": "a46de92fcb9430049cf9e61e267e1c3c9db1f1aa4a8680a048949b06adb625a5",
  "peer_id": "172.18.0.3-minikube-86e48d67-1653-4571-bf01-7e0c9a0a119d"
}
```

---
id: kubernetes-with-manager
title: Kubernetes with Manager
description: Kubernetes with Manager
slug: /getting-started/quick-start/kubernetes-with-manager/
sidebar_position: 3
---

Documentation for deploying Dragonfly with the Manager on kubernetes using helm.

The Manager provides the web console, Open API, preheating and multi-cluster management,
and it depends on MySQL and Redis. If you only need the P2P distribution capabilities,
it is recommended to use the lightweight deployment without the Manager, refer to
[Kubernetes](./kubernetes.md).

## Runtime

You can have a quick start following [Helm Charts](../installation/helm-charts.md).
It is recommended to use `containerd`.

| Runtime                                                                     | Version  |
| --------------------------------------------------------------------------- | -------- |
| [containerd](../../operations/integrations/container-runtime/containerd.md) | v1.1.0+  |
| [Docker](../../operations/integrations/container-runtime/docker.md)         | v20.0.1+ |
| [CRI-O](../../operations/integrations/container-runtime/cri-o.md)           | All      |

## Setup kubernetes cluster {#setup-kubernetes-cluster}

[Kind](https://kind.sigs.k8s.io/) is recommended if no Kubernetes cluster is available for testing.

Create kind multi-node cluster configuration file `kind-config.yaml`, configuration content is as follows:

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
  - role: control-plane
  - role: worker
  - role: worker
```

Create a kind multi-node cluster using the configuration file:

```shell
kind create cluster --config kind-config.yaml
```

Switch the context of kubectl to kind cluster:

```shell
kubectl config use-context kind-kind
```

## Kind loads Dragonfly image {#kind-loads-dragonfly-image}

Pull Dragonfly latest images:

```shell
docker pull dragonflyoss/scheduler:latest
docker pull dragonflyoss/manager:latest
docker pull dragonflyoss/client:latest
docker pull dragonflyoss/dfinit:latest
```

Kind cluster loads Dragonfly latest images:

```shell
kind load docker-image dragonflyoss/scheduler:latest
kind load docker-image dragonflyoss/manager:latest
kind load docker-image dragonflyoss/client:latest
kind load docker-image dragonflyoss/dfinit:latest
```

## Create Dragonfly cluster based on helm charts {#create-dragonfly-cluster-based-on-helm-charts}

Create helm charts configuration file `charts-config.yaml`, configuration content is as follows.
The Manager, MySQL and Redis are disabled by default, so they need to be enabled explicitly
when deploying with the Manager.

```yaml
manager:
  # Enable manager. The manager is disabled by default.
  enable: true
  image:
    repository: dragonflyoss/manager
    tag: latest
  metrics:
    enable: true

# MySQL and Redis are the dependencies of the manager,
# and they are disabled by default.
mysql:
  enable: true

redis:
  enable: true

scheduler:
  image:
    repository: dragonflyoss/scheduler
    tag: latest
  metrics:
    enable: true

seedClient:
  image:
    repository: dragonflyoss/client
    tag: latest
  metrics:
    enable: true

client:
  image:
    repository: dragonflyoss/client
    tag: latest
  metrics:
    enable: true
  dfinit:
    enable: true
    image:
      repository: dragonflyoss/dfinit
      tag: latest
    config:
      containerRuntime:
        containerd:
          configPath: /etc/containerd/config.toml
          proxyAllRegistries: true
```

Create a Dragonfly cluster using the configuration file:

<!-- markdownlint-disable -->

```shell
$ helm repo add dragonfly https://dragonflyoss.github.io/helm-charts/
$ helm install --wait --create-namespace --namespace dragonfly-system dragonfly dragonfly/dragonfly -f charts-config.yaml
NAME: dragonfly
LAST DEPLOYED: Mon Jul 27 21:23:00 2026
NAMESPACE: dragonfly-system
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
1. Get the manager address by running these commands:
  export MANAGER_POD_NAME=$(kubectl get pods --namespace dragonfly-system -l "app=dragonfly,release=dragonfly,component=manager" -o jsonpath={.items[0].metadata.name})
  export MANAGER_CONTAINER_PORT=$(kubectl get pod --namespace dragonfly-system $MANAGER_POD_NAME -o jsonpath="{.spec.containers[0].ports[0].containerPort}")
  kubectl --namespace dragonfly-system port-forward $MANAGER_POD_NAME 8080:$MANAGER_CONTAINER_PORT
  echo "Visit http://127.0.0.1:8080 to use your manager"

2. Get the scheduler address by running these commands:
  export SCHEDULER_POD_NAME=$(kubectl get pods --namespace dragonfly-system -l "app=dragonfly,release=dragonfly,component=scheduler" -o jsonpath={.items[0].metadata.name})
  export SCHEDULER_CONTAINER_PORT=$(kubectl get pod --namespace dragonfly-system $SCHEDULER_POD_NAME -o jsonpath="{.spec.containers[0].ports[0].containerPort}")
  kubectl --namespace dragonfly-system port-forward $SCHEDULER_POD_NAME 8002:$SCHEDULER_CONTAINER_PORT
  echo "Visit http://127.0.0.1:8002 to use your scheduler"

3. Configure runtime to use dragonfly:
  https://d7y.io/docs/getting-started/quick-start/kubernetes/
```

<!-- markdownlint-restore -->

Check that Dragonfly is deployed successfully:

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

## Containerd downloads images through Dragonfly {#containerd-downloads-images-through-dragonfly}

Pull `alpine:3.19` image in kind-worker node:

```shell
docker exec -i kind-worker /usr/local/bin/crictl pull alpine:3.19
```

### Verify {#verify}

You can execute the following command to check if the `alpine:3.19` image is distributed via Dragonfly.

<!-- markdownlint-disable -->

```shell
# Find pod name.
export POD_NAME=$(kubectl get pods --namespace dragonfly-system -l "app=dragonfly,release=dragonfly,component=client" -o=jsonpath='{.items[?(@.spec.nodeName=="kind-worker")].metadata.name}' | head -n 1 )

# Find task id.
export TASK_ID=$(kubectl -n dragonfly-system exec ${POD_NAME} -- sh -c "grep -hoP 'library/alpine.*task_id=\"\K[^\"]+' /var/log/dragonfly/dfdaemon/* | head -n 1")

# Check logs.
kubectl -n dragonfly-system exec -it ${POD_NAME} -- sh -c "grep ${TASK_ID} /var/log/dragonfly/dfdaemon/* | grep 'download task succeeded'"

# Download logs.
kubectl -n dragonfly-system exec ${POD_NAME} -- sh -c "grep ${TASK_ID} /var/log/dragonfly/dfdaemon/*" > dfdaemon.log
```

<!-- markdownlint-restore -->

The expected output is as follows:

```shell
{
  2024-04-19T02:44:09.259458Z  INFO
  "download_task":"dragonfly-client/src/grpc/dfdaemon_download.rs:276":: "download task succeeded"
  "host_id": "172.18.0.3-kind-worker",
  "task_id": "a46de92fcb9430049cf9e61e267e1c3c9db1f1aa4a8680a048949b06adb625a5",
  "peer_id": "172.18.0.3-kind-worker-86e48d67-1653-4571-bf01-7e0c9a0a119d"
}
```

## Preheat image {#preheat-image}

Use the Open API or the web console to preheat images to Dragonfly,
refer to [Preheat](../../advanced-guides/preheat.md).

---
id: lightweight-deployment
title: Lightweight Deployment
description: Multi-cluster kubernetes lightweight deployment
slug: /getting-started/quick-start/multi-cluster-kubernetes/lightweight-deployment/
---

Documentation for deploying Dragonfly on multi-cluster kubernetes using helm. A Dragonfly cluster manages cluster within
a network. If you have two clusters with disconnected networks, you can use two Dragonfly clusters to manage their own clusters.

Without the Manager, deploy a Dragonfly cluster per kubernetes cluster. Each deployment has its
own scheduler headless service and `dynconfig.yaml` ConfigMap, and clients only discover the
schedulers of their own deployment, so each deployment forms an isolated P2P network. Because
peer can only transmit data in its own Dragonfly cluster, if a kubernetes cluster deploys a
Dragonfly cluster, then a kubernetes cluster forms a p2p network, and internal peers can only
schedule and transmit data in a kubernetes cluster.

## Runtime

You can have a quick start following [Helm Charts](../../installation/helm-charts.md).
It is recommended to use `containerd`.

| Runtime                                                                     | Version  |
| --------------------------------------------------------------------------- | -------- |
| [containerd](../../../operations/integrations/container-runtime/containerd.md) | v1.1.0+  |
| [Docker](../../../operations/integrations/container-runtime/docker.md)         | v20.0.1+ |
| [CRI-O](../../../operations/integrations/container-runtime/cri-o.md)           | All      |

## Setup kubernetes cluster

[Kind](https://kind.sigs.k8s.io/) is recommended if no Kubernetes cluster is available for testing.

Create kind cluster configuration file `kind-config.yaml`, configuration content is as follows:

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
  - role: control-plane
  - role: worker
    labels:
      cluster: a
  - role: worker
    labels:
      cluster: a
  - role: worker
    labels:
      cluster: b
  - role: worker
    labels:
      cluster: b
```

Create cluster using the configuration file:

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
docker pull dragonflyoss/client:latest
docker pull dragonflyoss/dfinit:latest
```

Kind cluster loads Dragonfly latest images:

```shell
kind load docker-image dragonflyoss/scheduler:latest
kind load docker-image dragonflyoss/client:latest
kind load docker-image dragonflyoss/dfinit:latest
```

## Create Dragonfly cluster

Each Dragonfly cluster is deployed as an independent helm release in its own namespace.
The clients of each release use the scheduler headless service of their own release for
scheduler discovery, so the two Dragonfly clusters are isolated from each other.

### Create Dragonfly cluster A

#### Create Dragonfly cluster A based on helm charts

Create Dragonfly cluster A charts configuration file `charts-config-cluster-a.yaml`, configuration content is as follows:

```yaml
scheduler:
  nodeSelector:
    cluster: a
  image:
    repository: dragonflyoss/scheduler
    tag: latest
  metrics:
    enable: true

seedClient:
  nodeSelector:
    cluster: a
  image:
    repository: dragonflyoss/client
    tag: latest
  metrics:
    enable: true

client:
  nodeSelector:
    cluster: a
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

Create Dragonfly cluster A using the configuration file:

<!-- markdownlint-disable -->

```shell
$ helm repo add dragonfly https://dragonflyoss.github.io/helm-charts/
$ helm install --wait --create-namespace --namespace cluster-a dragonfly dragonfly/dragonfly -f charts-config-cluster-a.yaml
NAME: dragonfly
LAST DEPLOYED: Mon Jul 27 21:23:00 2026
NAMESPACE: cluster-a
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
1. Dragonfly is running without the manager. The scheduler and client load the dynamic
   configuration from the local dynconfig.yaml file mounted as a ConfigMap, and clients
   discover schedulers via the scheduler headless service:
  dragonfly-scheduler.cluster-a.svc.cluster.local:8002

2. Get the scheduler address by running these commands:
  export SCHEDULER_POD_NAME=$(kubectl get pods --namespace cluster-a -l "app=dragonfly,release=dragonfly,component=scheduler" -o jsonpath={.items[0].metadata.name})
  export SCHEDULER_CONTAINER_PORT=$(kubectl get pod --namespace cluster-a $SCHEDULER_POD_NAME -o jsonpath="{.spec.containers[0].ports[0].containerPort}")
  kubectl --namespace cluster-a port-forward $SCHEDULER_POD_NAME 8002:$SCHEDULER_CONTAINER_PORT
  echo "Visit http://127.0.0.1:8002 to use your scheduler"

3. Configure runtime to use dragonfly:
  https://d7y.io/docs/getting-started/quick-start/kubernetes/
```

<!-- markdownlint-restore -->

Check that Dragonfly cluster A is deployed successfully:

```shell
$ kubectl get po -n cluster-a
NAME                      READY   STATUS    RESTARTS   AGE
dragonfly-client-5gvz7    1/1     Running   0          3m
dragonfly-client-xvqmq    1/1     Running   0          3m
dragonfly-scheduler-0     1/1     Running   0          3m
dragonfly-seed-client-0   1/1     Running   0          3m
```

### Create Dragonfly cluster B

#### Create Dragonfly cluster B based on helm charts

Create Dragonfly cluster B charts configuration file `charts-config-cluster-b.yaml`, configuration content is as follows:

```yaml
scheduler:
  nodeSelector:
    cluster: b
  image:
    repository: dragonflyoss/scheduler
    tag: latest
  metrics:
    enable: true

seedClient:
  nodeSelector:
    cluster: b
  image:
    repository: dragonflyoss/client
    tag: latest
  metrics:
    enable: true

client:
  nodeSelector:
    cluster: b
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

Create Dragonfly cluster B using the configuration file:

<!-- markdownlint-disable -->

```shell
$ helm install --wait --create-namespace --namespace cluster-b dragonfly dragonfly/dragonfly -f charts-config-cluster-b.yaml
NAME: dragonfly
LAST DEPLOYED: Mon Jul 27 21:26:00 2026
NAMESPACE: cluster-b
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
1. Dragonfly is running without the manager. The scheduler and client load the dynamic
   configuration from the local dynconfig.yaml file mounted as a ConfigMap, and clients
   discover schedulers via the scheduler headless service:
  dragonfly-scheduler.cluster-b.svc.cluster.local:8002

2. Get the scheduler address by running these commands:
  export SCHEDULER_POD_NAME=$(kubectl get pods --namespace cluster-b -l "app=dragonfly,release=dragonfly,component=scheduler" -o jsonpath={.items[0].metadata.name})
  export SCHEDULER_CONTAINER_PORT=$(kubectl get pod --namespace cluster-b $SCHEDULER_POD_NAME -o jsonpath="{.spec.containers[0].ports[0].containerPort}")
  kubectl --namespace cluster-b port-forward $SCHEDULER_POD_NAME 8002:$SCHEDULER_CONTAINER_PORT
  echo "Visit http://127.0.0.1:8002 to use your scheduler"

3. Configure runtime to use dragonfly:
  https://d7y.io/docs/getting-started/quick-start/kubernetes/
```

<!-- markdownlint-restore -->

Check that Dragonfly cluster B is deployed successfully:

```shell
$ kubectl get po -n cluster-b
NAME                      READY   STATUS    RESTARTS   AGE
dragonfly-client-f4897    1/1     Running   0          3m
dragonfly-client-m9k9f    1/1     Running   0          3m
dragonfly-scheduler-0     1/1     Running   0          3m
dragonfly-seed-client-0   1/1     Running   0          3m
```

## Using Dragonfly to distribute images for multi-cluster kubernetes

### Containerd pull image back-to-source for the first time through Dragonfly in cluster A

Pull `alpine:3.19` image in `kind-worker` node:

```shell
time docker exec -i kind-worker /usr/local/bin/crictl pull alpine:3.19
```

When pull image back-to-source for the first time through Dragonfly, peer uses `cluster-a`'s scheduler and seed peer.
It takes `31.714s` to download the `alpine:3.19` image.

### Containerd pull image hits the cache of remote peer in cluster A

Delete the client whose Node is `kind-worker` to clear the cache of Dragonfly local Peer.

<!-- markdownlint-disable -->

```shell
# Find pod name.
export POD_NAME=$(kubectl get pods --namespace cluster-a -l "app=dragonfly,release=dragonfly,component=client" -o=jsonpath='{.items[?(@.spec.nodeName=="kind-worker")].metadata.name}' | head -n 1 )

# Delete pod.
kubectl delete pod ${POD_NAME} -n cluster-a
```

<!-- markdownlint-restore -->

Delete `alpine:3.19` image in `kind-worker` node:

```shell
docker exec -i kind-worker /usr/local/bin/crictl rmi alpine:3.19
```

Pull `alpine:3.19` image in `kind-worker` node:

```shell
time docker exec -i kind-worker /usr/local/bin/crictl pull alpine:3.19
```

When pull image hits cache of remote peer, peer uses `cluster-a`'s scheduler and seed peer.
It takes `7.304s` to download the `alpine:3.19` image.

### Containerd pull image back-to-source for the first time through dragonfly in cluster B

Pull `alpine:3.19` image in `kind-worker3` node:

```shell
time docker exec -i kind-worker3 /usr/local/bin/crictl pull alpine:3.19
```

When pull image back-to-source for the first time through Dragonfly, peer uses `cluster-b`'s scheduler and seed peer.
It takes `36.208s` to download the `alpine:3.19` image.

### Containerd pull image hits the cache of remote peer in cluster B

Delete the client whose Node is `kind-worker3` to clear the cache of Dragonfly local Peer.

<!-- markdownlint-disable -->

```shell
# Find pod name.
export POD_NAME=$(kubectl get pods --namespace cluster-b -l "app=dragonfly,release=dragonfly,component=client" -o=jsonpath='{.items[?(@.spec.nodeName=="kind-worker3")].metadata.name}' | head -n 1 )

# Delete pod.
kubectl delete pod ${POD_NAME} -n cluster-b
```

<!-- markdownlint-restore -->

Delete `alpine:3.19` image in `kind-worker3` node:

```shell
docker exec -i kind-worker3 /usr/local/bin/crictl rmi alpine:3.19
```

Pull `alpine:3.19` image in `kind-worker3` node:

```shell
time docker exec -i kind-worker3 /usr/local/bin/crictl pull alpine:3.19
```

When pull image hits cache of remote peer, peer uses `cluster-b`'s scheduler and seed peer.
It takes `6.963s` to download the `alpine:3.19` image.

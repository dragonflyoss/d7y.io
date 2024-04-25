---
id: multi-cluster-kubernetes
title: Multi-cluster Kubernetes
description: Multi-cluster kubernetes
slug: /getting-started/quick-start/multi-cluster-kubernetes/
---

Documentation for deploying Dragonfly on multi-cluster kubernetes using helm. A Dragonfly cluster manages cluster within
a network. If you have two clusters with disconnected networks, you can use two Dragonfly clusters to manage their own clusters.

The recommended deployment in a multi-cluster kubernetes is to use a Dragonfly cluster to manage a kubernetes cluster,
and use a centralized manager service to manage multiple Dragonfly clusters. Because peer can only transmit data in
its own Dragonfly cluster, if a kubernetes cluster deploys a Dragonfly cluster, then a kubernetes cluster forms a p2p network,
and internal peers can only schedule and transmit data in a kubernetes cluster.

![multi-cluster-kubernetes](../../resource/getting-started/multi-cluster-kubernetes.png)

## Runtime

You can have a quick start following [Helm Charts](../installation/helm-charts.md).
We recommend to use `containerd`.

| Runtime    | Version  | Document                                                              |
| ---------- | -------- | --------------------------------------------------------------------- |
| containerd | v1.1.0+  | [Link](../../operations/integrations/container-runtime/containerd.md) |
| Docker     | v20.0.1+ | [Link](../../operations/integrations/container-runtime/docker.md)     |
| CRI-O      | All      | [Link](../../operations/integrations/container-runtime/cri-o.md)      |

## Setup kubernetes cluster

[Kind](https://kind.sigs.k8s.io/) is recommended if no Kubernetes cluster is available for testing.

Create kind cluster configuration file `kind-config.yaml`, configuration content is as follows:

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
  - role: control-plane
  - role: worker
    extraPortMappings:
      - containerPort: 30950
        hostPort: 8080
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

Switch the context of kubectl to kind cluster A:

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

Kind cluster loads dragonfly latest images:

```shell
kind load docker-image dragonflyoss/scheduler:latest
kind load docker-image dragonflyoss/manager:latest
kind load docker-image dragonflyoss/client:latest
kind load docker-image dragonflyoss/dfinit:latest
```

## Create Dragonfly cluster A

Create Dragonfly cluster A, the schedulers, seed peers, peers and centralized manager included in
the cluster should be installed using helm.

### Create Dragonfly cluster A based on helm charts

Create Dragonfly cluster A charts configuration file `charts-config-cluster-a.yaml`, configuration content is as follows:

```yaml
manager:
  replicas: 1
  nodeSelector:
    cluster: a
  image:
    repository: dragonflyoss/manager
    tag: latest

scheduler:
  replicas: 1
  nodeSelector:
    cluster: a
  image:
    repository: dragonflyoss/scheduler
    tag: latest

seedClient:
  replicas: 1
  nodeSelector:
    cluster: a
  image:
    repository: dragonflyoss/client
    tag: latest

client:
  nodeSelector:
    cluster: a
  image:
    repository: dragonflyoss/client
    tag: latest
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

Create Dragonfly cluster A using the configuration file:

<!-- markdownlint-disable -->

```shell
$ helm repo add dragonfly https://dragonflyoss.github.io/helm-charts/
$ helm install --wait --create-namespace --namespace cluster-a dragonfly dragonfly/dragonfly -f charts-config-cluster-a.yaml
NAME: dragonfly
LAST DEPLOYED: Tue Apr 16 16:12:42 2024
NAMESPACE: cluster-a
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
1. Get the scheduler address by running these commands:
  export SCHEDULER_POD_NAME=$(kubectl get pods --namespace cluster-a -l "app=dragonfly,release=dragonfly,component=scheduler" -o jsonpath={.items[0].metadata.name})
  export SCHEDULER_CONTAINER_PORT=$(kubectl get pod --namespace cluster-a $SCHEDULER_POD_NAME -o jsonpath="{.spec.containers[0].ports[0].containerPort}")
  kubectl --namespace cluster-a port-forward $SCHEDULER_POD_NAME 8002:$SCHEDULER_CONTAINER_PORT
  echo "Visit http://127.0.0.1:8002 to use your scheduler"

2. Get the dfdaemon port by running these commands:
  export DFDAEMON_POD_NAME=$(kubectl get pods --namespace cluster-a -l "app=dragonfly,release=dragonfly,component=dfdaemon" -o jsonpath={.items[0].metadata.name})
  export DFDAEMON_CONTAINER_PORT=$(kubectl get pod --namespace cluster-a $DFDAEMON_POD_NAME -o jsonpath="{.spec.containers[0].ports[0].containerPort}")
  You can use $DFDAEMON_CONTAINER_PORT as a proxy port in Node.

3. Configure runtime to use dragonfly:
  https://d7y.io/docs/getting-started/quick-start/kubernetes/
```

<!-- markdownlint-restore -->

Check that Dragonfly cluster A is deployed successfully:

```shell
$ kubectl get po -n cluster-a
NAME                                READY   STATUS    RESTARTS   AGE
dragonfly-client-5gvz7              1/1     Running   0          51m
dragonfly-client-xvqmq              1/1     Running   0          51m
dragonfly-manager-dc6dcf87b-l88mr   1/1     Running   0          51m
dragonfly-mysql-0                   1/1     Running   0          51m
dragonfly-redis-master-0            1/1     Running   0          51m
dragonfly-redis-replicas-0          1/1     Running   0          51m
dragonfly-redis-replicas-1          1/1     Running   0          48m
dragonfly-redis-replicas-2          1/1     Running   0          39m
dragonfly-scheduler-0               1/1     Running   0          51m
dragonfly-seed-client-0             1/1     Running   0          51m
```

### Create NodePort service of the manager REST service

Create the manager REST service configuration file `manager-rest-svc.yaml`,
configuration content is as follows:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: manager-rest
  namespace: cluster-a
spec:
  type: NodePort
  ports:
    - name: http
      nodePort: 30950
      port: 8080
  selector:
    app: dragonfly
    component: manager
    release: dragonfly
```

Create manager REST service using the configuration file:

```shell
kubectl apply -f manager-rest-svc.yaml -n cluster-a
```

### Visit manager console

Visit address `localhost:8080` to see the manager console. Sign in the console with the default root user,
the username is `root` and password is `dragonfly`.

![signin](../../resource/getting-started/signin.png)

![clusters](../../resource/getting-started/clusters.png)

By default, Dragonfly will automatically create Dragonfly cluster A record in manager when
it is installed for the first time. You can click Dragonfly cluster A to view the details.

![cluster-a](../../resource/getting-started/cluster-a.png)

## Create Dragonfly cluster B

Create Dragonfly cluster B, you need to create a Dragonfly cluster record in the manager console first,
and the schedulers, seed peers and peers included in the Dragonfly cluster should be installed using helm.

### Create Dragonfly cluster B in the manager console

Visit manager console and click the `ADD CLUSTER` button to add Dragonfly cluster B record.
Note that the IDC is set to `cluster-2` to match the peer whose IDC is `cluster-2`.

![create-cluster-b](../../resource/getting-started/create-cluster-b.png)

Create Dragonfly cluster B record successfully.

![create-cluster-b-successfully](../../resource/getting-started/create-cluster-b-successfully.png)

### Use scopes to distinguish different Dragonfly clusters

The Dragonfly cluster needs to serve the scope. It wil provide scheduler services and
seed peer services to peers in the scope. The scopes of the Dragonfly cluster are configured
when the console is created and updated. The scopes of the peer are configured in peer YAML config,
the fields are `host.idc`, `host.location` and `host.advertiseIP`,
refer to [dfdaemon config](../../reference/configuration/dfdaemon.md).

If the peer scopes match the Dragonfly cluster scopes, then the peer will use
the Dragonfly cluster's scheduler and seed peer first, and if there is no matching
Dragonfly cluster then use the default Dragonfly cluster.

**Location**: The Dragonfly cluster needs to serve all peers in the location. When the location in
the peer configuration matches the location in the Dragonfly cluster, the peer will preferentially
use the scheduler and the seed peer of the Dragonfly cluster. It separated by "|",
for example "area|country|province|city".

**IDC**: The Dragonfly cluster needs to serve all peers in the IDC. When the IDC in the peer
configuration matches the IDC in the Dragonfly cluster, the peer will preferentially use the
scheduler and the seed peer of the Dragonfly cluster. IDC has higher priority than location
in the scopes.

**CIDRs**: The Dragonfly cluster needs to serve all peers in the CIDRs. The advertise IP will be reported in the peer
configuration when the peer is started, and if the advertise IP is empty in the peer configuration,
peer will automatically get expose IP as advertise IP. When advertise IP of the peer matches the CIDRs in Dragonfly cluster,
the peer will preferentially use the scheduler and the seed peer of the Dragonfly cluster.
CIDRs has higher priority than IDC in the scopes.

**Hostnames**: The cluster needs to serve all peers in Hostnames. The input parameter is the multiple Hostnames regexes.
The Hostnames will be reported in the peer configuration when the peer is started.
When the Hostnames matches the multiple Hostnames regexes in the cluster,
the peer will preferentially use the scheduler and the seed peer of the cluster.
Hostnames has higher priority than IDC in the scopes.
Hostnames has priority equal to CIDRs in the scopes.

### Create Dragonfly cluster B based on helm charts

Create charts configuration with cluster information in the manager console.

![cluster-b-information](../../resource/getting-started/cluster-b-information.png)

- `Scheduler.config.manager.schedulerClusterID` using the `Scheduler cluster ID`
  from `cluster-2` information in the manager console.
- `Scheduler.config.manager.addr` is address of the manager GRPC server.
- `seedClient.config.seedPeer.clusterID` using the `Seed peer cluster ID`
  from `cluster-2` information in the manager console.
- `seedClient.config.manager.addrs` is address of the manager GRPC server.
- `client.config.host.idc` using the `IDC` from `cluster-2` information in the manager console.
- `client.config.manager.addrs` is address of the manager GRPC server.
- `externalManager.host` is host of the manager GRPC server.
- `externalRedis.addrs[0]` is address of the redis.

Create Dragonfly cluster B charts configuration file `charts-config-cluster-b.yaml`,
configuration content is as follows:

```yaml
scheduler:
  replicas: 1
  nodeSelector:
    cluster: b
  image:
    repository: dragonflyoss/scheduler
    tag: latest
  config:
    manager:
      addr: dragonfly-manager.cluster-a.svc.cluster.local:65003
      schedulerClusterID: 2

seedClient:
  replicas: 1
  nodeSelector:
    cluster: b
  image:
    repository: dragonflyoss/client
    tag: latest
  config:
    manager:
      addrs:
        - http://dragonfly-manager.cluster-a.svc.cluster.local:65003
    seedPeer:
      clusterID: 2

client:
  nodeSelector:
    cluster: b
  image:
    repository: dragonflyoss/client
    tag: latest
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
  config:
    host:
      idc: cluster-2
    manager:
      addrs:
        - http://dragonfly-manager.cluster-a.svc.cluster.local:65003

manager:
  enable: false

externalManager:
  enable: true
  host: dragonfly-manager.cluster-a.svc.cluster.local
  restPort: 8080
  grpcPort: 65003

redis:
  enable: false

externalRedis:
  addrs:
    - dragonfly-redis-master.cluster-a.svc.cluster.local:6379
  password: dragonfly

mysql:
  enable: false
```

Create Dragonfly cluster B using the configuration file:

<!-- markdownlint-disable -->

```shell
$ helm install --wait --create-namespace --namespace cluster-b dragonfly dragonfly/dragonfly -f charts-config-cluster-b.yaml
NAME: dragonfly
LAST DEPLOYED: Tue Apr 16 15:49:42 2024
NAMESPACE: cluster-b
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
1. Get the scheduler address by running these commands:
  export SCHEDULER_POD_NAME=$(kubectl get pods --namespace cluster-b -l "app=dragonfly,release=dragonfly,component=scheduler" -o jsonpath={.items[0].metadata.name})
  export SCHEDULER_CONTAINER_PORT=$(kubectl get pod --namespace cluster-b $SCHEDULER_POD_NAME -o jsonpath="{.spec.containers[0].ports[0].containerPort}")
  kubectl --namespace cluster-b port-forward $SCHEDULER_POD_NAME 8002:$SCHEDULER_CONTAINER_PORT
  echo "Visit http://127.0.0.1:8002 to use your scheduler"

2. Get the dfdaemon port by running these commands:
  export DFDAEMON_POD_NAME=$(kubectl get pods --namespace cluster-b -l "app=dragonfly,release=dragonfly,component=dfdaemon" -o jsonpath={.items[0].metadata.name})
  export DFDAEMON_CONTAINER_PORT=$(kubectl get pod --namespace cluster-b $DFDAEMON_POD_NAME -o jsonpath="{.spec.containers[0].ports[0].containerPort}")
  You can use $DFDAEMON_CONTAINER_PORT as a proxy port in Node.

3. Configure runtime to use dragonfly:
  https://d7y.io/docs/getting-started/quick-start/kubernetes/
```

<!-- markdownlint-restore -->

Check that Dragonfly cluster B is deployed successfully:

```shell
$ kubectl get po -n cluster-b
NAME                      READY   STATUS    RESTARTS   AGE
dragonfly-client-f4897    1/1     Running   0          10m
dragonfly-client-m9k9f    1/1     Running   0          10m
dragonfly-scheduler-0     1/1     Running   0          10m
dragonfly-seed-client-0   1/1     Running   0          10m
```

Create dragonfly cluster B successfully.

![install-cluster-b-successfully](../../resource/getting-started/install-cluster-b-successfully.png)

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

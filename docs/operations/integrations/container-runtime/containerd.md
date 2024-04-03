---
id: containerd
title: containerd
slug: /setup/runtime/containerd
---

Documentation for setting Dragonfly's container runtime to containerd.

## Prerequisites {#prerequisites}

| Name               | Version | Document                                |
| ------------------ | ------- | --------------------------------------- |
| Kubernetes cluster | 1.20+   | [kubernetes.io](https://kubernetes.io/) |
| Helm               | v3.8.0+ | [helm.sh](https://helm.sh/)             |
| containerd         | v1.5.0+ | [containerd.io](https://containerd.io/) |

## Quick Start {#quick-start}

### Setup kubernetes cluster {#setup-kubernetes-cluster}

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

### Kind loads Dragonfly image {#kind-loads-dragonfly-image}

Pull Dragonfly latest images:

```shell
docker pull dragonflyoss/scheduler:latest
docker pull dragonflyoss/manager:latest
docker pull dragonflyoss/dfdaemon:latest
```

Kind cluster loads Dragonfly latest images:

```shell
kind load docker-image dragonflyoss/scheduler:latest
kind load docker-image dragonflyoss/manager:latest
kind load docker-image dragonflyoss/dfdaemon:latest
```

### Create Dragonfly cluster based on helm charts {#create-dragonfly-cluster-based-on-helm-charts}

Create the Helm Charts configuration file `values.yaml`. Please refer to the
[configuration](https://artifacthub.io/packages/helm/dragonfly/dragonfly#values) documentation for details.

```yaml
containerRuntime:
  containerd:
    enable: true
    injectConfigPath: true
    registries:
      - 'https://docker.io'
```

Create a Dragonfly cluster using the configuration file:

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

<!-- markdownlint-restore -->

Check that Dragonfly is deployed successfully:

```shell
$ kubectl get po -n dragonfly-system
NAME                                READY   STATUS    RESTARTS   AGE
dragonfly-dfdaemon-2j57h            1/1     Running   0          92s
dragonfly-dfdaemon-fg575            1/1     Running   0          92s
dragonfly-manager-6dbfb7b47-9cd6m   1/1     Running   0          92s
dragonfly-manager-6dbfb7b47-m9nkj   1/1     Running   0          92s
dragonfly-manager-6dbfb7b47-x2nzg   1/1     Running   0          92s
dragonfly-mysql-0                   1/1     Running   0          92s
dragonfly-redis-master-0            1/1     Running   0          92s
dragonfly-redis-replicas-0          1/1     Running   0          92s
dragonfly-redis-replicas-1          1/1     Running   0          55s
dragonfly-redis-replicas-2          1/1     Running   0          34s
dragonfly-scheduler-0               1/1     Running   0          92s
dragonfly-scheduler-1               1/1     Running   0          20s
dragonfly-scheduler-2               0/1     Running   0          10s
dragonfly-seed-peer-0               1/1     Running   0          92s
dragonfly-seed-peer-1               1/1     Running   0          31s
dragonfly-seed-peer-2               0/1     Running   0          11s
```

### Containerd downloads images through Dragonfly {#containerd-downloads-images-through-dragonfly}

Pull `alpine:3.19` image in kind-worker node:

```shell
docker exec -i kind-worker /usr/local/bin/crictl pull alpine:3.19
```

#### Verify {#verify}

You can execute the following command to check if the `alpine:3.19` image is distributed via Dragonfly.

<!-- markdownlint-disable -->

```shell
# Find pod name.
export POD_NAME=$(kubectl get pods --namespace dragonfly-system -l "app=dragonfly,release=dragonfly,component=dfdaemon" -o=jsonpath='{.items[?(@.spec.nodeName=="kind-worker")].metadata.name}' | head -n 1 )

# Find peer id.
export PEER_ID=$(kubectl -n dragonfly-system exec -it ${POD_NAME} -- grep "alpine" /var/log/dragonfly/daemon/core.log | awk -F'"peer":"' '{print $2}' | awk -F'"' '{print $1}' | head -n 1)

# Check logs.
kubectl -n dragonfly-system exec -it ${POD_NAME} -- grep ${PEER_ID} /var/log/dragonfly/daemon/core.log | grep "peer task done"
```

<!-- markdownlint-restore -->

The expected output is as follows:

```shell
{
  "level": "info",
  "ts": "2024-03-05 12:06:31.244",
  "caller": "peer/peertask_conductor.go:1349",
  "msg": "peer task done, cost: 2751ms",
  "peer": "10.244.1.2-54896-5c6cb404-0f2b-4ac6-a18f-d74167a766b4",
  "task": "0bff62286fe544f598997eed3ecfc8aa9772b8522b9aa22a01c06eef2c8eba66",
  "component": "PeerTask",
  "trace": "31fc6650d93ec3992ab9aad245fbef71"
}
```

## More configurations {#more-configurations}

### Single Registry {single-registry}

Method 1: Deploy using Helm Charts and create the Helm Charts configuration file `values.yaml`.
Please refer to the [configuration](https://artifacthub.io/packages/helm/dragonfly/dragonfly#values) documentation for details.

```yaml
containerRuntime:
  containerd:
    enable: true
    injectConfigPath: true
    registries:
      - 'https://docker.io'
```

Method 2: Modify your `config.toml` (default location: `/etc/containerd/config.toml`), refer to [registry-configuration-examples](https://github.com/containerd/containerd/blob/main/docs/hosts.md#registry-configuration---examples).

> Notice: config_path is the path where containerd looks for registry configuration files.

```toml
# explicitly use v2 config format
version = 2

[plugins."io.containerd.grpc.v1.cri".registry]
  config_path = "/etc/containerd/certs.d"
```

Create the registry configuration file `/etc/containerd/certs.d/docker.io/hosts.toml`:

> Notice: The container registry is `https://index.docker.io`.

```toml
server = "https://index.docker.io"

[host."http://127.0.0.1:65001"]
  capabilities = ["pull", "resolve"]
[host."http://127.0.0.1:65001".header]
  X-Dragonfly-Registry = ["https://index.docker.io"]
```

Restart containerd:

```shell
systemctl restart containerd
```

### Multiple Registries {#multiple-registries}

Method 1: Deploy using Helm Charts and create the Helm Charts configuration file `values.yaml`.
Please refer to the [configuration](https://artifacthub.io/packages/helm/dragonfly/dragonfly#values) documentation for details.

```yaml
containerRuntime:
  containerd:
    enable: true
    injectConfigPath: true
    registries:
      - 'https://docker.io'
      - 'https://ghcr.io'
```

Method 2: Modify your `config.toml` (default location: `/etc/containerd/config.toml`), refer to [registry-configuration-examples](https://github.com/containerd/containerd/blob/main/docs/hosts.md#registry-configuration---examples).

> Notice: config_path is the path where containerd looks for registry configuration files.

```toml
# explicitly use v2 config format
version = 2

[plugins."io.containerd.grpc.v1.cri".registry]
  config_path = "/etc/containerd/certs.d"
```

Create the registry configuration file `/etc/containerd/certs.d/docker.io/hosts.toml`:

> Notice: The container registry is `https://index.docker.io`.

```toml
server = "https://example.com"

[host."http://127.0.0.1:65001"]
  capabilities = ["pull", "resolve"]
[host."http://127.0.0.1:65001".header]
  X-Dragonfly-Registry = ["https://example.com"]
```

Create the registry configuration file `/etc/containerd/certs.d/ghcr.io/hosts.toml`:

> Notice: The container registry is `https://ghcr.io`.

```toml
server = "https://ghcr.io"

[host."http://127.0.0.1:65001"]
  capabilities = ["pull", "resolve"]
[host."http://127.0.0.1:65001".header]
  X-Dragonfly-Registry = ["https://ghcr.io"]
```

Restart containerd:

```shell
systemctl restart containerd
```

---
id: containerd
title: containerd
slug: /operations/integrations/container-runtime/containerd/
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

### Create Dragonfly cluster based on helm charts {#create-dragonfly-cluster-based-on-helm-charts}

Create the Helm Charts configuration file `values.yaml`. Please refer to the
[configuration](https://artifacthub.io/packages/helm/dragonfly/dragonfly#values) documentation for details.

```yaml
manager:
  replicas: 1
  image:
    repository: dragonflyoss/manager
    tag: latest

scheduler:
  replicas: 1
  image:
    repository: dragonflyoss/scheduler
    tag: latest

seedClient:
  replicas: 1
  image:
    repository: dragonflyoss/client
    tag: latest

client:
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

Create a Dragonfly cluster using the configuration file:

<!-- markdownlint-disable -->

```shell
$ helm repo add dragonfly https://dragonflyoss.github.io/helm-charts/
$ helm install --create-namespace --namespace dragonfly-system dragonfly dragonfly/dragonfly -f values.yaml
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

<!-- markdownlint-restore -->

Check that Dragonfly is deployed successfully:

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
export POD_NAME=$(kubectl get pods --namespace dragonfly-system -l "app=dragonfly,release=dragonfly,component=client" -o=jsonpath='{.items[?(@.spec.nodeName=="kind-worker")].metadata.name}' | head -n 1 )

# Find peer id.
export TASK_ID=$(kubectl -n dragonfly-system exec ${POD_NAME} -- sh -c "grep -hoP 'library/alpine.*task_id=\"\K[^\"]+' /var/log/dragonfly/dfdaemon/* | head -n 1")

# Check logs.
kubectl -n dragonfly-system exec -it ${POD_NAME} -- sh -c "grep ${TASK_ID} /var/log/dragonfly/dfdaemon/* | grep 'download task succeeded'"
```

<!-- markdownlint-restore -->

The expected output is as follows:

```shell
{
2024-04-29T07:55:39.011077Z  INFO
download_task: dragonfly-client/src/grpc/dfdaemon_download.rs:276: download task succeeded
host_id="172.18.0.4-kind-worker"
task_id="e6eae29939870e88750daef3369cae2d7f8699ea29e1319efa1c7d4ff72a3317"
peer_id="172.18.0.4-kind-worker-b1490bd8-2778-405f-8871-cdeb87cf36a7"
}
```

## More configurations {#more-configurations}

### Single Registry {single-registry}

Method 1: Deploy using Helm Charts and create the Helm Charts configuration file `values.yaml`.
Please refer to the [configuration](https://artifacthub.io/packages/helm/dragonfly/dragonfly#values) documentation for details.

```yaml
manager:
  replicas: 1
  image:
    repository: dragonflyoss/manager
    tag: latest

scheduler:
  replicas: 1
  image:
    repository: dragonflyoss/scheduler
    tag: latest

seedClient:
  replicas: 1
  image:
    repository: dragonflyoss/client
    tag: latest

client:
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

[host."http://127.0.0.1:4001"]
capabilities = ["pull", "resolve"]

[host."http://127.0.0.1:4001".header]
X-Dragonfly-Registry = "https://index.docker.io"
```

Restart containerd:

```shell
systemctl restart containerd
```

### Multiple Registries {#multiple-registries}

Method 1: Deploy using Helm Charts and create the Helm Charts configuration file `values.yaml`.
Please refer to the [configuration](https://artifacthub.io/packages/helm/dragonfly/dragonfly#values) documentation for details.

```yaml
manager:
  replicas: 1
  image:
    repository: dragonflyoss/manager
    tag: latest

scheduler:
  replicas: 1
  image:
    repository: dragonflyoss/scheduler
    tag: latest

seedClient:
  replicas: 1
  image:
    repository: dragonflyoss/client
    tag: latest

client:
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
            - hostNamespace: ghcr.io
              serverAddr: https://ghcr.io
              capabilities: ['pull', 'resolve']
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

[host."http://127.0.0.1:4001"]
capabilities = ["pull", "resolve"]

[host."http://127.0.0.1:4001".header]
X-Dragonfly-Registry = "https://index.docker.io"
```

Create the registry configuration file `/etc/containerd/certs.d/ghcr.io/hosts.toml`:

> Notice: The container registry is `https://ghcr.io`.

```toml
server = "https://ghcr.io"

[host."http://127.0.0.1:4001"]
capabilities = ["pull", "resolve"]

[host."http://127.0.0.1:4001".header]
X-Dragonfly-Registry = "https://ghcr.io"
```

Restart containerd:

```shell
systemctl restart containerd
```

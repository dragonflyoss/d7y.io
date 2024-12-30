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
$ helm install --wait --create-namespace --namespace dragonfly-system dragonfly dragonfly/dragonfly -f values.yaml
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
  2024-04-19T02:44:09.259458Z  INFO
  "download_task":"dragonfly-client/src/grpc/dfdaemon_download.rs:276":: "download task succeeded"
  "host_id": "172.18.0.3-kind-worker",
  "task_id": "a46de92fcb9430049cf9e61e267e1c3c9db1f1aa4a8680a048949b06adb625a5",
  "peer_id": "172.18.0.3-kind-worker-86e48d67-1653-4571-bf01-7e0c9a0a119d"
}
```

## More configurations {#more-configurations}

### Multiple Registries {#multiple-registries}

**Method 1**: Deploy using Helm Charts and create the Helm Charts configuration file `values.yaml`.
Please refer to the [configuration](https://artifacthub.io/packages/helm/dragonfly/dragonfly#values) documentation for details.

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

**Method 2**: Modify your `config.toml` (default location: `/etc/containerd/config.toml`), refer to [registry-configuration-examples](https://github.com/containerd/containerd/blob/main/docs/hosts.md#registry-configuration---examples).

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

### Private project {#private-project}

Deploy using Helm Charts and create the Helm Charts configuration file `values.yaml`.
Please refer to the [configuration](https://artifacthub.io/packages/helm/dragonfly/dragonfly#values) documentation for details.

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
        containerd:
          configPath: /etc/containerd/config.toml
          registries:
            - hostNamespace: your_private_registry_host_addr
              serverAddr: your_private_registry_server_addr
              capabilities: ['pull', 'resolve']
```

Modify your `config.toml` (default location: `/etc/containerd/config.toml`), refer to [configure-registry-credentials](https://github.com/containerd/containerd/blob/v1.5.2/docs/cri/registry.md#configure-registry-credentials).

> Notice：`your_private_registry_host_addr` is your private registry host address.

```toml
[plugins."io.containerd.grpc.v1.cri".registry.configs."your_private_registry_host_addr".auth]
  username = "your_private_registry_username"
  password = "your_private_registry_password"
  auth = "your_private_registry_token"
[plugins."io.containerd.grpc.v1.cri".registry.configs."127.0.0.1:4001".auth]
  username = "your_private_registry_username"
  password = "your_private_registry_password"
  auth = "your_private_registry_token"
```

Restart containerd:

```shell
systemctl restart containerd
```

### Container Registry using self-signed certificates

Use Harbor as an example of a container registry using self-signed certificates.
Harbor generates self-signed certificate, refer to [Harbor](https://goharbor.io/docs/2.11.0/install-config/configure-https/).

#### Install Dragonfly with Helm Charts

##### Create self-signed certificate secret for Seed Peer

Create seed client secret configuration file `seed-client-secret.yaml`, configuration content is as follows:

> Notice: yourdomain.crt is Harbor's ca.crt.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: seed-client-secret
  namespace: dragonfly-system
type: Opaque
data:
  # the data is abbreviated in this example.
  yourdomain.crt: |
    MIIFwTCCA6mgAwIBAgIUdgmYyNCw4t+Lp/...
```

Create the secret through the following command:

```shell
kubectl apply -f seed-client-secret.yaml
```

##### Create self-signed certificate secret for Peer

Create client secret configuration file `client-secret.yaml`, configuration content is as follows:

> Notice: yourdomain.crt is Harbor's ca.crt.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: client-secret
  namespace: dragonfly-system
type: Opaque
data:
  # the data is abbreviated in this example.
  yourdomain.crt: |
    MIIFwTCCA6mgAwIBAgIUdgmYyNCw4t+Lp/...
```

Create the secret through the following command:

```shell
kubectl apply -f client-secret.yaml
```

##### Create Dragonfly cluster based on helm charts {#harbor-create-dragonfly-cluster-based-on-helm-charts}

Create helm charts configuration file `values.yaml`, configuration content is as follows:

- Support preheating for harbor with self-signed certificates,
  you need to change the `manager.config.job.preheat.tls` configuration,
  `/etc/certs/yourdomain.crt` is the harbor self-signed certificate configuration file.
  If you want to bypass TLS verification, please set `insecureSkipVerify` to `true`.

- Support dragonfly as registry of containerd for harbor with self-signed certificates,
  you need to change the `client.config.proxy.registryMirror` configuration and
  `seedClient.config.proxy.registryMirror` configuration,
  `https://yourdomain.com` is the harbor service address,
  `/etc/certs/yourdomain.crt` is the harbor self-signed certificate configuration file.

- Set the configuration of the containerd for harbor with self-signed certificates,
  you need to change the `client.dfinit.config.containerRuntime.containerd.registries` configuration,
  `yourdomain.com` is harbor registry host address, `https://yourdomain.com` is the Harbor service address.
  If you want to bypass TLS verification, please set `skipVerify` to `true`.

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
    job:
      preheat:
        tls:
          insecureSkipVerify: false
          caCert: /etc/certs/yourdomain.crt
  extraVolumes:
    - name: client-secret
      secret:
        secretName: client-secret
  extraVolumeMounts:
    - name: client-secret
      mountPath: /etc/certs

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
      registryMirror:
        addr: https://yourdomain.com
        cert: /etc/certs/yourdomain.crt
  extraVolumes:
    - name: seed-client-secret
      secret:
        secretName: seed-client-secret
  extraVolumeMounts:
    - name: seed-client-secret
      mountPath: /etc/certs

client:
  image:
    repository: dragonflyoss/client
    tag: latest
  metrics:
    enable: true
  config:
    verbose: true
    proxy:
      registryMirror:
        addr: https://yourdomain.com
        cert: /etc/certs/yourdomain.crt
  extraVolumes:
    - name: client-secret
      secret:
        secretName: client-secret
  extraVolumeMounts:
    - name: client-secret
      mountPath: /etc/certs
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
            - hostNamespace: yourdomain.com
              serverAddr: https://yourdomain.com
              capabilities: ['pull', 'resolve']
              skipVerify: true
```

#### Install Dragonfly with Binaries

Copy Harbor's ca.crt file to `/etc/certs/yourdomain.crt`.

```shell
cp ca.crt /etc/certs/yourdomain.crt
```

Install Dragonfly with Binaries, refer to [Binaries](../../../getting-started/installation/binaries.md).

##### Setup Manager and configure self-signed certificate

To support preheating for harbor with self-signed certificates, the Manager configuration needs to be modified.

Configure `manager.yaml`, the default path is `/etc/dragonfly/manager.yaml`,
refer to [manager config](../../../reference/configuration/manager.md).

> Notice: `yourdomain.crt` is Harbor's ca.crt.

```shell
job:
  # Preheat configuration.
  preheat:
    tls:
      # insecureSkipVerify controls whether a client verifies the server's certificate chain and hostname.
      insecureSkipVerify: false
      # # caCert is the CA certificate for preheat tls handshake, it can be path or PEM format string.
      caCert: /etc/certs/yourdomain.crt
```

Skip TLS verification, set `job.preheat.tls.insecureSkipVerify` to true.

```shell
job:
  # Preheat configuration.
  preheat:
    tls:
      # insecureSkipVerify controls whether a client verifies the server's certificate chain and hostname.
      insecureSkipVerify: true
      # # caCert is the CA certificate for preheat tls handshake, it can be path or PEM format string.
      # caCert: ''
```

##### Setup Dfdaemon as Seed Peer and configure self-signed certificate

Configure `dfdaemon.yaml`, the default path is `/etc/dragonfly/dfdaemon.yaml`,
refer to [dfdaemon config](../../../reference/configuration/client/dfdaemon.md).

```shell
manager:
  addr: http://dragonfly-manager:65003
seedPeer:
  enable: true
  type: super
  clusterID: 1
proxy:
  registryMirror:
    # addr is the default address of the registry mirror. Proxy will start a registry mirror service for the
    # client to pull the image. The client can use the default address of the registry mirror in
    # configuration to pull the image. The `X-Dragonfly-Registry` header can instead of the default address
    # of registry mirror.
    addr: https://yourdomain.com
    ## cert is the client cert path with PEM format for the registry.
    ## If registry use self-signed cert, the client should set the
    ## cert for the registry mirror.
    cert: /etc/certs/yourdomain.crt
```

##### Setup Dfdaemon as Peer and configure self-signed certificate

Configure `dfdaemon.yaml`, the default path is `/etc/dragonfly/dfdaemon.yaml`,
refer to [dfdaemon config](../../../reference/configuration/client/dfdaemon.md).

```shell
manager:
  addr: http://dragonfly-manager:65003
proxy:
  registryMirror:
    # addr is the default address of the registry mirror. Proxy will start a registry mirror service for the
    # client to pull the image. The client can use the default address of the registry mirror in
    # configuration to pull the image. The `X-Dragonfly-Registry` header can instead of the default address
    # of registry mirror.
    addr: https://yourdomain.com
    ## cert is the client cert path with PEM format for the registry.
    ## If registry use self-signed cert, the client should set the
    ## cert for the registry mirror.
    cert: /etc/certs/yourdomain.crt
```

##### Configure containerd self-signed certificate

Modify your `config.toml` (default location: `/etc/containerd/config.toml`), refer to [registry-configuration-examples](https://github.com/containerd/containerd/blob/main/docs/hosts.md#registry-configuration---examples).

> Notice: config_path is the path where containerd looks for registry configuration files.

```toml
# explicitly use v2 config format
version = 2

[plugins."io.containerd.grpc.v1.cri".registry]
  config_path = "/etc/containerd/certs.d"
```

Create the registry configuration file `/etc/containerd/certs.d/yourdomain.com/hosts.toml`:

> Notice: `https://yourdomain.com` is the Harbor service address.

```toml
server = "https://yourdomain.com"

[host."http://127.0.0.1:4001"]
capabilities = ["pull", "resolve"]
ca = "/etc/certs/yourdomain.crt"

[host."http://127.0.0.1:4001".header]
X-Dragonfly-Registry = "https://yourdomain.com"
```

To bypass the TLS verification for a private registry at `yourdomain.com`.

```toml
server = "https://yourdomain.com"

[host."http://127.0.0.1:4001"]
capabilities = ["pull", "resolve"]
skip_verify = true

[host."http://127.0.0.1:4001".header]
X-Dragonfly-Registry = "https://yourdomain.com"
```

Restart containerd:

```shell
systemctl restart containerd
```

#### containerd downloads harbor images through Dragonfly

```shell
crictl pull yourdomain.com/alpine:3.19
```

---
id: cri-o
title: CRI-O
slug: /operations/integrations/container-runtime/cri-o/
---

Documentation for setting Dragonfly's container runtime to CRI-O.

## Prerequisites {#prerequisites}

| Name               | Version | Document                                |
| ------------------ | ------- | --------------------------------------- |
| Kubernetes cluster | 1.20+   | [kubernetes.io](https://kubernetes.io/) |
| Helm               | v3.8.0+ | [helm.sh](https://helm.sh/)             |
| CRI-O              | v1.5.0+ | [cri-o.io](https://cri-o.io/)           |

## Quick Start {#quick-start}

### Setup kubernetes cluster {#setup-kubernetes-cluster}

[Minikube](https://minikube.sigs.k8s.io/docs) is recommended if no Kubernetes cluster is available for testing.

Create a Minikube cluster.

```shell
minikube start --container-runtime=cri-o
```

Switch the context of kubectl to minikube cluster:

```shell
kubectl config use-context minikube
```

### Minikube loads Dragonfly image {#minikube-loads-dragonfly-image}

Pull Dragonfly latest images:

```shell
docker pull dragonflyoss/scheduler:latest
docker pull dragonflyoss/manager:latest
docker pull dragonflyoss/client:latest
docker pull dragonflyoss/dfinit:latest
```

Minikube cluster loads Dragonfly latest images:

```shell
minikube image load dragonflyoss/scheduler:latest
minikube image load dragonflyoss/manager:latest
minikube image load dragonflyoss/client:latest
minikube image load dragonflyoss/dfinit:latest
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
        containerd: null
        crio:
          configPath: /etc/containers/registries.conf
          unqualifiedSearchRegistries: ['registry.fedoraproject.org', 'registry.access.redhat.com', 'docker.io']
          registries:
            - prefix: docker.io
              location: docker.io
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

### CRI-O downloads images through Dragonfly {#crio-downloads-images-through-dragonfly}

Pull `alpine:3.19` image in minikube node:

```shell
docker exec -i minikube /usr/bin/crictl pull alpine:3.19
```

#### Verify {#verify}

You can execute the following command to check if the `alpine:3.19` image is distributed via Dragonfly.

<!-- markdownlint-disable -->

```shell
# Find pod name.
export POD_NAME=$(kubectl get pods --namespace dragonfly-system -l "app=dragonfly,release=dragonfly,component=client" -o=jsonpath='{.items[?(@.spec.nodeName=="minikube")].metadata.name}' | head -n 1 )

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
  "host_id": "172.18.0.3-minikube",
  "task_id": "a46de92fcb9430049cf9e61e267e1c3c9db1f1aa4a8680a048949b06adb625a5",
  "peer_id": "172.18.0.3-minikube-86e48d67-1653-4571-bf01-7e0c9a0a119d"
}
```

## More configurations

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
  you need to change the `client.dfinit.config.containerRuntime.crio.registries` configuration,
  `yourdomain.com` is the harbor registry host address. CRI-O skips TLS verification by default (no certificate required).

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
        containerd: null
        crio:
          configPath: /etc/containers/registries.conf
          unqualifiedSearchRegistries: ['registry.fedoraproject.org', 'registry.access.redhat.com', 'docker.io']
          registries:
            - prefix: yourdomain.com
              location: yourdomain.com
```

#### Install Dragonfly with Binaries

Copy Harbor's ca.crt file to `/etc/containers/certs.d/yourdomain.crt`.

```shell
cp ca.crt /etc/containers/certs.d/yourdomain.crt
```

Install Dragonfly with Binaries, refer to [Binaries](../../../getting-started/installation/binaries.md).

##### Setup Manager and configure self-signed certificate

To support preheating for harbor with self-signed certificates, the Manager configuration needs to be modified.

Configure Manager yaml file, The default path in Linux is `/etc/dragonfly/manager.yaml` in linux,
refer to [Manager](../../../reference/configuration/manager.md).

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

Configure Dfdaemon yaml file, The default path in Linux is `/etc/dragonfly/dfdaemon.yaml` in linux,
refer to [Dfdaemon](../../../reference/configuration/client/dfdaemon.md).

```shell
manager:
  addrs:
    - http://dragonfly-manager:65003
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

Configure Dfdaemon yaml file, The default path in Linux is `/etc/dragonfly/dfdaemon.yaml` in linux,
refer to [Dfdaemon](../../../reference/configuration/client/dfdaemon.md).

```shell
manager:
  addrs:
    - http://dragonfly-manager:65003
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

##### Configure CRI-O self-signed certificate

A custom TLS configuration for a container registry can be configured by creating a directory under `/etc/containers/certs.d`.
The name of the directory must correspond to the host:port of the registry (e.g., yourdomain.com:port),
refer to [containers-certs.d](https://github.com/containers/image/blob/main/docs/containers-certs.d.5.md).

```shell
cp yourdomain.com.cert /etc/containers/certs.d/yourdomain.com/
cp yourdomain.com.key /etc/containers/certs.d/yourdomain.com/
cp ca.crt /etc/containers/certs.d/yourdomain.com/
```

The following example illustrates a configuration that uses custom certificates.

```shell
/etc/containers/certs.d/    <- Certificate directory
└── yourdomain.com:port     <- Hostname:port
   ├── yourdomain.com.cert  <- Harbor certificate
   ├── yourdomain.com.key   <- Harbor key
   └── ca.crt               <- Certificate authority that signed the registry certificate
```

Modify your `registries.conf` (default location: `/etc/containers/registries.conf`), refer to [containers-registries.conf](https://github.com/containers/image/blob/main/docs/containers-registries.conf.5.md).

> Notice: `yourdomain.com` is the Harbor service address.

```toml
[[registry]]
prefix = "yourdomain.com"
location = "yourdomain.com"

[[registry.mirror]]
location = "127.0.0.1:4001"
```

To bypass the TLS verification for a private registry at `yourdomain.com`.

```toml
[[registry]]
prefix = "yourdomain.com"
location = "yourdomain.com"

[[registry.mirror]]
insecure = true
location = "127.0.0.1:4001"
```

Restart crio:

```shell
systemctl restart crio
```

#### CRI-O downloads harbor images through Dragonfly

```shell
crictl pull yourdomain.com/alpine:3.19
```

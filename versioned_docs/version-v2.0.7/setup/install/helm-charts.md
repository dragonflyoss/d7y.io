---
id: helm-charts
title: Helm Charts
---

Now we can deploy all components of Dragonfly in
Kubernetes cluster. We deploy scheduler and seed peer as `StatefulSets`,
daemon as `DaemonSets`, manager as `Deployments`.

## Prerequisites

- Kubernetes cluster 1.20+
- Helm v3.8.0+

## Runtime Configuration Guide for Dragonfly Helm Chart {#runtime-configuration-guide-for-dragonfly-helm-chart}

When enable runtime configuration in dragonfly,
you can skip [Configure Runtime](#configure-runtime-manually) manually.

### 1. Docker {#1-docker}

> **We did not recommend to using dragonfly
> with docker in Kubernetes**
> due to many reasons:
> no fallback image pulling policy.
> deprecated in Kubernetes.
> Because the original `daemonset` in
> Kubernetes did not support `Surging Rolling Update` policy.
> When kill current dfdaemon pod,
> the new pod image can not be pulled anymore.
> If you can not change runtime from docker to others,
> remind to choose a plan when upgrade dfdaemon:
> pull newly dfdaemon image manually before upgrade dragonfly,
> or use [ImagePullJob](https://openkruise.io/docs/user-manuals/imagepulljob) to
> pull image automate.
> keep the image registry of dragonfly is
> different from common registries and add host in `containerRuntime.docker.skipHosts`.

Dragonfly helm supports config docker automatically.

Config cases:

#### Case 1: [Preferred] Implicit registries support without restart docker {#case-1-preferred-implicit-registries-support-without-restart-docker}

Chart customize values.yaml:

<!-- markdownlint-disable -->

```yaml
containerRuntime:
  docker:
    enable: true
    # -- Inject domains into /etc/hosts to force redirect traffic to dfdaemon.
    # Caution: This feature need dfdaemon to implement SNI Proxy, confirm image tag is greater than v2.0.0.
    # When use certs and inject hosts in docker, no necessary to restart docker daemon.
    injectHosts: true
    registryDomains:
      - 'harbor.example.com'
      - 'harbor.example.net'
```

<!-- markdownlint-restore -->

This config enables docker pulling images from
registries `harbor.example.com` and `harbor.example.net` via Dragonfly.
When deploying Dragonfly with above config,
it's unnecessary to restart docker daemon.

Advantages:

- Support upgrade dfdaemon smoothness

> In this mode, when dfdaemon pod deleted,
> the `preStop` hook will remove all injected hosts info in /etc/hosts,
> all images traffic fallbacks to original registries.

Limitations:

- Only support implicit registries

#### Case 2: Arbitrary registries support with restart docker {#case-2-arbitrary-registries-support-with-restart-docker}

Chart customize values.yaml:

<!-- markdownlint-disable -->

```yaml
containerRuntime:
  docker:
    enable: true
    # -- Restart docker daemon to redirect traffic to dfdaemon
    # When containerRuntime.docker.restart=true, containerRuntime.docker.injectHosts and containerRuntime.registry.domains is ignored.
    # If did not want restart docker daemon, keep containerRuntime.docker.restart=false and containerRuntime.docker.injectHosts=true.
    restart: true
    skipHosts:
      - '127.0.0.1'
      - 'docker.io' # Dragonfly use this image registry to upgrade itself, so we need skip it. Change it in real environment.
```

<!-- markdownlint-restore -->

This config enables docker pulling images from arbitrary registries via Dragonfly.
When deploying Dragonfly with above config, dfdaemon will restart docker daemon.

Advantages:

- Support arbitrary registries

Limitations:

- Must enable live-restore feature in docker
- Need restart docker daemon
- When upgrade dfdaemon, new image must be pulled beforehand.

### 2. Containerd {#2-containerd}

The config of containerd has two version with complicated fields.
These are many cases to consider:

#### Case 1: Version 2 config with config_path {#case-1-version-2-config-with-config_path}

There is `config_path` in `/etc/containerd/config.toml`:

```toml
[plugins."io.containerd.grpc.v1.cri".registry]
  config_path = "/etc/containerd/certs.d"
```

This case is very simple to enable multiple registry mirrors support.

Chart customize values.yaml:

```yaml
containerRuntime:
  containerd:
    enable: true
```

#### Case 2: Version 2 config without config_path {#case-2-version-2-config-without-config_path}

- Option 1 - Allow charts to inject config_path and restart containerd.

  This option also enable multiple registry mirrors support.

  > Caution: if there are already many other mirror config in config.toml,
  > should not use this option, or migrate your config with `config_path`.

  Chart customize values.yaml:

  ```yaml
  containerRuntime:
    containerd:
      enable: true
      injectConfigPath: true
  ```

- Option 2 - Just mirror only one registry
  which `dfdaemon.config.proxy.registryMirror.url` is Chart customize values.yaml:

  ```yaml
  containerRuntime:
    containerd:
      enable: true
  ```

#### Case 3: Version 1 {#case-3-version-1}

With version 1 config.toml, only support
the registry which `dfdaemon.config.proxy.registryMirror.url` is.

Chart customize values.yaml:

```yaml
containerRuntime:
  containerd:
    enable: true
```

### 3. [WIP] CRI-O {#3-wip-cri-o}

> DON'T USE, Work in progress

Dragonfly helm supports config CRI-O automatically with drop-in registries.

Chart customize values.yaml:

```yaml
containerRuntime:
  crio:
    # -- Enable CRI-O support
    # Inject drop-in mirror config into /etc/containers/registries.conf.d.
    enable: true
    # Registries full urls
    registries:
      - 'https://ghcr.io'
      - 'https://quay.io'
      - 'https://harbor.example.com:8443'
```

## Prepare Kubernetes Cluster {#prepare-kubernetes-cluster}

If there is no available Kubernetes cluster for testing,
[minikube](https://minikube.sigs.k8s.io/docs/start/) is
recommended. Just run `minikube start`.

## Install Dragonfly {#install-dragonfly}

### Install with default configuration {#install-with-default-configuration}

```shell
helm repo add dragonfly https://dragonflyoss.github.io/helm-charts/
helm install --create-namespace --namespace dragonfly-system --version 0.8.3 dragonfly dragonfly/dragonfly
```

### Install with custom configuration {#install-with-custom-configuration}

Create the `values.yaml` configuration file.
It is recommended to use external redis and mysql instead of containers.

The example uses external mysql and redis.
Refer to the document for
[configuration](https://artifacthub.io/packages/helm/dragonfly/dragonfly#values).

```yaml
mysql:
  enable: false

externalMysql:
  migrate: true
  host: mysql-host
  username: dragonfly
  password: dragonfly
  database: manager
  port: 3306

redis:
  enable: false

externalRedis:
  host: redis-host
  password: dragonfly
  port: 6379
```

Install dragonfly with `values.yaml`.

```shell
helm repo add dragonfly https://dragonflyoss.github.io/helm-charts/
helm install --create-namespace --namespace dragonfly-system --version 0.8.3 \
    dragonfly dragonfly/dragonfly -f values.yaml
```

### Install with an existing manager {#install-with-an-existing-manager}

Create the `values.yaml` configuration file.
Need to configure the cluster id associated with scheduler and seed peer.

The example is to deploy a cluster using the existing manager and redis.
Refer to the document for [configuration](https://artifacthub.io/packages/helm/dragonfly/dragonfly#values).

```yaml
scheduler:
  config:
    manager:
      schedulerClusterID: 1

seedPeer:
  config:
    scheduler:
      manager:
        seedPeer:
          clusterID: 1

manager:
  enable: false

externalManager:
  enable: true
  host: 'dragonfly-manager.dragonfly-system.svc.cluster.local'
  restPort: 8080
  grpcPort: 65003

redis:
  enable: false

externalRedis:
  host: redis-host
  password: dragonfly
  port: 6379

mysql:
  enable: false
```

## Wait Dragonfly Ready {#wait-dragonfly-ready}

Wait all pods running

```shell
kubectl -n dragonfly-system wait --for=condition=ready --all --timeout=10m pod
```

## Manager Console {#manager-console}

The console page will be displayed on `dragonfly-manager.dragonfly-system.svc.cluster.local:8080`.

If you need to bind Ingress, you can refer to
[configuration options](https://artifacthub.io/packages/helm/dragonfly/dragonfly#values)
of Helm Charts, or create it manually.

Console features preview reference document [console preview](../../reference/manage-console.md).

## Configure Runtime Manually {#configure-runtime-manually}

Use Containerd with CRI as example, more runtimes can be found [here](../../getting-started/quick-start/kubernetes.md)

> This example is for single registry, multiple registries configuration is [here](../../setup/runtime/containerd.md)

For private registry:

```toml
# explicitly use v2 config format, if already v2, skip the "version = 2"
version = 2
[plugins."io.containerd.grpc.v1.cri".registry.mirrors."harbor.example.com"]
endpoint = ["http://127.0.0.1:65001", "https://harbor.example.com"]
```

For docker public registry:

```toml
# explicitly use v2 config format, if already v2, skip the "version = 2"
version = 2
[plugins."io.containerd.grpc.v1.cri".registry.mirrors."docker.io"]
endpoint = ["http://127.0.0.1:65001", "https://index.docker.io"]
```

Add above config to `/etc/containerd/config.toml` and restart Containerd

```shell
systemctl restart containerd
```

## Using Dragonfly {#using-dragonfly}

After all above steps, create a new pod with
target registry. Or just pull an image with `crictl`:

```shell
crictl harbor.example.com/library/alpine:latest
```

```shell
crictl pull docker.io/library/alpine:latest
```

After pulled images, find logs in dfdaemon pod:

```shell
# find pods
kubectl -n dragonfly-system get pod -l component=dfdaemon
# find logs
pod_name=dfdaemon-xxxxx
kubectl -n dragonfly-system exec -it ${pod_name} -- grep "peer task done" /var/log/dragonfly/daemon/core.log
```

Example output:

```shell
{
   "level":"info",
   "ts":"2022-09-07 12:04:26.485",
   "caller":"peer/peertask_conductor.go:1500",
   "msg":"peer task done, cost: 1ms",
   "peer":"10.140.2.175-5184-1eab18b6-bead-4b9f-b055-6c1120a30a33",
   "task":"b423e11ddb7ab19a3c2c4c98e5ab3b1699a597e974c737bb4004edeef6016ed2",
   "component":"PeerTask"
}
```

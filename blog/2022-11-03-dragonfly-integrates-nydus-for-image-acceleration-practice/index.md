---
title: Dragonfly integrates nydus for image acceleration practive
author: Gaius
author_title: Dragonfly Maintainer
author_url: https://github.com/gaius-qi
author_image_url: https://avatars.githubusercontent.com/u/15955374?s=96&v=4
tags: [dragonfly, container image, OCI, nydus, containerd, cncf]
description: Introduce how dragonfly integrates nydus to improve image download speed.
hide_table_of_contents: false
---

## Introduce definition {#introduce-definition}

[Dragonfly](https://d7y.io/) has been selected and put into production use by
many Internet companies since its open source in 2017,
and entered CNCF in October 2018, becoming the third project in China to enter the CNCF Sandbox. In April 2020,
CNCF TOC voted to accept Dragonfly as an CNCF Incubating project.
Dragonfly has developed the next version through production practice,
which has absorbed the advantages of Dragonfly1.x and made a lot of optimizations for known problems.

[Nydus](https://nydus.dev/) optimized the OCIv1 image format, and designed a brand new image-based filesystem,
so that the container can download the image on demand, and the container no longer needs to
download the complete image to start the container. In the latest version,
dragonfly has completed the integration with the nydus, allowing the container to
start downloading images on demand, reducing the amount of downloads. The dragonfly P2P transmission method can
also be used during the transmission process to reduce the back-to-source traffic and increase the speed.

## Quick start {#quick-start}

### Prerequisites {#prerequisites}

<!-- markdownlint-disable -->

| Name               | Version | Document                                                    |
| ------------------ | ------- | ----------------------------------------------------------- |
| Kubernetes cluster | 1.20+   | [kubernetes.io](https://kubernetes.io/)                     |
| Helm               | 3.8.0+  | [helm.sh](https://helm.sh/)                                 |
| Containerd         | v1.4.3+ | [containerd.io](https://containerd.io/)                     |
| Nerdctl            | 0.22+   | [containerd/nerdctl](https://github.com/containerd/nerdctl) |

**Notice:** [Kind](https://kind.sigs.k8s.io/) is recommended if no kubernetes cluster is available for testing.

<!-- markdownlint-restore -->

### Install dragonfly {#install-dragonfly}

For detailed installation documentation based on kubernetes cluster, please refer to [quick-start-kubernetes](https://d7y.io/docs/getting-started/quick-start/kubernetes/).

### Setup kubernetes cluster {#setup-kubernetes-cluster}

Create kind multi-node cluster configuration file `kind-config.yaml`, configuration content is as follows:

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
  - role: control-plane
  - role: worker
    extraPortMappings:
      - containerPort: 30950
        hostPort: 65001
      - containerPort: 30951
        hostPort: 40901
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

### Kind loads dragonfly image {#kind-loads-dragonfly-image}

Pull dragonfly latest images:

```shell
docker pull dragonflyoss/scheduler:latest
docker pull dragonflyoss/manager:latest
docker pull dragonflyoss/dfdaemon:latest
```

Kind cluster loads dragonfly latest images:

```shell
kind load docker-image dragonflyoss/scheduler:latest
kind load docker-image dragonflyoss/manager:latest
kind load docker-image dragonflyoss/dfdaemon:latest
```

### Create dragonfly cluster based on helm charts {#create-dragonfly-cluster-based-on-helm-charts}

Create helm charts configuration file `charts-config.yaml` and enable prefetching, configuration content is as follows:

```yaml
scheduler:
  replicas: 1
  metrics:
    enable: true
  config:
    verbose: true
    pprofPort: 18066

seedPeer:
  replicas: 1
  metrics:
    enable: true
  config:
    verbose: true
    pprofPort: 18066
    download:
      prefetch: true

dfdaemon:
  hostNetwork: true
  metrics:
    enable: true
  config:
    verbose: true
    pprofPort: 18066
    download:
      prefetch: true
    proxy:
      defaultFilter: 'Expires&Signature&ns'
      security:
        insecure: true
      tcpListen:
        listen: 0.0.0.0
        port: 65001
      registryMirror:
        dynamic: true
        url: https://index.docker.io
      proxies:
        - regx: blobs/sha256.*

manager:
  replicas: 1
  metrics:
    enable: true
  config:
    verbose: true
    pprofPort: 18066
```

Create a dragonfly cluster using the configuration file:

<!-- markdownlint-disable -->

```shell
$ helm repo add dragonfly https://dragonflyoss.github.io/helm-charts/
$ helm install --wait --create-namespace --namespace dragonfly-system dragonfly dragonfly/dragonfly -f charts-config.yaml
NAME: dragonfly
LAST DEPLOYED: Wed Oct 19 04:23:22 2022
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

Check that dragonfly is deployed successfully:

```shell
$ kubectl get po -n dragonfly-system
NAME                                 READY   STATUS    RESTARTS       AGE
dragonfly-dfdaemon-rhnr6             1/1     Running   4 (101s ago)   3m27s
dragonfly-dfdaemon-s6sv5             1/1     Running   5 (111s ago)   3m27s
dragonfly-manager-67f97d7986-8dgn8   1/1     Running   0              3m27s
dragonfly-mysql-0                    1/1     Running   0              3m27s
dragonfly-redis-master-0             1/1     Running   0              3m27s
dragonfly-redis-replicas-0           1/1     Running   1 (115s ago)   3m27s
dragonfly-redis-replicas-1           1/1     Running   0              95s
dragonfly-redis-replicas-2           1/1     Running   0              70s
dragonfly-scheduler-0                1/1     Running   0              3m27s
dragonfly-seed-peer-0                1/1     Running   2 (95s ago)    3m27s
```

Create peer service configuration file `peer-service-config.yaml`, configuration content is as follows:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: peer
  namespace: dragonfly-system
spec:
  type: NodePort
  ports:
    - name: http-65001
      nodePort: 30950
      port: 65001
    - name: http-40901
      nodePort: 30951
      port: 40901
  selector:
    app: dragonfly
    component: dfdaemon
    release: dragonfly
```

Create a peer service using the configuration file:

```shell
kubectl apply -f peer-service-config.yaml
```

### Install nydus for containerd {#install-nydus-for-containerd}

For detailed nydus installation documentation based on containerd environment, please refer to
[nydus-setup-for-containerd-environment](https://github.com/dragonflyoss/image-service/blob/master/docs/containerd-env-setup.md#nydus-setup-for-containerd-environment).
The example uses Systemd to manage the `nydus-snapshotter` service.

#### Install nydus tools {#install-nydus-tools}

Download `containerd-nydus-grpc` binary, please refer to [nydus-snapshotter/releases](https://github.com/containerd/nydus-snapshotter/releases/latest):

```shell
NYDUS_SNAPSHOTTER_VERSION=0.3.3
wget https://github.com/containerd/nydus-snapshotter/releases/download/v$NYDUS_SNAPSHOTTER_VERSION/nydus-snapshotter-v$NYDUS_SNAPSHOTTER_VERSION-x86_64.tgz
tar zxvf nydus-snapshotter-v$NYDUS_SNAPSHOTTER_VERSION-x86_64.tgz
```

Install `containerd-nydus-grpc` tool:

```shell
sudo cp nydus-snapshotter/containerd-nydus-grpc /usr/local/bin/
```

Download `nydus-image`, `nydusd` and `nydusify` binaries, please refer to [dragonflyoss/image-service](https://github.com/dragonflyoss/image-service/releases/latest):

```shell
NYDUS_VERSION=2.1.1
wget https://github.com/dragonflyoss/image-service/releases/download/v$NYDUS_VERSION/nydus-static-v$NYDUS_VERSION-linux-amd64.tgz
tar zxvf nydus-static-v$NYDUS_VERSION-linux-amd64.tgz
```

Install `nydus-image`, `nydusd` and `nydusify` tools:

```shell
sudo cp nydus-static/nydus-image nydus-static/nydusd nydus-static/nydusify /usr/local/bin/
```

#### Install nydus snapshotter plugin for containerd {#install-nydus-snapshotter-plugin-for-containerd}

Configure containerd to use the `nydus-snapshotter` plugin, please refer to
[configure-and-start-containerd](https://github.com/dragonflyoss/image-service/blob/master/docs/containerd-env-setup.md#configure-and-start-containerd).

`127.0.0.1:65001` is the proxy address of dragonfly peer,
and the `X-Dragonfly-Registry` header is the address of origin registry,
which is provided for dragonfly to download the images.

Change configuration of containerd in `/etc/containerd/config.toml`:

```toml
[proxy_plugins]
  [proxy_plugins.nydus]
    type = "snapshot"
    address = "/run/containerd-nydus/containerd-nydus-grpc.sock"

[plugins.cri]
  [plugins.cri.containerd]
    snapshotter = "nydus"
    disable_snapshot_annotations = false
```

Restart containerd service:

```shell
sudo systemctl restart containerd
```

Check that containerd uses the `nydus-snapshotter` plugin:

```shell
$ ctr -a /run/containerd/containerd.sock plugin ls | grep nydus
io.containerd.snapshotter.v1          nydus                    -              ok
```

#### Systemd starts nydus snapshotter service {#systemd-starts-snapshotter-service}

For detailed configuration documentation based on nydus mirror mode, please refer to
[enable-mirrors-for-storage-backend](https://github.com/dragonflyoss/image-service/blob/master/docs/nydusd.md#enable-mirrors-for-storage-backend).

Create nydusd configuration file `nydusd-config.json`, configuration content is as follows:

```json
{
  "device": {
    "backend": {
      "type": "registry",
      "config": {
        "mirrors": [
          {
            "host": "http://127.0.0.1:65001",
            "auth_through": false,
            "headers": {
              "X-Dragonfly-Registry": "https://index.docker.io"
            },
            "ping_url": "http://127.0.0.1:40901/server/ping"
          }
        ],
        "scheme": "https",
        "skip_verify": false,
        "timeout": 10,
        "connect_timeout": 10,
        "retry_limit": 2
      }
    },
    "cache": {
      "type": "blobcache",
      "config": {
        "work_dir": "/var/lib/nydus/cache/"
      }
    }
  },
  "mode": "direct",
  "digest_validate": false,
  "iostats_files": false,
  "enable_xattr": true,
  "fs_prefetch": {
    "enable": true,
    "threads_count": 10,
    "merging_size": 131072,
    "bandwidth_rate": 1048576
  }
}
```

Copy configuration file to `/etc/nydus/config.json`:

```shell
sudo mkdir /etc/nydus && cp nydusd-config.json /etc/nydus/config.json
```

Create systemd configuration file `nydus-snapshotter.service` of nydus snapshotter, configuration content is as follows:

```text
[Unit]
Description=nydus snapshotter
After=network.target
Before=containerd.service

[Service]
Type=simple
Environment=HOME=/root
ExecStart=/usr/local/bin/containerd-nydus-grpc --config-path /etc/nydus/config.json
Restart=always
RestartSec=1
KillMode=process
OOMScoreAdjust=-999
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

Copy configuration file to `/etc/systemd/system/`:

```shell
sudo cp nydus-snapshotter.service /etc/systemd/system/
```

Systemd starts nydus snapshotter service:

<!-- markdownlint-disable -->

```shell
$ sudo systemctl enable nydus-snapshotter
$ sudo systemctl start nydus-snapshotter
$ sudo systemctl status nydus-snapshotter
● nydus-snapshotter.service - nydus snapshotter
     Loaded: loaded (/etc/systemd/system/nydus-snapshotter.service; enabled; vendor preset: enabled)
     Active: active (running) since Wed 2022-10-19 08:01:00 UTC; 2s ago
   Main PID: 2853636 (containerd-nydu)
      Tasks: 9 (limit: 37574)
     Memory: 4.6M
        CPU: 20ms
     CGroup: /system.slice/nydus-snapshotter.service
             └─2853636 /usr/local/bin/containerd-nydus-grpc --config-path /etc/nydus/config.json

Oct 19 08:01:00 kvm-gaius-0 systemd[1]: Started nydus snapshotter.
Oct 19 08:01:00 kvm-gaius-0 containerd-nydus-grpc[2853636]: time="2022-10-19T08:01:00.493700269Z" level=info msg="gc goroutine start..."
Oct 19 08:01:00 kvm-gaius-0 containerd-nydus-grpc[2853636]: time="2022-10-19T08:01:00.493947264Z" level=info msg="found 0 daemons running"
```

<!-- markdownlint-restore -->

#### Convert an image to nydus format {#convert-an-image-to-nydus-format}

Convert `python:3.9.15` image to nydus format, you can use
the converted `dragonflyoss/python:3.9.15-nydus` image and skip this step.
Conversion tool can use [nydusify](https://github.com/dragonflyoss/image-service/blob/master/docs/nydusify.md) and [acceld](https://github.com/goharbor/acceleration-service).

Login to Dockerhub:

```shell
docker login
```

Convert `python:3.9.15` image to nydus format, and `DOCKERHUB_REPO_NAME` environment variable
needs to be set to the user's image repository:

```shell
DOCKERHUB_REPO_NAME=dragonflyoss
sudo nydusify convert --nydus-image /usr/local/bin/nydus-image --source python:3.9.15 --target $DOCKERHUB_REPO_NAME/python:3.9.15-nydus
```

#### Try nydus with nerdctl {#try-nydus-with-nerdctl}

Running `python:3.9.15-nydus` with nerdctl:

```shell
sudo nerdctl --snapshotter nydus run --rm -it $DOCKERHUB_REPO_NAME/python:3.9.15-nydus
```

Check that nydus is downloaded via dragonfly based on mirror mode:

<!-- markdownlint-disable -->

```shell
$ grep mirrors /var/lib/containerd-nydus/logs/**/*log
[2022-10-19 10:16:13.276548 +00:00] INFO [storage/src/backend/connection.rs:271] backend config: ConnectionConfig { proxy: ProxyConfig { url: "", ping_url: "", fallback: false, check_interval: 5, use_http: false }, mirrors: [MirrorConfig { host: "http://127.0.0.1:65001", headers: {"X-Dragonfly-Registry": "https://index.docker.io"}, auth_through: false }], skip_verify: false, timeout: 10, connect_timeout: 10, retry_limit: 2 }
```

<!-- markdownlint-restore -->

## Performance testing {#performance-testing}

Test the performance of single-machine image download after the integration of
`nydus mirror` mode and `dragonfly P2P`.
Test running version commands using images in different languages.
For example, the startup command used to run a `python` image is `python -V`.
The tests were performed on the same machine.
Due to the influence of the network environment of the machine itself,
the actual download time is not important, but the ratio of the increase in
the download time in different scenarios is very important.

![nydus-mirror-dragonfly](nydus-mirror-dragonfly.png)

- OCIv1: Use containerd to pull image directly.
- Nydus Cold Boot: Use containerd to pull image via nydus-snapshotter and doesn't hit any cache.
- Nydus & Dragonfly Cold Boot: Use containerd to pull image via nydus-snapshotter.
  Transfer the traffic to dragonfly P2P based on nydus mirror mode and no cache hits.
- Hit Dragonfly Remote Peer Cache: Use containerd to pull image via nydus-snapshotter.
  Transfer the traffic to dragonfly P2P based on nydus mirror mode and hit the remote peer cache.
- Hit Dragonfly Local Peer Cache: Use containerd to pull image via nydus-snapshotter.
  Transfer the traffic to dragonfly P2P based on nydus mirror mode and hit the local peer cache.
- Hit Nydus Cache: Use containerd to pull image via nydus-snapshotter.
  Transfer the traffic to dragonfly P2P based on nydus mirror mode and hit the nydus local cache.

Test results show `nydus mirror` mode and `dragonfly P2P` integration.
Use the `nydus` download image to compare the `OCIv1` mode,
It can effectively reduce the image download time.
The cold boot of `nydus` and `nydus & dragonfly` are basically close.
All hits to `dragonfly` cache are better than `nydus` only.
The most important thing is that if a very large `kubernetes` cluster uses `nydus` to pull images.
The download of each image layer will be generate as many range requests as needed.
The `QPS` of the source of the registry is too high.
Causes the `QPS` of the registry to be relatively high.
Dragonfly can effectively reduce the number of requests and
download traffic for back-to-source registry.
In the best case, `dragonfly` can make the same task back-to-source download only once.

## Links

### Dragonfly community

- Website: [https://d7y.io/](https://d7y.io/)
- Github Repo: [https://github.com/dragonflyoss/Dragonfly2](https://github.com/dragonflyoss/Dragonfly2)
- Slack Channel: [#dragonfly](https://cloud-native.slack.com/messages/dragonfly/) on [CNCF Slack](https://slack.cncf.io/)
- Discussion Group: <dragonfly-discuss@googlegroups.com>
- Twitter: [@dragonfly_oss](https://twitter.com/dragonfly_oss)

### Nydus community

- Website: [https://nydus.dev/](https://nydus.dev/)
- Github Repo: [https://github.com/dragonflyoss/image-service](https://github.com/dragonflyoss/image-service)
- Slack Channel: [#nydus](https://join.slack.com/t/nydusimageservice/shared_invite/zt-pz4qvl4y-WIh4itPNILGhPS8JqdFm_w)

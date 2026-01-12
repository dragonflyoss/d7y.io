---
id: git-lfs
title: Git LFS
slug: /operations/integrations/git-lfs/
---

## What is Git LFS?

[Git LFS (Large File Storage)](https://git-lfs.com/) is an open-source extension for Git that enables users to
handle large files more efficiently in Git repositories. Git is a version control system designed
primarily for text files such as source code and it can become less efficient when dealing with large binary files like
audio, videos, datasets, graphics and other large assets. These files can significantly increase
the size of a repository and make cloning and fetching operations slow.

![git-lfs](../../resource/operations/integrations/git-lfs.png)

Git LFS addresses this issue by storing these large files on a separate server and replacing them in
the Git repository with small placeholder files (pointers). When a user clones or pulls from the repository,
Git LFS fetches the large files from the LFS server as needed rather than downloading all the
large files with the initial clone of the repository. For specifications,
please refer to the [Git LFS Specification](https://github.com/git-lfs/git-lfs/blob/main/docs/spec.md).
The server is implemented based on the HTTP protocol, refer to [Git LFS API](https://github.com/git-lfs/git-lfs/tree/main/docs/api).
Usually Git LFS's content storage uses object storage to store large files.

### Git LFS Usage

#### Git LFS manages large files

Github and GitLab usually manage large files based on Git LFS.

- GitHub uses Git LFS refer to [About Git Large File Storage](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-git-large-file-storage).
- GitLab uses Git LFS refer to [Git Large File Storage](https://docs.gitlab.com/ee/topics/git/lfs/).

#### Git LFS manages AI models and AI datasets

Large files of models and datasets in AI are usually managed based on Git LFS.
[Hugging Face Hub](https://huggingface.co/) and [ModelScope Hub](https://modelscope.cn/)
manage models and datasets based on Git LFS.

- Hugging Face Hub uses Git LFS refer to [Getting Started with Repositories](https://huggingface.co/docs/hub/repositories-getting-started).
- ModelScope Hub uses Git LFS refer to [Getting Started with ModelScope](https://modelscope.cn/docs/ModelScope%20Hub%E4%BD%BF%E7%94%A8%E6%96%87%E6%A1%A3).

Hugging Face Hub's Python Library implements Git LFS to download models and datasets.
Hugging Face Hub's Python Library distributes models and datasets to accelerate,
refer to [Hugging Face accelerates distribution of models and datasets based on Dragonfly](https://www.cncf.io/blog/2023/11/16/hugging-face-accelerates-distribution-of-models-and-datasets-based-on-dragonfly/).

## Dragonfly eliminates the bandwidth limit of Git LFS's content storage

This document will help you experience how to use dragonfly with Git LFS. During the downloading of large files,
the file size is large and there are many services downloading the larges files at the same time.
The bandwidth of the storage will reach the limit and the download will be slow.

![git-lfs-download](../../resource/operations/integrations/git-lfs-download.png)

Dragonfly can be used to eliminate the bandwidth limit of the storage through P2P technology,
thereby accelerating large files downloading.

![git-lfs-p2p](../../resource/operations/integrations/git-lfs-p2p.png)

## Dragonfly accelerates downloads with Git LFS

By proxying the HTTP protocol file download request of Git LFS to Dragonfly Peer Proxy,
the file download traffic is forwarded to the P2P network. The following documentation is based on GitHub LFS.

### Get the Content Storage address of Git LFS

Add `GIT_CURL_VERBOSE=1` to print verbose logs of git clone and get the address of content storage of Git LFS.

```shell
GIT_CURL_VERBOSE=1 git clone git@github.com:{YOUR-USERNAME}/{YOUR-REPOSITORY}.git
```

Look for the `trace git-lfs` keyword in the logs and you can see the log of Git LFS download files.
Pay attention to the content of `actions` and `download` in the log.

<!-- markdownlint-disable -->

```text
18:52:51.137490 trace git-lfs: HTTP: {"objects":[{"oid":"68ac0af011ce9c51a4c74c5ac9a40218e9e67bf55ebe13c8f2d758f710a3163a","size":19670194,"actions":{"download":{"href":"https://github-cloud.githubusercontent.com/alambic/media/730487717/68/ac/68ac0af011ce9c51a4c74c5ac9a40218e9e67bf55ebe13c8f2d758f710a3163a?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA5BA2674WPWWEFGQ5%2F20240605%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240605T105251Z&X-Amz-Expires=3600&X-Amz-Signature=35cf8e02f0d3e2da893aa46fa4929d79ce1abb18aea8e0fabfbb138706d7151818:52:51.137574 trace git-lfs: HTTP: &X-Amz-SignedHeaders=host&actor_id=0&key_id=0&repo_id=810214636&token=1","expires_at":"2024-06-05T11:52:51Z","expires_in":3600}}}]}
```

<!-- markdownlint-restore -->

The download URL can be found in `actions.download.href` in the `objects`.
You can find that the content storage of GitHub LFS is actually stored at `github-cloud.githubusercontent.com`.

**Information about Git LFS :**

The content storage address of Git LFS is `github-cloud.githubusercontent.com`.

### Installation

#### Prerequisites

| Name               | Version | Document                                |
| ------------------ | ------- | --------------------------------------- |
| Kubernetes cluster | 1.20+   | [kubernetes.io](https://kubernetes.io/) |
| Helm               | 3.8.0+  | [helm.sh](https://helm.sh/)             |
| Git LFS            | 3.3.0+  | [git-lfs](https://git-lfs.com/)         |

#### Dragonfly Kubernetes Cluster Setup {#dragonfly-kubernetes-cluster-setup}

For detailed installation documentation based on kubernetes cluster, please refer to [quick-start-kubernetes](../../getting-started/quick-start/kubernetes.md).

##### Setup kubernetes cluster

[Kind](https://kind.sigs.k8s.io/) is recommended if no kubernetes cluster is available for testing.

Create kind multi-node cluster configuration file kind-config.yaml, configuration content is as follows:

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
  - role: control-plane
  - role: worker
    extraPortMappings:
      - containerPort: 30950
        hostPort: 4001
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

##### Kind loads Dragonfly image

Pull Dragonfly latest images:

```shell
docker pull dragonflyoss/scheduler:latest
docker pull dragonflyoss/manager:latest
docker pull dragonflyoss/client:latest
```

Kind cluster loads Dragonfly latest images:

```shell
kind load docker-image dragonflyoss/scheduler:latest
kind load docker-image dragonflyoss/manager:latest
kind load docker-image dragonflyoss/client:latest
```

##### Create Dragonfly cluster based on helm charts

Create helm charts configuration file charts-config.yaml.
Add the `github-cloud.githubusercontent.com` rule to `client.config.proxy.rules.regex`
to forward the HTTP file download of content storage of Git LFS to the P2P network.

```yaml
manager:
  image:
    repository: dragonflyoss/manager
    tag: latest
  metrics:
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
  hostNetwork: true
  metrics:
    enable: true
  config:
    proxy:
      server:
        port: 4001
      registryMirror:
        addr: https://index.docker.io
      rules:
        - regex: blobs/sha256.*
        - regex: github-cloud.githubusercontent.com.*
```

Create a Dragonfly cluster using the configuration file:

<!-- markdownlint-disable -->

```shell
$ helm repo add dragonfly https://dragonflyoss.github.io/helm-charts/
$ helm install --wait --create-namespace --namespace dragonfly-system dragonfly dragonfly/dragonfly -f charts-config.yaml
NAME: dragonfly
LAST DEPLOYED: Mon June 5 12:53:14 2024
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


4. Get Jaeger query URL by running these commands:
  export JAEGER_QUERY_PORT=$(kubectl --namespace dragonfly-system get services dragonfly-jaeger-query -o jsonpath="{.spec.ports[0].port}")
  kubectl --namespace dragonfly-system port-forward service/dragonfly-jaeger-query 16686:$JAEGER_QUERY_PORT
  echo "Visit http://127.0.0.1:16686/search?limit=20&lookback=1h&maxDuration&minDuration&service=dragonfly to query download events"
```

<!-- markdownlint-restore -->

Check that Dragonfly is deployed successfully:

```shell
$ kubectl get po -n dragonfly-system
NAME                                 READY   STATUS    RESTARTS       AGE
dragonfly-client-6jgzn               1/1     Running   0              34m
dragonfly-client-qzcz9               1/1     Running   0              34m
dragonfly-manager-6bc4454d94-ldsk7   1/1     Running   0              34m
dragonfly-mysql-0                    1/1     Running   0              34m
dragonfly-redis-master-0             1/1     Running   0              34m
dragonfly-redis-replicas-0           1/1     Running   0              34m
dragonfly-redis-replicas-1           1/1     Running   0              34m
dragonfly-redis-replicas-2           1/1     Running   0              34m
dragonfly-scheduler-0                1/1     Running   0              34m
dragonfly-scheduler-1                1/1     Running   0              34m
dragonfly-scheduler-2                1/1     Running   0              34m
dragonfly-seed-client-0              1/1     Running   0              34m
dragonfly-seed-client-1              1/1     Running   0              34m
dragonfly-seed-client-2              1/1     Running   0              34m
```

Create peer service configuration file peer-service-config.yaml, configuration content is as follows:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: peer
  namespace: dragonfly-system
spec:
  type: NodePort
  ports:
    - name: http-4001
      nodePort: 30950
      port: 4001
  selector:
    app: dragonfly
    component: client
    release: dragonfly
```

Create a peer service using the configuration file:

```shell
kubectl apply -f peer-service-config.yaml
```

### Git LFS downlads large files via Dragonfly

Proxy Git LFS download requests to Dragonfly Peer Proxy
through Git configuration. Set Git configuration includes
`http.proxy`, `lfs.transfer.enablehrefrewrite` and `url.http://github-cloud.githubusercontent.com/.insteadOf` properties.

> Notice: Replace the `http.proxy` address with your actual address.

```shell
git config --global http.proxy http://127.0.0.1:4001
git config --global lfs.transfer.enablehrefrewrite true
git config --global url.http://github-cloud.githubusercontent.com/.insteadOf https://github-cloud.githubusercontent.com/
```

Forward Git LFS download requests to the P2P network via Dragonfly Peer Proxy and Git clone the large files.

```shell
git clone git@github.com:{YOUR-USERNAME}/{YOUR-REPOSITORY}.git
```

Skip GIT SSL verification.

```shell
GIT_SSL_NO_VERIFY=1 git clone git@github.com:{YOUR-USERNAME}/{YOUR-REPOSITORY}.git
```

### Verify

Execute the command:

```shell
# Find pod name.
export POD_NAME=$(kubectl get pods --namespace dragonfly-system -l "app=dragonfly,release=dragonfly,
component=client" -o=jsonpath='{.items[?(@.spec.nodeName=="kind-worker")].metadata.name}' | head -n 1 )

# Check logs.
kubectl -n dragonfly-system exec -it ${POD_NAME} -- grep "download task succeeded" /var/log/dragonfly/dfdaemon/*
```

The expected output is as follows:

<!-- markdownlint-disable -->

```shell
{
  2024-04-19T02:44:09.259458Z  "INFO"
  "download_task":"dragonfly-client/src/grpc/dfdaemon_download.rs:276":: "download task succeeded"
  "host_id": "172.18.0.3-kind-worker",
  "task_id": "a46de92fcb9430049cf9e61e267e1c3c9db1f1aa4a8680a048949b06adb625a5",
  "peer_id": "172.18.0.3-kind-worker-86e48d67-1653-4571-bf01-7e0c9a0a119d"
}
```

<!-- markdownlint-restore -->

## Performance testing

Test the performance of single-machine large files download after the integration of Git LFS and Dragonfly P2P.
Due to the influence of the network environment of the machine itself, the actual download time is not important,
but the ratio of the increase in the download time in different scenarios is very important.

![git-lfs-dragonfly](../../resource/operations/integrations/git-lfs-dragonfly.png)

- Git LFS: Use Git LFS to download large files directly.
- Git LFS & Dragonfly Cold Boot: Use Git LFS to download large files via Dragonfly P2P network and no cache hits.
- Hit Dragonfly Remote Peer Cache: Use Git LFS to download large files via
  Dragonfly P2P network and hit the remote peer cache.
- Hit Dragonfly Remote Local Cache: Use Git LFS to download large files via
  Dragonfly P2P network and hit the local peer cache.

Test results show Git LFS and Dragonfly P2P integration. It can effectively reduce the file download time.
Note that this test was a single-machine test, which means that in the case of cache hits,
the performance limitation is on the disk. If Dragonfly is deployed on multiple machines for P2P download,
the large files download speed will be faster.

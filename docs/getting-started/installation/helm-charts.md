---
id: helm-charts
title: Helm Charts
slug: /getting-started/installation/helm-charts/
---

Documentation for deploying Dragonfly on kubernetes using helm.

For more integrations such as Docker, CRI-O, Podman, Singularity/Apptainer, Nydus, eStargz, Harbor, Git LFS,
Hugging Face, TorchServe, Triton Server, Pip, etc. refer to [Integrations](../../operations/integrations/container-runtime/containerd.md).

## Prerequisites {#prerequisites}

| Name               | Version | Document                                |
| ------------------ | ------- | --------------------------------------- |
| Kubernetes cluster | 1.20+   | [kubernetes.io](https://kubernetes.io/) |
| Helm               | v3.8.0+ | [helm.sh](https://helm.sh/)             |
| containerd         | v1.5.0+ | [containerd.io](https://containerd.io/) |

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

Create the Helm Charts configuration file `values.yaml`, and set the container runtime to `containerd`.
Please refer to the [configuration](https://artifacthub.io/packages/helm/dragonfly/dragonfly#values) documentation for details.

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
$ helm install --wait --create-namespace --namespace dragonfly-system dragonfly dragonfly/dragonfly -f values.yaml
NAME: dragonfly
LAST DEPLOYED: Thu Apr 18 19:26:39 2024
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
dragonfly-client-gvspg               1/1     Running   0             34m
dragonfly-client-kxrhh               1/1     Running   0             34m
dragonfly-manager-864774f54d-6t79l   1/1     Running   0             34m
dragonfly-mysql-0                    1/1     Running   0             34m
dragonfly-redis-master-0             1/1     Running   0             34m
dragonfly-redis-replicas-0           1/1     Running   0             34m
dragonfly-redis-replicas-1           1/1     Running   0             32m
dragonfly-redis-replicas-2           1/1     Running   0             32m
dragonfly-scheduler-0                1/1     Running   0             34m
dragonfly-seed-client-0              1/1     Running   5 (21m ago)   34m
```

## Containerd downloads images through Dragonfly {#containerd-downloads-images-through-dragonfly}

Pull `alpine:3.19` image in kind-worker node:

```shell
docker exec -i kind-worker /usr/local/bin/crictl pull alpine:3.19
```

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

## Performance testing {#performance-testing}

### Containerd pull image back-to-source for the first time through Dragonfly {#containerd-pull-image-back-to-source-for-the-first-time-through-dragonfly}

Pull `alpine:3.19` image in `kind-worker` node:

```shell
time docker exec -i kind-worker /usr/local/bin/crictl pull alpine:3.19
```

When pull image back-to-source for the first time through Dragonfly, it takes `28.82s` to download the `alpine:3.19` image.

### Containerd pull image hits the cache of remote peer {#containerd-pull-image-hits-the-cache-of-remote-peer}

Delete the client whose Node is `kind-worker` to clear the cache of Dragonfly local Peer.

<!-- markdownlint-disable -->

```shell
# Find pod name.
export POD_NAME=$(kubectl get pods --namespace dragonfly-system -l "app=dragonfly,release=dragonfly,component=client" -o=jsonpath='{.items[?(@.spec.nodeName=="kind-worker")].metadata.name}' | head -n 1 )

# Delete pod.
kubectl delete pod ${POD_NAME} -n dragonfly-system
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

When pull image hits cache of remote peer, it takes `12.524s` to download the
`alpine:3.19` image.

### Containerd pull image hits the cache of local peer {#containerd-pull-image-hits-the-cache-of-local-peer}

Delete `alpine:3.19` image in `kind-worker` node:

```shell
docker exec -i kind-worker /usr/local/bin/crictl rmi alpine:3.19
```

Pull `alpine:3.19` image in `kind-worker` node:

```shell
time docker exec -i kind-worker /usr/local/bin/crictl pull alpine:3.19
```

When pull image hits cache of local peer, it takes `7.432s` to download the
`alpine:3.19` image.

## Advanced Features & Scenarios {#advanced-features-and-scenarios}

### Using Dragonfly with webhook injection {#using-dragonfly-with-webhook-injection}

Dragonfly provides a webhook injector that automatically injects Dragonfly client binaries and configurations into
application Pods via a Kubernetes mutating admission webhook. This enables any Pod to use Dragonfly for downloading
files without modifying the container image.

#### Prerequisites for webhook {#prerequisites-for-webhook}

The webhook injector requires cert-manager to manage TLS certificates for the webhook server.

Install cert-manager:

```shell
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/latest/download/cert-manager.yaml
```

Wait for cert-manager to be ready:

```shell
kubectl wait --for=condition=Available deployment --all -n cert-manager --timeout=300s
```

#### Deploy Dragonfly with webhook injector {#deploy-dragonfly-with-webhook-injector}

Create the Helm Charts configuration file `values.yaml` with the webhook injector enabled:

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

injector:
  enable: true
  replicas: 2
  image:
    registry: docker.io
    repository: dragonflyoss/injector
    tag: latest
  initContainerImage:
    registry: docker.io
    repository: dragonflyoss/client
    tag: latest
  certManager:
    enable: true
    issuer:
      name: ''
      kind: Issuer
      create: true
```

Create a Dragonfly cluster using the configuration file:

<!-- markdownlint-disable -->

```shell
$ helm repo add dragonfly https://dragonflyoss.github.io/helm-charts/
$ helm install --create-namespace --namespace dragonfly-system dragonfly dragonfly/dragonfly -f values.yaml
NAME: dragonfly
LAST DEPLOYED: Fri Apr  3 11:25:25 2026
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

#### Inject Dragonfly Binaries into a Pod {#inject-dragonfly-binaries-into-a-pod}

Create a Pod configuration file pod.yaml with Dragonfly injection annotations:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pod
  annotations:
    dragonfly.io/inject: 'true'
    dragonfly.io/init-container-image: 'dragonflyoss/client:latest'
    dragonfly.io/skip-unix-sock-inject: 'false'
spec:
  containers:
    - name: busybox-container
      image: debian:stable-slim
      imagePullPolicy: IfNotPresent
      command: ['/bin/sh', '-c', "echo 'Hello from BusyBox!'; sleep 3600"]
      resources:
        limits:
          memory: '128Mi'
          cpu: '100m'
        requests:
          memory: '64Mi'
          cpu: '50m'
```

Install the Pod:

```shell
kubectl apply -f pod.yaml
```

Check that the Pod is running:

```shell
$ kubectl get po -owide
NAME       READY   STATUS    RESTARTS   AGE   IP            NODE                 NOMINATED NODE   READINESS GATES
test-pod   1/1     Running   0          38s   10.244.0.41   kind-control-plane   <none>           <none>
```

#### Verify webhook injection {#verify-webhook-injection}

Describe the Pod to verify the webhook injected the init container, volumes, and volume mounts:

```shell
$ kubectl describe po test-pod
Name:             test-pod
Namespace:        default
Priority:         0
Service Account:  default
Node:             kind-control-plane/192.168.97.2
Start Time:       Fri, 03 Apr 2026 11:34:29 +0800
Labels:           <none>
Annotations:      dragonfly.io/init-container-image: dragonflyoss/client:latest
                  dragonfly.io/inject: true
                  dragonfly.io/skip-unix-sock-inject: false
Status:           Running
IP:               10.244.0.41
IPs:
  IP:  10.244.0.41
Init Containers:
  dragonfly-binaries:
    Container ID:  containerd://32e5f73e389c2222e01e64220ae1c5b25792e3716d39e8b49cd642ac8246cb6d
    Image:         dragonflyoss/client:latest
    Image ID:      docker.io/library/import-2026-04-03@sha256:9dca0342ee7b9320d1a87d7f6e98a11aa05f2fc716e12b370484dd3d0e1eab3d
    Port:          <none>
    Host Port:     <none>
    Command:
      install
      -D
      /usr/local/bin/dfget
      /usr/local/bin/dfcache
      /usr/local/bin/dfstore
      /usr/local/bin/dfdaemon
      -t
      /dragonfly/bin/
    State:          Terminated
      Reason:       Completed
      Exit Code:    0
      Started:      Fri, 03 Apr 2026 11:34:29 +0800
      Finished:     Fri, 03 Apr 2026 11:34:30 +0800
    Ready:          True
    Restart Count:  0
    Environment:    <none>
    Mounts:
      /dragonfly/bin from dragonfly-binaries-volume (rw)
      /var/run/secrets/kubernetes.io/serviceaccount from kube-api-access-prcc6 (ro)
Containers:
  busybox-container:
    Container ID:  containerd://f184c726f011d538685b6658bea97353300b4b91b728422c5841de9f6c8089d0
    Image:         debian:stable-slim
    Image ID:      docker.io/library/debian@sha256:99fc6d2a0882fcbcdc452948d2d54eab91faafc7db037df82425edcdcf950e1f
    Port:          <none>
    Host Port:     <none>
    Command:
      /bin/sh
      -c
      echo 'Hello from BusyBox!'; sleep 3600
    State:          Running
      Started:      Fri, 03 Apr 2026 11:35:05 +0800
    Ready:          True
    Restart Count:  0
    Limits:
      cpu:     100m
      memory:  128Mi
    Requests:
      cpu:        50m
      memory:     64Mi
    Environment:  <none>
    Mounts:
      /dragonfly/bin from dragonfly-binaries-volume (rw)
      /usr/local/bin/dfcache from dragonfly-binaries-volume (ro,path="dfcache")
      /usr/local/bin/dfdaemon from dragonfly-binaries-volume (ro,path="dfdaemon")
      /usr/local/bin/dfget from dragonfly-binaries-volume (ro,path="dfget")
      /usr/local/bin/dfstore from dragonfly-binaries-volume (ro,path="dfstore")
      /var/run/dragonfly/dfdaemon.sock from dfdaemon-unix-sock (rw)
      /var/run/secrets/kubernetes.io/serviceaccount from kube-api-access-prcc6 (ro)
...
Events:
  Type    Reason     Age   From               Message
  ----    ------     ----  ----               -------
  Normal  Scheduled  57s   default-scheduler  Successfully assigned default/test-pod to kind-control-plane
  Normal  Pulled     57s   kubelet            Container image "dragonflyoss/client:latest" already present on machine
  Normal  Created    57s   kubelet            Created container dragonfly-binaries
  Normal  Started    57s   kubelet            Started container dragonfly-binaries
  Normal  Pulling    55s   kubelet            Pulling image "debian:stable-slim"
  Normal  Pulled     21s   kubelet            Successfully pulled image "debian:stable-slim" in 33.986s (33.986s including waiting). Image size: 30148894 bytes.
  Normal  Created    21s   kubelet            Created container busybox-container
  Normal  Started    21s   kubelet            Started container busybox-container
```

Verify that the Dragonfly binaries are available inside the container:

```shell
$ kubectl exec -it test-pod -- bash
$ which dfget dfcache dfstore dfdaemon
/usr/local/bin/dfget
/usr/local/bin/dfcache
/usr/local/bin/dfstore
/usr/local/bin/dfdaemon
```

#### Download files using dfget {#download-files-using-dfget}

Use dfget inside the injected Pod to download files through Dragonfly:

<!-- markdownlint-disable -->

```shell
$ kubectl exec -it test-pod -- dfget https://github.com/dragonflyoss/client/releases/download/v1.2.17/dragonfly-client-v1.2.17-x86_64-unknown-linux-musl.tar.gz --output dragonfly-client.tar.gz
/dragonflyoss/client/releases/download/v1.2.17/dragonfly-client-v1.2.17-x86_64-unknown-linux-musl.tar.gz
[00:00:18] [============================================================] 100% (1.48 MiB/s, 0.0s)
```

<!-- markdownlint-restore -->

### Preheat image {#preheat-image}

Expose manager's port `8080`:

```shell
kubectl --namespace dragonfly-system port-forward service/dragonfly-manager 8080:8080
```

Please create personal access Token before calling Open API, and select `job` for access scopes, refer to [personal-access-tokens](../../advanced-guides/personal-access-tokens.md).

Use Open API to preheat the image `alpine:3.19` to Seed Peer, refer to [preheat](../../advanced-guides/open-api/preheat.md).

```shell
curl --location --request POST 'http://127.0.0.1:8080/oapi/v1/jobs' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer your_personal_access_token' \
--data-raw '{
    "type": "preheat",
    "args": {
        "type": "image",
        "url": "https://index.docker.io/v2/library/alpine/manifests/3.19",
        "filteredQueryParams": "Expires&Signature",
        "username": "your_registry_username",
        "password": "your_registry_password"
    }
}'
```

The command-line log returns the preheat job id:

```json
{
  "id": 1,
  "created_at": "2024-04-18T08:51:55Z",
  "updated_at": "2024-04-18T08:51:55Z",
  "task_id": "group_2717f455-ff0a-435f-a3a7-672828d15a2a",
  "type": "preheat",
  "state": "PENDING",
  "args": {
    "filteredQueryParams": "Expires&Signature",
    "headers": null,
    "password": "",
    "pieceLength": 4194304,
    "platform": "",
    "tag": "",
    "type": "image",
    "url": "https://index.docker.io/v2/library/alpine/manifests/3.19",
    "username": ""
  },
  "scheduler_clusters": [
    {
      "id": 1,
      "created_at": "2024-04-18T08:29:15Z",
      "updated_at": "2024-04-18T08:29:15Z",
      "name": "cluster-1"
    }
  ]
}
```

Polling the preheating status with job id:

```shell
curl --request GET 'http://127.0.0.1:8080/oapi/v1/jobs/1' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer your_personal_access_token'
```

If the status is `SUCCESS`, the preheating is successful:

```json
{
  "id": 1,
  "created_at": "2024-04-18T08:51:55Z",
  "updated_at": "2024-04-18T08:51:55Z",
  "task_id": "group_2717f455-ff0a-435f-a3a7-672828d15a2a",
  "type": "preheat",
  "state": "SUCCESS",
  "args": {
    "filteredQueryParams": "Expires&Signature",
    "headers": null,
    "password": "",
    "pieceLength": 4194304,
    "platform": "",
    "tag": "",
    "type": "image",
    "url": "https://index.docker.io/v2/library/alpine/manifests/3.19",
    "username": ""
  },
  "scheduler_clusters": [
    {
      "id": 1,
      "created_at": "2024-04-18T08:29:15Z",
      "updated_at": "2024-04-18T08:29:15Z",
      "name": "cluster-1"
    }
  ]
}
```

Pull `alpine:3.19` image in `kind-worker` node:

```shell
time docker exec -i kind-worker /usr/local/bin/crictl pull alpine:3.19
```

When pull image hits preheat cache, it takes `11.030s` to download the
`alpine:3.19` image.

---
id: kubernetes
title: Kubernetes
description: Kubernetes
slug: /getting-started/quick-start/kubernetes/
---

Documentation for deploying Dragonfly on kubernetes using helm.

## Runtime

You can have a quick start following [Helm Charts](../installation/helm-charts.md).
We recommend to use `containerd`.

| Runtime    | Version  | Document                                                              |
| ---------- | -------- | --------------------------------------------------------------------- |
| containerd | v1.1.0+  | [Link](../../operations/integrations/container-runtime/containerd.md) |
| Docker     | v20.0.1+ | [Link](../../operations/integrations/container-runtime/docker.md)     |
| CRI-O      | All      | [Link](../../operations/integrations/container-runtime/cri-o.md)      |

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

Create helm charts configuration file `charts-config.yaml`, configuration content is as follows:

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
$ helm install --wait --create-namespace --namespace dragonfly-system dragonfly dragonfly/dragonfly -f charts-config.yaml
NAME: dragonfly
LAST DEPLOYED: Tue Apr 16 11:23:00 2024
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
NAME                                 READY   STATUS     RESTARTS      AGE
dragonfly-client-dhqfc               1/1     Running    0             13m
dragonfly-client-h58x6               1/1     Running    0             13m
dragonfly-manager-7b4fd85458-fjtpk   1/1     Running    0             13m
dragonfly-mysql-0                    1/1     Running    0             13m
dragonfly-redis-master-0             1/1     Running    0             13m
dragonfly-redis-replicas-0           1/1     Running    0             13m
dragonfly-redis-replicas-1           1/1     Running    0             11m
dragonfly-redis-replicas-2           1/1     Running    0             10m
dragonfly-scheduler-0                1/1     Running    0             13m
dragonfly-seed-client-0              1/1     Running    2 (76s ago)   13m
```

## Containerd downloads images through Dragonfly {#containerd-downloads-images-through-dragonfly}

Pull `alpine:3.19` image in kind-worker node:

```shell
docker exec -i kind-worker /usr/local/bin/crictl pull alpine:3.19
```

### Verify {#verify}

You can execute the following command to check if the `alpine:3.19` image is distributed via Dragonfly.

<!-- markdownlint-disable -->

```shell
# Find pod name.
export POD_NAME=$(kubectl get pods --namespace dragonfly-system -l "app=dragonfly,release=dragonfly,component=client" -o=jsonpath='{.items[?(@.spec.nodeName=="kind-worker")].metadata.name}' | head -n 1 )

# Find task id.
export TASK_ID=$(kubectl -n dragonfly-system exec ${POD_NAME} -- sh -c "grep -hoP 'library/alpine.*task_id=\"\K[^\"]+' /var/log/dragonfly/dfdaemon/* | head -n 1")

# Check logs.
kubectl -n dragonfly-system exec -it ${POD_NAME} -- sh -c "grep ${TASK_ID} /var/log/dragonfly/dfdaemon/* | grep 'download task succeeded'"

# Download all logs.
kubectl -n dragonfly-system exec ${POD_NAME} -- sh -c "grep ${TASK_ID} /var/log/dragonfly/dfdaemon/*" > dfdaemon.log
```

<!-- markdownlint-restore -->

The expected output is as follows:

```shell
{
2024-04-18T08:37:06.790177Z  INFO
download_task: dragonfly-client/src/grpc/dfdaemon_download.rs:276: download task succeeded
host_id="172.18.0.2-kind-worker"
task_id="a46de92fcb9430049cf9e61e267e1c3c9db1f1aa4a8680a048949b06adb625a5"
peer_id="172.18.0.2-kind-worker-b72b0d50-b839-46ae-9000-83a8bf9ccc5a"
}
```

## Performance testing {#performance-testing}

### Containerd pull image back-to-source for the first time through Dragonfly {#containerd-pull-image-back-to-source-for-the-first-time-through-dragonfly}

Pull `alpine:3.19` image in `kind-worker` node:

```shell
time docker exec -i kind-worker /usr/local/bin/crictl pull alpine:3.19
```

When pull image back-to-source for the first time through Dragonfly, it takes `37.852s` to download the
`alpine:3.19` image.

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

When pull image hits cache of remote peer, it takes `6.942s` to download the
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

When pull image hits cache of local peer, it takes `5.540s` to download the
`alpine:3.19` image.

## Preheat image {#preheat-image}

Expose manager's port `8080`:

```shell
kubectl --namespace dragonfly-system port-forward service/dragonfly-manager 8080:8080
```

Please create personal access Token before calling Open API, and select `job` for access scopes, refer to [personal-access-tokens](../../advanced-guides/personal-access-tokens.md).

Use Open API to preheat the image `alpine:3.19` to Seed Peer, refer to [preheat](../../advanced-guides/preheat.md).

````shell
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
````

The command-line log returns the preheat job id:

```shell
{"id":1,"created_at":"2024-04-18T12:06:33Z","updated_at":"2024-04-18T12:06:33Z","is_del":0,"task_id":"group_2717f455-ff0a-435f-a3a7-672828d15a2a","bio":"","type":"preheat","state":"PENDING",
"args":{"filteredQueryParams":"Expires\u0026Signature","headers":null,"password":"","pieceLength":4194304,"platform":"","tag":"","type":"image","url":"https://index.docker.io/v2/library/alpine/manifests/3.19","username":""},
"result":null,"user_id":0,
"user":{"id":0,"created_at":"0001-01-01T00:00:00Z","updated_at":"0001-01-01T00:00:00Z","is_del":0,"email":"","name":"","avatar":"","phone":"","state":"","location":"","bio":"","configs":null},"seed_peer_clusters":null,
"scheduler_clusters":[{"id":1,"created_at":"2024-04-18T10:53:33Z","updated_at":"2024-04-18T10:53:33Z","is_del":0,"name":"cluster-1","bio":"","config":{"candidate_parent_limit":4,"filter_parent_limit":15},"client_config":{"load_limit":200},"scopes":{},"is_default":true,"seed_peer_clusters":null,"schedulers":null,"peers":null,"jobs":null}]}
```

Polling the preheating status with job id:

```shell
curl --request GET 'http://127.0.0.1:8080/oapi/v1/jobs/1' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer your_personal_access_token'
```

If the status is `SUCCESS`, the preheating is successful:

```shell
{"id":1,"created_at":"2024-04-18T08:51:55Z","updated_at":"2024-04-18T08:51:55Z","is_del":0,"task_id":"group_2717f455-ff0a-435f-a3a7-672828d15a2a","bio":"","type":"preheat","state":"SUCCESS","args":{"filteredQueryParams":"Expires\u0026Signature","headers":null,"password":"","pieceLength":4194304,"platform":"",
"tag":"","type":"image","url":"https://index.docker.io/v2/library/alpine/manifests/3.19","username":""},
"result":{"CreatedAt":"2024-04-18T08:51:55.324823179Z","GroupUUID":"group_2717f455-ff0a-435f-a3a7-672828d15a2a","JobStates":[{"CreatedAt":"2024-04-18T08:51:55.324823179Z","Error":"","Results":[],"State":"SUCCESS","TTL":0,"TaskName":"preheat","TaskUUID":"task_a3ca085c-d80d-41e5-9e91-18b910c6653f"},{"CreatedAt":"2024-04-18T08:51:55.326531846Z","Error":"","Results":[],"State":"SUCCESS","TTL":0,"TaskName":"preheat","TaskUUID":"task_b006e4dc-6ed3-4bc2-98f6-86b0234e2d6d"}],"State":"SUCCESS"},"user_id":0,
"user":{"id":0,"created_at":"0001-01-01T00:00:00Z","updated_at":"0001-01-01T00:00:00Z","is_del":0,"email":"","name":"","avatar":"","phone":"","state":"","location":"","bio":"","configs":null},"seed_peer_clusters":[],
"scheduler_clusters":[{"id":1,"created_at":"2024-04-18T08:29:15Z","updated_at":"2024-04-18T08:29:15Z","is_del":0,"name":"cluster-1","bio":"","config":{"candidate_parent_limit":4,"filter_parent_limit":15},"client_config":{"load_limit":200},"scopes":{},"is_default":true,"seed_peer_clusters":null,"schedulers":null,"peers":null,"jobs":null}]}
```

Pull `alpine:3.19` image in `kind-worker` node:

```shell
time docker exec -i kind-worker /usr/local/bin/crictl pull alpine:3.19
```

When pull image hits preheat cache, it takes `2.952s` to download the
`alpine:3.19` image.

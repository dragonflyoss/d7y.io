---
id: helm-charts
title: Helm Charts
slug: /getting-started/installation/helm-charts/
---

Documentation for deploying Dragonfly on kubernetes using helm.

For more integrations such as Docker, CRI-O, Singularity/Apptainer, Nydus, eStargz, Harbor, Git LFS,
Hugging Face, TorchServe, Triton Server, etc., refer to [Integrations](../../operations/integrations/container-runtime/containerd.md).

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

## Create Dragonfly cluster based on helm charts {#create-dragonfly-cluster-based-on-helm-charts}

Create the Helm Charts configuration file `values.yaml`, and set the container runtime to `containerd`.
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

Create a Dragonfly cluster using the configuration file:

<!-- markdownlint-disable -->

```shell
$ helm repo add dragonfly https://dragonflyoss.github.io/helm-charts/
$ helm install --create-namespace --namespace dragonfly-system dragonfly dragonfly/dragonfly -f values.yaml
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
```

<!-- markdownlint-restore -->

The expected output is as follows:

```shell
{
2024-04-19T02:44:09.259458Z  INFO
download_task: dragonfly-client/src/grpc/dfdaemon_download.rs:276: download task succeeded
host_id="172.18.0.3-kind-worker"
task_id="a46de92fcb9430049cf9e61e267e1c3c9db1f1aa4a8680a048949b06adb625a5"
peer_id="172.18.0.3-kind-worker-86e48d67-1653-4571-bf01-7e0c9a0a119d"
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

## Preheat image {#preheat-image}

Expose manager's port `8080`:

```shell
kubectl --namespace dragonfly-system port-forward service/dragonfly-manager 8080:8080
```

Please create personal access Token before calling Open API, and select `job` for access scopes, refer to [personal-access-tokens](../../reference/personal-access-tokens.md).

Use Open API to preheat the image `alpine:3.19` to Seed Peer, refer to [preheat](../../reference/preheat.md).

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

```shell
{
  id: 1,
  created_at: '0001-01-01T00:00:00Z',
  updated_at: '0001-01-01T00:00:00Z',
  is_del: 0,
  task_id: 'group_2bed5b1e-1e36-41d9-b74c-4fd1e10c69ef',
  bio: '',
  type: 'preheat',
  state: 'PENDING',
  args: {
    filteredQueryParams: 'Expires\u0026Signature',
    headers: null,
    password: '',
    pieceLength: 4194304,
    platform: '',
    tag: '',
    type: 'image',
    url: 'https://index.docker.io/v2/library/alpine/manifests/3.19',
    username: '',
  },
  result: null,
  user_id: 0,
  user: {
    id: 0,
    created_at: '0001-01-01T00:00:00Z',
    updated_at: '0001-01-01T00:00:00Z',
    is_del: 0,
    email: '',
    name: '',
    avatar: '',
    phone: '',
    state: '',
    location: '',
    bio: '',
    configs: null,
  },
  seed_peer_clusters: null,
  scheduler_clusters: [
    {
      id: 1,
      created_at: '2024-04-19T02:24:44Z',
      updated_at: '2024-04-19T02:24:44Z',
      is_del: 0,
      name: 'cluster-1',
      bio: '',
      config: { candidate_parent_limit: 4, filter_parent_limit: 15 },
      client_config: { load_limit: 200 },
      scopes: {},
      is_default: true,
      seed_peer_clusters: null,
      schedulers: null,
      peers: null,
      jobs: null,
    },
  ],
}
```

Polling the preheating status with job id:

```shell
curl --request GET 'http://127.0.0.1:8080/oapi/v1/jobs/1' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer your_personal_access_token'
```

If the status is `SUCCESS`, the preheating is successful:

```shell
{
  id: 1,
  created_at: '2024-04-19T02:42:06Z',
  updated_at: '2024-04-19T02:42:27Z',
  is_del: 0,
  task_id: 'group_2bed5b1e-1e36-41d9-b74c-4fd1e10c69ef',
  bio: '',
  type: 'preheat',
  state: 'SUCCESS',
  args: {
    filteredQueryParams: 'Expires\u0026Signature',
    headers: null,
    password: '',
    pieceLength: 4194304,
    platform: '',
    tag: '',
    type: 'image',
    url: 'https://index.docker.io/v2/library/alpine/manifests/3.19',
    username: '',
  },
  result: {
    CreatedAt: '2024-04-19T02:42:06.202315051Z',
    GroupUUID: 'group_2bed5b1e-1e36-41d9-b74c-4fd1e10c69ef',
    JobStates: [
      {
        CreatedAt: '2024-04-19T02:42:06.202315051Z',
        Error: '',
        Results: [],
        State: 'SUCCESS',
        TTL: 0,
        TaskName: 'preheat',
        TaskUUID: 'task_064d25a2-e3e7-4be8-8ca9-cad6bd94ad16',
      },
      {
        CreatedAt: '2024-04-19T02:42:06.20404751Z',
        Error: '',
        Results: [],
        State: 'SUCCESS',
        TTL: 0,
        TaskName: 'preheat',
        TaskUUID: 'task_7b921739-2b17-475b-87ac-7afc69d917d8',
      },
    ],
    State: 'SUCCESS',
  },
  user_id: 0,
  user: {
    id: 0,
    created_at: '0001-01-01T00:00:00Z',
    updated_at: '0001-01-01T00:00:00Z',
    is_del: 0,
    email: '',
    name: '',
    avatar: '',
    phone: '',
    state: '',
    location: '',
    bio: '',
    configs: null,
  },
  seed_peer_clusters: [],
  scheduler_clusters: [
    {
      id: 1,
      created_at: '2024-04-19T02:24:44Z',
      updated_at: '2024-04-19T02:24:44Z',
      is_del: 0,
      name: 'cluster-1',
      bio: '',
      config: { candidate_parent_limit: 4, filter_parent_limit: 15 },
      client_config: { load_limit: 200 },
      scopes: {},
      is_default: true,
      seed_peer_clusters: null,
      schedulers: null,
      peers: null,
      jobs: null,
    },
  ],
}
```

Pull `alpine:3.19` image in `kind-worker` node:

```shell
time docker exec -i kind-worker /usr/local/bin/crictl pull alpine:3.19
```

When pull image hits preheat cache, it takes `11.030s` to download the
`alpine:3.19` image.

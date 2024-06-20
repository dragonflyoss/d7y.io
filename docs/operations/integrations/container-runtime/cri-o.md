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
| CRI-O              | v1.5.0+ | [containerd.io](https://containerd.io/) |

## Quick Start {#quick-start}

### Setup kubernetes cluster {#setup-kubernetes-cluster}

[Minikube](https://minikube.sigs.k8s.io/docs) is recommended if no Kubernetes cluster is available for testing.

Create a Minikube cluster.

```shell
minikube start --container-runtime=cri-o
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

### Containerd downloads images through Dragonfly {#containerd-downloads-images-through-dragonfly}

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
2024-04-29T07:55:39.011077Z  INFO
download_task: dragonfly-client/src/grpc/dfdaemon_download.rs:276: download task succeeded
host_id="172.18.0.4-minikube"
task_id="e6eae29939870e88750daef3369cae2d7f8699ea29e1319efa1c7d4ff72a3317"
peer_id="172.18.0.4-minikube-b1490bd8-2778-405f-8871-cdeb87cf36a7"
}
```

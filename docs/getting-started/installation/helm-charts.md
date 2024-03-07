---
id: helm-charts
title: Helm Charts
---

Documentation for deploying dragonfly on kubernetes using helm.

You can configure Helm charts based on different container runtimes
It is recommended to use `Containerd`.

## Prerequisites {#prerequisites}

| Required software  | Version |
| ------------------ | ------- |
| Kubernetes cluster | 1.20+   |
| Helm               | v3.8.0+ |

## Containerd

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

### Install Dragonfly {#install-dragonfly}

Create helm charts configuration file `values.yaml`, configuration content is as follows:

Need to add other configuration, Refer to the document for [configuration](https://artifacthub.io/packages/helm/dragonfly/dragonfly#values).

```yaml
containerRuntime:
  containerd:
    enable: true
    injectConfigPath: true
    registries:
      - 'https://docker.io'
```

Create a dragonfly cluster using the configuration file:

```shell
$ helm repo add dragonfly https://dragonflyoss.github.io/helm-charts/
$ helm install --create-namespace --namespace dragonfly-system dragonfly dragonfly/dragonfly -f values.yaml

NAME: dragonfly
LAST DEPLOYED: Mon Mar  4 16:23:15 2024
NAMESPACE: dragonfly-system
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
1. Get the scheduler address by running these commands:
  export SCHEDULER_POD_NAME=$(kubectl get pods --namespace dragonfly-system -l "app=dragonfly,release=dragonfly,
  component=scheduler" -o jsonpath={.items[0].metadata.name})
  export SCHEDULER_CONTAINER_PORT=$(kubectl get pod --namespace dragonfly-system $SCHEDULER_POD_NAME
  -o jsonpath="{.spec.containers[0].ports[0].containerPort}")
  kubectl --namespace dragonfly-system port-forward $SCHEDULER_POD_NAME 8002:$SCHEDULER_CONTAINER_PORT
  echo "Visit http://127.0.0.1:8002 to use your scheduler"

1. Get the dfdaemon port by running these commands:
  export DFDAEMON_POD_NAME=$(kubectl get pods --namespace dragonfly-system -l "app=dragonfly,release=dragonfly,
  component=dfdaemon" -o jsonpath={.items[0].metadata.name})
  export DFDAEMON_CONTAINER_PORT=$(kubectl get pod --namespace dragonfly-system $DFDAEMON_POD_NAME -o jsonpath="{.spec.containers[0].ports[0].containerPort}")
  You can use $DFDAEMON_CONTAINER_PORT as a proxy port in Node.

1. Configure runtime to use dragonfly:
  https://d7y.io/docs/getting-started/quick-start/kubernetes/
```

### Wait Dragonfly Ready {#wait-dragonfly-ready}

Check that dragonfly is deployed successfully:

```shell
$ kubectl get po -n dragonfly-system
NAME                                READY   STATUS    RESTARTS   AGE
dragonfly-dfdaemon-2j57h            1/1     Running   0          92s
dragonfly-dfdaemon-fg575            1/1     Running   0          92s
dragonfly-manager-6dbfb7b47-9cd6m   1/1     Running   0          92s
dragonfly-manager-6dbfb7b47-m9nkj   1/1     Running   0          92s
dragonfly-manager-6dbfb7b47-x2nzg   1/1     Running   0          92s
dragonfly-mysql-0                   1/1     Running   0          92s
dragonfly-redis-master-0            1/1     Running   0          92s
dragonfly-redis-replicas-0          1/1     Running   0          92s
dragonfly-redis-replicas-1          1/1     Running   0          55s
dragonfly-redis-replicas-2          1/1     Running   0          34s
dragonfly-scheduler-0               1/1     Running   0          92s
dragonfly-scheduler-1               1/1     Running   0          20s
dragonfly-scheduler-2               0/1     Running   0          10s
dragonfly-seed-peer-0               1/1     Running   0          92s
dragonfly-seed-peer-1               1/1     Running   0          31s
dragonfly-seed-peer-2               0/1     Running   0          11s
```

### Run Dragonfly {#run-dragonfly}

Pull `dragonflyoss/scheduler:latest` image in kind-worker node:

```shell
docker exec -i kind-worker /usr/local/bin/crictl pull dragonflyoss/scheduler:latest
```

After pulled images, find logs in dfdaemon pod:

```shell
# find pods
kubectl -n dragonfly-system get pod -l component=dfdaemon -owide
# find logs
POD_NAME=<your-pod-name>
kubectl -n dragonfly-system exec -it ${POD_NAME} -- grep "peer task done" /var/log/dragonfly/daemon/core.log
```

Example output:

```shell
{
  "level": "info",
  "ts": "2024-03-05 12:06:31.244",
  "caller": "peer/peertask_conductor.go:1349",
  "msg": "peer task done, cost: 2751ms",
  "peer": "10.244.1.2-54896-5c6cb404-0f2b-4ac6-a18f-d74167a766b4",
  "task": "0bff62286fe544f598997eed3ecfc8aa9772b8522b9aa22a01c06eef2c8eba66",
  "component": "PeerTask",
  "trace": "31fc6650d93ec3992ab9aad245fbef71"
}
```

## Docker

> **We did not recommend to using dragonfly
> with docker in Kubernetes**
> due to many reasons:
> no fallback image pulling policy.
> deprecated in Kubernetes.
> Because the original `daemonset` in
> Kubernetes did not support `Surging Rolling Update` policy.
> When kill current dfdaemon pod,
> the new pod image can not be pulled anymore.

### Prepare Kubernetes Cluster {#docker-prepare-kubernetes-cluster}

[minikube](https://minikube.sigs.k8s.io/docs/start/) is recommended if no Kubernetes cluster is available
for testing. Just run `minikube start`.

### Install Dragonfly {#docker-install-dragonfly}

Create helm charts configuration file `values.yaml`, configuration content is as follows:

Need to add other configuration, Refer to the document for [configuration](https://artifacthub.io/packages/helm/dragonfly/dragonfly#values).

```shell
containerRuntime:
  docker:
    enable: true
    restart: true
```

Create a dragonfly cluster using the configuration file:

```shell
$ helm repo add dragonfly https://dragonflyoss.github.io/helm-charts/
$ helm install --create-namespace --namespace dragonfly-system dragonfly dragonfly/dragonfly -f values.yaml

NAME: dragonfly
LAST DEPLOYED: Mon Mar  4 16:23:15 2024
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

1. Get the dfdaemon port by running these commands:
  export DFDAEMON_POD_NAME=$(kubectl get pods --namespace dragonfly-system -l "app=dragonfly,release=dragonfly,component=dfdaemon" -o jsonpath={.items[0].metadata.name})
  export DFDAEMON_CONTAINER_PORT=$(kubectl get pod --namespace dragonfly-system $DFDAEMON_POD_NAME -o jsonpath="{.spec.containers[0].ports[0].containerPort}")
  You can use $DFDAEMON_CONTAINER_PORT as a proxy port in Node.

1. Configure runtime to use dragonfly:
  https://d7y.io/docs/getting-started/quick-start/kubernetes/
```

### Wait Dragonfly Ready {#docker-wait-dragonfly-ready}

Check that dragonfly is deployed successfully:

```shell
$ kubectl get po -n dragonfly-system
NAME                                READY   STATUS    RESTARTS   AGE
dragonfly-dfdaemon-vsggn            1/1     Running   0          123s
dragonfly-manager-6dbfb7b47-j5gpn   1/1     Running   0          123s
dragonfly-manager-6dbfb7b47-tgdxq   1/1     Running   0          123s
dragonfly-manager-6dbfb7b47-vz67b   1/1     Running   0          123s
dragonfly-mysql-0                   1/1     Running   0          123s
dragonfly-redis-master-0            1/1     Running   0          123s
dragonfly-redis-replicas-0          1/1     Running   0          123s
dragonfly-redis-replicas-1          1/1     Running   0          123s
dragonfly-redis-replicas-2          1/1     Running   0          112s
dragonfly-scheduler-0               1/1     Running   0          123s
dragonfly-scheduler-1               1/1     Running   0          121s
dragonfly-scheduler-2               1/1     Running   0          121s
dragonfly-seed-peer-0               1/1     Running   0          123s
dragonfly-seed-peer-1               1/1     Running   0          121s
dragonfly-seed-peer-2               1/1     Running   0          121s
```

### Run Dragonfly {#docker-run-dragonfly}

Pull `dragonflyoss/scheduler:latest` image in `minikube` node:

```shell
docker exec -i minikube /bin/docker pull dragonflyoss/scheduler:latest
```

After pulled images, find logs in dfdaemon pod:

```shell
# find pods
kubectl -n dragonfly-system get pod -l component=dfdaemon -owide
# find logs
POD_NAME=<your-pod-name>
kubectl -n dragonfly-system exec -it ${POD_NAME} -- grep "peer task done" /var/log/dragonfly/daemon/core.log
```

Example output:

```shell
{
  "level": "info",
  "ts": "2024-03-05 12:46:29.542",
  "caller": "peer/peertask_conductor.go:1349",
  "msg": "peer task done, cost: 32068ms",
  "peer": "10.244.0.153-231511-f19680f9-4028-46b9-be8b-8eed156183a1",
  "task": "4d4eba4c9dca752f0381ffe5093a96fb4ffbd9b0b4ea43234d942025c451b76c",
  "component": "PeerTask",
  "trace": "e35cc32974a440297016a213aa2f0e48"
}
```

## Manager Console {#manager-console}

Visit address `localhost:8080` to see the manager console. Sign in the console with the default root user,
the username is `root` and password is `dragonfly`.

If you need to bind Ingress, you can refer to
[configuration options](https://artifacthub.io/packages/helm/dragonfly/dragonfly#values)
of Helm Charts, or create it manually.

Console features preview reference document [console preview](../../reference/manage-console.md).

## Uninstall Dragonfly

To uninstall Dragonfly, execute the following command:

```shell
helm delete dragonfly --namespace dragonfly-system
```

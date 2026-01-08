---
id: dfcache
title: Dfcache
slug: /reference/commands/client/dfcache/
---

`dfcache` is the cache client to of dragonfly that communicates with dfdaemon and operates on files in P2P network,
and it can copy multiple replicas during import. P2P cache is effectively used for fast read and write cache.

## Usage

Import a file into Dragonfly P2P network.

```shell
dfcache import <PATH>
```

Export a file from Dragonfly P2P network.

```shell
dfcache export <ID> -O <OUTPUT> <PATH>
```

Get file information in Dragonfly P2P network.

```shell
dfcache stat <ID>
```

## Example

### Import

```shell
dfcache import /tmp/file.txt
```

#### Configuring persistent replicas and TTL

Use the following parameters to specify the number of replicas and ttl of the persistent cache task.

```shell
dfcache import --persistent-replica-count 3 --ttl 2h /tmp/file.txt
```

#### Importing large file

The default ID is calculated based on the file's SHA256. For large files,
this process may take longer. You can specify `--content-for-calculating-task-id` to define the file's uniqueness.
For example,
`--content-for-calculating-task-id` can be set to the filename, provided it ensures uniqueness.

```shell
dfcache import --content-for-calculating-task-id <CONTENT_FOR_CALCULATING_TASK_ID> /tmp/file.txt
```

### Export

```shell
dfcache export <ID> -O /tmp/file.txt
```

#### Export in Container {#export-in-container}

##### Install Dragonfly in the Kubernetes cluster

Deploy Dragonfly components across your cluster:

```shell
helm repo add dragonfly https://dragonflyoss.github.io/helm-charts/
helm install --create-namespace -n dragonfly-system dragonfly dragonfly/dragonfly
```

For detailed installation options, refer to [Helm Charts Installation Guide](../../../getting-started/installation/helm-charts.md).

##### Mount the Unix Domain Socket of dfdaemon to the Pod

Add the following configuration to your Pod definition to mount the Dragonfly daemon's Unix Domain Socket,
then the container can use the same dfdaemon to export files in the node.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: runtime
spec:
  containers:
    - name: runtime
      image: your-image:tag
      volumeMounts:
        - mountPath: /var/run/dragonfly
          name: dfdaemon-socket-dir
  volumes:
    - name: dfdaemon-socket-dir
      hostPath:
        path: /var/run/dragonfly
        type: DirectoryOrCreate
```

##### Install dfcache in the Container Image

Install dfcache in the Container Image, refer to [Install Client using RPM](../../../getting-started/installation/binaries.md#install-client-using-rpm)
or [Install Client using DEB](../../../getting-started/installation/binaries.md#install-client-using-deb).

##### Export via UDS(unix domain socket) of dfdaemon in the node

Once set up, use the dfcache command with the `--transfer-from-dfdaemon` flag to export files:

```shell
dfcache export --transfer-from-dfdaemon <ID> -O /tmp/file.txt
```

### Stat

```shell
dfcache stat <ID>
```

## Log

```text
1. set option --console if you want to print logs to Terminal
2. log path: /var/log/dragonfly/dfcache/
```

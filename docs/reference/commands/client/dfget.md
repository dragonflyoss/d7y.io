---
id: dfget
title: Dfget
slug: /reference/commands/client/dfget/
---

`dfget` is the client of Dragonfly used to download and upload files.
The unix socket of the dfdaemon GRPC service needs to be used during the upload and download process of dfget.
To use dfget, dfdaemon must be started.

## Usage {#usage}

dfget is the client of Dragonfly which takes
a role of peer in a P2P network. When user triggers a file downloading
task, dfget will download the pieces of
file from other peers. Meanwhile, it will act as an uploader to support other
peers to download pieces from it if it owns them.
In addition, dfget has the abilities to provide more advanced
functionality, such as network bandwidth limit,
transmission encryption and so on.

```shell
dfget -O <OUTPUT> <URL>
dfget [command]
```

## Example {#example}

### Download in Container {#download-in-container}

#### Install Dragonfly in the Kubernetes cluster

Deploy Dragonfly components across your cluster:

```shell
helm repo add dragonfly https://dragonflyoss.github.io/helm-charts/
helm install --create-namespace -n dragonfly-system dragonfly dragonfly/dragonfly
```

For detailed installation options, refer to [Helm Charts Installation Guide](../../../getting-started/installation/helm-charts.md).

#### Mount the Unix Domain Socket of dfdaemon to the Pod

Add the following configuration to your Pod definition to mount the Dragonfly daemon's Unix Domain Socket,
then the container can use the same dfdaemon to download files in the node.

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

#### Install Dfget in the Container Image

Install Dfget in the Container Image, refer to [Install Client using RPM](../../../getting-started/installation/binaries.md#install-client-using-rpm)
or [Install Client using DEB](../../../getting-started/installation/binaries.md#install-client-using-deb).

#### Download via UDS(unix domain socket) of dfdaemon in the node

Once set up, use the dfget command with the `--transfer-from-dfdaemon` flag to download files:

```shell
dfget --transfer-from-dfdaemon https://<host>:<port>/<path> -O /tmp/file.txt
```

`--transfer-from-dfdaemon` specify whether to transfer the content of downloading file from dfdaemon's unix domain socket. If it is `true`,
dfget will call dfdaemon to download the file, and dfdaemon will return the content of downloading file to
dfget via unix domain socket, and dfget will copy the content to the output path. If it is `false`, dfdaemon will
download the file and hardlink or copy the file to the output path.

### Dwonload with different protocols {#download-with-different-protocols}

#### Download with HTTP protocol

```shell
dfget https://<host>:<port>/<path> -O /tmp/file.txt
```

#### Download with S3 protocol

```shell
# Download a file.
dfget s3://<bucket>/<path> -O /tmp/file.txt --storage-access-key-id=<access_key_id> --storage-access-key-secret=<access_key_secret>

# Download a directory.
dfget s3://<bucket/<path> -O /tmp/path/ --recursive --storage-access-key-id=<access_key_id> --storage-access-key-secret=<access_key_secret>
```

#### Download with GCS protocol

```shell
# Download a file.
dfget gs://<bucket>/<path> -O /tmp/file.txt --storage-credential-path=<credential_path>

# Download a directory.
dfget gs://<bucket>/<path> -O /tmp/path/ --recursive --storage-credential-path=<credential_path>
```

#### Download with ABS protocol

```shell
# Download a file.
dfget abs://<container>/<path> -O /tmp/file.txt --storage-access-key-id=<account_name> --storage-access-key-secret=<account_key>

# Download a directory.
dfget abs://<container>/<path> -O /tmp/path/ --recursive --storage-access-key-id=<account_name> --storage-access-key-secret=<account_key>
```

#### Download with OSS protocol

```shell
# Download a file.
dfget oss://<bucket>/<path> -O /tmp/file.txt --storage-access-key-id=<access_key_id> --storage-access-key-secret=<access_key_secret> --storage-endpoint=<endpoint>

# Download a directory.
dfget oss://<bucket>/<path> -O /tmp/path/ --recursive --storage-access-key-id=<access_key_id> --storage-access-key-secret=<access_key_secret> --storage-endpoint=<endpoint>
```

#### Download with OBS protocol

```shell
# Download a file.
dfget obs://<bucket>/<path> -O /tmp/file.txt --storage-access-key-id=<access_key_id> --storage-access-key-secret=<access_key_secret> --storage-endpoint=<endpoint>

# Download a directory.
dfget obs://<bucket>/<path> -O /tmp/path/ --recursive --storage-access-key-id=<access_key_id> --storage-access-key-secret=<access_key_secret> --storage-endpoint=<endpoint>
```

#### Download with COS protocol

> Note: The endpoint does not require `BucketName-APPID`, just --storage-endpoint=cos.region.myqcloud.com.

```shell
# Download a file.
dfget cos://<bucket>/<path> -O /tmp/file.txt --storage-access-key-id=<access_key_id> --storage-access-key-secret=<access_key_secret> --storage-endpoint=<endpoint>

# Download a directory.
dfget cos://<bucket>/<path> -O /tmp/path/ --recursive --storage-access-key-id=<access_key_id> --storage-access-key-secret=<access_key_secret> --storage-endpoint=<endpoint>
```

#### Download with HDFS protocol

```shell
dfget hdfs://<path>/file.txt -O /tmp/file.txt  --hdfs-delegation-token <hadoop_delegation_token>
```

<!-- markdownlint-restore -->

## Log {#log}

```text
1. set option --console if you want to print logs to Terminal
2. log path: /var/log/dragonfly/dfget/
```

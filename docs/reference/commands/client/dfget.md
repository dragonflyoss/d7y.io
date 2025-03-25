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

## Options {#options}

<!-- markdownlint-disable -->

```text
Usage: dfget [OPTIONS] --output <OUTPUT> <URL>

Arguments:
  <URL>
          Specify the URL to download

Options:
  -O, --output <OUTPUT>
          Specify the output path of downloading file

  -e, --endpoint <ENDPOINT>
          Endpoint of dfdaemon's GRPC server

          [default: /var/run/dragonfly/dfdaemon.sock]

      --timeout <TIMEOUT>
          Specify the timeout for downloading a file

          [default: 2h]

      --piece-length <PIECE_LENGTH>
          Specify the byte length of the piece

          [default: 4194304]

  -d, --digest <DIGEST>
          Verify the integrity of the downloaded file using the specified digest, e.g. md5:86d3f3a95c324c9479bd8986968f4327

          [default: ]

  -p, --priority <PRIORITY>
          Specify the priority for scheduling task

          [default: 6]

      --application <APPLICATION>
          Caller application which is used for statistics and access control

          [default: ]

      --tag <TAG>
          Different tags for the same url will be divided into different tasks

          [default: ]

  -H, --header <HEADER>
          Specify the header for downloading file, e.g. --header='Content-Type: application/json' --header='Accept: application/json'

      --filtered-query-param <FILTERED_QUERY_PARAMS>
          Filter the query parameters of the downloaded URL. If the download URL is the same, it will be scheduled as the same task, e.g. --filtered-query-param='signature' --filtered-query-param='timeout'

      --disable-back-to-source
          Disable back-to-source download when dfget download failed

      --storage-region <STORAGE_REGION>
          Specify the region for the Object Storage Service

      --storage-endpoint <STORAGE_ENDPOINT>
          Specify the endpoint for the Object Storage Service

      --storage-access-key-id <STORAGE_ACCESS_KEY_ID>
          Specify the access key ID for the Object Storage Service

      --storage-access-key-secret <STORAGE_ACCESS_KEY_SECRET>
          Specify the access key secret for the Object Storage Service

      --storage-session-token <STORAGE_SESSION_TOKEN>
          Specify the session token for Amazon Simple Storage Service(S3)

      --storage-credential-path <STORAGE_CREDENTIAL_PATH>
          Specify the local path to credential file for Google Cloud Storage Service(GCS)

      --storage-predefined-acl <STORAGE_PREDEFINED_ACL>
          Specify the predefined ACL for Google Cloud Storage Service(GCS)

          [default: publicRead]

      --max-files <MAX_FILES>
          Specify the max count of file to download when downloading a directory. If the actual file count is greater than this value, the downloading will be rejected

          [default: 10]

      --max-concurrent-requests <MAX_CONCURRENT_REQUESTS>
          Specify the max count of concurrent download files when downloading a directory

          [default: 5]

  -l, --log-level <LOG_LEVEL>
          Specify the logging level [trace, debug, info, warn, error]

          [default: info]

      --log-dir <LOG_DIR>
          Specify the log directory

          [default: /var/log/dragonfly/dfget]

      --log-max-files <LOG_MAX_FILES>
          Specify the max number of log files

          [default: 6]

      --verbose
          Specify whether to print log

  -h, --help
          Print help (see a summary with '-h')

  -V, --version
          Print version
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

Install Dfget in the Container Image, refer to [Install Client using RPM](../../../getting-started/installation/binaries.md#install-client-using-rpm-install-client-using-rpm)
or [Install Client using DEB](../../../getting-started/installation/binaries.md#install-client-using-deb-install-client-using-deb).

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
dfget s3://<bucket/<path>/ -O /tmp/path/ --storage-access-key-id=<access_key_id> --storage-access-key-secret=<access_key_secret>
```

#### Download with GCS protocol

```shell
# Download a file.
dfget gs://<bucket>/<path> -O /tmp/file.txt --storage-credential-path=<credential_path>

# Download a directory.
dfget gs://<bucket>/<path>/ -O /tmp/path/ --storage-credential-path=<credential_path>
```

#### Download with ABS protocol

```shell
# Download a file.
dfget abs://<container>/<path> -O /tmp/file.txt --storage-access-key-id=<account_name> --storage-access-key-secret=<account_key>

# Download a directory.
dfget abs://<container>/<path>/ -O /tmp/path/ --storage-access-key-id=<account_name> --storage-access-key-secret=<account_key>
```

#### Download with OSS protocol

```shell
# Download a file.
dfget oss://<bucket>/<path> -O /tmp/file.txt --storage-access-key-id=<access_key_id> --storage-access-key-secret=<access_key_secret> --storage-endpoint=<endpoint>

# Download a directory.
dfget oss://<bucket>/<path>/ -O /tmp/path/ --storage-access-key-id=<access_key_id> --storage-access-key-secret=<access_key_secret> --storage-endpoint=<endpoint>
```

#### Download with OBS protocol

```shell
# Download a file.
dfget obs://<bucket>/<path> -O /tmp/file.txt --storage-access-key-id=<access_key_id> --storage-access-key-secret=<access_key_secret> --storage-endpoint=<endpoint>

# Download a directory.
dfget obs://<bucket>/<path>/ -O /tmp/path/ --storage-access-key-id=<access_key_id> --storage-access-key-secret=<access_key_secret> --storage-endpoint=<endpoint>
```

#### Download with COS protocol

> Note: The endpoint does not require `BucketName-APPID`, just --storage-endpoint=cos.region.myqcloud.com.

```shell
# Download a file.
dfget cos://<bucket>/<path> -O /tmp/file.txt --storage-access-key-id=<access_key_id> --storage-access-key-secret=<access_key_secret> --storage-endpoint=<endpoint>

# Download a directory.
dfget cos://<bucket>/<path>/ -O /tmp/path/ --storage-access-key-id=<access_key_id> --storage-access-key-secret=<access_key_secret> --storage-endpoint=<endpoint>
```

#### Download with HDFS protocol

```shell
dfget hdfs://<path>/file.txt -O /tmp/file.txt  --hdfs-delegation-token <hadoop_delegation_token>
```

<!-- markdownlint-restore -->

## Log {#log}

```text
1. set option --verbose if you want to print logs to Terminal
2. log path: /var/log/dragonfly/dfget/
```

---
id: dfget
title: Dfget
slug: /reference/commands/client/dfget/
---

`dfget` is the client of Dragonfly used to download and upload files.

### Usage {#usage}

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

### Options {#options}

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

      --storage-credential <STORAGE_CREDENTIAL>
          Specify the credential for Google Cloud Storage Service(GCS)

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

### Example {#example}

#### Download with HTTP protocol {#downlad-with-http}

```shell
dfget https://<host>:<port>/<path> -O /tmp/file.txt
```

#### Download with S3 protocol {#downlad-with-s3}

```shell
# Download a file.
dfget s3://<bucket>/<path> -O /tmp/file.txt --storage-access-key-id=<access_key_id> --storage-access-key-secret=<access_key_secret>

# Download a directory.
dfget s3://<bucket/<path>/ -O /tmp/path/ --storage-access-key-id=<access_key_id> --storage-access-key-secret=<access_key_secret>
```

#### Download with GCS protocol {#downlad-with-gcs}

```shell
# Download a file.
dfget gcs://<bucket>/<path> -O /tmp/file.txt --storage-credential=<credential> --storage-endpoint=<endpoint>

# Download a directory.
dfget gcs://<bucket>/<path>/ -O /tmp/path/ --storage-credential=<credential> --storage-endpoint=<endpoint>
```

#### Download with ABS protocol {#downlad-with-abs}

```shell
# Download a file.
dfget abs://<container>/<path> -O /tmp/file.txt --storage-access-key-id=<account_name> --storage-access-key-secret=<account_key> --storage-endpoint=<endpoint>

# Download a directory.
dfget abs://<container>/<path>/ -O /tmp/path/ --storage-access-key-id=<account_name> --storage-access-key-secret=<account_key> --storage-endpoint=<endpoint>
```

#### Download with OSS protocol {#downlad-with-oss}

```shell
# Download a file.
dfget oss://<bucket>/<path> -O /tmp/file.txt --storage-access-key-id=<access_key_id> --storage-access-key-secret=<access_key_secret> --storage-endpoint=<endpoint>

# Download a directory.
dfget oss://<bucket>/<path>/ -O /tmp/path/ --storage-access-key-id=<access_key_id> --storage-access-key-secret=<access_key_secret> --storage-endpoint=<endpoint>
```

#### Download with OBS protocol {#downlad-with-obs}

```shell
# Download a file.
dfget obs://<bucket>/<path> -O /tmp/file.txt --storage-access-key-id=<access_key_id> --storage-access-key-secret=<access_key_secret> --storage-endpoint=<endpoint>

# Download a directory.
dfget obs://<bucket>/<path>/ -O /tmp/path/ --storage-access-key-id=<access_key_id> --storage-access-key-secret=<access_key_secret> --storage-endpoint=<endpoint>
```

#### Download with COS protocol {#downlad-with-cos}

> Note: The endpoint does not require `BucketName-APPID`, just --storage-endpoint=cos.region.myqcloud.com.

```shell
# Download a file.
dfget cos://<bucket>/<path> -O /tmp/file.txt --storage-access-key-id=<access_key_id> --storage-access-key-secret=<access_key_secret> --storage-endpoint=<endpoint>

# Download a directory.
dfget cos://<bucket>/<path>/ -O /tmp/path/ --storage-access-key-id=<access_key_id> --storage-access-key-secret=<access_key_secret> --storage-endpoint=<endpoint>
```

### Log {#log}

```text
1. set option --verbose if you want to print logs to Terminal
2. log path: /var/log/dragonfly/dfget/
```

<!-- markdownlint-restore -->

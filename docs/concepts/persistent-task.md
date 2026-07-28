---
id: persistent-task
title: Persistent Task
slug: /concepts/persistent-task/
---

It designs to provide persistent storage for tasks. A persistent task is imported into the P2P network
with multiple replicas on different peers, and provides persistence by copying the data to object storage.
The P2P cache is effectively used for fast read and write operations, and the object storage serves as the
persistent backend. This makes it particularly advantageous for scenarios involving large files, such as
machine learning model checkpoints, where rapid, reliable access and distribution across the network are
critical for training and inference workflows.

The persistent task metadata is stored in Redis of the scheduler, so it is only available when the
scheduler is deployed with Redis, refer to
[Deployment Models](../operations/deployment/deployment-models.md).

## Dfstore

Use dfstore to import a local file into the P2P network, create replicas on different peers and
persist the data to object storage, please refer to
[dfstore](../reference/commands/client/dfstore.md).

```shell
$ dfstore import /tmp/file.txt --url s3://<bucket>/<path>
⣷ Done: s3://<bucket>/<path>
```

Use dfstore to export a file from the P2P network:

```shell
$ dfstore export s3://<bucket>/<path> --output /tmp/file.txt
[00:00:00] [############################################################] 8.73 KiB/8.73 KiB (7.30 MiB/s, 0.0s)
```

## Dfctl

List all persistent tasks in client's local storage, please refer to
[dfctl](../reference/commands/client/dfctl.md).

```shell
dfctl persistent-task ls
```

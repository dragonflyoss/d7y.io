---
id: task
title: Task
slug: /concepts/task/
---

The Resource Search feature enables seamless querying of tasks, including files, images. It optimizes resource access, improving task management and retrieval efficiency.

## Search by URL

Download a file using dfget, refer to [dfget](../reference/commands/client/dfget.md).

```shell
$ dfget https://<host>:<port>/<path> -O /tmp/file.txt
[00:00:00] [============================================================] 100% (209.63 KiB/s, 0.0s)
```

Access the console and search for tasks by URL. refer to [Search by URL](../advanced-guides/web-console/resource/task.md#search-by-url).

## Search by Image Manifest URL

Create a preheat task for image preheating, refer to [preheat-image](../advanced-guides/web-console/job/preheat.md#preheat-image).

> Notice: Deletion of the image manifest URL task cache is not supported yet.

Access the console and search for tasks by Image Manifest URL. refer to [Search by Image Manifest URL](../advanced-guides/web-console/resource/task.md#search-by-image-manifest-url).

## Search by Task ID

Download a file using dfget, refer to [dfget](../reference/commands/client/dfget.md).

```shell
$ dfget https://<host>:<port>/<path> -O /tmp/file.txt
[00:00:00] [============================================================] 100% (209.63 KiB/s, 0.0s)
```

Get task_id.

```shell
# Find task id.
$ export TASK_ID=$(grep "https://<host>:<port>/<path>" /var/log/dragonfly/dfdaemon/* | grep -o 'task_id="[^"]*"')

# Check logs.
$ grep "$TASK_ID" /var/log/dragonfly/dfdaemon/* | grep 'download task succeeded'
```

The expected output is as follows:

```shell
2025-07-07T02:15:26.640865338+00:00 INFO
download_task: dragonfly-client/src/grpc/dfdaemon_download.rs:454: download task succeeded
host_id="172.18.0.4-kind-worker"
task_id="475c16c1db17af77359d59e63047fad44c56341e2fa15a744c3890a233fb5852"
peer_id="172.18.0.4-kind-worker-3aa79d4f-fe54-4b8b-81ef-60a259b30e39"
```

Access the console and search for tasks by Task ID. refer to [Search by Task ID](../advanced-guides/web-console/resource/task.md#search-by-task-id).

## Search by Content for Calculating Task ID

Download a file using dfget, refer to [dfget](../reference/commands/client/dfget.md).

```shell
$ dfget --content-for-calculating-task-id <CONTENT_FOR_CALCULATING_TASK_ID> https://<host>:<port>/<path> -O /tmp/file.txt
[00:00:00] [============================================================] 100% (209.63 KiB/s, 0.0s)
```

Access the console and search for tasks by Content for Calculating Task ID. refer to [Search by Content for Calculating Task ID](../advanced-guides/web-console/resource/task.md#search-by-content-for-calculating-task-id).

---
id: persistent-cache-task
title: Persistent Cache Task
slug: /concepts/persistent-cache-task/
---

It designs to provide persistent caching for tasks. This tool can import file and export file in P2P network. The solution is specifically engineered for high-speed read and write operations. This makes it particularly advantageous for scenarios involving large files, such as machine learning model checkpoints, where rapid, reliable access and distribution across the network are critical for training and inference workflows. By leveraging P2P distribution and persistent caching, dfcache significantly reduces I/O bottlenecks and accelerates the lifecycle of large data assets.

![persistent-cache-task-architecture](./../resource/concepts/persistent-cache-task/persistent-cache-task-architecture.png)

## Dfcache

Use dfcache to import files, please refer to [dfcache](../reference/commands/client/dfcache.md).

```shell
$ dfcache import /tmp/file.txt
⣷ Done: e2d0fe1585a63ec6009c8016ff8dda8b17719a637405a4e23c0ff81339148249
```

Use dfcache to export files.

```shell
$ dfcache export e2d0fe1585a63ec6009c8016ff8dda8b17719a637405a4e23c0ff81339148249 -O /tmp/file.txt
[00:00:00] [############################################################] 8.73 KiB/8.73 KiB (7.30 MiB/s, 0.0s)
```

## Console

View persistent cache task details or delete a persistent cache task, please refer to [persistent cache task](../advanced-guides/web-console/resource/persistent-cache-task.md).

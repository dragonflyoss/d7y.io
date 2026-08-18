---
id: dfctl
title: Dfctl
slug: /reference/commands/client/dfctl/
---

`dfctl` is the command-line tool of Dragonfly used to manage tasks in client's local storage, including task,
persistent task and persistent cache task.

## Usage

### Task

List all tasks in client's local storage.

```shell
dfctl task ls
```

Delete a task in client's local storage.

```shell
dfctl task rm <ID>
```

Preheat a file task or an image task in advance, so that later downloads hit the cache of the peers.
`dfctl task preheat` supports two modes:

- **Scheduler gRPC mode (default)**: calls the scheduler's preheat API directly. The preheat scope is
  controlled by `--scope` (`single_seed_peer`, `all_seed_peers` or `all_peers`), and the peers to preheat
  can be narrowed by `--ip`, `--count` or `--percentage`. Use this mode when the tasks are downloaded in
  any way other than the Request SDK (e.g., `dfget` or the client proxy).
- **Request SDK mode (`--request-sdk`)**: uses the [Request SDK](../../../advanced-guides/request-sdk.md)
  to trigger the seed peers to download the task without streaming the content back to `dfctl`. Preheat
  selects the `--replicas` (default is 2) seed peers by consistent hashing on the task ID, so a later GET
  request via the Request SDK with the same replicas hits the preheated seed peers. If the tasks are
  downloaded via the Request SDK, preheating MUST use this mode, because seed peers preheated in scheduler
  gRPC mode are selected by the scheduler and are not guaranteed to be the seed peers the Request SDK
  selects by consistent hashing.

Preheat a file task in scheduler gRPC mode.

```shell
dfctl task preheat http://example.com/file.txt --scheduler-endpoint http://scheduler-service:8002
```

<!-- markdownlint-disable -->

Preheat a image task in scheduler gRPC mode.

```shell
dfctl task preheat oci://docker.io/library/nginx:latest --scheduler-endpoint http://scheduler-service:8002 --username <USERNAME>  --password <PASSWORD>
```

Preheat a file task to 50% of the available peers in scheduler gRPC mode.

```shell
dfctl task preheat http://example.com/file.txt --scheduler-endpoint http://scheduler-service:8002 --scope all_peers --percentage 50
```

Preheat a file task to 3 replicas of the seed peers in request SDK mode.

```shell
dfctl task preheat http://example.com/file.txt --scheduler-endpoint http://scheduler-service:8002 --request-sdk --replicas 3
```

Preheat a image task in request SDK mode.

```shell
dfctl task preheat oci://docker.io/library/nginx:latest --scheduler-endpoint http://scheduler-service:8002 --request-sdk --username <USERNAME>  --password <PASSWORD>
```

<!-- markdownlint-restore -->

### Persistent Task

List all persistent tasks in client's local storage.

```shell
dfctl persistent-task ls
```

### Persistent Cache Task

List all persistent cache tasks in client's local storage.

```shell
dfctl persistent-cache-task ls
```

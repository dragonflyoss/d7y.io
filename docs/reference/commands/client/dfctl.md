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

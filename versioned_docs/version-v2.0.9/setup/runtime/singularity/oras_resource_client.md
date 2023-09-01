---
id: singularity-oras-resource-client
title: Oras Resource Client Mode
slug: /setup/runtime/singularity/oras-resource-client
---

## Oras Resource Client {#oras-resource-client}

We can use oras resource client to pull image using Dragonfly, the key is the scheme used for the resource client.

This method of image pull through Dragonfly is more efficient when compared to proxy method as
it avoids TLS termination, reduces CPU time and download time as it creates hardlink(insead of copy)
for subsequent file download after downloading the image from source for first time.

## Quick Start {#quick-start}

### Step 1: Configure dfget daemon {#step-1-configure-dfget-daemon}

To use oras resource client to pull image ensure below configuraion in `/etc/dragonfly/dfget.yaml:`.

```yaml
# Peer task storage option.
storage:
  # Task data expire time,
  # when there is no access to a task data, this task will be gc.
  taskExpireTime: 6h
  strategy: io.d7y.storage.v2.advance.
  # Disk quota gc threshold, when the quota of all tasks exceeds the gc threshold, the oldest tasks will be reclaimed.
  diskGCThreshold: 50Gi
  # Disk used percent gc threshold, when the disk used percent exceeds, the oldest tasks will be reclaimed.
  # eg, diskGCThresholdPercent=80, when the disk usage is above 80%, start to gc the oldest tasks.
  diskGCThresholdPercent: 80
  # Set to ture for reusing underlying storage for same task id.
  multiplex: true

# The singularity oras resources, most of it is same with https scheme
oras:
  proxy:
  dialTimeout: 30s
  keepAlive: 30s
  maxIdleConns: 100
  idleConnTimeout: 90s
  responseHeaderTimeout: 30s
  tlsHandshakeTimeout: 30s
  expectContinueTimeout: 10s
  insecureSkipVerify: true
```

### Step 2: Pull images through oras resource client {#step-2-pull-images-through-oras-resource-client}

Through the above steps, we can start to validate if Dragonfly works as expected.

And you can pull the image through oras resource client as below:

```shell
dfget -u "oras://hostname/path/image:tag" -O /path/to/output
```

### Step 3: Validate Dragonfly {#step-3-validate-dragonfly}

You can execute the following command to
check if the image is distributed via Dragonfly.

```shell
grep "peer task done" /var/log/dragonfly/daemon/core.log
```

If the output of command above has content like

```shell
{
   "level":"info",
   "ts":"2022-09-07 12:04:26.485",
   "caller":"peer/peertask_conductor.go:1500",
   "msg":"peer task done, cost: 1ms",
   "peer":"00.000.0.000-5184-1eab18b6-bead-4a9f-b055-abcdefghihkl",
   "task":"b223b11dcb7ad19e3cfc4cg8e5af3b1699a597e974c737bb4004edeefabcdefgh",
   "component":"PeerTask"
}
```

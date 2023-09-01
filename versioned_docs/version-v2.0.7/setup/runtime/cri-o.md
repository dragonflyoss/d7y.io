---
id: cri-o
title: CRI-O
slug: /setup/runtime/cri-o
---

Use dfget daemon as registry mirror for CRI-O

## Step 1: Validate Dragonfly Configuration {#step-1-validate-dragonfly-configuration}

To use dfget daemon as registry mirror,
first you need to ensure configuration in `/etc/dragonfly/dfget.yaml`:

```yaml
proxy:
  security:
    insecure: true
  tcpListen:
    listen: 0.0.0.0
    port: 65001
  registryMirror:
    url: https://index.docker.io
  proxies:
    - regx: blobs/sha256.*
```

This will proxy all requests for image layers with dfget.

## Step 2: Validate CRI-O Configuration {#step-2-validate-cri-o-configuration}

Then, enable mirrors in CRI-O registries configuration in
`/etc/containers/registries.conf`:

```toml
[[registry]]
location = "docker.io"
  [[registry.mirror]]
  location = "127.0.0.1:65001"
  insecure = true
```

## Step 3: Restart CRI-O Daemon {#step-3-restart-cri-o-daemon}

```shell
systemctl restart crio
```

If encounter error like these:
`mixing sysregistry v1/v2 is not supported` or
`registry must be in v2 format but is in v1`,
please convert your registries configuration to v2.

## Step 4: Pull Image {#step-4-pull-image}

You can pull image like this:

```shell
crictl pull docker.io/library/busybox
```

## Step 5: Validate Dragonfly {#step-5-validate-dragonfly}

You can execute the following command to
check if the busybox image is distributed via Dragonfly.

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
   "peer":"10.140.2.175-5184-1eab18b6-bead-4b9f-b055-6c1120a30a33",
   "task":"b423e11ddb7ab19a3c2c4c98e5ab3b1699a597e974c737bb4004edeef6016ed2",
   "component":"PeerTask"
}
```

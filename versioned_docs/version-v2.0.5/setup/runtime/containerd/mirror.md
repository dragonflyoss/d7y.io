---
id: containerd-mirror
title: Mirror mode
slug: /setup/runtime/containerd/mirror
---

Use dfget daemon for containerd

From v1.1.0, Containerd supports registry mirrors,
we can configure Containerd via this feature for HA.

## Quick Start {#quick-start}

### Step 1: Configure dfget daemon {#step-1-configure-dfget-daemon}

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
    # multiple registries support, if only mirror single registry, disable this
    dynamic: true
    url: https://index.docker.io
  proxies:
    - regx: blobs/sha256.*
```

Run dfget daemon

```shell
dfget daemon
```

## Step 2: Configure Containerd {#step-2-configure-containerd}

### Option 1: Single Registry {#option-1-single-registry}

Enable mirrors in Containerd registries configuration in
`/etc/containerd/config.toml`:

```toml
# explicitly use v2 config format, if already v2, skip the "version = 2"
version = 2

[plugins."io.containerd.grpc.v1.cri".registry.mirrors."docker.io"]
  endpoint = ["http://127.0.0.1:65001","https://index.docker.io"]
```

In this config, there is two mirror endpoints for "docker.io",
Containerd will pull images with `http://127.0.0.1:65001` first.
If `http://127.0.0.1:65001` is not available,
the default `https://index.docker.io` will be used for HA.

Enable mirrors in private Containerd registries configuration in

`/etc/containerd/config.toml`:

```toml
# explicitly use v2 config format, if already v2, skip the "version = 2"
version = 2

[plugins."io.containerd.grpc.v1.cri".registry.mirrors."docker.io"]
  endpoint = ["http://127.0.0.1:65001","https://index.docker.io"]

[plugins."io.containerd.grpc.v1.cri".registry.configs."127.0.0.1:65001".auth]
  username = "registry_username"
  password = "registry_password"
```

In this config, registry auth configuration needs to be based on `127.0.0.1:65001`.

> More details about Containerd configuration: <https://github.com/containerd/containerd/blob/v1.5.2/docs/cri/registry.md#configure-registry-endpoint>
> Containerd has deprecated the above config from v1.4.0,
> new format for reference: <https://github.com/containerd/containerd/blob/v1.5.2/docs/cri/config.md#registry-configuration>

### Option 2: Multiple Registries {#option-2-multiple-registries}

This option only supports Containerd 1.5.0+.

#### 1. Enable Containerd Registries Config Path {#1-enable-containerd-registries-config-path}

Enable mirrors in Containerd registries config path in
`/etc/containerd/config.toml`:

```toml
# explicitly use v2 config format, if already v2, skip the "version = 2"
version = 2

[plugins."io.containerd.grpc.v1.cri".registry]
  config_path = "/etc/containerd/certs.d"
```

#### 2. Generate Per Registry hosts.toml {#2-generate-per-registry-hoststoml}

##### Option 1: Generate hosts.toml manually {#option-1-generate-hoststoml-manually}

Path: `/etc/containerd/certs.d/example.com/hosts.toml`

Replace `example.com` according the different registry domains.

Content:

```toml
server = "https://example.com"

[host."http://127.0.0.1:65001"]
  capabilities = ["pull", "resolve"]
  [host."http://127.0.0.1:65001".header]
    X-Dragonfly-Registry = ["https://example.com"]
```

##### Option 2: Generate hosts.toml automatically {#option-2-generate-hoststoml-automatically}

You can also generate hosts.toml with <https://github.com/dragonflyoss/Dragonfly2/blob/main/hack/gen-containerd-hosts.sh>

```shell
bash gen-containerd-hosts.sh example.com
```

> More details about registry configuration: <https://github.com/containerd/containerd/blob/main/docs/hosts.md#registry-configuration---examples>

## Step 3: Restart Containerd Daemon {#step-3-restart-containerd-daemon}

```shell
systemctl restart containerd
```

## Step 4: Pull Image {#step-4-pull-image}

You can pull image like this:

```shell
crictl pull docker.io/library/busybox
```

## Step 5: Validate Dragonfly {#step-5-validate-dragonfly}

You can execute the following command to check
if the busybox image is distributed via Dragonfly.

```shell
grep "peer task done" /var/log/dragonfly/daemon/core.log
```

If the output of command above has content like

```shell
{
  "level": "info",
  "ts": "2022-09-07 12:04:26.485",
  "caller": "peer/peertask_conductor.go:1500",
  "msg": "peer task done, cost: 1ms",
  "peer": "10.140.2.175-5184-1eab18b6-bead-4b9f-b055-6c1120a30a33",
  "task": "b423e11ddb7ab19a3c2c4c98e5ab3b1699a597e974c737bb4004edeef6016ed2",
  "component": "PeerTask"
}
```

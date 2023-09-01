---
id: cri-o
title: CRI-O
slug: /setup/runtime/cri-o
---

使用 dfdaemon 支持 CRI-O

## Step 1: 配置 Dragonfly

下面为镜像仓库的 dfdaemon 配置，在路径 `/etc/dragonfly/dfget.yaml`:

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

上面配置会拦截所有 `https://index.docker.io` 的镜像。

## Step 2: 配置 CRI-O

启动 CRI-O 镜像仓库配置 `/etc/containers/registries.conf`:

```toml
[[registry]]
location = "docker.io"
  [[registry.mirror]]
  location = "127.0.0.1:65001"
  insecure = true
```

## Step 3: 重启 CRI-O

```shell
systemctl restart crio
```

如果遇到如下错误 `mixing sysregistry v1/v2 is not supported` 或
`registry must be in v2 format but is in v1`, 请将您的镜像仓库配置为 v2。

## Step 4: 拉取镜像

使用以下命令拉取镜像:

```shell
crictl pull docker.io/library/busybox
```

## Step 5: 验证 Dragonfly 拉取成功

可以查看日志，判断 busybox 镜像正常拉取。

```shell
grep "peer task done" /var/log/dragonfly/daemon/core.log
```

如果正常日志输出如下:

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

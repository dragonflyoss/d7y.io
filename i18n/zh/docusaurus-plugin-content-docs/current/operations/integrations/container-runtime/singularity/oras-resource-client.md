---
id: singularity-oras-resource-client
title: ORAS 资源客户端
slug: /operations/integrations/container-runtime/singularity/oras-resource-client/
---

文档的目标是帮助您将 Dragonfly 的容器运行时设置为 ORAS 的资源客户端。

通过 Dragonfly 资源客户端拉取镜像的这种方法比代理方法相比更加高效，因为它避免了 TLS，减少了 CPU 资源使用量和下载时间，
因为它在首次从源下载镜像后为后续文件下载创建了硬链接，而不是复制一份完全一样的资源。

## 配置 Dfdaemon

下面为镜像仓库的 Dfdaemon 配置，在路径 `/etc/dragonfly/dfget.yaml`:

```yaml
# Peer task storage option.
storage:
  # Task data expire time.
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

# The singularity oras resources, most of it is same with https scheme.
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

## ORAS 资源客户端通过 Dragonfly 下载镜像

使用以下命令拉取镜像:

```shell
dfget -u "oras://hostname/path/image:tag" -O /path/to/output
```

### 验证镜像下载成功

可以查看日志，判断镜像正常拉取。

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
   "peer":"00.000.0.000-5184-1eab18b6-bead-4a9f-b055-abcdefghihkl",
   "task":"b223b11dcb7ad19e3cfc4cg8e5af3b1699a597e974c737bb4004edeefabcdefgh",
   "component":"PeerTask"
}
```

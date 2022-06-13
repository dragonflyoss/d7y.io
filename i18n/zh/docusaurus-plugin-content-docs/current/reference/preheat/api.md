---
id: api
title: API
---

## 配置

如果客户端为 containerd，建议将 dfget.yaml 配置 `proxy.defaultFilter` 设置为 `Expires&Signature&ns`,
因为 containerd 会将 blobs 下载 URL 增加 `ns` query params,
参考代码 [containerd/remotes/docker/resolver.go](https://github.com/containerd/containerd/blob/main/remotes/docker/resolver.go#L493)。
这样会导致生成的 Task ID 和预热的 Task ID 不相同，因此无法命中已经预热好的 Task ID。

```yaml
# proxy service detail option
proxy:
  defaultFilter: 'Expires&Signature&ns'
```

## 操作

用户使用 api 进行预热。首先发送 POST 请求创建预热任务。

如果 `scheduler_cluster_ids` 不存在，表示对所有 scheduler cluster 进行预热。

```bash
curl --location --request POST 'http://dragonfly-manager:8080/api/v1/jobs' \
--header 'Content-Type: application/json' \
--data-raw '{
    "type": "preheat",
    "args": {
        "type": "image",
        "url": "https://index.docker.io/v2/library/redis/manifests/latest"
    }
}'
```

命令行日志返回预热任务 ID。

```bash
{
    "id": 1,
    "task_id": "group_4d1ea00e-740f-4dbf-a47e-dbdc08eb33e1",
    "type": "preheat",
    "status": "PENDING",
    "args": {
        "filter": "",
        "headers": null,
        "type": "image",
        "url": "https://index.docker.io/v2/library/redis/manifests/latest"
    }
}
```

使用预热任务 ID 轮训查询任务是否成功。

```bash
curl --request GET 'http://dragonfly-manager:8080/api/v1/jobs/1'
```

如果返回预热任务状态为 `SUCCESS`，表示预热成功。

```bash
{
    "id": 1,
    "task_id": "group_4d1ea00e-740f-4dbf-a47e-dbdc08eb33e1",
    "type": "preheat",
    "status": "SUCCESS",
    "args": {
        "filter": "",
        "headers": null,
        "type": "image",
        "url": "https://index.docker.io/v2/library/redis/manifests/latest"
    }
}
```

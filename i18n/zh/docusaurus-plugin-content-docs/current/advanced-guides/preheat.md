---
id: preheat
title: 预热
---

可以使用两种方式预热，一种是通过 Open API 预热，一种是通过控制台预热。

## Open API

使用 Open API 进行预热。

### 配置

如果客户端为 containerd，建议将 dfget.yaml 配置 `proxy.defaultFilter` 设置为 `Expires&Signature&ns`,
因为 containerd 会将 blobs 下载 URL 增加 `ns` query params,
参考代码 [containerd/remotes/docker/resolver.go](https://github.com/containerd/containerd/blob/main/remotes/docker/resolver.go#L493)。
这样会导致生成的 Task ID 和预热的 Task ID 不相同，因此无法命中已经预热好的 Task ID。

```yaml
# proxy service detail option
proxy:
  defaultFilter: 'Expires&Signature&ns'
```

### 申请 Personal Access Token

调用 Open API 之前请先申请 Personal Access Token，并且 Access Scopes 选择为 `job`，参考文档 [personal-access-tokens](./personal-access-tokens.md)。

### 预热镜像

用户使用 Open API 进行预热镜像。首先发送 POST 请求创建预热任务。

如果 `scheduler_cluster_ids` 不存在，表示对所有 scheduler cluster 进行预热。

```bash
curl --location --request POST 'http://dragonfly-manager:8080/oapi/v1/jobs' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer your_dragonfly_personal_access_token' \
--data-raw '{
    "type": "preheat",
    "args": {
        "type": "image",
        "url": "https://index.docker.io/v2/library/alpine/manifests/3.19",
        "filteredQueryParams": "Expires&Signature",
        "username": "your_registry_username",
        "password": "your_registry_password"
    }
}'
```

命令行日志返回预热任务 ID。

```bash
{
  "id": 1,
  "created_at": "2024-04-18T08:51:55Z",
  "updated_at": "2024-04-18T08:51:55Z",
  "task_id": "group_2717f455-ff0a-435f-a3a7-672828d15a2a",
  "type": "preheat",
  "state": "PENDING",
  "args": {
    "filteredQueryParams": "Expires&Signature",
    "headers": null,
    "password": "",
    "pieceLength": 4194304,
    "platform": "",
    "tag": "",
    "type": "image",
    "url": "https://index.docker.io/v2/library/alpine/manifests/3.19",
    "username": ""
  },
  "scheduler_clusters": [
    {
      "id": 1,
      "created_at": "2024-04-18T08:29:15Z",
      "updated_at": "2024-04-18T08:29:15Z",
      "name": "cluster-1"
    }
  ]
}
```

使用预热任务 ID 轮训查询任务是否成功。

```bash
curl --request GET 'http://dragonfly-manager:8080/oapi/v1/jobs/1' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer your_dragonfly_personal_access_token'
```

如果返回预热任务状态为 `SUCCESS`，表示预热镜像成功。

```bash
{
  "id": 1,
  "created_at": "2024-04-18T08:51:55Z",
  "updated_at": "2024-04-18T08:51:55Z",
  "task_id": "group_2717f455-ff0a-435f-a3a7-672828d15a2a",
  "type": "preheat",
  "state": "SUCCESS",
  "args": {
    "filteredQueryParams": "Expires&Signature",
    "headers": null,
    "password": "",
    "pieceLength": 4194304,
    "platform": "",
    "tag": "",
    "type": "file",
    "url": "https://index.docker.io/v2/library/alpine/manifests/3.19",
    "username": ""
  },
  "scheduler_clusters": [
    {
      "id": 1,
      "created_at": "2024-04-18T08:29:15Z",
      "updated_at": "2024-04-18T08:29:15Z",
      "name": "cluster-1"
    }
  ]
}
```

### 预热文件

用户使用 Open API 进行预热文件。首先发送 POST 请求创建预热任务。

如果 `scheduler_cluster_ids` 不存在，表示对所有 scheduler cluster 进行预热。

```bash
curl --location --request POST 'http://dragonfly-manager:8080/oapi/v1/jobs' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer your_dragonfly_personal_access_token' \
--header 'Authorization: token your_example.com_personal_access_token' \
--data-raw '{
    "type": "preheat",
    "args": {
        "type": "file",
        "url": "https://example.com",
    }
}'
```

命令行日志返回预热任务 ID。

```bash
{
  "id": 1,
  "created_at": "2024-04-18T08:51:55Z",
  "updated_at": "2024-04-18T08:51:55Z",
  "task_id": "group_2717f455-ff0a-435f-a3a7-672828d15a2a",
  "type": "preheat",
  "state": "PENDING",
  "args": {
    "filteredQueryParams": "Expires&Signature",
    "headers": null,
    "password": "",
    "pieceLength": 4194304,
    "platform": "",
    "tag": "",
    "type": "file",
    "url": "https://index.docker.io/v2/library/alpine/manifests/3.19",
    "username": ""
  },
  "scheduler_clusters": [
    {
      "id": 1,
      "created_at": "2024-04-18T08:29:15Z",
      "updated_at": "2024-04-18T08:29:15Z",
      "name": "cluster-1"
    }
  ]
}
```

使用预热任务 ID 轮训查询任务是否成功。

```bash
curl --request GET 'http://dragonfly-manager:8080/oapi/v1/jobs/1' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer your_dragonfly_personal_access_token'
```

如果返回预热任务状态为 `SUCCESS`，表示预热文件成功。

```bash
{
  "id": 1,
  "created_at": "2024-04-18T08:51:55Z",
  "updated_at": "2024-04-18T08:51:55Z",
  "task_id": "group_2717f455-ff0a-435f-a3a7-672828d15a2a",
  "type": "preheat",
  "state": "SUCCESS",
  "args": {
    "filteredQueryParams": "Expires&Signature",
    "headers": null,
    "password": "",
    "pieceLength": 4194304,
    "platform": "",
    "tag": "",
    "type": "file",
    "url": "https://index.docker.io/v2/library/alpine/manifests/3.19",
    "username": ""
  },
  "scheduler_clusters": [
    {
      "id": 1,
      "created_at": "2024-04-18T08:29:15Z",
      "updated_at": "2024-04-18T08:29:15Z",
      "name": "cluster-1"
    }
  ]
}
```

## 控制台

使用控制台进行预热，用于文件预热。

### 展示预热信息

展示所有预热任务信息列表。

![preheats](../resource/advanced-guides/preheat/preheats.png)

### 创建预热任务

点击 `ADD PREHEAT` 按钮创建预热任务。

**Description**: 添加说明来描述预热的用途。

**Clusters**: 至少选择一个或多个 Cluster 进行预热。

**Piece Length**: 指定预热期间要下载的 Piece 的大小。默认最小值为 4MiB，最大值为 1024MiB。

**Tag**: 当预热任务的 URL 相同但 Tag 不同时，会根据 Tag 进行区分，生成的预热任务也会不同。

**URL**: 需要进行预热资源的 URL 地址。

**Filtered Query Params**: 通过设置 filteredQueryParams 参数，可以指定需要预热的资源的文件类型，过滤器用于生成唯一的任务 ID，过滤 URL 中不必要的查询参数。

![create-preheat](../resource/advanced-guides/preheat/create-preheat.png)

点击 `SAVE` 创建完成后，生成的预热任务不会立即返回结果，该预热任务会一直轮询直到返回结果。

![pending-preheat](../resource/advanced-guides/preheat/pending-preheat.png)

### 预热成功

显示预热任务详细信息，`status` 属性显示预热任务是否成功。

![success-preheat](../resource/advanced-guides/preheat/success-preheat.png)

### 预热失败

如果返回预热任务状态为 `FAILURE`，表示预热失败，并且可以查看失败日志。

![failure-preheat](../resource/advanced-guides/preheat/failure-preheat.png)

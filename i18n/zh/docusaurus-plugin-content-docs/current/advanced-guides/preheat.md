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
{"id":1,"created_at":"2024-06-13T12:22:34Z","updated_at":"2024-06-13T12:22:34Z","is_del":0,"task_id":"group_99ae9da4-614f-4f39-af8a-c68289bbd14d","bio":"","type":"preheat","state":"PENDING","args":{"filteredQueryParams":"Expires\u0026Signature","headers":null,"password":"your_registry_password","pieceLength":4194304,"platform":"","tag":"","type":"image","url":"https://index.docker.io/v2/library/alpine/manifests/3.19","username":"your_registry_username"},"result":null,"user_id":0,"user":{"id":0,"created_at":"0001-01-01T00:00:00Z","updated_at":"0001-01-01T00:00:00Z","is_del":0,"email":"","name":"","avatar":"","phone":"","state":"","location":"","bio":"","configs":null},"seed_peer_clusters":null,"scheduler_clusters":[{"id":1,"created_at":"2024-06-13T10:53:33Z","updated_at":"2024-06-13T10:53:33Z","is_del":0,"name":"cluster-1","bio":"","config":{"candidate_parent_limit":4,"filter_parent_limit":15},"client_config":{"load_limit":200},"scopes":{},"is_default":true,"seed_peer_clusters":null,"schedulers":null,"peers":null,"jobs":null}]}
```

使用预热任务 ID 轮训查询任务是否成功。

```bash
curl --request GET 'http://dragonfly-manager:8080/oapi/v1/jobs/1' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer your_dragonfly_personal_access_token'
```

如果返回预热任务状态为 `SUCCESS`，表示预热镜像成功。

```bash
{"id":6,"created_at":"2024-06-13T12:22:34Z","updated_at":"2024-06-13T12:22:39Z","is_del":0,"task_id":"group_99ae9da4-614f-4f39-af8a-c68289bbd14d","bio":"","type":"preheat","state":"SUCCESS","args":{"filteredQueryParams":"Expires\u0026Signature","headers":null,"password":"your_registry_password","pieceLength":4194304,"platform":"","tag":"","type":"image","url":"https://index.docker.io/v2/library/alpine/manifests/3.19","username":"your_registry_username"},"result":{"CreatedAt":"2024-06-13T12:22:34.851158047Z","GroupUUID":"group_99ae9da4-614f-4f39-af8a-c68289bbd14d","JobStates":[{"CreatedAt":"2024-06-13T12:22:34.851158047Z","Error":"","Results":[],"State":"SUCCESS","TTL":0,"TaskName":"preheat","TaskUUID":"task_e72976b0-a4f7-4e55-bd1c-5a67981cf70d"},{"CreatedAt":"2024-06-13T12:22:34.851410964Z","Error":"","Results":[],"State":"SUCCESS","TTL":0,"TaskName":"preheat","TaskUUID":"task_cd8e77b8-09b9-4c7b-906a-b3662b17ac0e"}],"State":"SUCCESS"},"user_id":0,"user":{"id":0,"created_at":"0001-01-01T00:00:00Z","updated_at":"0001-01-01T00:00:00Z","is_del":0,"email":"","name":"","avatar":"","phone":"","state":"","location":"","bio":"","configs":null},"seed_peer_clusters":[],"scheduler_clusters":[{"id":1,"created_at":"2024-06-13T10:53:33Z","updated_at":"2024-06-13T10:53:33Z","is_del":0,"name":"cluster-1","bio":"","config":{"candidate_parent_limit":4,"filter_parent_limit":15},"client_config":{"load_limit":200},"scopes":{},"is_default":true,"seed_peer_clusters":null,"schedulers":null,"peers":null,"jobs":null}]}
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
        "filteredQueryParams": "Expires&Signature"
    }
}'
```

命令行日志返回预热任务 ID。

```bash
{"id":1,"created_at":"2024-06-13T12:06:33Z","updated_at":"2024-06-13T12:06:33Z","is_del":0,"task_id":"group_03507603-1e3f-4f13-92a5-1644f18afdcc","bio":"","type":"preheat","state":"PENDING","args":{"filteredQueryParams":"Expires\u0026Signature","headers":null,"password":"","pieceLength":4194304,"platform":"","tag":"","type":"file","url":"https://example.com","username":""},"result":null,"user_id":0,"user":{"id":0,"created_at":"0001-01-01T00:00:00Z","updated_at":"0001-01-01T00:00:00Z","is_del":0,"email":"","name":"","avatar":"","phone":"","state":"","location":"","bio":"","configs":null},"seed_peer_clusters":null,"scheduler_clusters":[{"id":1,"created_at":"2024-06-13T10:53:33Z","updated_at":"2024-06-13T10:53:33Z","is_del":0,"name":"cluster-1","bio":"","config":{"candidate_parent_limit":4,"filter_parent_limit":15},"client_config":{"load_limit":200},"scopes":{},"is_default":true,"seed_peer_clusters":null,"schedulers":null,"peers":null,"jobs":null}]}
```

使用预热任务 ID 轮训查询任务是否成功。

```bash
curl --request GET 'http://dragonfly-manager:8080/oapi/v1/jobs/1' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer your_dragonfly_personal_access_token'
```

如果返回预热任务状态为 `SUCCESS`，表示预热文件成功。

```bash
{"id":1,"created_at":"2024-06-13T11:46:24Z","updated_at":"2024-06-13T11:46:29Z","is_del":0,"task_id":"group_dec2f298-1733-4c0d-a57d-61ce9b54784a","bio":"","type":"preheat","state":"SUCCESS","args":{"filteredQueryParams":"Expires\u0026Signature","headers":null,"password":"","pieceLength":4194304,"platform":"","tag":"","type":"file","url":"https://example.com","username":""},"result":{"CreatedAt":"2024-06-13T11:46:24.522180334Z","GroupUUID":"group_dec2f298-1733-4c0d-a57d-61ce9b54784a","JobStates":[{"CreatedAt":"2024-06-13T11:46:24.522180334Z","Error":"","Results":[],"State":"SUCCESS","TTL":0,"TaskName":"preheat","TaskUUID":"task_59dedb3f-40d6-4796-81d8-c1be7d41fdc7"}],"State":"SUCCESS"},"user_id":0,"user":{"id":0,"created_at":"0001-01-01T00:00:00Z","updated_at":"0001-01-01T00:00:00Z","is_del":0,"email":"","name":"","avatar":"","phone":"","state":"","location":"","bio":"","configs":null},"seed_peer_clusters":[],"scheduler_clusters":[{"id":1,"created_at":"2024-06-13T10:53:33Z","updated_at":"2024-06-13T10:53:33Z","is_del":0,"name":"cluster-1","bio":"","config":{"candidate_parent_limit":4,"filter_parent_limit":15},"client_config":{"load_limit":200},"scopes":{},"is_default":true,"seed_peer_clusters":null,"schedulers":null,"peers":null,"jobs":null}]}
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

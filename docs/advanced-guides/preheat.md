---
id: preheat
title: Preheat
slug: /advanced-guides/preheat/
---

There are two ways to preheat, one is to preheat through the Open API, and the other is to preheat through the console.

## Open API

Use Open API to preheat.

### Configuration

If the client is `containerd`, it is recommended to configure `proxy.defaultFilter` in dfget.yaml and set it to `Expires&Signature&ns`,
because containerd will add `ns` query params to the blobs download URL,
refer to [containerd/remotes/docker/resolver.go](https://github.com/containerd/containerd/blob/main/remotes/docker/resolver.go#L493).
Which will cause the generated Task ID to be different from the preheat Task ID, so it is impossible to hit the preheat blobs.

```yaml
# proxy service detail option
proxy:
  defaultFilter: 'Expires&Signature&ns'
```

### Create Personal Access Token

Please create personal access Token before calling Open API, and select `job` for access scopes,
refer to [personal-access-tokens](./personal-access-tokens.md).

### Preheat image

Use Open API for preheating image. First create a POST request for preheating.

If the `scheduler_cluster_ids` does not exist,
it means to preheat all scheduler clusters.

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

The command-line log returns the preheat job id.

```bash
{"id":1,"created_at":"2024-06-13T12:22:34Z","updated_at":"2024-06-13T12:22:34Z","is_del":0,"task_id":"group_99ae9da4-614f-4f39-af8a-c68289bbd14d","bio":"","type":"preheat","state":"PENDING","args":{"filteredQueryParams":"Expires\u0026Signature","headers":null,"password":"your_registry_password","pieceLength":4194304,"platform":"","tag":"","type":"image","url":"https://index.docker.io/v2/library/alpine/manifests/3.19","username":"your_registry_username"},"result":null,"user_id":0,"user":{"id":0,"created_at":"0001-01-01T00:00:00Z","updated_at":"0001-01-01T00:00:00Z","is_del":0,"email":"","name":"","avatar":"","phone":"","state":"","location":"","bio":"","configs":null},"seed_peer_clusters":null,"scheduler_clusters":[{"id":1,"created_at":"2024-06-13T10:53:33Z","updated_at":"2024-06-13T10:53:33Z","is_del":0,"name":"cluster-1","bio":"","config":{"candidate_parent_limit":4,"filter_parent_limit":15},"client_config":{"load_limit":200},"scopes":{},"is_default":true,"seed_peer_clusters":null,"schedulers":null,"peers":null,"jobs":null}]}
```

Polling the preheating status with job id.

```bash
curl --request GET 'http://dragonfly-manager:8080/oapi/v1/jobs/1' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer your_dragonfly_personal_access_token'
```

If the status is `SUCCESS`, the preheating is successful.

```bash
{"id":6,"created_at":"2024-06-13T12:22:34Z","updated_at":"2024-06-13T12:22:39Z","is_del":0,"task_id":"group_99ae9da4-614f-4f39-af8a-c68289bbd14d","bio":"","type":"preheat","state":"SUCCESS","args":{"filteredQueryParams":"Expires\u0026Signature","headers":null,"password":"your_registry_password","pieceLength":4194304,"platform":"","tag":"","type":"image","url":"https://index.docker.io/v2/library/alpine/manifests/3.19","username":"your_registry_username"},"result":{"CreatedAt":"2024-06-13T12:22:34.851158047Z","GroupUUID":"group_99ae9da4-614f-4f39-af8a-c68289bbd14d","JobStates":[{"CreatedAt":"2024-06-13T12:22:34.851158047Z","Error":"","Results":[],"State":"SUCCESS","TTL":0,"TaskName":"preheat","TaskUUID":"task_e72976b0-a4f7-4e55-bd1c-5a67981cf70d"},{"CreatedAt":"2024-06-13T12:22:34.851410964Z","Error":"","Results":[],"State":"SUCCESS","TTL":0,"TaskName":"preheat","TaskUUID":"task_cd8e77b8-09b9-4c7b-906a-b3662b17ac0e"}],"State":"SUCCESS"},"user_id":0,"user":{"id":0,"created_at":"0001-01-01T00:00:00Z","updated_at":"0001-01-01T00:00:00Z","is_del":0,"email":"","name":"","avatar":"","phone":"","state":"","location":"","bio":"","configs":null},"seed_peer_clusters":[],"scheduler_clusters":[{"id":1,"created_at":"2024-06-13T10:53:33Z","updated_at":"2024-06-13T10:53:33Z","is_del":0,"name":"cluster-1","bio":"","config":{"candidate_parent_limit":4,"filter_parent_limit":15},"client_config":{"load_limit":200},"scopes":{},"is_default":true,"seed_peer_clusters":null,"schedulers":null,"peers":null,"jobs":null}]}
```

### Preheat file

Use Open API for preheating file. First create a POST request for preheating.

If the `scheduler_cluster_ids` does not exist,
it means to preheat all scheduler clusters.

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

The command-line log returns the preheat job id.

```bash
{"id":1,"created_at":"2024-06-13T12:06:33Z","updated_at":"2024-06-13T12:06:33Z","is_del":0,"task_id":"group_03507603-1e3f-4f13-92a5-1644f18afdcc","bio":"","type":"preheat","state":"PENDING","args":{"filteredQueryParams":"Expires\u0026Signature","headers":null,"password":"","pieceLength":4194304,"platform":"","tag":"","type":"file","url":"https://example.com","username":""},"result":null,"user_id":0,"user":{"id":0,"created_at":"0001-01-01T00:00:00Z","updated_at":"0001-01-01T00:00:00Z","is_del":0,"email":"","name":"","avatar":"","phone":"","state":"","location":"","bio":"","configs":null},"seed_peer_clusters":null,"scheduler_clusters":[{"id":1,"created_at":"2024-06-13T10:53:33Z","updated_at":"2024-06-13T10:53:33Z","is_del":0,"name":"cluster-1","bio":"","config":{"candidate_parent_limit":4,"filter_parent_limit":15},"client_config":{"load_limit":200},"scopes":{},"is_default":true,"seed_peer_clusters":null,"schedulers":null,"peers":null,"jobs":null}]}
```

Polling the preheating status with job id.

```bash
curl --request GET 'http://dragonfly-manager:8080/oapi/v1/jobs/1' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer your_dragonfly_personal_access_token'
```

If the status is `SUCCESS`, the preheating is successful.

```bash
{"id":1,"created_at":"2024-06-13T11:46:24Z","updated_at":"2024-06-13T11:46:29Z","is_del":0,"task_id":"group_dec2f298-1733-4c0d-a57d-61ce9b54784a","bio":"","type":"preheat","state":"SUCCESS","args":{"filteredQueryParams":"Expires\u0026Signature","headers":null,"password":"","pieceLength":4194304,"platform":"","tag":"","type":"file","url":"https://example.com","username":""},"result":{"CreatedAt":"2024-06-13T11:46:24.522180334Z","GroupUUID":"group_dec2f298-1733-4c0d-a57d-61ce9b54784a","JobStates":[{"CreatedAt":"2024-06-13T11:46:24.522180334Z","Error":"","Results":[],"State":"SUCCESS","TTL":0,"TaskName":"preheat","TaskUUID":"task_59dedb3f-40d6-4796-81d8-c1be7d41fdc7"}],"State":"SUCCESS"},"user_id":0,"user":{"id":0,"created_at":"0001-01-01T00:00:00Z","updated_at":"0001-01-01T00:00:00Z","is_del":0,"email":"","name":"","avatar":"","phone":"","state":"","location":"","bio":"","configs":null},"seed_peer_clusters":[],"scheduler_clusters":[{"id":1,"created_at":"2024-06-13T10:53:33Z","updated_at":"2024-06-13T10:53:33Z","is_del":0,"name":"cluster-1","bio":"","config":{"candidate_parent_limit":4,"filter_parent_limit":15},"client_config":{"load_limit":200},"scopes":{},"is_default":true,"seed_peer_clusters":null,"schedulers":null,"peers":null,"jobs":null}]}
```

## Console

Use console for preheating, for file preheating.

### Preheat

Display all of the preheat tasks.

![preheats](../resource/advanced-guides/preheat/preheats.png)

### Create Preheat

Click the `ADD PREHEAT` button to create preheat task.

**Description**: Set a description.

**Clusters**: Used for clusters that need to be preheat.

**URL**: URL address used to specify the resource to be preheat.

**Tag**: When the URL of the preheat task are the same but the Tag are different, they will be distinguished based on the
tag and the generated preheat task will be different.

**Filtered Query Params**: By setting the filteredQueryParams parameter, you can specify
the file type of the resource that needs to be preheated.
The filteredQueryParams is used to generate a unique preheat task and filter unnecessary query parameters in the URL.

![create-preheat](../resource/advanced-guides/preheat/create-preheat.png)

Click the `SAVE` to generate the preheat task,the generated preheat task will not return results immediately and
you need to wait.

![penging-preheat](../resource/advanced-guides/preheat/pending-preheat.png)

### Preheat Success

If the status is `SUCCESS`, the preheating is successful.

![success-preheat](../resource/advanced-guides/preheat/success-preheat.png)

### Preheat Failure

If the status is `FAILURE`, the preheating is failure and an error log is displayed.

![failure-preheat](../resource/advanced-guides/preheat/failure-preheat.png)

---
id: preheat
title: Preheat
---

Use preheat api for preheating. First create a POST request for preheating.

## Configuration

If the client is `containerd`, it is recommended to configure `proxy.defaultFilter` in dfget.yaml and set it to `Expires&Signature&ns`,
because containerd will add `ns` query params to the blobs download URL,
refer to [containerd/remotes/docker/resolver.go](https://github.com/containerd/containerd/blob/main/remotes/docker/resolver.go#L493).
Which will cause the generated Task ID to be different from the preheat Task ID, so it is impossible to hit the preheat blobs.

```yaml
# proxy service detail option
proxy:
  defaultFilter: 'Expires&Signature&ns'
```

## Create Personal Access Token

Please create personal access Token before calling Open API, and select `job` for access scopes,
refer to [personal-access-tokens](./personal-access-tokens.md).

## Operation

If the `scheduler_cluster_ids` does not exist,
it means to preheat all scheduler clusters.

```bash
curl --location --request POST 'http://dragonfly-manager:8080/oapi/v1/jobs' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer ZDkxMDMyYTEtZDE1ZC00ZmUxLWE0ODItNDI3NTk1ZGM2YWU0' \
--data-raw '{
    "type": "preheat",
    "args": {
        "type": "image",
        "url": "https://index.docker.io/v2/library/redis/manifests/latest"
    }
}'
```

The command-line log returns the preheat job id.

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

Polling the preheating status with job id.

```bash
curl --request GET 'http://dragonfly-manager:8080/oapi/v1/jobs/1' \
--header 'Authorization: Bearer ZDkxMDMyYTEtZDE1ZC00ZmUxLWE0ODItNDI3NTk1ZGM2YWU0'
```

If the status is `SUCCESS`, the preheating is successful.

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
## Console Preheat 

Use console for preheating,for file preheating.

## About Preheat 

Display all of the preheat tasks.

![preheats](../resource/preheat/preheats.png)

## Create Preheat

Click the `ADD PREHEAT` button to create preheat task.

**Description**: Set a description.

**Clusters**: Used for clusters that need to be preheat.

**URL**: URL address used to specify the resource to be preheat.

**Tag**: When the URL of the preheat task are the same but the Tag are different, they will be distinguished based on the
tag and the generated preheat task will be different.

**Filter**: By setting the filter parameter, you can specify the file type of the resource that needs to be preheated.
The filter is used to generate a unique preheat task and filter unnecessary query parameters in the URL.

![create-preheat](../resource/preheat/create-preheat.png)

Click the `SAVE` to generate the preheat task,the generated preheat task will not return results immediately and you need to wait.

![penging-preheat](../resource/preheat/penging-preheat.png)

## Preheat Success

If the status is `SUCCESS`, the preheating is successful.

![success-preheat](../resource/preheat/preheat-success.png)

## Preheat Failure

If the status is `FAILURE`, the preheating is failure and an error log is displayed.

![failure-preheat](../resource/preheat/preheat-failure.png)

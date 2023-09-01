---
id: api
title: API
---

Use preheat apis for preheating. First create a POST request for preheating.

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

## Operation

If the `scheduler_cluster_ids` does not exist,
it means to preheat all scheduler clusters.

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
curl --request GET 'http://dragonfly-manager:8080/api/v1/jobs/1'
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

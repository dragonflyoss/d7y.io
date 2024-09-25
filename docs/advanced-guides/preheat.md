---
id: preheat
title: Preheat
slug: /advanced-guides/preheat/
---

This document will help you experience how to use Dragonfly's three preheat methods,
namely Open API preheat, console preheat and harbor preheat.


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

Polling the preheating status with job id.

```bash
curl --request GET 'http://dragonfly-manager:8080/oapi/v1/jobs/1' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer your_dragonfly_personal_access_token'
```

If the status is `SUCCESS`, the preheating is successful.

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
        "url": "https://example.com"
    }
}'
```

The command-line log returns the preheat job id.

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

Polling the preheating status with job id.

```bash
curl --request GET 'http://dragonfly-manager:8080/oapi/v1/jobs/1' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer your_dragonfly_personal_access_token'
```

If the status is `SUCCESS`, the preheating is successful.

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

## Harbor

Use harbor for preheating, for images preheating.

### Create Personal Access Token {#harbor-create-personal-access-token}

Please create personal access Token before using Harbor Preheat, and select Preheat for access scopes, refer to [personal-access-tokens](./web-console/developer/personal-access-tokens.md).

### Create Instance

Click the `NEW INSTANCE` button to create instances.

![create-instance](../resource/advanced-guides/preheat/create-instance.png)

**Provider** : Select Dragonfly as provider.

**Name**: Instance name.

**Description**: Set a description..

**Endpoint**: Enter Dragonfly manager address。

**Auto Mode**: Select verification method, It is recommended to use `OAuth` for authentication.

- **Token**: Manager personal-access-tokens.

**Options**: Whether uses a self-signed.

- **Enable**: Check or uncheck the Enable checkbox to enable/disable the instance after creation.
  cd
- **Skip certificate verification**: Optionally, select the Skip certificate verification check box.

Click the `OK` to generate the instance. The status of instance must be Healthy.

![instance](../resource/advanced-guides/preheat/instance.png)

### Create Preheat Policy

Go to Projects and open your project from the project list, and Open the P2P Preheat tab.

![policies](../resource/advanced-guides/preheat/policies.png)

Click `+ NEW POLICY` button to open the policy creation dialog.

![create-p2p-preheate](../resource/advanced-guides/preheat/create-p2p-preheate.png)

**Proider**: select a pre-configured preheat provider instance as target.

**Name**: Provider name.

**Description**: Set the Provider description.

**Filter**: By setting the Filter parameter, you can specify the image that needs to be preheated.

- **Repositories**: Set the repository filter(required) by following the [doublestar pattern](https://github.com/bmatcuk/doublestar#patterns).

- **Tags**: Set the tags filter(required) by following the same [doublestar pattern](https://github.com/bmatcuk/doublestar#patterns).

- **Labels**: Set the labels filter. Only images with matching labels will be put into the candidate list.
  Use `,` to split multiple labels.

**Trigger**: Select Manual, manually start the preheating process.

**Scope**: Select single peer to preheat.

Click the `Save` to Create P2P Provider policy.

![policie](../resource/advanced-guides/preheat/policie.png)

### Manage Executions of Preheat Policy

Select the policy by checking the checkbox at front of the row, click `ACTIONS` to open the drop down menu.

![click-exectu](../resource/advanced-guides/preheat/click-exectu.png)

Click `Execute` to start the execution of the preheat task,
the generated preheat task will not return results immediately and you need to wait.

![p2p-preheat-executions](../resource/advanced-guides/preheat/p2p-preheat-executions.png)

### Preheat Success {#harbor-preheat-success}

If the status is SUCCESS, the preheating is successful.

![executions-success](../resource/advanced-guides/preheat/executions-success.png)

### Preheat Failure {#harbor-preheat-failure}

If the status is FAILURE, the preheating is FAILURE. Click the Logs icon to view the error log.

![executions-failure](../resource/advanced-guides/preheat/executions-failure.png)

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

### Create personal access token

Click the `ADD PERSONAL ACCESS TOKENS` button to create personal access token.

**Name**: Set your token a descriptive name.

**Description**: Set a description.

**Expiration**: Set your token an expiration.

**Scopes**: Select the access permissions for the token.

![create-token](../resource/advanced-guides/personal-access-tokens/create-token.png)

Click `SAVE` and copy the token and store it. For your security, it doesn't display again.

![copy-token](../resource/advanced-guides/personal-access-tokens/copy-token.png)

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

Use console for preheating image.

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

Use harbor for preheating image, please refer to the
[harbor](https://goharbor.io/docs/2.11.0/administration/p2p-preheat/) documentation for details.

### Create personal access token {#harbor-create-personal-access-token}

Click the `ADD PERSONAL ACCESS TOKENS` button to create personal access token.

**Name**: Set your token a descriptive name.

**Description**: Set your token a descriptive information.

**Expiration**: Set your token an expiration.

**Scopes**: Select the access permissions for the token.

![create-token](../resource/advanced-guides/preheat/create-token.png)

Click `SAVE` and copy the token and store it. For your security, it doesn't display again.

![copy-token](../resource/advanced-guides/personal-access-tokens/copy-token.png)

### Create instance

Open the harbor UI, go to `Distributions` item under `Administration`
and click the `NEW INSTANCE` button to create create instance.

**Step 1:** Enter REST address of the Dragonfly Manager.

**Step 2:** Auth Mode selects OAuth for authentication.

**Step 3:** Enter personsal assess token.

![create-instance](../resource/advanced-guides/preheat/create-instance.png)

Click the `TEST CONNECTION` button to test the connectivity of the creating instance.
If the connectivity testing is successful, click the `OK` button to save the creating instance.

> Notice: Instance status must be `Healthy`.

![instance](../resource/advanced-guides/preheat/instance.png)

### Create P2P provider policy

Go to `Projects` and open your project from the project list, and open the `P2P Preheat` tab.

![p2p-preheat](../resource/advanced-guides/preheat/p2p-preheat.png)

Click the `NEW POLICY` button to create P2P provider policy.

**Step 1:** Select a pre-configured preheat provider instance as target.

**Step 2:** By setting the Filter parameter, you can specify the image that needs to be preheated.

**Step 3:** Select `Single Peer` or `All Peers` based on your needs.

- **Single Peer**: Preheat to a seed peer.

- **All Peers**: Preheat to each peer in the P2P cluster.

![create-policy](../resource/advanced-guides/preheat/create-policy.png)

### Executions Preheat policy

Click the `EXECUTE` to execute the preheating task.

![exectu-preheat](../resource/advanced-guides/preheat/exectu-preheat.png)

If the status is SUCCESS, the preheating is successful.

![executions](../resource/advanced-guides/preheat/executions.png)

Click the executions `ID` to view the detailed information of the preheating task, and click the Logs icon to view the log.

![executions-success](../resource/advanced-guides/preheat/executions-success.png)

The expected output is as follows.

![log](../resource/advanced-guides/preheat/log.png)

## Harbor using self-signed certificates

If you use Harbor with a self-signed certificate for preheat, you will need to modify the Manager configuration.

Configure Manager yaml file, The default path in Linux is `/etc/dragonfly/manager.yaml` in linux, refer to [Manager](../reference/configuration/manager.md).

> Notice: `yourdomain.crt` is Harbor's ca.crt.

```shell
job:
  # Preheat configuration.
  preheat:
    # registryTimeout is the timeout for requesting registry to get token and manifest.
    registryTimeout: 1m
    tls:
      # insecureSkipVerify controls whether a client verifies the server's certificate chain and hostname.
      insecureSkipVerify: false
      # # caCert is the CA certificate for preheat tls handshake, it can be path or PEM format string.
      caCert: /etc/certs/yourdomain.crt
```

Skip TLS verification, set `job.preheat.tls.insecureSkipVerify` to true.

```shell
job:
  # Preheat configuration.
  preheat:
    # registryTimeout is the timeout for requesting registry to get token and manifest.
    registryTimeout: 1m
    tls:
      # insecureSkipVerify controls whether a client verifies the server's certificate chain and hostname.
      insecureSkipVerify: true
      # # caCert is the CA certificate for preheat tls handshake, it can be path or PEM format string.
      # caCert: ''
```

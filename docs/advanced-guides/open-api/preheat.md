---
id: preheat
title: Preheat
slug: /advanced-guides/open-api/preheat/
---

This document will help you experience how to use Dragonfly's Open API for preheating.

## Create personal access token

Click the `ADD PERSONAL ACCESS TOKENS` button to create personal access token.

**Name**: Set your token a descriptive name.

**Description**: Set a description.

**Expiration**: Set your token an expiration.

**Scopes**: Select the access permissions for the token.

![create-token](../../resource/advanced-guides/preheat/create-token.png)

Click `SAVE` and copy the token and store it. For your security, it doesn't display again.

![copy-token](../../resource/advanced-guides/preheat/copy-token.png)

## Preheat image

Use Open API for preheating image. First create a POST request for preheating.

**scope:** Select the scope of preheat as needed.

- **Single Seed Peer**: Preheat to a seed peer.

- **All Seed Peers**: Preheat to each seed peer in the P2P cluster.

- **All Peers**: Preheat to each peer in the P2P cluster.

**scheduler_cluster_ids:** Specify the preheated scheduler cluster id,
if `scheduler_cluster_ids` is empty, it means preheating all scheduler clusters.

```bash
curl --location --request POST 'http://dragonfly-manager:8080/oapi/v1/jobs' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer your_dragonfly_personal_access_token' \
--data-raw '{
    "type": "preheat",
    "args": {
        "type": "image",
        "url": "https://index.docker.io/v2/library/alpine/manifests/3.19",
        "username": "your_registry_username",
        "password": "your_registry_password",
        "scope": "single_seed_peer"
    },
    "scheduler_cluster_ids":[1]
}'
```

The command-line log returns the preheat job id.

```bash
{
  "id": 1,
  "created_at": "0001-01-01T00:00:00Z",
  "updated_at": "0001-01-01T00:00:00Z",
  "task_id": "group_9523f30a-877d-41f7-a25f-0854228341f6",
  "type": "preheat",
  "state": "PENDING",
  "args": {
    "scope": "single_seed_peer",
    "type": "image",
    "url": "https://dockerpull.org/v2/library/alpine/manifests/3.19"
  },
  "result": null,
  "scheduler_clusters": [
    {
      "id": 1,
      "created_at": "2024-12-11T07:57:44Z",
      "updated_at": "2024-12-11T07:57:44Z",
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
  "created_at": "0001-01-01T00:00:00Z",
  "updated_at": "0001-01-01T00:00:00Z",
  "task_id": "group_9523f30a-877d-41f7-a25f-0854228341f6",
  "type": "preheat",
  "state": "SUCCESS",
  "args": {
    "scope": "single_seed_peer",
    "type": "image",
    "url": "https://dockerpull.org/v2/library/alpine/manifests/3.19"
  },
  "result": null,
  "scheduler_clusters": [
    {
      "id": 1,
      "created_at": "2024-12-11T07:57:44Z",
      "updated_at": "2024-12-11T07:57:44Z",
      "name": "cluster-1"
    }
  ]
}
```

## Preheat file

Use Open API for preheating file. First create a POST request for preheating.

**scope:** Select the scope of preheat as needed.

- **Single Seed Peer**: Preheat to a seed peer.

- **All Seed Peers**: Preheat to each seed peer in the P2P cluster.

- **All Peers**: Preheat to each peer in the P2P cluster.

**scheduler_cluster_ids:** Specify the preheated scheduler cluster id,
if `scheduler_cluster_ids` is empty, it means preheating all scheduler clusters.

```bash
curl --location --request POST 'http://dragonfly-manager:8080/oapi/v1/jobs' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer your_dragonfly_personal_access_token' \
--data-raw '{
    "type": "preheat",
    "args": {
        "type": "file",
        "url": "https://example.com",
        "scope": "single_seed_peer"
    },
    "scheduler_cluster_ids":[1]
}'
```

The command-line log returns the preheat job id.

```bash
{
  "id": 1,
  "created_at": "2024-12-11T08:30:12Z",
  "updated_at": "2024-12-11T08:30:51Z",
  "task_id": "group_4dd1da54-96ca-48ff-8f20-4fae665f677f",
  "type": "preheat",
  "state": "PENDING",
  "args": {
    "scope": "single_seed_peer",
    "type": "file",
    "url": "https://example.com"
  },
  "scheduler_clusters": [
    {
      "id": 1,
      "created_at": "2024-12-11T07:57:44Z",
      "updated_at": "2024-12-11T07:57:44Z",
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
  "created_at": "2024-12-11T08:30:12Z",
  "updated_at": "2024-12-11T08:30:51Z",
  "task_id": "group_4dd1da54-96ca-48ff-8f20-4fae665f677f",
  "bio": "",
  "type": "preheat",
  "state": "SUCCESS",
  "args": {
    "platform": "",
    "scope": "single_seed_peer",
    "type": "file",
    "url": "https://example.com"
  },
  "scheduler_clusters": [
    {
      "id": 1,
      "created_at": "2024-12-11T07:57:44Z",
      "updated_at": "2024-12-11T07:57:44Z",
      "name": "cluster-1"
    }
  ]
}
```

## Harbor

Use harbor for preheating image, please refer to the
[harbor](https://goharbor.io/docs/2.11.0/administration/p2p-preheat/) documentation for details.

### Configure self-signed certificates for registry

> Notice: If harbor is not configured self-signed certificates, please ignore the following.

To support preheating for harbor with self-signed certificates,
the Manager configuration needs to be modified.

Configure `manager.yaml`, the default path is `/etc/dragonfly/manager.yaml`,
refer to [manager config](../../reference/configuration/manager.md).

> Notice: `yourdomain.crt` is Harbor's ca.crt.

```shell
job:
  # Preheat configuration.
  preheat:
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
    tls:
      # insecureSkipVerify controls whether a client verifies the server's certificate chain and hostname.
      insecureSkipVerify: true
      # # caCert is the CA certificate for preheat tls handshake, it can be path or PEM format string.
      # caCert: ''
```

### Create personal access token {#harbor-create-personal-access-token}

Click the `ADD PERSONAL ACCESS TOKENS` button to create personal access token.

**Name**: Set your token a descriptive name.

**Description**: Set your token a descriptive information.

**Expiration**: Set your token an expiration.

**Scopes**: Select the access permissions for the token.

![create-token](../../resource/advanced-guides/preheat/create-token.png)

Click `SAVE` and copy the token and store it. For your security, it doesn't display again.

![copy-token](../../resource/advanced-guides/preheat/copy-token.png)

### Create instance

Open the harbor UI, go to `Distributions` item under `Administration`
and click the `NEW INSTANCE` button to create create instance.

**Step 1:** Enter REST address of the Dragonfly Manager.

**Step 2:** Auth Mode selects OAuth for authentication.

**Step 3:** Enter personsal assess token.

![create-instance](../../resource/advanced-guides/preheat/create-instance.png)

Click the `TEST CONNECTION` button to test the connectivity of the creating instance.
If the connectivity testing is successful, click the `OK` button to save the creating instance.

> Notice: Instance status must be `Healthy`.

![instance](../../resource/advanced-guides/preheat/instance.png)

### Create P2P provider policy

Go to `Projects` and open your project from the project list, and open the `P2P Preheat` tab.

![p2p-preheat](../../resource/advanced-guides/preheat/p2p-preheat.png)

Click the `NEW POLICY` button to create P2P provider policy.

**Scope:** Select the scope of preheat as needed.

- **Single Seed Peer**: Preheat to a seed peer.

- **All Seed Peers**: Preheat to each seed peer in the P2P cluster.

- **All Peers**: Preheat to each peer in the P2P cluster.

**Step 2:** Enter the cluster id of Dragonfly Manager in `Cluster IDs` to specify the preheated cluster.
If `Cluster IDs` is empty, it means to preheat all clusters.

![create-policy](../../resource/advanced-guides/preheat/create-policy.png)

### Executions Preheat policy

Click the `EXECUTE` to execute the preheating task.

![exectu-preheat](../../resource/advanced-guides/preheat/exectu-preheat.png)

If the status is SUCCESS, the preheating is successful.

![executions](../../resource/advanced-guides/preheat/executions.png)

Click the executions `ID` to view the detailed information of the preheating task, and click the Logs icon to view the log.

![executions-success](../../resource/advanced-guides/preheat/executions-success.png)

The expected output is as follows.

![log](../../resource/advanced-guides/preheat/log.png)

---
id: preheat
title: Preheat
slug: /advanced-guides/web-console/job/preheat/
---

In this article, you will be shown Preheat page information.

## Preheats

Display all of the preheat tasks.

![preheats](../../../resource/advanced-guides/web-console/job/preheat/preheats.png)

## Preheat

Display the preheat details, The `status` attribute shows whether the preheat is successful.

![preheat](../../../resource/advanced-guides/web-console/job/preheat/preheat-success.png)

## Preheat Failure

If the status is `FAILURE`, the preheating is failure and an error log is displayed.

![preheat-failure](../../../resource/advanced-guides/web-console/job/preheat/preheat-failure.png)

## Create Preheat

Create a preheat task.

### Preheat file

Create a preheat task for file preheating.

![create-preheat-file](../../../resource/advanced-guides/web-console/job/preheat/create-preheat-file.png)

#### Information

The information of Preheat.

**Description**: Set a description.

#### Clusters

Preheat the cluster.

**Clusters**: Used for clusters that need to be preheat.

#### URL

Used to specify the URL addresses of resources requiring preheating, supporting multiple URLs in a single preheat request.

#### Args

Args used to pass additional configuration options to the preheat task.

**Piece Length**: By setting the piece length, you can define the size of each piece downloaded during preheating. If unspecified, it’s calculated based on content length, defaulting to 4-16 MiB.

**Scope**: Select the scope of preheat as needed.

- **Single Seed Peer**: Preheat to a seed peer.

- **All Seed Peers**: Preheat to each seed peer in the P2P cluster.
  - **Count**: Count is the desired number of peers to preheat.
    This field is used only when 'IPs' is not specified. It has priority over 'Percentage'.
    It must be a value between 1 and 200 (inclusive) if provided.
  - **Percentage**: Percentage is the percentage of available peers to preheat.
    This field has the lowest priority and is only used if both 'IPs' and 'Count' are not provided.
    It must be a value between 1 and 100 (inclusive) if provided.

- **All Peers**: Preheat to each peer in the P2P cluster.
  - **Count**: Count is the desired number of peers to preheat.
    This field is used only when 'IPs' is not specified. It has priority over 'Percentage'.
    It must be a value between 1 and 200 (inclusive) if provided.
  - **Percentage**: Percentage is the percentage of available peers to preheat.
    This field has the lowest priority and is only used if both 'IPs' and 'Count' are not provided.
    It must be a value between 1 and 100 (inclusive) if provided.

**Tag**: When the URL of the preheat task are the same but the Tag are different, they will be distinguished based on the
tag and the generated preheat task will be different.

**application**: When the URL of the preheat tasks are the same but the Application are different, they will be distinguished based on the Application and the generated preheat tasks will be different.

**IPs**: IPs is a list of specific peer IPs for preheating.
This field has the highest priority: if provided, both 'Count' and 'Percentage' will be ignored.
Applies to 'all_peers' and 'all_seed_peers' scopes.

**Filtered Query Params**: By setting the filteredQueryParams parameter, you can specify
the file type of the resource that needs to be preheated.
The filteredQueryParams is used to generate a unique preheat task and filter unnecessary query parameters in the URL.

**ADD Headers**: Add headers for preheat request.

### Preheat image

Create a preheat task for image preheating.

![create-preheat-image](../../../resource/advanced-guides/web-console/job/preheat/create-preheat-image.png)

#### Information

The information of Preheat.

**Description**: Set a description.

#### Clusters

Preheat the cluster.

**Clusters**: Used for clusters that need to be preheat.

#### URL

Preheat file adds.

**URL**: URL address used to specify the resource to be preheat.

#### Args

Args used to pass additional configuration options to the preheat task.

**Platform**: The image type preheating task can specify the image architecture type. eg: linux/amd64、linux/arm64.

**Piece Length**: By setting the piece length, you can define the size of each piece downloaded during preheating. If unspecified, it’s calculated based on content length, defaulting to 4-16 MiB.

**Scope**: Select the scope of preheat as needed.

- **Single Seed Peer**: Preheat to a seed peer.

- **All Seed Peers**: Preheat to each seed peer in the P2P cluster.
  - **Count**: Count is the desired number of peers to preheat.
    This field is used only when 'IPs' is not specified. It has priority over 'Percentage'.
    It must be a value between 1 and 200 (inclusive) if provided.
  - **Percentage**: Percentage is the percentage of available peers to preheat.
    This field has the lowest priority and is only used if both 'IPs' and 'Count' are not provided.
    It must be a value between 1 and 100 (inclusive) if provided.

- **All Peers**: Preheat to each peer in the P2P cluster.
  - **Count**: Count is the desired number of peers to preheat.
    This field is used only when 'IPs' is not specified. It has priority over 'Percentage'.
    It must be a value between 1 and 200 (inclusive) if provided.
  - **Percentage**: Percentage is the percentage of available peers to preheat.
    This field has the lowest priority and is only used if both 'IPs' and 'Count' are not provided.
    It must be a value between 1 and 100 (inclusive) if provided.

**User Name**: Username is the username for authentication.

**Password**: Password is the password for authentication.

**Tag**: When the URL of the preheat task are the same but the Tag are different, they will be distinguished based on the
tag and the generated preheat task will be different.

**application**: When the URL of the preheat tasks are the same but the Application are different,
they will be distinguished based on the Application and the generated preheat tasks will be different.

**IPs**: IPs is a list of specific peer IPs for preheating.
This field has the highest priority: if provided, both 'Count' and 'Percentage' will be ignored.
Applies to 'all_peers' and 'all_seed_peers' scopes.

**Filtered Query Params**: By setting the filteredQueryParams parameter, you can specify
the file type of the resource that needs to be preheated.
The filteredQueryParams is used to generate a unique preheat task and filter unnecessary query parameters in the URL.

**ADD Headers**: Add headers for preheat request.

---
id: cluster
title: Cluster
slug: /advanced-guides/web-console/cluster/
---

In this article, you will be shown Cluster page information.

## Clusters

When you sign in successfully, you will come to the clusters list page, which will display all of the clusters information.

![clusters](../../resource/advanced-guides/web-console/cluster/clusters.png)

## Cluster

Display the cluster details, each attribute has prompt information on the button `?`.

![cluster](../../resource/advanced-guides/web-console/cluster/cluster.png)

## Create Cluster

Create a cluster, and at the same time create a set of scheduler cluster and seed peer cluster with `1:1` relationship.
A Cluster can represent a P2P cluster, including a scheduler cluster and a seed peer cluster.

![create-cluster](../../resource/advanced-guides/web-console/cluster/create-cluster.png)

### Information

The information of cluster.

**Set cluster as your default cluster**: When peer does not find a matching cluster based on scopes,
the default cluster will be used.

### Scopes

The cluster needs to serve the scope. It wil provide scheduler services and seed peer services to peers in the scope.

**Location**: The cluster needs to serve all peers in the location. When the location in the peer configuration matches
the location in the cluster, the peer will preferentially use the scheduler and the seed peer of the cluster.
It separated by "|", for example "area|country|province|city".

**IDC**: The cluster needs to serve all peers in the IDC. When the IDC in the peer configuration matches the IDC in the cluster,
the peer will preferentially use the scheduler and the seed peer of the cluster.
IDC has higher priority than location in the scopes.

**CIDRs**: The cluster needs to serve all peers in the CIDRs. The advertise IP will be reported in the peer
configuration when the peer is started, and if the advertise IP is empty in the peer configuration,
peer will automatically get expose IP as advertise IP. When advertise IP of the peer matches the CIDRs in cluster,
the peer will preferentially use the scheduler and the seed peer of the cluster.
CIDRs has higher priority than IDC in the scopes.

**Hostnames**: The cluster needs to serve all peers in Hostname. The input parameter is the multiple Hostname regexes.
The Hostname will be reported in the peer configuration when the peer is started.
When the Hostname matches the multiple Hostname regexes in the cluster,
the peer will preferentially use the scheduler and the seed peer of the cluster.
Hostname has higher priority than IDC in the scopes.Hostname has priority equal to CIDRs in the scopes.

### Config

The configuration for P2P downloads.

**Seed Peer load limit**: Int If other peers download from the seed peer, the load of the seed peer will increase.
When the load limit of the seed peer is reached, the scheduler will no longer schedule other peers to
download from the seed peer until the it has the free load.

**Peer load limit**: If other peers download from the peer, the load of the peer will increase.
When the load limit of the peer is reached, the scheduler will no longer schedule other peers to
download from the peer until the it has the free load.

**Candidate parent limit**: The maximum number of parents that the scheduler can schedule for download peer.

**Filter parent limit**: The scheduler will randomly select the number of parents from all the parents according to
the filter parent limit and evaluate the optimal parents in selecting parents for the peer to download task.
The number of optimal parent is the scheduling parent limit.

## Update Cluster

Update cluster information.

![update-cluster](../../resource/advanced-guides/web-console/cluster/update-cluster.png)

## Delete Cluster

Delete cluster and at the same time delete scheduler cluster and seed peer cluster.

![delete-cluster](../../resource/advanced-guides/web-console/cluster/delete-cluster.png)

## Scheduler

Display the scheduler details.

![scheduler](../../resource/advanced-guides/web-console/cluster/scheduler.png)

## Delete Scheduler

Delete scheduler record in database.

![delete-scheduler](../../resource/advanced-guides/web-console/cluster/delete-scheduler.png)

## Seed Peer

Display the seed peer details.

![seed-peer](../../resource/advanced-guides/web-console/cluster/seed-peer.png)

## Delete seed peer

Delete seed peer record in database.

![delete-seed-peer](../../resource/advanced-guides/web-console/cluster/delete-seed-peer.png)

## Delete all inative instances

Delete inactive schedulers and inactive seed peers record in database.

![delete-all-inative-instances](../../resource/advanced-guides/web-console/cluster/delete-all-inative-instances.png)

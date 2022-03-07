---
id: manage-console
title: Manage Console
---

Used to manage the dynamic configuration that each module depends on,
and provide keepalive and metrics functions.

## Relationship

- CDN cluster and Scheduler cluster have a `1:N` relationship
- CDN cluster and CDN instance have a `1:N` relationship
- Scheduler cluster and Scheduler instance have a `1:N` relationship

![manager-relationship](../resource/manager-console/relationship.jpg)

When the Scheduler instance starts,
it reports to the manager the Scheduler Cluster ID.
Refer to
[document](https://github.com/dragonflyoss/Dragonfly2/blob/main/docs/en/deployment/configuration/scheduler.yaml)
to configure `schedulerClusterID`.

When the CDN instance starts,
it reports to the manager the CDN Cluster ID.
Refer to
[document](https://github.com/dragonflyoss/Dragonfly2/blob/main/docs/en/deployment/configuration/cdn.yaml)
to configure `cdnClusterID`.

## User account

Default root username: `root` password: `dragonfly`.

## Pages

### User

#### Sign in

![signin](../resource/manager-console/signin.jpg)

#### Sign up

![signup](../resource/manager-console/signup.jpg)

### Configuration

#### Scheduler Cluster

##### Scheduler Cluster List

![scheduler-cluster](../resource/manager-console/scheduler-cluster.jpg)

##### Add Scheduler Cluster

![add-scheduler-cluster](../resource/manager-console/add-scheduler-cluster.jpg)

##### Configure Scheduler Cluster

![add-scheduler-cluster](../resource/manager-console/add-scheduler-cluster.jpg)

##### Configure Scheduler Cluster's Client

![configure-scheduler-cluster-client](../resource/manager-console/configure-scheduler-cluster-client.jpg)

- `load_limit`: client host can provide the maximum upload load.

#### CDN Cluster

##### CDN Cluster List

![cdn-cluster](../resource/manager-console/cdn-cluster.jpg)

##### Add CDN Cluster

![add-cdn-cluster](../resource/manager-console/add-cdn-cluster.jpg)

##### Configure CDN Cluster

![configure-cdn-cluster](../resource/manager-console/configure-cdn-cluster.jpg)

- `load_limit`: CDN host can provide the maximum upload load.

---
title: Dragonfly v2.0.9 is released
tags: [dragonfly, container image, OCI, nydus, nydus-snapshotter, containerd]
hide_table_of_contents: false
---

<!-- Posted on March 20, 2023 -->

[CNCF projects highlighted in this post](https://www.cncf.io/blog/2023/03/20/dragonfly-v2-0-9-is-released/), and migrated by [mingcheng](https://github.com/mingcheng).

 <!-- [![Dragonfly logo](https://landscape.cncf.io/logos/60b07adb6812ca92688c7a1c33b13001022b0dd73cd3b8e64a415e4f003cde16.svg)](https://www.cncf.io/projects/dragonfly "Go to Dragonfly")[![Kubernetes logo](https://landscape.cncf.io/logos/e0303fdc381c96c1b4461ad1a2437c8f050cfb856fcb8710c9104367ca60f316.svg) ](https://www.cncf.io/projects/kubernetes "Go to Kubernetes")[![Volcano logo](https://landscape.cncf.io/logos/45984434efdb609308838359d65422b44b2c60579df44a3f56c642b4161660d1.svg)](https://www.cncf.io/projects/volcano "Go to Volcano") -->

_Project post originally published on [Github](https://github.com/dragonflyoss/Dragonfly2/releases/tag/v2.0.9) by Dragonfly maintainers_

![Dragonfly provide efficient, stable, secure file distribution and image acceleration based on p2p technology to be the best practice and standard solution in cloud native architectures. It is hosted by the Cloud Native Computing Foundation (CNCF) as an Incubating Level Project](https://www.cncf.io/wp-content/uploads/2023/03/20230317123413.jpg)

Dragonfly v2.0.9 is released! 🎉🎉🎉 Thanks to the [Google Cloud Platform](https://cloud.google.com/) (GCP) Team, [Volcano Engine](https://www.volcengine.com/) Team, and [Baidu AI Cloud](https://intl.cloud.baidu.com/) Team for helping Dragonfly integrate with their public clouds. Welcome to visit [d7y.io](https://d7y.io/) website.

![Github snippit](https://www.cncf.io/wp-content/uploads/2023/03/image-7.jpg)

## **Features**

- Download tasks based on priority. Priority can be passed as parameter during the download task, or can be associated with priority in the application of the Manager console, refer to priority [protoc definition](https://github.com/dragonflyoss/api/blob/main/pkg/apis/common/v2/common.proto#L74).
- Scheduler adds PieceDownloadTimeout parameter, which indicates that if the piece download times out, the scheduler will change the task state to TaskStateFailed.
- Add health service to each GRPC service.
- Add reflection to each GRPC service.
- Manager supports redis sentinal model.
- Refactor dynconfig package to remove json.Unmarshal, improving its runtime efficiency.
- Fix panic caused by hashring not being built.
- Previously, most of the pieces were downloaded from the same parent. Now, different pieces are downloaded from different parents to improve download efficiency and distribute bandwidth among multiple parents.
- If Manager’s searcher can not found candidate scheduler clusters, It will return all the clusters for peers to check health. If check health is successful, the scheduler cluster can be used.
- Support [ORAS](https://github.com/oras-project/oras) source client to pull image.
- Add UDP ping package and GRPC protoc definition for building virtual network topology.
- The [V2 P2P protocol](https://github.com/dragonflyoss/api/tree/main/proto) has been added, and both Scheduler and Manager have implemented the API of the V2 P2P protocol, in preparation for the future Rust version of Dfdaemon.
- OSS source client supports STS access, user can set security token in header.
- Dynconfig supports to resolve addresses with health service.
- Add hostTTL and hostGCInterval in Scheduler to prevent information of abnormally exited Dfdaemon from becoming dirty data in the Scheduler.
- Add [CIDR](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) to searcher to provide more precise scheduler cluster selection for Dfdaemon.
- Refactor the metric definitions for the V1 P2P protocol and add the metric definitions for the V2 P2P protocol. Additionally, reorganize the [Dragonfly Grafana Dashboards](https://grafana.com/grafana/dashboards/?search=dragonfly), refer to [monitoring](https://d7y.io/docs/concepts/observability/monitoring).

## **Break Change**

- Using the default value for the key used to generate JWT tokens in Manager can lead to security issues. Therefore, Manager has added [JWT Key](https://github.com/dragonflyoss/Dragonfly2/pull/2161) in the configuration, and upgrading Manager requires generating a new JWT Key and setting it in the [Manager configuration](https://github.com/dragonflyoss/d7y.io/blob/main/docs/reference/configuration/manager.md?plain=1#L56).

## **Public Cloud Providers**

- **_Google Cloud Platform(GCP)_** – GCP provides click to deploy Dragonfly in [Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine) (GKE) through [Marketplace](https://console.cloud.google.com/marketplace/product/google/dragonfly), refer to [Click to Deploy Dragonfly](https://console.cloud.google.com/marketplace/product/google/dragonfly).
- **_Alibaba Cloud(Aliyun)_** – Aliyun provides install Dragonfly 1.x in [Container Registry](https://console.cloud.google.com/marketplace/product/google/dragonfly), refer to Use P2P Acceleration in [ASK](https://www.alibabacloud.com/help/en/container-registry/latest/use-the-p2p-acceleration-feature-in-ask-and-ack-clusters). **Recommend to deploy the more efficient and stable [Dragonfly 2.0](https://github.com/dragonflyoss/Dragonfly2)**, refer to Setup [Dragonfly in Kubernetes](https://d7y.io/docs/getting-started/quick-start/kubernetes/).
- **_Volcano Engine_** – Volcano Engine provides Dragonfly integration in Volcano Engine Kubernetes Engine(VKE) and Container Registry(CR), visit [VKE](https://www.volcengine.com/product/vke) & [CR](https://www.volcengine.com/product/cr) to Learn more.
- **_Baidu AI Cloud_** – Baidu AI Cloud provides click to P2P Acceleration in [Cloud Container Engine](https://intl.cloud.baidu.com/product/cce.html) (CCE), power by Dragonfly.

## **Others**

You can see [CHANGELOG](https://github.com/dragonflyoss/Dragonfly2/blob/main/CHANGELOG.md) for more details.

## **Links**

- Dragonfly Website: [https://d7y.io/](https://d7y.io/)
- Dragonfly Github: [https://github.com/dragonflyoss/Dragonfly2](https://github.com/dragonflyoss/Dragonfly2)
- Dragonfly Charts Github: [https://github.com/dragonflyoss/helm-charts](https://github.com/dragonflyoss/helm-charts)
- Dragonfly Monitor Github: [https://github.com/dragonflyoss/monitoring](https://github.com/dragonflyoss/monitoring)
- Google Kubernetes Engine(GKE): [https://cloud.google.com/kubernetes-engine](https://cloud.google.com/kubernetes-engine)
- Google Cloud Platform(GCP) Dragonfly Marketplace: [https://console.cloud.google.com/marketplace/product/google/dragonfly](https://console.cloud.google.com/marketplace/product/google/dragonfly)
- Alibaba Cloud Container Registry: [https://www.alibabacloud.com/product/container-registry](https://www.alibabacloud.com/product/container-registry)
- Alibaba Cloud Container Service for Kubernetes (ACK): [https://www.alibabacloud.com/product/kubernetes](https://www.alibabacloud.com/product/kubernetes)
- Volcano Engine Kubernetes Engine(VKE): [https://www.volcengine.com/product/vke](https://www.volcengine.com/product/vke)
- Volcano Engine Container Registry(CR): [https://www.volcengine.com/product/cr](https://www.volcengine.com/product/cr)
- Baidu AI Cloud Cloud Container Engine(CCE): [https://intl.cloud.baidu.com/product/cce.html](https://intl.cloud.baidu.com/product/cce.html)

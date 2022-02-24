---
title: Dragonfly adoption in DCOS of China Mobile Group Zhejiang Co., Ltd
authors:
- name: Chen Yuanzheng
  title: Cloud Computing Architect at China Mobile Group Zhejiang Co., Ltd
- name: Wang Miaoxin
  title: Cloud Computing Architect at China Mobile Group Zhejiang Co., Ltd
tags: [dragonfly, china mobile]
description: This article mainly describes Dragonfly's implementation in the container cloud platform (DCOS) at China Mobile Group Zhejiang Co., Ltd to resolve problems in the large-scale cluster scenario, such as low distribution efficiency, low success rate, and difficult network bandwidth control. In addition, Dragonfly upgraded its features and established high availability deployment based on feedback from the DCOS platform to the community.
hide_table_of_contents: false
---

## Dragonfly adoption in DCOS of China Mobile Group Zhejiang Co., Ltd

![611.jpg | center | 827x347](https://user-images.githubusercontent.com/9465626/51097124-ab05eb00-17fc-11e9-890c-51617620feb0.png "")

In November 2018, Dragonfly, a cloud-native image distribution system from Alibaba,
was on display at KubeCon Shanghai and has become a CNCF sandbox level project since then.

Dragonfly mainly resolves the image distribution problems in Kubernetes-based distributed application orchestration
systems. In 2017, open source became one of Alibaba's most central infrastructure technologies.
A year after Alibaba adopted open source as a core technology,
Dragonfly has been used in a variety of industrial fields.

DCOS is the container cloud platform at China Mobile Group Zhejiang Co., Ltd. Currently,
185 application systems are running on this platform,
including core systems such as the China Mobile service mobile app and the CRM application.
This article mainly describes Dragonfly's implementation in the container cloud platform (DCOS) at
China Mobile Group Zhejiang Co., Ltd to resolve problems in the large-scale cluster scenario,
such as low distribution efficiency, low success rate, and difficult network bandwidth control.
In addition, Dragonfly upgraded its features and established high availability deployment based on feedback from
the DCOS platform to the community.

## __Challenges Faced by the DCOS Container Cloud in the Production Environment__

As the DCOS container cloud platform continuously improves and hosts more and more applications
(nearly 10,000 running containers), it has become increasingly difficult for distribution service systems
using traditional C/S (client-server) architecture to meet requirements in scenarios such as publishing code packages
and transmitting files in large-scale distributed applications due to the following reasons:

* Downloading code packages fail due to factors like computing node network exceptions, eventually influencing
the integrity and consistency of application code packages.
* Terabytes of data may need to be transmitted in multiuser and highly-concurrent scenarios. However,
the single-node performance bottlenecks prolong application publishing time.

## __What Is Dragonfly?__

P2P (peer-to-peer) is a node-to-node network technology that connects individual nodes and distributes resources
and services in networks among individual nodes. Information transmission
and service implementation are carried out directly across nodes to avoid single-node performance bottlenecks
that may otherwise occur in traditional C/S architecture.

![612.jpg | center | 612x264](https://user-images.githubusercontent.com/9465626/51097148-df79a700-17fc-11e9-807a-99421e7a6d14.png "")

Dragonfly is a CNCF open-source file distribution service solution based on the P2P and CDN technologies
and suitable for distributing container images and files. Dragonfly can efficiently resolve low file
and image distribution efficiency, low success rate, and network bandwidth control problems in
an enterprise's large-scale cluster scenarios.

Core components of Dragonfly:

* SuperNode: Downloads files from a file source in a passive CDN manner and produces seed data blocks.
* In a P2P network, a supernode serves as a network controller to schedule block data transmission among nodes.
* dfget proxy: Deployed on computing nodes and responsible for downloading data blocks to P2P nodes
* and sharing data among nodes.

Dragonfly distribution principle (take image distribution, for example): Unlike ordinary files,
container images consist of multiple storage layers. Downloading container images is also performed
at a layer level instead of downloading a single file. Images in each layer can be divided into data blocks
and serve as seeds. After container images are downloaded, the unique IDs of images in each layer
and the sha256 algorithm are used to combine downloaded images into complete images.
Consistency is ensured during the downloading process.

![613.jpg | center | 643x229](https://cdn.nlark.com/lark/0/2018/jpeg/168324/1545132849354-01a2b0c7-ce7c-4fa1-9b82-a28e4bf15513.jpeg "")

The following diagram shows how images are downloaded in Dragonfly.

![614.jpg | center | 622x379](https://cdn.nlark.com/lark/0/2018/jpeg/168324/1545132858016-ab4b43c1-8ec8-40b1-8f9b-b8ebe20cc9c9.jpeg "")

1. The dfget-proxy intercepts the image download request (docker pull) from the docker client and converts
it into the dfget download request targeting the SuperNode.
2. The SuperNode downloads images from the image source warehouse and divides them into multiple seed data blocks.
3. The dfget downloads data blocks and openly shares the downloaded data blocks. The SuperNode records information
about downloading data blocks and guides the subsequent requests to download data blocks across nodes in a P2P manner.
4. The Docker daemon uses its image pull mechanism to combine image files into complete images.

Based on the preceding Dragonfly characteristics and the actual production conditions, China Mobile Group Zhejiang Co.,
Ltd decided to introduce the Dragonfly technology into its container cloud platform
to reform its existing code package publishing model,
share the transmission bandwidth bottleneck on a single file server by using a P2P network,
and ensure the consistency of image files throughout the publishing process.

## __Solution: Unified Distribution Platform__

### __Functional Architecture Design__

#### Functional Architecture Design

Based on the Dragonfly technology and the production practices of China Mobile Group Zhejiang Co., Ltd,
the unified distribution platform has the following overall design objectives:

* Use Dragonfly and the file download verification feature to resolve the inconsistency during the process publishing
application code and the long publishing time problems in the current publishing process;
* Provide support for interface-based clients, block background command details, and simplify the process to achieve
higher efficiency;
* Support distribution in various cloud environments, including Mesos, K8s, Host, and VM, implement self-discovery
of clusters, and enable users to manage target clusters via the unified distribution platform;
* Add the user permission control and task bandwidth restriction features and support multi-tenant
and multitask distribution;
* Optimize the P2P Agent deployment models and enable faster P2P networking of computing nodes.

Based on these objectives, the overall architecture design is as follows:

![615.jpg | center | 677x418](https://user-images.githubusercontent.com/9465626/51097197-2b2c5080-17fd-11e9-8bde-842de19c577f.png "")

* The P2P network layer is a distribution network that consists of multiple computing nodes
and allows different heterogeneous clusters (host clusters, K8s clusters, and Mesos clusters) to be connected;
* As the core architecture of the entire universal distribution system,
the distribution service layer consists of the functional modules and the storage modules. Among them,
the user access authentication module provides the system login verification feature; based on Dragonfly,
the distribution control module implements task distribution in a P2P manner;
the traffic control module enables tenants to configure bandwidth for different tasks;
the configuration info database is responsible for recording basic information,
such as target clusters in the network layer and task status;
the status query module enables users to closely monitor the distribution task progress;
* The user action layer consists of any number of interface-based clients.

#### Technical Architecture Implementation

According to the preceding platform design objectives and architecture analyses,
the DOCS container cloud team conducted secondary development of
the platform features based on the open-source components, including the following:

* Use of interface-based clients;
* Addition of the open source image warehouse "Harbor" to store images and the "Minio" Object Storage Service to store files;
* Use of MySQL and Redis as CMDBs and the ability of MySQL manage data, such as cluster status and user information,
to support "one-click" creation of tasks targeting clusters. Use of Redis to save status information
about distribution tasks and provide highly concurrent and low-latency status query services;
* Both the core service layer (Docktrans) of the platform and the API gateway service layer (Edgetrans) are stateless,
cluster-oriented, and dynamically scalable core groups:
  * The API gateway encapsulates the internal system architecture and is responsible for receiving and forwarding
  task requests sent by clients, authenticating user access to individual functional modules,
  and providing customized API calls to external services;
  * The core service layer is the engine that processes business logic for all functional modules on the platform.
  During the distribution process, the core service layer sends the download request to the P2P proxy node
  via unified remote calls and completes the "one-to-many" client/task cluster distribution.
  * Both df-master and df-client are Dragonfly components. df-master is the SuperNode in Dragonfly,
  and df-client is the peer-to-peer node proxy (dfget proxy) in a P2P network.

![616.jpg | center | 629x527](https://user-images.githubusercontent.com/9465626/51097224-59aa2b80-17fd-11e9-97c1-97325b1d8b6e.png "")

#### __Technical Characteristics__

* df-client implements container mirroring. The lightweight container deployment improves networking efficiency.
The cluster host nodes that are newly added to the network layer can start P2P Agent nodes in a few seconds
by downloading and starting images.
* The core interface layer (Docktrans) screens the command-line details at the bottom layer
of dfget and provides interface-based features to simplify user operations. Distributing to multiple P2P task nodes
via unified remote calls eliminates the need for users to perform download operations, like dfget,
node by node and simplifies the "one-to-many" task launching model.

## __Core Functional Modules: Interaction Process of Distribution Control Interfaces__

__The following figure shows how the core modules of the unified distribution platform distribute tasks.__

1. A user uses the client to create an image or file distribution task.
2. The distribution module judges whether the user has the distribution permission by using the authentication
feature provided by the API service gateway (Edgetrans).
3. After the user passes authentication, sets parameters for the distribution task, and provides the cluster ID,
the platform reads cluster configuration information from the MySQL database to implement the self-discovery of
the cluster nodes. The user can also specify multiple node IPs as custom cluster parameters.
4. Depending on the distribution type, the distribution module in the core service layer (Docktrans) converts
front-end distribution requests into dfget (for files) or Docker pull (for images) commands, and distributes commands
down to multiple node df-clients for processing by remotely calling the Docker Service.
5. During the process of performing the task, task progress and task transaction logs are written to the Redis database
and the MySQL database, respectively, to enable users to query task status.

![617.jpg | center | 650x750](https://user-images.githubusercontent.com/9465626/51097240-7c3c4480-17fd-11e9-805f-df31277515c0.png "")

## __Production Environment Reformation Results__

Currently, over 200 business systems and over 1,700 application modules that are currently running
in the production environment have been optimized to use the image publishing model.
The time consumption for publishing and the publishing success rate have significantly improved.
After the P2P image publishing method is adopted, the monthly success rate of publishing multiple applications
at a time is steady at 98%.

![618.png | center | 750x452](https://user-images.githubusercontent.com/9465626/51097253-937b3200-17fd-11e9-9ad3-82507c482fd4.png "")

After April, the container cloud platform began using the P2P image publishing method in place
of the code package publishing model in traditional distribution systems. After the platform is reformed,
publishing multiple applications intensively at once significantly reduces time consumption (by 67% on average).

![619.jpg | center | 806x437](https://user-images.githubusercontent.com/9465626/51097258-9f66f400-17fd-11e9-90a2-20f339134349.png "")

n the meantime, the container cloud platform selects multiple application clusters to test the efficiency
in publishing a single application's P2P images after the transformation. As we can see,
the time consumption for publishing a single application is significantly reduced (by 81.5% on average)
compared with consumption by the platform before reformation.

![620.jpg | center | 756x418](https://user-images.githubusercontent.com/9465626/51097263-a8f05c00-17fd-11e9-8f0e-218a9fc84b71.png "")

## __Subsequent Utilization Plans__

The unified file distribution platform has resolved the efficiency and consistency problems faced
by China Mobile Group Zhejiang Co., Ltd when using its DCOS platform to publish code
and has become a key component of the platform.
The unified file distribution platform also supports efficient file distribution in larger-scale clusters.
This distribution platform can be consecutively applied to batch-distribute cluster installation media
and batch-update cluster configuration files.

## __Community Co-Construction: Interface Function Display__

### __Community Requirements Resulting from Directly Introducing Dragonfly__

* Lack of graphical interfaces contributes to high cost for users and low operation efficiency;
* The user permission management and distribution audit features are not available, and the distribution control cannot
be implemented;
* The "one-to-many" cluster operation model is not supported. In the cloud environment, users usually need distribution
to multiple clusters at the same time as management takes place, but the current model only supports distribution
on a single node;
* The traditional Agent application package deployment is too inefficient to implement fast scalability
of large-scale clusters. Serving as the system software increases the level of intrusion into host systems.

Currently, the interface-based client is almost developed and is in production testing and deployment.
The four planned core features of the distribution platform are Task Management, Target Management,
Permission Management, and System Analysis. Currently, the first three features are available.

#### __Permission Management__

Permission Management (namely, user management)
is designed to provide customized permission management features targeting different users, as listed below:

* It supports the creation, deletion, and modification operations for various user roles (super administrator,
task cluster administrator, and task administrator);
* It supports the customized combination of collections with different permissions (role creation) and allows
user permissions to be granted;
* It supports access from external system users and allows permissions to be granted to external
system users (not yet available).

![621.jpg | center | 775x356](https://user-images.githubusercontent.com/9465626/51097288-e3f28f80-17fd-11e9-9034-b8677a705907.png "")

![622.jpg | center | 777x291](https://user-images.githubusercontent.com/9465626/51097289-e81ead00-17fd-11e9-8354-c26008ec4ac2.png "")

#### __Target Management__

Target Management enables users to manage target cluster nodes when distributing tasks and manage
P2P cluster networking,
as well as cluster node status and health, as described below:

* It supports the creation and deletion operations on various user clusters;
* In the user-managed clusters, it supports automated container agent deployment, fast addition
or deletion of P2P network nodes, and node status monitoring;
* It enables different types of clusters, such as host (physical machine and virtual machine),
K8s, and Mesos clusters, to access the network. It also supports directly reading of K8s
and Mesos cluster node info and batch access of the P2P network layer.

![623.jpg | center | 768x352](https://user-images.githubusercontent.com/9465626/51097307-fd93d700-17fd-11e9-92fc-dd708ba437fa.png "")

![624.jpg | center | 770x375](https://user-images.githubusercontent.com/9465626/51097310-01275e00-17fe-11e9-9c91-a183d6d6bf73.png "")

#### __Task Management__

Task Management enables users to create, delete, and stop file or image distribution tasks and perform other operations,
as detailed below:：

* It supports the image warm-up mode (enabling users to set scheduled distribution tasks and distribute images
or files to nodes in advance);
* This feature supports the distribution of files in various formats, such as container images;
* It makes it possible to "one-click" create, perform, delete, and stop tasks on multiple nodes
in a specified task cluster, as well as copy executed tasks;
* It supports the creation, deletion, and management of the published file versions;
* It supports viewing distribution task status and task logs.

![625.jpg | center | 768x356](https://user-images.githubusercontent.com/9465626/51097318-1a300f00-17fe-11e9-80b5-660e8bad3b04.png "")

![626.jpg | center | 777x358](https://user-images.githubusercontent.com/9465626/51097319-1dc39600-17fe-11e9-9226-26b80fdb25be.png "")

#### __System Analysis (coming soon)__

The system analysis feature is expected to be released later to provide platform administrators and users
with statistical graphs showing information such as task distribution time consumption, success rate,
and task execution efficiency and facilitate platform intelligence via data statistics and prediction.

## __Community Co-Construction: High-Availability Deployment of Production__

Active-standby mirror database disaster tolerance ensures data consistency between the active
and standby databases through image synchronization.

* The P2P publishing method consists of df-master and df-client (in blue).
The df-master pulls images from the mirror database to form P2P seeds,
and two df-masters are configured in each data center;
* P2P distribution is only performed in local data centers to avoid traffic across data centers;
* Two mirrors (standby mirror databases) are configured in each data center.
In the event of P2P distribution exceptions, computing nodes automatically go to the mirrors to download images.
* Mirrors implement high availability through load balancing.

![626.jpg | center | 777x358](https://user-images.githubusercontent.com/9465626/51097333-359b1a00-17fe-11e9-9cb1-79ff762f675a.png "")

We currently plan to contribute interface feature displays to the CNCF Dragonfly community
to further enrich community content. We hope that more people join and help to improve the community.

Authors:

Chen Yuanzheng Cloud Computing Architect at China Mobile Group Zhejiang Co., Ltd

Wang Miaoxin Cloud Computing Architect at China Mobile Group Zhejiang Co., Ltd

## __Dragonfly Community Sharing__

__Tai Yun, a contributor in the Dragonfly community, said during a Dragonfly Meetup：__

Dragonfly is now a CNCF sandbox project with 2700+ stars. Many enterprises are using Dragonfly
to resolve various problems they have encountered when distributing images and files.
We will continuously improve Dragonfly to provide a more powerful and simpler distribution tool
for cloud-native applications.I look forward to working with you to make Dragonfly a CNCF 'graduated'
project as soon as possible.

### __Official GitHub page__

<https://github.com/dragonflyoss/Dragonfly>

### __Dragonfly Roadmap__

<https://github.com/dragonflyoss/Dragonfly/blob/master/ROADMAP.md>

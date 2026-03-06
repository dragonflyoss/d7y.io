---
title: TOC votes to move Dragonfly into CNCF incubator
tags: [audit, dragonfly, container image, OCI, nydus, nydus-snapshotter, containerd]
hide_table_of_contents: true
---

This post was migrated by [mingcheng](https://github.com/mingcheng) from the CNCF Blog, [the orginal post can be found here](https://www.cncf.io/blog/2020/04/09/toc-votes-to-move-dragonfly-into-cncf-incubator/).

Today, the CNCF Technical Oversight Committee (TOC) voted to accept Dragonfly as an incubation-level hosted project.

[Dragonfly](https://d7y.io/en-us/), which was accepted into the CNCF Sandbox in October 2018, is an open source, cloud native image and file distribution system. Dragonfly was created in June 2015 by Alibaba Cloud to improve the user experience of image and file distribution in Kubernetes. This allows engineers in enterprises to focus on the application itself rather than infrastructure management.

“Dragonfly is one of the backbone technologies for container platforms within Alibaba’s ecosystem, supporting billions of application deliveries each year, and in use by many enterprise customers around the world,” said, Li Yi, senior staff engineer, Alibaba. “Alibaba looks forward to continually improving Dragonfly, making it more efficient and easier to use.”

The goal of Dragonfly is to tackle distribution problems in cloud native scenarios. The project is comprised of three main components: supernode plays the role of central scheduler and controls all distribution procedure among the peer network; dfget resides on each peer as an agent to download file pieces; and “dfdaemon” plays the role of proxy which intercepts image downloading requests from container engine to dfget.

“Dragonfly improves the user experience by taking advantage of a P2P image and file distribution protocol and easing the network load of the image registry,” said Sheng Liang, TOC member and project sponsor. “As organizations across the world migrate their workloads onto container stacks, we expect the adoption of Dragonfly to continue to increase significantly.”

Dragonfly integrates with other CNCF projects, including Prometheus, containerd, Habor, Kubernetes, and Helm. Project maintainers come from Alibaba, ByteDance, eBay, and Meitu, and there are more than 20 contributing companies, including NetEase, JD.com, Walmart, VMware, Shopee, ChinaMobile, Qunar, ZTE, Qiniu, NVIDIA, and others.

Main Dragonfly Features:

- P2P based file distribution: Using P2P technology for file transmission, which can make full use of the bandwidth resources of each peer to improve download efficiency, saves a lot of cross-IDC bandwidth, especially costly cross-board bandwidth.
- Non-invasive support for all kinds of container technologies: Dragonfly can seamlessly support various containers for distributing images.
- Host level speed limit: Many downloading tools (wget/curl) only have rate limit for the current download task, but dragonfly also provides a rate limit for the entire host.
- Passive CDN: The CDN mechanism can avoid repetitive remote downloads.

Notable Milestones:

- 7 project maintainers from 4 organizations

<!-- truncate -->

- 67 contributors
- 21 contributing organizations
- 4.6k + GitHub stars
- 100k + downloads in Docker Hub
- 120% increase in commits last year

Since it joined the CNCF sandbox, Dragonfly has grown rapidly across industries including e-commerce, telecom, financial, internet, and more. Users include organizations like Alibaba, China Mobile, Ant Financial, Huya, Didi, iFLYTEK, and others.

“As cloud native adoption continues to grow, the distribution of container images in large scale production environments becomes an important challenge to tackle, and we are glad that Dragonfly shares some of those initial lessons learned at Alibaba,” said Chris Aniszczyk, CTO/COO of CNCF. “The Dragonfly project has made a lot of strides recently as it was completely rewritten in Golang for performance improvements, and we look forward to cultivating and diversifying the project community.”

In its latest version, Dragonfly 1.0.0, the project has been completely rewritten in Golang to improve ease of use with other cloud native technologies. Now Dragonfly brings a more flexible and scalable architecture, more cloud scenarios, and a potential integration with [OCI (Open Container Initiative)](https://www.opencontainers.org/) to make image distribution more efficient.

“We are very excited for Dragonfly to move into incubation,” said Allen Sun, staff engineer at Alibaba and Dragonfly project maintainer. “The maintainers have been working diligently to improve on all aspects of the project, and we look forward to seeing what this next chapter will bring.”

As a CNCF hosted project, joining incubating technologies like OpenTracing, gRPC, CNI, Notary, NATS, Linkerd, Helm, Rook, Harbor, etcd, OPA, CRI-O, TiKV, CloudEvents, Falco, and Argo, Dragonfly is part of a neutral foundation aligned with its technical interests, as well as the larger Linux Foundation, which provides governance, marketing support, and community outreach.

Every CNCF project has an associated maturity level: sandbox, incubating, or graduated. For more information on maturity requirements for each level, please visit the [CNCF Graduation Criteria v.1.3](https://github.com/cncf/toc/blob/master/process/graduation_criteria.adoc).

Learn more about Dragonfly, visit [https://github.com/dragonflyoss/Dragonfly](https://github.com/dragonflyoss/Dragonfly).

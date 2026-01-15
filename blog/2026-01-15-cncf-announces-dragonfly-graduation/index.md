---
title: Cloud Native Computing Foundation Announces Dragonfly’s Graduation
tags: [cncf, graduation, dragonfly, container image, OCI, nydus, nydus-snapshotter, containerd]
hide_table_of_contents: false
---

_Dragonfly graduates after demonstrating production readiness, powering container and AI workloads at scale._

**Key Highlights:**

- Dragonfly graduates from CNCF after demonstrating production readiness and widespread adoption across container and AI workloads.
- Dragonfly is used by major organizations, including Ant Group, Alibaba, Datadog, DiDi, and Kuaishou to power large-scale container and AI model distribution.
- Since joining the CNCF, Dragonfly is backed by over a 3,000% growth in code contributions and a growing contributor community spanning over 130 companies.

**SAN FRANCISCO, Calif. – January 14, 2026 – The Cloud Native Computing Foundation® (CNCF®)**, which builds sustainable ecosystems for cloud
native software, today announced the graduation of **Dragonfly**, a cloud native open source image and file distribution system designed to
solve cloud native image distribution in Kubernetes-centered applications.

“Dragonfly’s graduation reflects the project’s maturity, broad industry adoption and critical role in scaling cloud native infrastructure,” said Chris Aniszczyk, CTO, CNCF. “It’s especially exciting to see the project’s impact in accelerating image distribution and meeting the data demands of AI workloads. We’re proud to support a community that continues to push forward scalable, efficient and open solutions.”

### Dragonfly’s Technical Capabilities

Dragonfly delivers efficient, stable, and secure data distribution and acceleration powered by peer-to-peer (P2P) technology.
It aims to provide a best‑practice, standards‑based solution for cloud native architectures to improve large‑scale delivery
of files, container images, OCI artifacts, AI models, caches, logs, and dependencies.

Dragonfly runs on **Kubernetes** and is installed via **Helm**, with its official chart available on **Artifact Hub**. It also includes tools
like **Prometheus** for tracking performance, **OpenTelemetry** for collecting and sharing data, and **gRPC** for rapid communication between parts.
Enhancing **Harbor** capability to distribute images and OCI artifacts through the preheat feature. In the GenAI era, as model
serving becomes increasingly important, Dragonfly delivers even more value by distributing AI model artifacts defined by the **ModelPack** specification.

Dragonfly continues to advance container image distribution, supporting tens of millions of container launches per day in
production, saving storage bandwidth by up to 90%, and reducing launch time from minutes to seconds, with large-scale
adoption across different cloud native scenarios.

Dragonfly is also driving standards and acceleration solutions for distributing both AI model weights and optimized image layout in
AI workloads. The technology reduces data loading for large-scale AI applications and enables the distribution of model weights at
a hundred-terabyte scale to hundreds of nodes in minutes. As AI continues to integrate into operations, Dragonfly
becomes crucial to powering large-scale AI workloads.

### Milestones Driving Graduation

Dragonfly was open-sourced by Alibaba Group in November 2017. It then joined the CNCF as a Sandbox project in October 2018.
During this stage, Dragonfly 1.0 became production-ready in November 2019 and the Dragonfly subproject, Nydus, was open-sourced
in January 2020. Dragonfly then reached Incubation phase in April 2020, with Dragonfly 2.0 later released in 2021.

Since then, the community has significantly matured and attracted hundreds of contributors from organizations such as
Ant Group, Alibaba Cloud, ByteDance, Kuaishou, Intel, Datadog, Zhipu AI, and more, who use Dragonfly to deliver efficient image and AI model distribution.

Since joining CNCF, contributors have increased by 500%, from 45 individuals across 5 companies to 271 individuals across over 130 companies.
Commit activity has grown by over 3,000%, from roughly 800 to 26,000 commits, and the number of overall participants has reached 1,890.

### What’s Next For Dragonfly

Dragonfly will accelerate AI model weight distribution based on RDMA, improving throughput and reducing end-to-end latency.
It will also optimize image layout to reduce data loading time for large-scale AI workloads. A load-aware two-phase scheduling
will be introduced, leveraging collaboration between the scheduler and clients to enhance overall distribution efficiency.
To provide more stable and reliable services, Dragonfly will support automatic updates and fault recovery, ensuring stable
operation of all components during traffic bursts while controlling back-to-source traffic.

### Dragonfly’s Graduation Process

To officially graduate from Incubation status, the Dragonfly team enhanced the election policy, clarified the maintainer lifecycle,
standardized the contribution process, defined the community ladder, and added community guidelines for subprojects.
The graduation process is supported by CNCF’s **Technical Oversight Committee (TOC)** sponsors for Dragonfly, Karena Angell and Kevin Wang,
who conducted a thorough technical due diligence with Dragonfly’s project maintainers.

Additionally, a **third-party security audit** of Dragonfly was conducted. The Dragonfly team along with the guidance of
their TOC sponsors, completed both a self-assessment and a joint assessment with **CNCF TAG Security**, then collaborated with
the Dragonfly security team on a threat model. After this, the team improved the project’s security policy.

Learn more about Dragonfly and join the community: <https://d7y.io/>

### Supporting Quotes

“I am thrilled, as the founder of Dragonfly, to announce its graduation from the CNCF. We are grateful to
each and every open source contributor in the community, whose tenacity and commitment have enabled
Dragonfly to reach its current state. Dragonfly was created to resolve Alibaba Group’s challenges with ultra-large-scale
file distribution and was open-sourced in 2017. Looking back on this journey over the past eight years,
every step has embodied the open source spirit and the tireless efforts of the many contributors.
This graduation marks a new starting point for Dragonfly. I hope that the project will embark on a new journey, continue
to explore more possibilities in the field of data distribution, and provide greater value!”

<!-- markdownlint-disable MD036 -->

**—Zuozheng Hu, founder of Dragonfly, emeritus maintainer**

<!-- markdownlint-enable MD036 -->

“I am delighted that Dragonfly is now a CNCF graduated project. This is a significant milestone, reflecting the maturity of
the community, the trust of end users, and the reliability of the service. In the future, with the support of CNCF,
the Dragonfly team will work together to drive the community’s sustainable growth and attract more contributors.
Facing the challenges of large-scale model distribution and data distribution in the GenAI era, our team will continue to
explore the future of data distribution within the cloud native ecosystem.”

<!-- markdownlint-disable MD036 -->

**—Wenbo Qi (Gaius), core Dragonfly maintainer**

<!-- markdownlint-enable MD036 -->

“Since open-sourcing in 2020, Nydus, alongside Dragonfly, has been validated at production scale. Dragonfly’s graduation is
a key milestone for Nydus as a subproject, allowing the project to continue improving the image filesystem’s usability
and performance. It will also allow us to further explore ecosystem standardization and AGI use cases that will advance the underlying infrastructure.”

<!-- markdownlint-disable MD036 -->

**—Song Yan, core Nydus maintainer**

<!-- markdownlint-enable MD036 -->

“The combination of Dragonfly and Nydus substantially shortens launch times for container images and AI models, enhancing system resilience and efficiency.”

<!-- markdownlint-disable MD036 -->

**—Jiang Liu, Nydus maintainer**

<!-- markdownlint-enable MD036 -->

“Thanks to the community’s collective efforts, Dragonfly has evolved from a tool for accelerating container images into
a secure and stable distribution system widely adopted by many enterprises. Continuous improvements in usability and
stability enable the project to support a variety of scenarios, including CI/CD, edge computing, and AI.
New challenges are emerging for the distribution of model weights and data in the age of AI. Dragonfly is becoming
a key infrastructure in mitigating these challenges. With the support of the CNCF, Dragonfly will continue to
drive the future evolution of cloud native distribution technologies.”

<!-- markdownlint-disable MD036 -->

**—Yuan Yang, Dragonfly maintainer**

<!-- markdownlint-enable MD036 -->

### TOC Sponsors

“We’re grateful to the TOC members who dedicated significant time to the technical due diligence required for
Dragonfly’s advancement, as well as the technical leads and community members who supported governance and
technical reviews. We also thank the project maintainers for their openness and responsiveness throughout this process,
and the end users who met with TOC and TAB members to share their experiences with Dragonfly.
This level of collaboration is what helps ensure the strength and credibility of the CNCF ecosystem.”

<!-- markdownlint-disable MD036 -->

**—Karena Angell, chair, TOC, CNCF**

<!-- markdownlint-enable MD036 -->

“Dragonfly’s graduation is a testament to the project’s technical maturity and the community’s consistent focus on
performance, reliability, and tangible impact. It’s been impressive to see Dragonfly evolve to meet the needs of
large-scale production environments and AI workloads. Congratulations to the maintainers and contributors who’ve worked hard to reach this milestone.”

<!-- markdownlint-disable MD036 -->

**—Kevin Wang, vice chair, TOC, CNCF**

<!-- markdownlint-enable MD036 -->

### Project End Users

“Over the past few years, as part of Ant Group’s container infrastructure, the Dragonfly project has accelerated container image
and code package delivery across several 10K-node Kubernetes clusters. It has significantly saved image transmission
bandwidth, and the Nydus subproject has additionally helped us to reduce image pull time to near zero.
The project also supports the delivery of large language models within our AI infrastructure. It is a great honor to
have contributed to Dragonfly and to have shared our practices with the community.”

<!-- markdownlint-disable MD036 -->

**—Xu Wang, head of the container infra team, Ant Group, and co-launcher of Kata Containers Project**

<!-- markdownlint-enable MD036 -->

“Dragonfly has become a key infrastructure component of the container image and data distribution system for Alibaba’s
large-scale distributed systems. In ultra-large-scale scenarios such as the Double 11 (Singles’ Day) shopping festival,
Dragonfly has provided stable and efficient distribution capabilities and has improved the efficiency of system scaling and delivery.
Facing the new technological challenges of the AI era, Dragonfly has played an important role in model data distribution and
cache acceleration, helping us to build a more efficient, intelligent computing platform. We are happy to see Dragonfly
graduate, which represents an enhancement in community maturity and validates its reliability in large-scale production environments.”

<!-- markdownlint-disable MD036 -->

**—Li Yi, director of engineering for container service, Alibaba Cloud & Tao Huang, director of engineering for cloud native transformation project, Alibaba Group**

<!-- markdownlint-enable MD036 -->

“Datadog recently adopted the Dragonfly subproject, Nydus, and it has helped significantly reduce time spent pulling images.
This includes AI workloads, where image pulls previously took 5 minutes, and node daemonsets, which have startup speeds directly
related to how quickly applications can be scheduled on nodes. We have seen significant improvements using Nydus,
now everything starts in a matter of seconds. We are thrilled to see Dragonfly graduate and hope to continue to contribute to this impressive ecosystem!”

<!-- markdownlint-disable MD036 -->

**—Baptiste Girard-Carrabin, Datadog**

<!-- markdownlint-enable MD036 -->

“DiDi uses a distributed cloud platform to handle a large number of user requests and quickly adjust resources, which
requires very efficient and stable management of resource distribution and image synchronization. Dragonfly is a
core component of our technical architecture due to its strong cloud native adaptability, excellent P2P acceleration
capabilities, and proven stability in large-scale scenarios. We believe that Dragonfly’s graduation is a strong
testament to its technical maturity and industry value. We also look forward to its continued advancement in
the field of cloud native distribution, providing more efficient solutions for large-scale
file synchronization, image distribution, and other enterprise scenarios.”

<!-- markdownlint-disable MD036 -->

**—Feng Wu, head of the Elastic Cloud, DiDi & Rapier Yang, head of the Elastic Cloud, DiDi**

<!-- markdownlint-enable MD036 -->

“At Kuaishou, Dragonfly is considered the cornerstone of our container infrastructure, and it will soon provide
stable and reliable image distribution capabilities for tens of thousands of services and hundreds of thousands of servers.
Integrated with its subproject Nydus, Dragonfly dramatically enhances application startup efficiency while significantly
alleviating disk I/O pressure—ensuring stability for services. In the era of AI large models, Dragonfly also functions as
a critical component of our AI infrastructure, providing exceptional acceleration capabilities for large model distribution.
We are deeply honored to partner with the vibrant Dragonfly community in collectively exploring future innovations for
cloud native distribution technologies.”

<!-- markdownlint-disable MD036 -->

**—Wang Yao, head of container registry service of Kuaishou**

<!-- markdownlint-enable MD036 -->

### About Cloud Native Computing Foundation

Cloud native computing empowers organizations to build and run scalable applications with an open source software stack in
public, private, and hybrid clouds. The Cloud Native Computing Foundation (CNCF) hosts critical components of
the global technology infrastructure, including Kubernetes, Prometheus, and Envoy. CNCF brings together the
industry’s top developers, end users, and vendors and runs the largest open source developer conferences in the world.
Supported by nearly 800 members, including the world’s largest cloud computing and software companies, as well as
over 200 innovative startups, CNCF is part of the nonprofit Linux Foundation. For more information, please visit www.cncf.io.

---
title: Dragonfly 完成安全审计!
tags: [security, audit, OSTIF, Trail of Bits, dragonfly, container image, OCI, nydus, nydus-snapshotter, containerd]
hide_table_of_contents: false
---

今年夏天，在四个工程师周的时间里，[Trail of Bits](https://www.trailofbits.com/) 和 OSTIF 合作对 Dragonfly2 进行了安全审计。
作为 [CNCF](https://www.cncf.io/) 孵化项目，[Dragonfly2](https://d7y.io/) 是基于 P2P 技术的文件分发系统。
该范围包括用于镜像分发的 Dragonfly 子项目 [Nydus](https://nydus.dev/)。
此次合作围绕与项目毕业时的安全性和寿命相关的几个目标进行了概述和构造。

Trail of Bits 审计团队通过使用静态和手动测试以及自动化和手动流程来进行审计。
通过引入 semgrep 和 CodeQL 工具，对客户端、调度程序和管理器代码进行手动审查，
并对 gRPC 处理程序进行模糊测试，审计团队能够识别项目的各种结果，以提高其安全性。
通过将工作重点放在高级业务逻辑和外部可访问端上，Trail of Bits 审计团队能够在审计过程中确定重点，
并为 Dragonfly2 未来的工作提供指导和建议。

审计报告记录了 19 项调查结果。其中 5 个调查结果被评为高，1 个为中，4 个为低，5 个为信息性，
4 个被认为是未确定的。其中 9 个调查结果被归类为数据验证，其中 3 个属于高严重性。
Dragonfly2 的代码库成熟度也进行了排名和审查，包括项目代码的 11 个方面，报告中对这些方面进行了单独分析。

这是一个很庞大的项目，由于时间和范围的限制，无法全面审查。由于这些原因，
多个专门功能不在本次审核的范围之内。该项目是在毕业前继续进行审计工作以改进
和提升代码并强化安全性的绝佳机会。持续的安全努力至关重要，因为安全是一个不断变化的目标。

我们要感谢 Trail of Bits 团队，特别是 Dan Guido、Jeff Braswell、Paweł Płatek 和 Sam Alws
在此项目上所做的工作。感谢 Dragonfly2 的维护者和贡献者，
特别是戚文博，他们持续的工作和对本次活动的贡献。
最后，我们感谢 CNCF 为此次审计提供资金并支持开源安全工作。

## Links

### OSTIF & Trail of Bits

- OSTIF: [https://ostif.org/](https://ostif.org/)
- Trail of Bits: [https://www.trailofbits.com/](https://www.trailofbits.com/)
- Security Audit of Dragonfly: [https://ostif.org/dragonfly-audit/](https://ostif.org/dragonfly-audit/)

### Dragonfly community

- Website: [https://d7y.io/](https://d7y.io/)
- Github Repo: [https://github.com/dragonflyoss/Dragonfly2](https://github.com/dragonflyoss/Dragonfly2)
- Slack Channel: [#dragonfly](https://cloud-native.slack.com/messages/dragonfly/) on [CNCF Slack](https://slack.cncf.io/)
- Discussion Group: <dragonfly-discuss@googlegroups.com>
- Twitter: [@dragonfly_oss](https://twitter.com/dragonfly_oss)

### Nydus community

- Website: [https://nydus.dev/](https://nydus.dev/)
- Github Repo: [https://github.com/dragonflyoss/image-service](https://github.com/dragonflyoss/image-service)
- Slack Channel: [#nydus](https://join.slack.com/t/nydusimageservice/shared_invite/zt-pz4qvl4y-WIh4itPNILGhPS8JqdFm_w)

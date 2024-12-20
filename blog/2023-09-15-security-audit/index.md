---
title: Dragonfly completes security audit!
tags: [security, audit, OSTIF, Trail of Bits, dragonfly, container image, OCI, nydus, nydus-snapshotter, containerd]
hide_table_of_contents: false
---

This summer, over four engineer weeks, [Trail of Bits](https://www.trailofbits.com/) and
OSTIF collaborated on a security audit of dragonfly.
A [CNCF](https://www.cncf.io/) Incubating Project, [dragonfly](https://d7y.io/) functions as
file distribution for peer-to-peer technologies.
Included in the scope was the sub-project [Nydus](https://nydus.dev/)’s repository that works in image distribution.
The engagement was outlined and framed around several goals relevant to the security and longevity of
the project as it moves towards graduation.

The Trail of Bits audit team approached the audit by using static and manual testing with automated and manual processes.
By introducing semgrep and CodeQL tooling, performing a manual review of client, scheduler, and manager code,
and fuzz testing on the gRPC handlers, the audit team was able to identify a variety of findings for the project to
improve their security. In focusing efforts on high-level business logic and externally accessible endpoints,
the Trail of Bits audit team was able to direct their focus during the audit and
provide guidance and recommendations for dragonfly’s future work.

Recorded in the audit report are 19 findings. Five of the findings were ranked as high, one as medium, four low,
five informational, and four were considered undetermined. Nine of the findings were categorized as
Data Validation, three of which were high severity. Ranked and reviewed as well was dragonfly’s Codebase Maturity,
comprising eleven aspects of project code which are analyzed individually in the report.

This is a large project and could not be reviewed in total due to time constraints and scope.
multiple specialized features were outside the scope of this audit for those reasons.
this project is a great opportunity for continued audit work to improve and elevate code and
harden security before graduation. Ongoing efforts for security is critical, as security is a moving target.

We would like to thank the Trail of Bits team, particularly Dan Guido, Jeff Braswell, Paweł Płatek,
and Sam Alws for their work on this project. Thank you to the dragonfly maintainers and contributors,
specifically Wenbo Qi, for their ongoing work and contributions to this engagement.
Finally, we are grateful to the CNCF for funding this audit and supporting open source security efforts.

## Links

### OSTIF & Trail of Bits

- OSTIF: [https://ostif.org/](https://ostif.org/)
- Trail of Bits: [https://www.trailofbits.com/](https://www.trailofbits.com/)
- Security Audit of Dragonfly: [https://ostif.org/dragonfly-audit/](https://ostif.org/dragonfly-audit/)

### Dragonfly community

- Website: [https://d7y.io/](https://d7y.io/)
- Github Repo: [https://github.com/dragonflyoss/dragonfly](https://github.com/dragonflyoss/dragonfly)
- Slack Channel: [#dragonfly](https://cloud-native.slack.com/messages/dragonfly/) on [CNCF Slack](https://slack.cncf.io/)
- Discussion Group: <dragonfly-discuss@googlegroups.com>
- Twitter: [@dragonfly_oss](https://twitter.com/dragonfly_oss)

### Nydus community

- Website: [https://nydus.dev/](https://nydus.dev/)
- Github Repo: [https://github.com/dragonflyoss/image-service](https://github.com/dragonflyoss/image-service)
- Slack Channel: [#nydus](https://join.slack.com/t/nydusimageservice/shared_invite/zt-pz4qvl4y-WIh4itPNILGhPS8JqdFm_w)

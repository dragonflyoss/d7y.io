---
id: upgrade
title: Dragonfly2 Upgrade
---

## Upgrade the cluster deployed by Helm

User can deploy a Dragonfly2 cluster on kubernetes with [Helm](./kubernetes/helm.md).
The [helm chart](https://github.com/dragonflyoss/helm-charts) is a project managed by Dragonfly2 Team.

Before Upgrade, user must read the [Change Log](https://github.com/dragonflyoss/Dragonfly2/blob/main/CHANGELOG.md) to
make sure the breaking changes between the current version and target version.

```shell script
# check the dragonfly repo existence
helm repo list | grep dragonfly

# [Optional] add repo if not exist
helm repo add dragonfly https://dragonflyoss.github.io/helm-charts/

# update locally cached repo information
helm repo update

# upgrade the dragonfly
helm upgrade --install -n dragonfly-system dragonfly dragonfly/dragonfly --version 0.5.50 [-f values.yaml]
```

Note:

1. On the above example, `dragonfly/dragonfly` means `dragonfly` release under `dragonfly` repo,
   `0.5.50` is the upgrading target version，user can specify the version as you want.
2. If user need specify extra parameters, user can edit the `values.yaml` you configured for the old release and
   specify with `-f values.yaml`.
3. If you want to drop the chart parameters you configured for the old release or set some new parameters,
   it is recommended to add `--reset-values` flag in helm upgrade command.
4. For those users can't fetch the chart from remote repo, follow this step:

```shell script
# download dragonfly2 helm chart from github source repo. use version 0.5.50 as an example

# method 1：
wget https://github.com/dragonflyoss/helm-charts/releases/download/dragonfly-0.5.50/dragonfly-0.5.50.tgz
# method 2：
git clone -b dragonfly-0.5.50 --depth=1  https://github.com/dragonflyoss/helm-charts.git

# upgrade the dragonfly
helm upgrade --install -n dragonfly-system dragonfly <Path/To/Chart> [-f values.yaml | --reset-values]
```

---
id: upgrade
title: 升级
slug: /setup/upgrade
---

## 升级 Helm 部署的集群

用户可以通过 Helm 在 kubernetes 上部署 Dragonfly2 集群,
部署时所使用的 [helm chart](https://github.com/dragonflyoss/helm-charts) 也是 Dragonfly 团队维护的。
用户可以在 [Artifact Hub](https://artifacthub.io/packages/helm/dragonfly/dragonfly) 上找到 Dragonfly2 发布的官方 chart 包。

用户在升级前务必仔细阅读 [Change Log](https://github.com/dragonflyoss/Dragonfly2/blob/main/CHANGELOG.md),
确认当前版本与目标版本之间不存在兼容性问题。

升级步骤为:

```shell script
# 检查是否存在 helm repo
helm repo list | grep dragonfly

# [可选] 如果 repo 不存在则添加
helm repo add dragonfly https://dragonflyoss.github.io/helm-charts/

# 更新本地 repo 信息
helm repo update

# 执行升级命令
helm upgrade --install -n dragonfly-system dragonfly dragonfly/dragonfly [--version 0.5.50] [-f values.yaml]
```

**注意：**

1. 上述例子中，`dragonfly/dragonfly` 表示 `dragonfly` repo 下的 `dragonfly` release,
   `0.5.50` 为指定升级的目标版本，用户根据需要修改。
2. 如果有需要修改的参数，可以在之前安装时使用的 values.yaml 中修改，并通过 `-f values.yaml` 参数指定。
3. 如果要重置之前旧版本上用的参数或者配置一些新参数，可在 helm upgrade 命令后加上 `--reset-values`。
4. 如果希望使用原有参数作为 values 的默认值，可在 helm upgrade 命令后加上 `--reuse-values`。
5. 更多对于 `helm upgrade` 子命令的介绍请参考[官方文档](https://helm.sh/zh/docs/helm/helm_upgrade/)
6. 如果用户无法访问远程仓库下载相应的 chart 包，可以参考下面步骤:

   ```shell script
   # 从 dragonfly2 helm chart github 仓库下载源码包，以 0.5.50 版本为例

   # 方法1：
   wget https://github.com/dragonflyoss/helm-charts/releases/download/dragonfly-0.5.50/dragonfly-0.5.50.tgz
   # 方法2：
   git clone -b dragonfly-0.5.50 --depth=1  https://github.com/dragonflyoss/helm-charts.git

   # 执行升级命令
   helm upgrade --install -n dragonfly-system dragonfly <Path/To/Chart> [-f values.yaml | --reset-values]
   ```

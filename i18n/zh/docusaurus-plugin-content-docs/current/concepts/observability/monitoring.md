---
id: monitoring
title: 监控
---

Dragonfly 推荐使用 [prometheus](https://prometheus.io/) 做监控。
Prometheus 和 Grafana 配置维护在仓库 [dragonflyoss/monitoring](https://github.com/dragonflyoss/monitoring/)。

Grafana 大盘发布在 [grafana.com](https://grafana.com/), 对应大盘地址分别为 [Manager](https://grafana.com/grafana/dashboards/15945/),
[Scheduler](https://grafana.com/grafana/dashboards/15944/) 和
[Seed Peer](https://grafana.com/grafana/dashboards/16349/)。

下面例子中对于 Dragonfly 监控例子基于 [kubernetes](https://kubernetes.io/) 环境, 使用
[prometheus-community/kube-prometheus-stack](https://artifacthub.io/packages/helm/prometheus-community/kube-prometheus-stack/)
charts 部署 Prometheus 和 Grafana。

## 步骤 1: 安装 Prometheus 和 Grafana

基于 [kube-prometheus-stack](https://artifacthub.io/packages/helm/prometheus-community/kube-prometheus-stack)
安装 Prometheus 和 Grafana。

- 添加 Charts 仓库

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
```

- 安装 kube-prometheus-stack charts

```bash
helm install prometheus prometheus-community/kube-prometheus-stack -f https://raw.githubusercontent.com/dragonflyoss/monitoring/main/prometheus/values.yaml
```

- 暴露 Grafana 大盘地址 `localhost:8080`

```bash
kubectl port-forward svc/prometheus-grafana 8080:80
```

- 访问 Grafana 大盘地址为 `localhost:8080`. 默认用户名为 `admin`, 密码为 `prom-operator`

![grafana-login](../../resource/monitoring/grafana-login.jpg)

## 步骤 2: 安装 Dragonfly 并且开启 [ServiceMonitor](https://github.com/prometheus-operator/prometheus-operator/blob/main/Documentation/user-guides/getting-started.md#prometheus-operator)

使用 Charts 安装 [dragonfly](https://artifacthub.io/packages/helm/dragonfly/dragonfly)。

- 添加 Charts 仓库

```bash
helm repo add dragonfly https://dragonflyoss.github.io/helm-charts/
helm repo update
```

- Dragonfly charts 开启 `ServiceMonitor`, 参考文档
  [serviceMonitor](https://github.com/dragonflyoss/helm-charts/blob/main/charts/dragonfly/values.yaml#L256)。
  生成 Dragonfly charts 配置文件 `values.yaml` 如下:

```yaml
scheduler:
  image: d7yio/scheduler
  tag: latest
  metrics:
    enable: true
    serviceMonitor:
      enable: true

seedPeer:
  image: d7yio/dfdaemon
  tag: latest
  metrics:
    enable: true
    serviceMonitor:
      enable: true

dfdaemon:
  image: d7yio/dfdaemon
  tag: latest

manager:
  image: d7yio/manager
  tag: latest
  metrics:
    enable: true
    serviceMonitor:
      enable: true
```

- 安装 Dragonfly 并开启 `ServiceMonitor`

```bash
helm install --create-namespace --namespace dragonfly-system dragonfly dragonfly/dragonfly -f values.yaml
```

## 步骤 3: 验证数据是否被采集

访问 Grafana explore 页面，地址为 `localhost:8080/explore`,
并且搜索 `dragonfly_manager_requests_total` 来验证数据是否被采集。

![grafana-validate-metrics](../../resource/monitoring/grafana-validate-metrics.jpg)

## 步骤 4: 导入 Dragonfly grafana 数据大盘

Dragonfly grafana 数据大盘信息如下：

<!-- markdownlint-disable -->

| Name                | ID    | Link                                         | Description                                |
| :------------------ | :---- | :------------------------------------------- | :----------------------------------------- |
| Dragonfly Manager   | 15945 | https://grafana.com/grafana/dashboards/15945 | Granafa dashboard for dragonfly manager.   |
| Dragonfly Scheduler | 15944 | https://grafana.com/grafana/dashboards/15944 | Granafa dashboard for dragonfly scheduler. |
| Dragonfly Seed Peer | 16349 | https://grafana.com/grafana/dashboards/16349 | Granafa dashboard for dragonfly seed peer. |

<!-- markdownlint-restore -->

- 导入 Dragonfly grafana 数据大盘使用 ID `15945`, `15944` 和 `16349`, 参考文档 [export-import](https://grafana.com/docs/grafana/latest/dashboards/export-import/)

![grafana-import-dashboard](../../resource/monitoring/grafana-import-dashboard.jpg)

- 导入成功可以访问 Dragonfly 数据大盘:

![grafana-manager](../../resource/monitoring/grafana-manager.jpg)

![grafana-scheduler](../../resource/monitoring/grafana-scheduler.jpg)

![grafana-seed-peer](../../resource/monitoring/grafana-seed-peer.jpg)

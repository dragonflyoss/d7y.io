---
id: prometheus-metrics
title: Prometheus 数据指标
slug: /operations/best-practices/observability/prometheus-metrics/
---

文档包含 Dragonfly 组件当前支持的所有指标。
现在支持 Client、Seed Client、Manager 和 Scheduler 服务的指标。
获取数据指标的路径固定为 `/metrics`。

## Client

GRPC 数据指标基于 [go-grpc-prometheus](https://github.com/grpc-ecosystem/go-grpc-prometheus).

<!-- markdownlint-disable -->

| 名字                                | 标签                                          | 类型      | 描述                       |
| :---------------------------------- | :-------------------------------------------- | :-------- | :------------------------- |
| download_task_total                 | type, tag, app, priority                      | counter   | 下载任务下载总次数。       |
| download_task_failure_total         | type, tag, app, priority                      | counter   | 下载任务失败总次数。       |
| prefetch_task_total                 | type, tag, app, priority                      | counter   | 预取任务总次数。           |
| prefetch_task_failure_total         | type, tag, app, priority                      | counter   | 预取任务失败总次数。       |
| concurrent_download_task_total      | type, tag, app, priority                      | gauge     | 下载任务并发数量。         |
| concurrent_upload_piece_total       |                                               | gauge     | 上传任务并发数量。         |
| download_traffic                    | type                                          | counter   | 下载流量统计。             |
| upload_traffic                      |                                               | counter   | 上传流量统计。             |
| download_task_duration_milliseconds | task_size_level                               | histogram | 下载任务持续时间的直方图。 |
| version                             | git_version, git_commit, platform, build_time | gauge     | 服务的版本信息。           |

<!-- markdownlint-restore -->

## Manager

GRPC 数据指标基于 [go-grpc-prometheus](https://github.com/grpc-ecosystem/go-grpc-prometheus).

<!-- markdownlint-disable -->

| 名字                                                     | 标签                                                                                         | 类型    | 描述                               |
| :------------------------------------------------------- | :------------------------------------------------------------------------------------------- | :------ | :--------------------------------- |
| dragonfly_manager_peer_total                             | version, commit                                                                              | gauge   | 当前活跃的 Peer 总个数。           |
| dragonfly_manager_search_scheduler_cluster_total         | version, commit                                                                              | counter | Peer 搜索 Scheduler 集群总次数。   |
| dragonfly_manager_search_scheduler_cluster_failure_total | version, commit                                                                              | counter | Peer 搜索 Scheduler 集群失败次数。 |
| dragonfly_manager_version                                | major, minor, git_version, git_commit, platform, build_time, go_version, go_tags, go_gcflags | gauge   | 服务版本信息。                     |

<!-- markdownlint-restore -->

## Scheduler

GRPC 数据指标基于 [go-grpc-prometheus](https://github.com/grpc-ecosystem/go-grpc-prometheus).

<!-- markdownlint-disable -->

| 名字                                                                     | 标签                                                                                                                 | 类型    | 描述                                            |
| :----------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------- | :------ | :---------------------------------------------- |
| dragonfly_scheduler_announce_peer_total                                  |                                                                                                                      | counter | 上报 Peer 任务总次数。                          |
| dragonfly_scheduler_announce_peer_failure_total                          |                                                                                                                      | counter | 上报 Peer 失败次数。                            |
| dragonfly_scheduler_stat_peer_total                                      |                                                                                                                      | counter | 查询 Peer 任务总次数。                          |
| dragonfly_scheduler_stat_peer_failure_total                              |                                                                                                                      | counter | 查询 Peer 任务失败次数。                        |
| dragonfly_scheduler_leave_peer_total                                     |                                                                                                                      | counter | 释放 Peer 任务总次数。                          |
| dragonfly_scheduler_leave_peer_failure_total                             |                                                                                                                      | counter | 释放 Peer 任务失败次数。                        |
| dragonfly_scheduler_exchange_peer_total                                  |                                                                                                                      | counter | 交换 Peer 任务信息总次数。                      |
| dragonfly_scheduler_exchange_peer_failure_total                          |                                                                                                                      | counter | 交换 Peer 任务信息失败次数。                    |
| dragonfly_scheduler_register_peer_total                                  | priority, task_type, task_tag, task_app, host_type                                                                   | counter | 注册 Peer 任务总次数。                          |
| dragonfly_scheduler_register_peer_failure_total                          | priority, task_type, task_tag, task_app, host_type                                                                   | counter | 注册 Peer 任务失败次数。                        |
| dragonfly_scheduler_download_peer_started_total                          | priority, task_type, task_tag, task_app, host_type                                                                   | counter | 下载 Peer 任务接收 Started Piece 总次数。       |
| dragonfly_scheduler_download_peer_started_failure_total                  | priority, task_type, task_tag, task_app, host_type                                                                   | counter | 下载 Peer 任务接收 Started Piece 失败次数。     |
| dragonfly_scheduler_download_peer_back_to_source_started_total           | priority, task_type, task_tag, task_app, host_type                                                                   | counter | 回源下载 Peer 任务接收 Started Piece 总次数。   |
| dragonfly_scheduler_download_peer_back_to_source_started_failure_total   | priority, task_type, task_tag, task_app, host_type                                                                   | counter | 回源下载 Peer 任务接收 Started Piece 失败次数。 |
| dragonfly_scheduler_download_peer_finished_total                         | priority, task_type, task_tag, task_app, host_type                                                                   | counter | 下载 Peer 任务完成总次数。                      |
| dragonfly_scheduler_download_peer_finished_failure_total                 | priority, task_type, task_tag, task_app, host_type                                                                   | counter | 下载 Peer 任务失败次数。                        |
| dragonfly_scheduler_download_peer_back_to_source_finished_failure_total  | priority, task_type, task_tag, task_app, host_type                                                                   | counter | 回源下载 Peer 任务失败次数。                    |
| dragonfly_scheduler_download_piece_finished_total                        | traffic_type, task_type, task_tag, task_app, host_type                                                               | counter | 下载 Piece 完成总次数。                         |
| dragonfly_scheduler_download_piece_finished_failure_total                | traffic_type, task_type, task_tag, task_app, host_type                                                               | counter | 下载 Piece 失败次数。                           |
| dragonfly_scheduler_download_piece_back_to_source_finished_failure_total | traffic_type, task_type, task_tag, task_app, host_type                                                               | counter | 回源下载 Piece 失败次数。                       |
| dragonfly_scheduler_stat_task_total                                      |                                                                                                                      | counter | 查询任务总次数。                                |
| dragonfly_scheduler_stat_task_failure_total                              |                                                                                                                      | counter | 查询任务失败次数。                              |
| dragonfly_scheduler_announce_host_total                                  | os, platform, platform_family, platform_version, kernel_version, git_version, git_commit, go_version, build_platform | counter | 上报 Host 总次数。                              |
| dragonfly_scheduler_announce_host_failure_total                          | os, platform, platform_family, platform_version, kernel_version, git_version, git_commit, go_version, build_platform | counter | 上报 Host 失败次数。                            |
| dragonfly_scheduler_leave_host_total                                     |                                                                                                                      | counter | 释放 Host 总次数。                              |
| dragonfly_scheduler_leave_host_failure_total                             |                                                                                                                      | counter | 释放 Host 失败次数。                            |
| dragonfly_scheduler_traffic                                              | type, task_type, task_tag, task_app, host_type                                                                       | counter | 总体流量统计。                                  |
| dragonfly_scheduler_host_traffic                                         | type, task_type, task_tag, task_app, host_type, host_id, host_ip, host_name                                          | counter | Host 流量统计                                   |
| dragonfly_scheduler_download_peer_duration_milliseconds                  | task_size_level                                                                                                      | summary | Peer 任务下载耗时。                             |
| dragonfly_scheduler_concurrent_schedule_total                            |                                                                                                                      | gauge   | 并行调度 Peer 任务个数。                        |
| dragonfly_scheduler_version                                              | major, minor, git_version, git_commit, platform, build_time, go_version, go_tags, go_gcflags                         | counter | 服务版本信息。                                  |

<!-- markdownlint-restore -->

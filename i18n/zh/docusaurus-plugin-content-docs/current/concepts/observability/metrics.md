---
id: metrics
title: Prometheus 数据指标
slug: /concepts/observability/metrics/
---

文档包含 Dragonfly 组件当前支持的所有指标。
现在支持 Dfdaemon、Manager 和 Scheduler 服务的指标。
获取数据指标的路径固定为 `/metrics`。

## Dfdaemon

GRPC 数据指标基于 [go-grpc-prometheus](https://github.com/grpc-ecosystem/go-grpc-prometheus).

<!-- markdownlint-disable -->

| 名字                                                     | 标签   | 类型    | 描述                                |
| :------------------------------------------------------- | :----- | :------ | :---------------------------------- |
| dragonfly_dfdaemon_proxy_request_total                   | method | counter | 代理请求总次数。                    |
| dragonfly_dfdaemon_proxy_request_via_dragonfly_total     |        | counter | 代理通过 drgonfly 的请求次数。      |
| dragonfly_dfdaemon_proxy_request_not_via_dragonfly_total |        | counter | 代理没有通过 dragonfly 的请求次数。 |
| dragonfly_dfdaemon_proxy_request_running_total           | method | counter | 当前代理请求总次数。                |
| dragonfly_dfdaemon_proxy_request_bytes_total             | method | counter | 所有代理请求的总字节数。            |
| dragonfly_dfdaemon_peer_task_total                       |        | counter | 任务的总个数。                      |
| dragonfly_dfdaemon_peer_task_failed_total                | type   | counter | 失败任务的总个数。                  |
| dragonfly_dfdaemon_piece_task_total                      |        | counter | 分片的总个数。                      |
| dragonfly_dfdaemon_piece_task_failed_total               |        | counter | 失败的分片总个数。                  |
| dragonfly_dfdaemon_file_task_total                       |        | counter | 文件类型任务总个数。                |
| dragonfly_dfdaemon_stream_task_total                     |        | counter | 流式类型任务总个数。                |
| dragonfly_dfdaemon_seed_peer_download_total              |        | counter | 作为 Seed Peer 下载总次数。         |
| dragonfly_dfdaemon_seed_peer_download_failure_total      |        | counter | 作为 Seed Peer 下载失败总次数。     |
| dragonfly_dfdaemon_seed_peer_download_traffic            | type   | counter | 作为 Seed Peer 下载流量。           |
| dragonfly_dfdaemon_seed_peer_concurrent_download_total   |        | gauge   | 作为 Seed Peer 的并行下载个数。     |
| dragonfly_dfdaemon_peer_task_cache_hit_total             |        | counter | 命中缓存任务个数。                  |
| dragonfly_dfdaemon_prefetch_task_total                   |        | counter | 预取任务总个数。                    |

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

| 名字                                                                     | 标签                                                                                                                 | 类型      | 描述                                            |
| :----------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------- | :-------- | :---------------------------------------------- |
| dragonfly_scheduler_announce_peer_total                                  |                                                                                                                      | counter   | 上报 Peer 任务总次数。                          |
| dragonfly_scheduler_announce_peer_failure_total                          |                                                                                                                      | counter   | 上报 Peer 失败次数。                            |
| dragonfly_scheduler_stat_peer_total                                      |                                                                                                                      | counter   | 查询 Peer 任务总次数。                          |
| dragonfly_scheduler_stat_peer_failure_total                              |                                                                                                                      | counter   | 查询 Peer 任务失败次数。                        |
| dragonfly_scheduler_leave_peer_total                                     |                                                                                                                      | counter   | 释放 Peer 任务总次数。                          |
| dragonfly_scheduler_leave_peer_failure_total                             |                                                                                                                      | counter   | 释放 Peer 任务失败次数。                        |
| dragonfly_scheduler_exchange_peer_total                                  |                                                                                                                      | counter   | 交换 Peer 任务信息总次数。                      |
| dragonfly_scheduler_exchange_peer_failure_total                          |                                                                                                                      | counter   | 交换 Peer 任务信息失败次数。                    |
| dragonfly_scheduler_register_peer_total                                  | priority, task_type, task_tag, task_app, host_type                                                                   | counter   | 注册 Peer 任务总次数。                          |
| dragonfly_scheduler_register_peer_failure_total                          | priority, task_type, task_tag, task_app, host_type                                                                   | counter   | 注册 Peer 任务失败次数。                        |
| dragonfly_scheduler_download_peer_started_total                          | priority, task_type, task_tag, task_app, host_type                                                                   | counter   | 下载 Peer 任务接收 Started Piece 总次数。       |
| dragonfly_scheduler_download_peer_started_failure_total                  | priority, task_type, task_tag, task_app, host_type                                                                   | counter   | 下载 Peer 任务接收 Started Piece 失败次数。     |
| dragonfly_scheduler_download_peer_back_to_source_started_total           | priority, task_type, task_tag, task_app, host_type                                                                   | counter   | 回源下载 Peer 任务接收 Started Piece 总次数。   |
| dragonfly_scheduler_download_peer_back_to_source_started_failure_total   | priority, task_type, task_tag, task_app, host_type                                                                   | counter   | 回源下载 Peer 任务接收 Started Piece 失败次数。 |
| dragonfly_scheduler_download_peer_finished_total                         | priority, task_type, task_tag, task_app, host_type                                                                   | counter   | 下载 Peer 任务完成总次数。                      |
| dragonfly_scheduler_download_peer_finished_failure_total                 | priority, task_type, task_tag, task_app, host_type                                                                   | counter   | 下载 Peer 任务失败次数。                        |
| dragonfly_scheduler_download_peer_back_to_source_finished_failure_total  | priority, task_type, task_tag, task_app, host_type                                                                   | counter   | 回源下载 Peer 任务失败次数。                    |
| dragonfly_scheduler_download_piece_finished_total                        | traffic_type, task_type, task_tag, task_app, host_type                                                               | counter   | 下载 Piece 完成总次数。                         |
| dragonfly_scheduler_download_piece_finished_failure_total                | traffic_type, task_type, task_tag, task_app, host_type                                                               | counter   | 下载 Piece 失败次数。                           |
| dragonfly_scheduler_download_piece_back_to_source_finished_failure_total | traffic_type, task_type, task_tag, task_app, host_type                                                               | counter   | 回源下载 Piece 失败次数。                       |
| dragonfly_scheduler_stat_task_total                                      |                                                                                                                      | counter   | 查询任务总次数。                                |
| dragonfly_scheduler_stat_task_failure_total                              |                                                                                                                      | counter   | 查询任务失败次数。                              |
| dragonfly_scheduler_announce_host_total                                  | os, platform, platform_family, platform_version, kernel_version, git_version, git_commit, go_version, build_platform | counter   | 上报 Host 总次数。                              |
| dragonfly_scheduler_announce_host_failure_total                          | os, platform, platform_family, platform_version, kernel_version, git_version, git_commit, go_version, build_platform | counter   | 上报 Host 失败次数。                            |
| dragonfly_scheduler_leave_host_total                                     |                                                                                                                      | counter   | 释放 Host 总次数。                              |
| dragonfly_scheduler_leave_host_failure_total                             |                                                                                                                      | counter   | 释放 Host 失败次数。                            |
| dragonfly_scheduler_traffic                                              | type, task_type, task_tag, task_app, host_type                                                                       | counter   | 总体流量统计。                                  |
| dragonfly_scheduler_host_traffic                                         | type, task_type, task_tag, task_app, host_type, host_id, host_ip, host_name                                          | counter   | Host 流量统计                                   |
| dragonfly_scheduler_download_peer_duration_milliseconds                  | priority, task_type, task_tag, task_app, host_type                                                                   | histogram | Peer 任务下载耗时。                             |
| dragonfly_scheduler_concurrent_schedule_total                            |                                                                                                                      | gauge     | 并行调度 Peer 任务个数。                        |
| dragonfly_scheduler_version                                              | major, minor, git_version, git_commit, platform, build_time, go_version, go_tags, go_gcflags                         | counter   | 服务版本信息。                                  |

<!-- markdownlint-restore -->

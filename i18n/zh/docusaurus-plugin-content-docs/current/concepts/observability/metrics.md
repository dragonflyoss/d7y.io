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

| Name                         | Labels | Type  | Description              |
| :--------------------------- | :----- | :---- | :----------------------- |
| dragonfly_manager_peer_total |        | gauge | 当前活跃的 Peer 总个数。 |

<!-- markdownlint-restore -->

## Scheduler

GRPC 数据指标基于 [go-grpc-prometheus](https://github.com/grpc-ecosystem/go-grpc-prometheus).

<!-- markdownlint-disable -->

| 名字                                                         | 标签                                            | 类型      | 描述                  |
| :----------------------------------------------------------- | :---------------------------------------------- | :-------- | :-------------------- |
| dragonfly_scheduler_register_peer_task_total                 | tag                                             | counter   | 注册任务总次数。      |
| dragonfly_scheduler_register_peer_task_failure_total         | tag                                             | counter   | 注册任务失败次数。    |
| dragonfly_scheduler_download_total                           | tag                                             | counter   | 下载任务总次数。      |
| dragonfly_scheduler_download_failure_total                   | tag, type                                       | counter   | 下载任务失败次数。    |
| dragonfly_scheduler_leave_task_total                         | tag                                             | counter   | 任务释放总个数。      |
| dragonfly_scheduler_leave_task_failure_total                 | tag                                             | counter   | 任务释放失败个数。    |
| dragonfly_scheduler_traffic                                  | tag, type                                       | counter   | P2P 流量。            |
| dragonfly_scheduler_peer_host_traffic                        | tag, traffic_type, peer_host_uuid, peer_host_ip | counter   | 每个主机的 P2P 流量。 |
| dragonfly_scheduler_peer_task_total                          | tag, type                                       | counter   | 下载任务总个数。      |
| dragonfly_scheduler_peer_task_download_duration_milliseconds | tag                                             | histogram | 任务下载耗时。        |
| dragonfly_scheduler_concurrent_schedule_total                |                                                 | gauge     | 并行调度任务个数。    |
| dragonfly_scheduler_stat_task_total                          |                                                 | counter   | 查询任务总次数。      |
| dragonfly_scheduler_stat_task_failure_total                  |                                                 | counter   | 查询任务失败次数。    |
| dragonfly_scheduler_announce_task_total                      |                                                 | counter   | 声明任务总次数。      |
| dragonfly_scheduler_announce_task_failure_total              |                                                 | counter   | 声明任务失败次数。    |

<!-- markdownlint-restore -->

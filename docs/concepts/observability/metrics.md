---
id: metrics
title: Prometheus Metrics
slug: /concepts/observability/metrics/
---

This doc contains all the metrics that Dragonfly components currently support.
Now we support metrics for Dfdaemon, Manager and Scheduler.
The metrics path is fixed to `/metrics`. The following metrics are exported.

## Dfdaemon {#dfdaemon}

GRPC metrics are exposed via [go-grpc-prometheus](https://github.com/grpc-ecosystem/go-grpc-prometheus).

<!-- markdownlint-disable -->

| Name                                                     | Labels | Type    | Description                                                      |
| :------------------------------------------------------- | :----- | :------ | :--------------------------------------------------------------- |
| dragonfly_dfdaemon_proxy_request_total                   | method | counter | Counter of the total proxy request.                              |
| dragonfly_dfdaemon_proxy_request_via_dragonfly_total     |        | counter | Counter of the total proxy request via Dragonfly.                |
| dragonfly_dfdaemon_proxy_request_not_via_dragonfly_total |        | counter | Counter of the total proxy request not via Dragonfly.            |
| dragonfly_dfdaemon_proxy_request_running_total           | method | counter | Current running count of proxy request.                          |
| dragonfly_dfdaemon_proxy_request_bytes_total             | method | counter | Counter of the total byte of all proxy request.                  |
| dragonfly_dfdaemon_peer_task_total                       |        | counter | Counter of the total peer tasks.                                 |
| dragonfly_dfdaemon_peer_task_failed_total                | type   | counter | Counter of the total failed peer tasks.                          |
| dragonfly_dfdaemon_piece_task_total                      |        | counter | Counter of the total failed piece tasks.                         |
| dragonfly_dfdaemon_piece_task_failed_total               |        | counter | Dragonfly dfget tasks.                                           |
| dragonfly_dfdaemon_file_task_total                       |        | counter | Counter of the total file tasks.                                 |
| dragonfly_dfdaemon_stream_task_total                     |        | counter | Counter of the total stream tasks.                               |
| dragonfly_dfdaemon_seed_peer_download_total              |        | counter | Counter of the number of the seed peer downloading.              |
| dragonfly_dfdaemon_seed_peer_download_failure_total      |        | counter | Counter of the number of failed of the seed peer downloading.    |
| dragonfly_dfdaemon_seed_peer_download_traffic            | type   | counter | Counter of the number of seed peer download traffic.             |
| dragonfly_dfdaemon_seed_peer_concurrent_download_total   |        | gauge   | Gauger of the number of concurrent of the seed peer downloading. |
| dragonfly_dfdaemon_peer_task_cache_hit_total             |        | counter | Counter of the total cache hit peer tasks.                       |
| dragonfly_dfdaemon_prefetch_task_total                   |        | counter | Counter of the total prefetched tasks.                           |

<!-- markdownlint-restore -->

## Manager {#manager}

GRPC metrics are exposed via [go-grpc-prometheus](https://github.com/grpc-ecosystem/go-grpc-prometheus).

<!-- markdownlint-disable -->

| Name                         | Labels | Type  | Description                  |
| :--------------------------- | :----- | :---- | :--------------------------- |
| dragonfly_manager_peer_total |        | gauge | Gauge of the number of peer. |

<!-- markdownlint-restore -->

## Scheduler {#scheduler}

GRPC metrics are exposed via [go-grpc-prometheus](https://github.com/grpc-ecosystem/go-grpc-prometheus).

<!-- markdownlint-disable -->

| Name                                                         | Labels                                          | Type      | Description                                                |
| :----------------------------------------------------------- | :---------------------------------------------- | :-------- | :--------------------------------------------------------- |
| dragonfly_scheduler_register_peer_task_total                 | tag                                             | counter   | Counter of the number of the register peer task.           |
| dragonfly_scheduler_register_peer_task_failure_total         | tag                                             | counter   | Counter of the number of failed of the register peer task. |
| dragonfly_scheduler_download_total                           | tag                                             | counter   | Counter of the number of the downloading.                  |
| dragonfly_scheduler_download_failure_total                   | tag, type                                       | counter   | Counter of the number of failed of the downloading.        |
| dragonfly_scheduler_leave_task_total                         | tag                                             | counter   | Counter of the number of the task leaving.                 |
| dragonfly_scheduler_leave_task_failure_total                 | tag                                             | counter   | Counter of the number of failed of the task leaving.       |
| dragonfly_scheduler_traffic                                  | tag, type                                       | counter   | Counter of the number of p2p traffic.                      |
| dragonfly_scheduler_peer_host_traffic                        | tag, traffic_type, peer_host_uuid, peer_host_ip | counter   | Counter of the number of per peer host traffic.            |
| dragonfly_scheduler_peer_task_total                          | tag, type                                       | counter   | Counter of the number of peer task.                        |
| dragonfly_scheduler_peer_task_download_duration_milliseconds | tag                                             | histogram | Histogram of the time each peer task downloading.          |
| dragonfly_scheduler_concurrent_schedule_total                |                                                 | gauge     | Gauge of the number of concurrent of the scheduling.       |
| dragonfly_scheduler_stat_task_total                          |                                                 | counter   | Counter of the number of the stat task.                    |
| dragonfly_scheduler_stat_task_failure_total                  |                                                 | counter   | Counter of the number of failed of the stat task.          |
| dragonfly_scheduler_announce_task_total                      |                                                 | counter   | Counter of the number of the announce task.                |
| dragonfly_scheduler_announce_task_failure_total              |                                                 | counter   | Counter of the number of failed of the announce task.      |

<!-- markdownlint-restore -->

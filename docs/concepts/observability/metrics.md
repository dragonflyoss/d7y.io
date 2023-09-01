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

| Name                                                     | Labels                                                                                       | Type    | Description                                                     |
| :------------------------------------------------------- | :------------------------------------------------------------------------------------------- | :------ | :-------------------------------------------------------------- |
| dragonfly_manager_peer_total                             | version, commit                                                                              | gauge   | Gauge of the number of peer.                                    |
| dragonfly_manager_search_scheduler_cluster_total         | version, commit                                                                              | counter | Counter of the number of searching scheduler cluster.           |
| dragonfly_manager_search_scheduler_cluster_failure_total | version, commit                                                                              | counter | Counter of the number of failed of searching scheduler cluster. |
| dragonfly_manager_version                                | major, minor, git_version, git_commit, platform, build_time, go_version, go_tags, go_gcflags | gauge   | Version info of the service.                                    |

<!-- markdownlint-restore -->

## Scheduler {#scheduler}

GRPC metrics are exposed via [go-grpc-prometheus](https://github.com/grpc-ecosystem/go-grpc-prometheus).

<!-- markdownlint-disable -->

| Name                                                                     | Labels                                                                                                               | Type      | Description                                                                  |
| :----------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------- | :-------- | :--------------------------------------------------------------------------- |
| dragonfly_scheduler_announce_peer_total                                  |                                                                                                                      | counter   | Counter of the number of the announcing peer.                                |
| dragonfly_scheduler_announce_peer_failure_total                          |                                                                                                                      | counter   | Counter of the number of failed of the announcing peer.                      |
| dragonfly_scheduler_stat_peer_total                                      |                                                                                                                      | counter   | Counter of the number of the stat peer.                                      |
| dragonfly_scheduler_stat_peer_failure_total                              |                                                                                                                      | counter   | Counter of the number of failed of the stat peer.                            |
| dragonfly_scheduler_leave_peer_total                                     |                                                                                                                      | counter   | Counter of the number of the leaving peer.                                   |
| dragonfly_scheduler_leave_peer_failure_total                             |                                                                                                                      | counter   | Counter of the number of failed of the leaving peer.                         |
| dragonfly_scheduler_exchange_peer_total                                  |                                                                                                                      | counter   | Counter of the number of the exchanging peer.                                |
| dragonfly_scheduler_exchange_peer_failure_total                          |                                                                                                                      | counter   | Counter of the number of the exchanging peer.                                |
| dragonfly_scheduler_register_peer_total                                  | priority, task_type, task_tag, task_app, host_type                                                                   | counter   | Counter of the number of the register peer.                                  |
| dragonfly_scheduler_register_peer_failure_total                          | priority, task_type, task_tag, task_app, host_type                                                                   | counter   | Counter of the number of failed of the register peer.                        |
| dragonfly_scheduler_download_peer_started_total                          | priority, task_type, task_tag, task_app, host_type                                                                   | counter   | Counter of the number of the download peer started.                          |
| dragonfly_scheduler_download_peer_started_failure_total                  | priority, task_type, task_tag, task_app, host_type                                                                   | counter   | Counter of the number of failed of the download peer started.                |
| dragonfly_scheduler_download_peer_back_to_source_started_total           | priority, task_type, task_tag, task_app, host_type                                                                   | counter   | Counter of the number of the download peer back-to-source started.           |
| dragonfly_scheduler_download_peer_back_to_source_started_failure_total   | priority, task_type, task_tag, task_app, host_type                                                                   | counter   | Counter of the number of failed of the download peer back-to-source started. |
| dragonfly_scheduler_download_peer_finished_total                         | priority, task_type, task_tag, task_app, host_type                                                                   | counter   | Counter of the number of the download peer.                                  |
| dragonfly_scheduler_download_peer_finished_failure_total                 | priority, task_type, task_tag, task_app, host_type                                                                   | counter   | Counter of the number of failed of the download peer.                        |
| dragonfly_scheduler_download_peer_back_to_source_finished_failure_total  | priority, task_type, task_tag, task_app, host_type                                                                   | counter   | Counter of the number of failed of the download peer back-to-source.         |
| dragonfly_scheduler_download_piece_finished_total                        | traffic_type, task_type, task_tag, task_app, host_type                                                               | counter   | Counter of the number of the download piece.                                 |
| dragonfly_scheduler_download_piece_finished_failure_total                | traffic_type, task_type, task_tag, task_app, host_type                                                               | counter   | Counter of the number of failed of the download piece.                       |
| dragonfly_scheduler_download_piece_back_to_source_finished_failure_total | traffic_type, task_type, task_tag, task_app, host_type                                                               | counter   | Counter of the number of failed of the download piece back-to-source.        |
| dragonfly_scheduler_stat_task_total                                      |                                                                                                                      | counter   | Counter of the number of the stat task.                                      |
| dragonfly_scheduler_stat_task_failure_total                              |                                                                                                                      | counter   | Counter of the number of failed of the stat task.                            |
| dragonfly_scheduler_announce_host_total                                  | os, platform, platform_family, platform_version, kernel_version, git_version, git_commit, go_version, build_platform | counter   | Counter of the number of the announce host.                                  |
| dragonfly_scheduler_announce_host_failure_total                          | os, platform, platform_family, platform_version, kernel_version, git_version, git_commit, go_version, build_platform | counter   | Counter of the number of failed of the announce host.                        |
| dragonfly_scheduler_leave_host_total                                     |                                                                                                                      | counter   | Counter of the number of the leaving host.                                   |
| dragonfly_scheduler_leave_host_failure_total                             |                                                                                                                      | counter   | Counter of the number of failed of the leaving host.                         |
| dragonfly_scheduler_traffic                                              | type, task_type, task_tag, task_app, host_type                                                                       | counter   | Counter of the number of traffic.                                            |
| dragonfly_scheduler_host_traffic                                         | type, task_type, task_tag, task_app, host_type, host_id, host_ip, host_name                                          | counter   | Counter of the number of per host traffic.                                   |
| dragonfly_scheduler_download_peer_duration_milliseconds                  | priority, task_type, task_tag, task_app, host_type                                                                   | histogram | Histogram of the time each peer downloading.                                 |
| dragonfly_scheduler_concurrent_schedule_total                            |                                                                                                                      | gauge     | Gauge of the number of concurrent of the scheduling.                         |
| dragonfly_scheduler_version                                              | major, minor, git_version, git_commit, platform, build_time, go_version, go_tags, go_gcflags                         | counter   | Version info of the service.                                                 |

<!-- markdownlint-restore -->

---
id: metrics
title: Prometheus Metrics
slug: /operations/best-practices/observability/prometheus-metrics/
---

This doc contains all the metrics that Dragonfly components currently support.
Now we support metrics for Client, Seed Client, Manager and Scheduler.
The metrics path is fixed to `/metrics`. The following metrics are exported.

## Client{#client}

GRPC metrics are exposed via [go-grpc-prometheus](https://github.com/grpc-ecosystem/go-grpc-prometheus).

<!-- markdownlint-disable -->

| Name                                  | Labels                                        | Type      | Description                                               |
| :------------------------------------ | :-------------------------------------------- | :-------- | :-------------------------------------------------------- |
| version                               | git_version, git_commit, platform, build_time | gauge     | Version info of the service.                              |
| upload_task_total                     | type, tag, app                                | counter   | Counter of the number of the upload task.                 |
| upload_task_failure_total             | type, tag, app                                | counter   | Counter of the number of failed of the upload task.       |
| concurrent_upload_task_total          | type, tag, app                                | gauge     | Gauge of the number of concurrent of the upload task.     |
| upload_task_duration_milliseconds     | task_type, task_size_level                    | histogram | Histogram of the upload task duration.                    |
| download_task_total                   | type, tag, app, priority                      | counter   | Counter of the number of the download task.               |
| download_task_failure_total           | type, tag, app, priority                      | counter   | Counter of the number of failed of the download task.     |
| prefetch_task_total                   | type, tag, app, priority                      | counter   | Counter of the number of the prefetch task.               |
| prefetch_task_failure_total           | type, tag, app, priority                      | counter   | Counter of the number of failed of the prefetch task.     |
| concurrent_download_task_total        | type, tag, app, priority                      | gauge     | Gauge of the number of concurrent of the download task.   |
| concurrent_upload_piece_total         |                                               | gauge     | Gauge of the number of concurrent of the upload piece.    |
| download_traffic                      | type, task_type                               | counter   | Counter of the number of the download traffic.            |
| upload_traffic                        | task_type                                     | counter   | Counter of the number of the upload traffic.              |
| download_task_duration_milliseconds   | task_type, task_size_level                    | histogram | Histogram of the download task duration.                  |
| backend_request_total                 | scheme, method                                | counter   | Counter of the number of the backend request.             |
| backend_request_failure_total         | scheme, method                                | counter   | Counter of the number of failed of the backend request.   |
| backend_request_duration_milliseconds | scheme, method                                | histogram | Histogram of the backend request duration.                |
| proxy_request_total                   |                                               | counter   | Counter of the number of the proxy request.               |
| proxy_request_failure_total           |                                               | counter   | Counter of the number of failed of the proxy request.     |
| proxy_request_via_dfdaemon_total      |                                               | counter   | Counter of the number of the proxy request via dfdaemon.  |
| update_task_total                     | type                                          | counter   | Counter of the number of the update task.                 |
| update_task_failure_total             | type                                          | counter   | Counter of the number of failed of the update task.       |
| stat_task_total                       | type                                          | counter   | Counter of the number of the stat task.                   |
| stat_task_failure_total               | type                                          | counter   | Counter of the number of failed of the stat task.         |
| list_task_entries_total               | type                                          | counter   | Counter of the number of the list task entries.           |
| list_task_entries_failure_total       | type                                          | counter   | Counter of the number of failed of the list task entries. |
| delete_task_total                     | type                                          | counter   | Counter of the number of the delete task.                 |
| delete_task_failure_total             | type                                          | counter   | Counter of the number of failed of the delete task.       |
| delete_host_total                     |                                               | counter   | Counter of the number of the delete host.                 |
| delete_host_failure_total             |                                               | counter   | Counter of the number of failed of the delete host.       |
| disk_space_total                      |                                               | gauge     | Gauge of the disk space in bytes                          |
| disk_usage_space_total                |                                               | gauge     | Gauge of the disk usage space in bytes                    |

<!-- markdownlint-restore -->

## Manager {#manager}

GRPC metrics are exposed via [go-grpc-prometheus](https://github.com/grpc-ecosystem/go-grpc-prometheus).

<!-- markdownlint-disable -->

| Name                                                     | Labels                                                                                       | Type    | Description                                                     |
| :------------------------------------------------------- | :------------------------------------------------------------------------------------------- | :------ | :-------------------------------------------------------------- |
| dragonfly_manager_search_scheduler_cluster_total         | version, commit                                                                              | counter | Counter of the number of searching scheduler cluster.           |
| dragonfly_manager_search_scheduler_cluster_failure_total | version, commit                                                                              | counter | Counter of the number of failed of searching scheduler cluster. |
| dragonfly_manager_create_job_total                       | name                                                                                         | counter | Counter of the number of creating job.                          |
| dragonfly_manager_create_job_success_total               | name                                                                                         | counter | Counter of the number of succeeded of creating job.             |
| dragonfly_manager_version                                | major, minor, git_version, git_commit, platform, build_time, go_version, go_tags, go_gcflags | gauge   | Version info of the service.                                    |

<!-- markdownlint-restore -->

## Scheduler {#scheduler}

GRPC metrics are exposed via [go-grpc-prometheus](https://github.com/grpc-ecosystem/go-grpc-prometheus).

<!-- markdownlint-disable -->

| Name                                                                       | Labels                                                                                                               | Type    | Description                                                                    |
| :------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------- | :------ | :----------------------------------------------------------------------------- |
| dragonfly_scheduler_announce_peer_total                                    |                                                                                                                      | counter | Counter of the number of the announcing peer.                                  |
| dragonfly_scheduler_announce_peer_failure_total                            |                                                                                                                      | counter | Counter of the number of failed of the announcing peer.                        |
| dragonfly_scheduler_stat_peer_total                                        |                                                                                                                      | counter | Counter of the number of the stat peer.                                        |
| dragonfly_scheduler_stat_peer_failure_total                                |                                                                                                                      | counter | Counter of the number of failed of the stat peer.                              |
| dragonfly_scheduler_leave_peer_total                                       |                                                                                                                      | counter | Counter of the number of the leaving peer.                                     |
| dragonfly_scheduler_leave_peer_failure_total                               |                                                                                                                      | counter | Counter of the number of failed of the leaving peer.                           |
| dragonfly_scheduler_exchange_peer_total                                    |                                                                                                                      | counter | Counter of the number of the exchanging peer.                                  |
| dragonfly_scheduler_exchange_peer_failure_total                            |                                                                                                                      | counter | Counter of the number of failed of the exchanging peer.                        |
| dragonfly_scheduler_register_peer_total                                    | priority, task_type, host_type                                                                                       | counter | Counter of the number of the register peer.                                    |
| dragonfly_scheduler_register_peer_failure_total                            | priority, task_type, host_type                                                                                       | counter | Counter of the number of failed of the register peer.                          |
| dragonfly_scheduler_download_peer_started_total                            | priority, task_type, host_type                                                                                       | counter | Counter of the number of the download peer started.                            |
| dragonfly_scheduler_download_peer_started_failure_total                    | priority, task_type, host_type                                                                                       | counter | Counter of the number of failed of the download peer started.                  |
| dragonfly_scheduler_download_peer_back_to_source_started_total             | priority, task_type, host_type                                                                                       | counter | Counter of the number of the download peer back-to-source started.             |
| dragonfly_scheduler_download_peer_back_to_source_started_failure_total     | priority, task_type, host_type                                                                                       | counter | Counter of the number of failed of the download peer back-to-source started.   |
| dragonfly_scheduler_download_peer_finished_total                           | priority, task_type, host_type                                                                                       | counter | Counter of the number of the download peer.                                    |
| dragonfly_scheduler_download_peer_finished_failure_total                   | priority, task_type, host_type                                                                                       | counter | Counter of the number of failed of the download peer.                          |
| dragonfly_scheduler_download_peer_back_to_source_finished_failure_total    | priority, task_type, host_type                                                                                       | counter | Counter of the number of failed of the download peer back-to-source.           |
| dragonfly_scheduler_download_piece_finished_total                          | traffic_type, task_type, host_type                                                                                   | counter | Counter of the number of the download piece.                                   |
| dragonfly_scheduler_download_piece_finished_failure_total                  | traffic_type, task_type, host_type                                                                                   | counter | Counter of the number of failed of the download piece.                         |
| dragonfly_scheduler_download_piece_back_to_source_finished_failure_total   | traffic_type, task_type, host_type                                                                                   | counter | Counter of the number of failed of the download piece back-to-source.          |
| dragonfly_scheduler_stat_task_total                                        |                                                                                                                      | counter | Counter of the number of the stat task.                                        |
| dragonfly_scheduler_stat_task_failure_total                                |                                                                                                                      | counter | Counter of the number of failed of the stat task.                              |
| dragonfly_scheduler_leave_task_total                                       |                                                                                                                      | counter | Counter of the number of the leaving task.                                     |
| dragonfly_scheduler_leave_task_failure_total                               |                                                                                                                      | counter | Counter of the number of failed of the leaving task.                           |
| dragonfly_scheduler_announce_host_total                                    | os, platform, platform_family, platform_version, kernel_version, git_version, git_commit, go_version, build_platform | counter | Counter of the number of the announce host.                                    |
| dragonfly_scheduler_announce_host_failure_total                            | os, platform, platform_family, platform_version, kernel_version, git_version, git_commit, go_version, build_platform | counter | Counter of the number of failed of the announce host.                          |
| dragonfly_scheduler_list_hosts_total                                       |                                                                                                                      | counter | Counter of the number of the list hosts.                                       |
| dragonfly_scheduler_list_hosts_failure_total                               |                                                                                                                      | counter | Counter of the number of failed of the list hosts.                             |
| dragonfly_scheduler_leave_host_total                                       |                                                                                                                      | counter | Counter of the number of the leaving host.                                     |
| dragonfly_scheduler_leave_host_failure_total                               |                                                                                                                      | counter | Counter of the number of failed of the leaving host.                           |
| dragonfly_scheduler_traffic                                                | type, task_type, host_type                                                                                           | counter | Counter of the number of traffic.                                              |
| dragonfly_scheduler_host_traffic                                           | type, task_type, host_type, host_id, host_ip, host_name                                                              | counter | Counter of the number of per host traffic.                                     |
| dragonfly_scheduler_download_peer_duration_milliseconds                    | task_size_level                                                                                                      | summary | Summary of the time each peer downloading.                                     |
| dragonfly_scheduler_concurrent_schedule_total                              |                                                                                                                      | gauge   | Gauge of the number of concurrent of the scheduling.                           |
| dragonfly_scheduler_schedule_duration_milliseconds                         |                                                                                                                      | summary | Summary of the time each scheduling.                                           |
| dragonfly_scheduler_announce_persistent_cache_peer_total                   |                                                                                                                      | counter | Counter of the number of the announcing cache peer.                            |
| dragonfly_scheduler_announce_persistent_cache_peer_failure_total           |                                                                                                                      | counter | Counter of the number of failed of the announcing cache peer.                  |
| dragonfly_scheduler_stat_persistent_cache_peer_total                       |                                                                                                                      | counter | Counter of the number of the stat cache peer.                                  |
| dragonfly_scheduler_stat_persistent_cache_peer_failure_total               |                                                                                                                      | counter | Counter of the number of failed of the stat cache peer.                        |
| dragonfly_scheduler_delete_persistent_cache_peer_total                     |                                                                                                                      | counter | Counter of the number of the deleting cache peer.                              |
| dragonfly_scheduler_delete_persistent_cache_peer_failure_total             |                                                                                                                      | counter | Counter of the number of failed of the deleting cache peer.                    |
| dragonfly_scheduler_upload_persistent_cache_task_started_total             |                                                                                                                      | counter | Counter of the number of the started uploading cache peer.                     |
| dragonfly_scheduler_upload_persistent_cache_task_started_failure_total     |                                                                                                                      | counter | Counter of the number of failed of the started uploading cache peer.           |
| dragonfly_scheduler_upload_persistent_cache_task_finished_total            |                                                                                                                      | counter | Counter of the number of the finished uploading cache peer.                    |
| dragonfly_scheduler_upload_persistent_cache_task_finished_failure_total    |                                                                                                                      | counter | Counter of the number of failed of the finished uploading cache peer.          |
| dragonfly_scheduler_upload_persistent_cache_task_failed_total              |                                                                                                                      | counter | Counter of the number of the failed uploading cache peer.                      |
| dragonfly_scheduler_upload_cache_peer_failed_failure_total                 |                                                                                                                      | counter | Counter of the number of failed of the failed uploading cache peer.            |
| dragonfly_scheduler_stat_persistent_cache_task_total                       |                                                                                                                      | counter | Counter of the number of the stat cache task.                                  |
| dragonfly_scheduler_stat_persistent_cache_task_failure_total               |                                                                                                                      | counter | Counter of the number of failed of the stat cache task.                        |
| dragonfly_scheduler_delete_persistent_cache_task_total                     |                                                                                                                      | counter | Counter of the number of the delete cache task.                                |
| dragonfly_scheduler_delete_persistent_cache_task_failure_total             |                                                                                                                      | counter | Counter of the number of failed of the delete cache task.                      |
| dragonfly_scheduler_register_persistent_cache_peer_total                   | host_type                                                                                                            | counter | Counter of the number of the register persistent cache peer.                   |
| dragonfly_scheduler_register_persistent_cache_peer_failure_total           | host_type                                                                                                            | counter | Counter of the number of failed of the register persistent cache peer.         |
| dragonfly_scheduler_download_persistent_cache_peer_started_total           | host_type                                                                                                            | counter | Counter of the number of the download persistent cache peer started.           |
| dragonfly_scheduler_download_persistent_cache_peer_started_failure_total   | host_type                                                                                                            | counter | Counter of the number of failed of the download persistent cache peer started. |
| dragonfly_scheduler_download_persistent_cache_peer_finished_total          | host_type                                                                                                            | counter | Counter of the number of the download persistent cache peer.                   |
| dragonfly_scheduler_download_persistent_cache_peer_finished_failure_total  | host_type                                                                                                            | counter | Counter of the number of failed of the download persistent cache peer.         |
| dragonfly_scheduler_download_persistent_cache_piece_finished_total         | host_type                                                                                                            | counter | Counter of the number of the download persistent cache piece.                  |
| dragonfly_scheduler_download_persistent_cache_piece_finished_failure_total | host_type                                                                                                            | counter | Counter of the number of failed of the download persistent cache piece.        |
| dragonfly_scheduler_version                                                | major, minor, git_version, git_commit, platform, build_time, go_version, go_tags, go_gcflags                         | gauge   | Version info of the service.                                                   |

<!-- markdownlint-restore -->

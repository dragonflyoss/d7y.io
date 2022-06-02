---
id: development
title: 本地开发
slug: /contribute/development-guide/development
---

可以简单的上手搭建本地开发环境。

## Step 1: 安装 Docker 和 Docker compose

安装参考文档 [docs.docker.com]。

## Step 2: 启动 Dragonfly

进入 Dragonfly 项目中并启动 docker-compose,
参考文档 [deploy with docker compose](https://github.com/dragonflyoss/Dragonfly2/blob/main/deploy/docker-compose/README.md)。

```bash
$ cd deploy/docker-compose
$ export IP=127.0.0.1
$ ./run.sh
Creating mysql ... done
Creating redis ... done
Creating manager ... done
Creating scheduler ... done
Creating seed-peer ... done
Creating dfdaemon  ... done
wait for all service ready:        1/       6,0 times check
wait for all service ready:        3/       6,1 times check
wait for all service ready:        3/       6,2 times check
wait for all service ready:        5/       6,3 times check
wait for all service ready:        5/       6,4 times check
  Name                 Command                  State       Ports
-----------------------------------------------------------------
dfdaemon    /opt/dragonfly/bin/dfget d ...   Up (healthy)
manager     /opt/dragonfly/bin/server        Up (healthy)
mysql       docker-entrypoint.sh mariadbd    Up (healthy)
redis       docker-entrypoint.sh --req ...   Up (healthy)
scheduler   /opt/dragonfly/bin/scheduler     Up (healthy)
seed-peer   /opt/dragonfly/bin/dfget d ...   Up (healthy)
```

## Step 3: 查看运行日志

查看 Manager 日志。

<!-- markdownlint-disable -->

```bash
$ docker exec -it manager /bin/sh
$ tail -f /var/log/dragonfly/manager/*log
```

<!-- markdownlint-restore -->

查看 Scheduler 日志。

<!-- markdownlint-disable -->

```bash
$ docker exec -it scheduler /bin/sh
$ tail -f /var/log/dragonfly/scheduler/*log
```

<!-- markdownlint-restore -->

查看 Peer 日志。

<!-- markdownlint-disable -->

```bash
$ docker exec -it dfdaemon /bin/sh
$ tail -f /var/log/dragonfly/dfdaemon/*log
```

<!-- markdownlint-restore -->

查看 Seed Peer 日志。

<!-- markdownlint-disable -->

```bash
$ docker exec -it seed-peer /bin/sh
$ tail -f /var/log/dragonfly/dfdaemon/*log
```

<!-- markdownlint-restore -->

## Step 4: 停止 Dragonfly

```bash
$ docker-compose down
[+] Running 6/6
 ⠿ Container dfdaemon   Removed
 ⠿ Container seed-peer  Removed
 ⠿ Container scheduler  Removed
 ⠿ Container manager    Removed
 ⠿ Container mysql      Removed
 ⠿ Container redis      Removed
```

[docs.docker.com]: https://docs.docker.com

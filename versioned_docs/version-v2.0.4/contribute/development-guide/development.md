---
id: development
title: Development
slug: /contribute/development-guide/development
---

Easily set up a local development environment.

## Step 1: Install docker and docker compose {#step-1-install-docker-and-docker-compose}

See documentation on [docs.docker.com]

## Step 2: Start dragonfly {#step-2-start-dragonfly}

Enter dragonfly project and start docker-compose,
refer to [deploy with docker compose](https://github.com/dragonflyoss/Dragonfly2/blob/main/deploy/docker-compose/README.md).

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

## Step 3: Log analysis {#step-3-log-analysis}

Show dragonfly manager logs.

<!-- markdownlint-disable -->

```bash
$ docker exec -it manager /bin/sh
$ tail -f /var/log/dragonfly/manager/*log
```

<!-- markdownlint-restore -->

Show dragonfly scheduler logs.

<!-- markdownlint-disable -->

```bash
$ docker exec -it scheduler /bin/sh
$ tail -f /var/log/dragonfly/scheduler/*log
```

<!-- markdownlint-restore -->

Show dragonfly peer logs.

<!-- markdownlint-disable -->

```bash
$ docker exec -it dfdaemon /bin/sh
$ tail -f /var/log/dragonfly/dfdaemon/*log
```

<!-- markdownlint-restore -->

Show dragonfly seed peer logs.

<!-- markdownlint-disable -->

```bash
$ docker exec -it seed-peer /bin/sh
$ tail -f /var/log/dragonfly/dfdaemon/*log
```

<!-- markdownlint-restore -->

## Step 4: Stop dragonfly {#step-4-stop-dragonfly}

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

---
id: configure-development-environment
title: Configure the Development Environment
slug: /development-guide/configure-development-environment/
---

This document describes how to configure a local development environment for Dragonfly.

## Prerequisites {#prerequisites}

<!-- markdownlint-disable -->

| Name     | Version                      | Document                                                                     |
| -------- | ---------------------------- | ---------------------------------------------------------------------------- |
| Git      | 1.9.1+                       | [git-scm](https://git-scm.com/)                                              |
| Golang   | 1.16.x                       | [go.dev](https://go.dev/)                                                    |
| Rust     | 1.6+                         | [rustup.rs](https://rustup.rs/)                                              |
| Database | Mysql 5.6+ OR PostgreSQL 12+ | [mysql](https://www.mysql.com/) OR [postgresql](https://www.postgresql.org/) |
| Redis    | 3.0+                         | [redis.io](https://redis.io/)                                                |

<!-- markdownlint-restore -->

## Clone Dragonfly {#clone-dragonfly}

Clone the source code of Dragonfly:

```bash
git clone --recurse-submodules https://github.com/dragonflyoss/Dragonfly2.git
cd Dragonfly2
```

Clone the source code of Client:

```bash
git clone https://github.com/dragonflyoss/client.git
cd client
```

## Operation {#operation}

### Manager {#manager}

#### Setup Manager {#setup-manager}

Configure `manager.yaml`, the default path is `/etc/dragonfly/manager.yaml`,
refer to [Manager](../reference/configuration/manager.md).

Set the `database.mysql.addrs` and `database.redis.addrs` address in the configuration file to your actual address.
Configuration content is as follows:

```yaml
# Manager configuration.
database:
  type: mysql
  mysql:
    user: dragonfly-mysql
    password: your_mysql_password
    host: your_mysql_host
    port: your_mysql_port
    dbname: manager
    migrate: true
  redis:
    addrs:
      - dragonfly-redis
    masterName: your_redis_master_name
    username: your_redis_username
    password: your_redis_passwprd
    db: 0
    brokerDB: 1
    backendDB: 2
```

Run Manager:

> Notice : Run Manager under Dragonfly2

```bash
# Setup Manager.
go run cmd/manager/main.go --config /etc/dragonfly/manager.yaml --verbose --console
```

#### Verify {#verify-manager}

After the Manager deployment is complete, run the following commands to verify if **Manager** is started,
and if Port `8080` and `65003` is available.

```bash
telnet 127.0.0.1 8080
telnet 127.0.0.1 65003
```

### Scheduler {#scheduler}

#### Setup Scheduler {#setup-scheduler}

Configure `scheduler.yaml`, the default path is `/etc/dragonfly/scheduler.yaml`,
refer to [Scheduler](../reference/configuration/scheduler.md).

Set the `database.redis.addrs` and `manager.addr` address in the configuration file to your actual address.
Configuration content is as follows:

```yaml
# Scheduler configuration.
database:
  redis:
    addrs:
      - dragonfly-redis
    masterName: your_redis_master_name
    username: your_redis_username
    password: your_redis_password
    brokerDB: 1
    backendDB: 2
 manager:
  addr: 127.0.0.1:65003
  schedulerClusterID: 1
  keepAlive:
    interval: 5s
```

Run Scheduler:

> Notice : Run Scheduler under Dragonfly2

```bash
# Setup Scheduler.
go run cmd/scheduler/main.go --config /etc/dragonfly/scheduler.yaml --verbose --console
```

#### Verify {#verify-scheduler}

After the Scheduler deployment is complete, run the following commands to verify if **Scheduler** is started,
and if Port `8002` is available.

```bash
telnet 127.0.0.1 8002
```

### Dfdaemon {#dfdaemon}

#### Setup Dfdaemon as Seed Peer {#setup-dfdaemon-as-seed-peer}

Configure `dfdaemon.yaml`, the default path is `/etc/dragonfly/dfdaemon.yaml`,
refer to [Dfdaemon](../reference/configuration/client/dfdaemon.md).

Set the `manager.addrs` address in the configuration file to your actual address.
Configuration content is as follows:

```yaml
# Seed Peer configuration.
manager:
  addr: http://127.0.0.1:65003
seedPeer:
  enable: true
  type: super
  clusterID: 1
```

Run Dfdaemon as Seed Peer:

> Notice : Run Dfdaemon under Client

```bash
# Setup Dfdaemon.
cargo run --bin dfdaemon -- --config /etc/dragonfly/dfdaemon.yaml -l info --verbose
```

#### Verify {#verify-seed-peer}

After the Seed Peer deployment is complete, run the following commands to verify if **Seed Peer** is started,
and if Port `4000`, `4001` and `4002` is available.

```bash
telnet 127.0.0.1 4000
telnet 127.0.0.1 4001
telnet 127.0.0.1 4002
```

#### Setup Dfdaemon as Peer {#setup-dfdaemon-as-Peer}

Configure `dfdaemon.yaml`, the default path is `/etc/dragonfly/dfdaemon.yaml`,
refer to [Dfdaemon](../reference/configuration/client/dfdaemon.md).

Set the `manager.addrs` address in the configuration file to your actual address.
Configuration content is as follows:

```yaml
# Peer configuration.
manager:
  addr: http://127.0.0.1:65003
```

Run Dfdaemon as Peer:

> Notice : Run Dfdaemon under Client

```bash
# Setup Dfdaemon.
cargo run --bin dfdaemon -- --config /etc/dragonfly/dfdaemon.yaml -l info --verbose
```

#### Verify {#verify-peer}

After the Peer deployment is complete, run the following commands to verify if **Peer** is started,
and if Port `4000`, `4001` and `4002` is available.

```bash
telnet 127.0.0.1 4000
telnet 127.0.0.1 4001
telnet 127.0.0.1 4002
```

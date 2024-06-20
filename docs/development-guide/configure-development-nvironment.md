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

## Installing Dragonfly {#installing-dragonfly}

Clone the source code of Dragonfly:

```bash
git clone --recurse-submodules https://github.com/dragonflyoss/Dragonfly2.git
cd Dragonfly2
```

Compile the source code:

```bash
# At the same time to build scheduler and manager.
make build-manager && make build-scheduler

# Install executable file to  /opt/dragonfly/bin/{manager,scheduler}.
make install-manager
make install-scheduler
```

Clone the source code of Client:

```bash
git clone https://github.com/dragonflyoss/client.git
cd client
```

Compile the source code:

```bash
# At the same time to build dfdaemon and dfget.
cargo build --release --bins

# Install executable file to  /opt/dragonfly/bin/{dfget,dfdaemon}.
mv target/release/dfget /opt/dragonfly/bin/dfget
mv target/release/dfdaemon /opt/dragonfly/bin/dfdaemon
```

Configuration environment:

```bash
export PATH="/opt/dragonfly/bin/:$PATH"
```

## Operation {#operation}

### Manager {#manager}

#### Startup Manager {#startup-manager}

Configure Manager yaml file, The default path in Linux is `/etc/dragonfly/manager.yaml` in linux,
refer to [Manager](../reference/configuration/manager.md).

Set the `database.mysql.addrs` and `database.redis.addrs` addresses under the configuration
file to your actual addresses. Configuration content is as follows:

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

```bash
# View Manager cli help docs.
manager --help

# Startup Manager.
manager
```

#### Verify {#verify-manager}

After the Manager deployment is complete, run the following commands to verify if **Manager** is started,
and if Port `8080` and `65003` is available.

```bash
telnet 127.0.0.1 8080
telnet 127.0.0.1 65003
```

#### Manager Console {#manager-console}

Now you can open brower and visit console by localhost:8080, Console features preview reference document [console preview](../reference/manage-console.md).

![manager-console](../resource/getting-started/installation/manager-console.png)

### Scheduler {#scheduler}

#### Startup Scheduler {#startup-scheduler}

Configure Scheduler yaml file, The default path in Linux is `/etc/dragonfly/scheduler.yaml` in linux,
refer to [Scheduler](../reference/configuration/scheduler.md).

Set the `database.redis.addrs` and `manager.addr` addresses manager.
under the configuration file to your actual addresses. Configuration content is as follows:

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
    networkTopologyDB: 3
 manager:
  addr: dragonfly-manager:65003
  schedulerClusterID: 1
  keepAlive:
    interval: 5s
```

Run Scheduler:

```bash
# View Scheduler cli help docs.
scheduler --help

# Startup Scheduler.
scheduler
```

#### Verify {#verify-scheduler}

After the Scheduler deployment is complete, run the following commands to verify if **Scheduler** is started,
and if Port `8002` is available.

```bash
telnet 127.0.0.1 8002
```

### Dfdaemon {#dfdaemon}

#### Startup Dfdaemon as Seed Peer {#startup-dfdaemon-as-seed-peer}

Configure Dfdaemon yaml file, The default path in Linux is `/etc/dragonfly/dfdaemon.yaml` in linux,
refer to [Dfdaemon](../reference/configuration/dfdaemon.md).

Set the `scheduler.manager.netAddrs.addr` address in the configuration file to your actual address.
Configuration content is as follows:

```yaml
# Seed Peer configuration.
manager:
  addrs:
    - http://dragonfly-manager:65003
seedPeer:
  enable: true
  type: super
  clusterID: 1
```

Run Dfdaemon as Seed Peer:

```bash
# View Dfget cli help docs.
dfget --help

# View Dfdaemon cli help docs.
dfdaemon --help

# Startup Dfdaemon mode.
dfdaemon
```

#### Verify {#verify-seed-peer}

After the Seed Peer deployment is complete, run the following commands to verify if **Seed Peer** is started,
and if Port `4000`, `4001` and `4002` is available.

```bash
telnet 127.0.0.1 4000
telnet 127.0.0.1 4001
telnet 127.0.0.1 4002
```

#### Startup Dfdaemon as Peer {#startup-dfdaemon-as-Peer}

Configure Dfdaemon yaml file, The default path in Linux is `/etc/dragonfly/dfdaemon.yaml` in linux,
refer to [Dfdaemon](../reference/configuration/dfdaemon.md).

Set the `manager.addrs` address in the configuration file to your actual address.
Configuration content is as follows:

```yaml
# Peer configuration.
manager:
  addrs:
    - http://dragonfly-manager:65003
```

Run Dfdaemon as Peer:

```bash
# View Dfget cli help docs.
dfget --help

# View Dfdaemon cli help docs.
dfdaemon --help

# Startup Dfdaemon mode.
dfdaemon
```

#### Verify {#verify-peer}

After the Peer deployment is complete, run the following commands to verify if **Peer** is started,
and if Port `4000`, `4001` and `4002` is available.

```bash
telnet 127.0.0.1 4000
telnet 127.0.0.1 4001
telnet 127.0.0.1 4002
```

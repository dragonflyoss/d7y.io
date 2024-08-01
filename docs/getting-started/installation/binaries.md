---
id: binaries
title: Binaries
slug: /getting-started/installation/binaries/
---

This guide shows how to install the Dragonfly. Dragonfly can be installed either from source, or from pre-built binary releases.

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

### From the Binary Releases {#from-the-binary-releases}

Pre-built binaries are available on our Dragonfly [releases page](https://github.com/dragonflyoss/Dragonfly2/releases).
These binary versions can be manually downloaded and installed.

Download the Dragonfly binaries:

> Notice: your_version is recommended to use the latest version.

<!-- markdownlint-disable -->

```bash
VERSION=<your_version>
wget -O dragonfly_linux_amd64.tar.gz https://github.com/dragonflyoss/Dragonfly2/releases/download/v${VERSION}/dragonfly-${VERSION}-linux-amd64.tar.gz
```

<!-- markdownlint-restore -->

Untar the package:

```bash
# Replace `/path/to/dragonfly` with the installation directory.
tar -zxf dragonfly_linux_amd64.tar.gz -C /path/to/dragonfly
```

Pre-built binaries are available on our Client [releases page](https://github.com/dragonflyoss/client/releases).
These binary versions can be manually downloaded and installed.

Download the Client binaries:

> Notice: your_client_version is recommended to use the latest version.

```bash
CLIENT_VERSION=<your_client_version>
wget -O client_dfget_x86_64-unknown-linux-musl.tar.gz https://github.com/dragonflyoss/client/releases/download/v${CLIENT_VERSION}/dfget-v${CLIENT_VERSION}-x86_64-unknown-linux-musl.tar.gz
wget -O client_dfdaemon_x86_64-unknown-linux-musl.tar.gz https://github.com/dragonflyoss/client/releases/download/v${CLIENT_VERSION}/dfdaemon-v${CLIENT_VERSION}-x86_64-unknown-linux-musl.tar.gz
```

Untar the package:

```bash
# Replace `/path/to/dragonfly` with the installation directory.
tar -zxf client_dfget_x86_64-unknown-linux-musl.tar.gz -C /path/to/dragonfly
tar -zxf client_dfdaemon_x86_64-unknown-linux-musl.tar.gz -C /path/to/dragonfly

# mv rename.
mv /path/to/dragonfly/dfget-v${CLIENT_VERSION}-x86_64-unknown-linux-musl /path/to/dragonfly/dfget
mv /path/to/dragonfly/dfdaemon-v${CLIENT_VERSION}-x86_64-unknown-linux-musl /path/to/dragonfly/dfdaemon
```

Configuration environment:

```bash
export PATH="/path/to/dragonfly:$PATH"
```

### Install Client using RPM {#install-client-using-rpm}

Download and execute the install script:

> Notice: version is recommended to use the latest version.

```bash
curl \
  --proto '=https' \
  --tlsv1.2 -L -o client-{arch}-unknown-linux-musl.rpm \
  https://github.com/dragonflyoss/client/releases/download/v{version}/client-v{version}-{arch}-unknown-linux-musl.rpm

rpm -ivh client-{arch}-unknown-linux-musl.rpm
```

Make sure to replace `arch` with one of the following:

- `x86_64`
- `aarch64`

### Install Client using DEB {#install-client-using-deb}

Download and execute the install script:

> Notice: version is recommended to use the latest version.

```bash
curl \
  --proto '=https' \
  --tlsv1.2 -L -o client-{arch}-unknown-linux-musl.deb \
  https://github.com/dragonflyoss/client/releases/download/v{version}/client-v{version}-{arch}-unknown-linux-musl.deb

dpkg -i client-{arch}-unknown-linux-musl.deb
```

Make sure to replace `arch` with one of the following:

- `x86_64`
- `aarch64`

### From Source {#from-source}

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

#### Setup Manager {#setup-manager}

Configure Manager yaml file, The default path in Linux is `/etc/dragonfly/manager.yaml` in linux,
refer to [Manager](../../reference/configuration/manager.md).

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

```bash
# View Manager cli help docs.
manager --help

# Setup Manager.
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

Now you can open brower and visit console by localhost:8080, Console features preview reference document [console preview](../../advanced-guides/web-console.md).

![manager-console](../../resource/getting-started/installation/manager-console.png)

### Scheduler {#scheduler}

#### Setup Scheduler {#setup-scheduler}

Configure Scheduler yaml file, The default path in Linux is `/etc/dragonfly/scheduler.yaml` in linux,
refer to [Scheduler](../../reference/configuration/scheduler.md).

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

# Setup Scheduler.
scheduler
```

#### Verify {#verify-scheduler}

After the Scheduler deployment is complete, run the following commands to verify if **Scheduler** is started,
and if Port `8002` is available.

```bash
telnet 127.0.0.1 8002
```

### Dfdaemon {#dfdaemon}

#### Setup Dfdaemon as Seed Peer {#setup-dfdaemon-as-seed-peer}

Configure Dfdaemon yaml file, The default path in Linux is `/etc/dragonfly/dfdaemon.yaml` in linux,
refer to [Dfdaemon](../../reference/configuration/client/dfdaemon.md).

Set the `manager.addrs` address in the configuration file to your actual address.
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

# Setup Dfdaemon.
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

#### Setup Dfdaemon as Peer {#setup-dfdaemon-as-Peer}

Configure Dfdaemon yaml file, The default path in Linux is `/etc/dragonfly/dfdaemon.yaml` in linux,
refer to [Dfdaemon](../../reference/configuration/client/dfdaemon.md).

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

# Setup Dfdaemon.
dfdaemon

# Download with HTTP protocol

dfget -O /path/to/output http://example.com/object
```

#### Verify {#verify-peer}

After the Peer deployment is complete, run the following commands to verify if **Peer** is started,
and if Port `4000`, `4001` and `4002` is available.

```bash
telnet 127.0.0.1 4000
telnet 127.0.0.1 4001
telnet 127.0.0.1 4002
```

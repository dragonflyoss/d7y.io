---
id: source
title: Source
---

There are installation methods to install
the executable files separately according to the modules.

## Prerequisites {#prerequisites}

| Required Software | Version Limit                |
| ----------------- | ---------------------------- |
| Git               | 1.9.1+                       |
| Golang            | 1.16.x                       |
| Database          | Mysql 5.6+ OR PostgreSQL 12+ |
| Redis             | 3.0+                         |

## Install it separately by module {#install-it-separately-by-module}

### Download the precompiled binaries {#download-the-precompiled-binaries}

1. Download a binary package. You can download one of the latest builds for Dragonfly on the
   [github releases page](https://github.com/dragonflyoss/Dragonfly2/releases)

   > Note: v2.x-rc.x rc indicates the candidate version and is not recommended to be deployed in a production environment

   ```bash
   version=2.0.2

   wget -O dragonfly_linux_amd64.tar.gz \
      https://github.com/dragonflyoss/Dragonfly2/releases/download/v${version}/dragonfly-${version}-linux-amd64.tar.gz
   ```

2. Unzip the package.

   ```bash
   # Replace `/path/to/dragonfly` with the installation directory.
   tar -zxf dragonfly_linux_amd64.tar.gz -C /path/to/dragonfly
   ```

3. Configuration environment

   ```bash
   export PATH="/path/to/dragonfly:$PATH"
   ```

### Build executable file by source code {#build-executable-file-by-source-code}

1. Obtain the source code of Dragonfly.

   ```bash
   git clone --recurse-submodules https://github.com/dragonflyoss/Dragonfly2.git
   ```

2. Enter the project directory.

   ```bash
   cd Dragonfly2
   ```

3. Compile the source code.

   ```bash
   # At the same time to build scheduler, dfget and manager
   make build

   # Equal
   make build-scheduler && make build-dfget && make build-manager

   # Install executable file to  /opt/dragonfly/bin/{manager,scheduler,dfget}
   make install-manager
   make install-scheduler
   make install-dfget
   ```

4. Configuration environment

   ```bash
   export PATH="/opt/dragonfly/bin/:$PATH"
   ```

## Operation {#operation}

### Manager {#manager}

#### Startup Manager {#startup-manager}

Configure manager yaml file, The default path for the manager yaml configuration file is
`/etc/dragonfly/manager.yaml` in linux,
and the default path is `$HOME/.dragonfly/config/manager.yaml` in darwin. Please refer to [Configure Manager YAML File](../../reference/configuration/manager.md)

```bash
# Configure manager yaml file
# Notice: check and modify some config e.g. database.mysql

# View manager cli help docs
manager --help

# startup manager
manager
```

After manager is installed, run the following commands to verify if **manager** is started,
and if Port `8080` and `65003` is available.

```bash
telnet 127.0.0.1 8080
telnet 127.0.0.1 65003
```

#### Manager Console {#manager-console}

Now you can open brower and visit console by `localhost:8080`.

Console features preview reference document [console preview](../../reference/manage-console.md)。

### Scheduler {#scheduler}

#### Startup scheduler {#startup-scheduler}

Configure scheduler yaml file, The default path for the scheduler yaml configuration file is
`/etc/dragonfly/scheduler.yaml` in linux,
and the default path is `$HOME/.dragonfly/config/scheduler.yaml` in darwin. Please refer to [Configure Scheduler YAML File](../../reference/configuration/scheduler.md)

```bash
# Configure scheduler yaml file
# Notice: check and modify some config e.g. job.enable,job.redis,manager.addr ...

# View scheduler cli help docs
scheduler --help

# Startup scheduler
scheduler
```

After scheduler is installed, run the following commands to verify if **scheduler** is started,
and if Port `8002` is available.

```bash
telnet 127.0.0.1 8002
```

### Dfdaemon {#dfdaemon}

#### Startup dfdaemon as seed peer {#startup-dfdaemon-as-seed-peer}

Configure dfdaemon's seed peer yaml file, The default path for the dfdaemon yaml configuration file is
`/etc/dragonfly/dfget.yaml` in linux,
and the default path is `$HOME/.dragonfly/config/dfget.yaml` in darwin. Please refer to [Configure Dfdaemon YAML File](../../reference/configuration/dfdaemon.md)

Configure dfdaemon's yaml file to enable seed peer mode:

```yaml
# Seed peer yaml file
scheduler:
  manager:
    # get scheduler list dynamically from manager
    enable: true
    # manager service address
    netAddrs:
      - type: tcp
        addr: manager-service:65003
    # scheduler list refresh interval
    refreshInterval: 10s
    seedPeer:
      enable: true
      type: 'super'
      clusterID: 1
```

Run dfdaemon as seed peer.

```bash
# Configure dfdaemon yaml file
# Notice: check and modify some config e.g. scheduler.manager ...

# View dfget cli help docs
dfget --help

# View dfget daemon cli help docs
dfget daemon --help

# Startup dfget daemon mode
dfget daemon
```

#### Startup dfdaemon as peer {#startup-dfdaemon-as-peer}

Configure dfdaemon's peer yaml file, The default path for the dfdaemon yaml configuration file is
`/etc/dragonfly/dfget.yaml` in linux,
and the default path is `$HOME/.dragonfly/config/dfget.yaml` in darwin. Please refer to [Configure Dfdaemon YAML File](../../reference/configuration/dfdaemon.md)

```bash
# Configure dfdaemon yaml file
# Notice: check and modify some config e.g. scheduler.manager ...

# View dfget cli help docs
dfget --help

# View dfget daemon cli help docs
dfget daemon --help

# Startup dfget daemon mode
dfget daemon
```

After dfget is installed, run the following commands to verify if **dfdaemon** is started,
and if Port `65000`, `65001` and `65002` is available.

```bash
telnet 127.0.0.1 65000
telnet 127.0.0.1 65001
telnet 127.0.0.1 65002
```

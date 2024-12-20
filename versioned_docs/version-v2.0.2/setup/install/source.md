---
id: source
title: Source
---

There are installation methods to install
the executable files separately according to the modules.

## Prerequisites {#prerequisites}

| Required Software | Version Limit |
| ----------------- | ------------- |
| Git               | 1.9.1+        |
| Golang            | 1.16.x        |
| MySQL             | 5.6+          |
| Redis             | 3.0+          |
| Nginx             | 0.8+          |

## Install it separately by module {#install-it-separately-by-module}

### Download the precompiled binaries {#download-the-precompiled-binaries}

1. Download a binary package of the cdn. You can download one of the latest builds for Dragonfly on the
   [github releases page](https://github.com/dragonflyoss/dragonfly/releases)

   > Note: v2.x-rc.x rc indicates the candidate version and is not recommended to be deployed in a production environment

   ```bash
   version=2.0.2

   wget -O Dragonfly2_linux_amd64.tar.gz \
      https://github.com/dragonflyoss/dragonfly/releases/download/v${version}/Dragonfly2-${version}-linux-amd64.tar.gz
   ```

2. Unzip the package.

   ```bash
   # Replace `/path/to/dragonfly` with the installation directory.
   tar -zxf Dragonfly2_linux_amd64.tar.gz -C /path/to/dragonfly
   ```

3. Configuration environment

   ```bash
   export PATH="/path/to/dragonfly:$PATH"
   ```

### Build executable file by source code {#build-executable-file-by-source-code}

1. Obtain the source code of Dragonfly.

   ```bash
   git clone --recurse-submodules https://github.com/dragonflyoss/dragonfly.git
   ```

2. Enter the project directory.

   ```bash
   cd Dragonfly2
   ```

3. Compile the source code.

   ```bash
   # At the same time to build cdn scheduler dfget manager
   make build

   # Equal
   make build-cdn && make build-scheduler && make build-dfget && make build-manager

   # Build manager-console UI (optional)
   make build-manager-console

   # Install executable file to  /opt/dragonfly/bin/{manager,cdn,scheduler,dfget}
   make install-manager
   make install-cdn
   make install-scheduler
   make install-dfget

   # Copy ./manager/console/build/dist to spec dir e.g. /opt/dragonfly/dist (optional)
   cp -R ./manager/console/dist /opt/dragonfly/
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
# Notice: check and modify some config e.g. database.mysql,server.rest.publicPath ...

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

### CDN {#cdn}

#### Startup cdn {#startup-cdn}

Configure cdn yaml file, The default path for the cdn yaml configuration file is
`/etc/dragonfly/cdn.yaml` in linux,
and the default path is `$HOME/.dragonfly/config/cdn.yaml` in darwin. Please refer to [Configure CDN YAML File](../../reference/configuration/cdn.md)

```bash
# Configure cdn yaml file
# Notice: check and modify some config e.g. base.manager ...

# View cdn cli help docs
cdn --help

# startup cdn
cdn
```

#### Startup file server {#startup-file-server}

You can start a file server in any way. However, the following conditions must be met:

- It must be rooted at `plugins.storagedriver[]name: disk.config.baseDir`
  which is defined in the `/etc/dragonfly/cdn.yaml`.
- It must listen on the port at `base.downloadPort` which is defined in the `/etc/dragonfly/cdn.yaml`.

Let's take nginx as an example.

1. Add the following configuration items to the Nginx configuration file.

   ```conf
   server {
     # Must be `/etc/dragonfly/cdn.yaml`'s ${base.downloadPort}
     listen 8001;
     location / {
        # Must be `/etc/dragonfly/cdn.yaml`'s ${plugins.storagedriver[]name: disk.config.baseDir}
        root /Users/${USER_HOME}/ftp;
     }
   }
   ```

2. Start Nginx.

   ```bash
   sudo nginx
   ```

   After cdn is installed, run the following commands to verify if Nginx and **cdn** are started,
   and if Port `8001` and `8003` are available.

   ```bash
   telnet 127.0.0.1 8001
   telnet 127.0.0.1 8003
   ```

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

### Dfget/Dfdaemon {#dfgetdfdaemon}

### Startup dfdaemon {#startup-dfdaemon}

Configure dfdaemon yaml file, The default path for the dfdaemon yaml configuration file is
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

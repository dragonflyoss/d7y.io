---
id: docker-compose
title: Docker Compose
slug: /getting-started/quick-start/docker-compose/
---

In order to facilitate you to quickly set up the Dragonfly environment,
this article uses [Docker-Compose](https://docs.docker.com/compose/) Take kubernetes as an example to explain,
if you need kubernetes related content, you can refer to [Quick Start: Helm Charts](../../setup/install/helm-charts.md)

If you want to use Dragonfly to complete production-level image and file distribution in the production environment,
please refer to the detailed production-level configuration parameters of supernode and dfget. If it is kubernetes,
you can use <https://github.com/dragonflyoss/helm-charts>.

## Preconditions {#preconditions}

All the steps in this document are done on the same machine using the docker container,
so please make sure that you have installed and started
the docker container engine and installed docker-compose on your machine.

## Step 1: Download and run Dragonfly docker-compose {#step-1-download-and-run-dragonfly-docker-compose}

> If run with the Mac OS, an error may be reported,
> ref [sed command with -i option failing on Mac, but works on Linux](https://stackoverflow.com/a/41416710)

```bash
git clone https://github.com/dragonflyoss/Dragonfly2.git
cd ./Dragonfly2/deploy/docker-compose/

export IP=<host ip>
./run.sh
```

## Step 2: Modify the Docker Daemon configuration {#step-2-modify-the-docker-daemon-configuration}

We need to modify the Docker Daemon configuration and use Dragonfly to pull the image by mirroring.

Add or update the following configuration items in the configuration file `/etc/docker/daemon.json`

```bash
{
  "registry-mirrors": ["http://127.0.0.1:65001"]
}
```

Restart Docker Daemon and Dragonfly

```bash
systemctl restart docker
./run.sh
```

> **Tips**：
> Note that this action affects containers running on this host
> For more information `/etc/docker/daemon.json`,
> please refer to the [Docker documents](https://docs.docker.com/registry/recipes/mirror/#configure-the-cache).

## Step 3: Pull the image {#step-3-pull-the-image}

Through the above steps, we have completed the deployment of Dragonfly server and client,
and set up Docker Daemon to pull official images through Dragonfly.

You can pull the image as usual, for example:

```bash
docker pull nginx:latest
```

## Step 4: Verify {#step-4-verify}

You can verify that the nginx image is transferred through Dragonfly by executing the following command.

```bash
docker compose exec dfdaemon grep "peer task done" /var/log/dragonfly/daemon/core.log
```

If the above command has something like

```shell
{
  "level": "info",
  "ts": "2022-09-07 12:04:26.485",
  "caller": "peer/peertask_conductor.go:1500",
  "msg": "peer task done, cost: 1ms",
  "peer": "10.140.2.175-5184-1eab18b6-bead-4b9f-b055-6c1120a30a33",
  "task": "b423e11ddb7ab19a3c2c4c98e5ab3b1699a597e974c737bb4004edeef6016ed2",
  "component": "PeerTask"
}
```

It means that the mirror download is completed through Dragonfly.

## Step 5: Manager Console {#step-5-manager-console}

Open via browser `http://ip:8080/`

The account is `root`, password is `dragonfly`

> Tip: Please remember to modify the user name and password for the generation environment

For more information refer to
[Manager Console document](../../reference/manage-console.md)

## Step 6: Preheat {#step-6-preheat}

To get the best out of Dragonfly, you can pull the image in advance by [preheat](../../reference/preheat.md)

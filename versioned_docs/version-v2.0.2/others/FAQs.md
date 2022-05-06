---
id: faqs
title: FAQs
---

## Change log level {#change-log-level}

Send `SIGUSR1` signal to dragonfly process to change log level

```shell
kill -s SIGUSR1 <pid of dfdaemon, scheduler, cdn, or manager>
```

stdout:

```text
change log level to debug
change log level to fatal
change log level to panic
change log level to dpanic
change log level to error
change log level to warn
change log level to info
```

> The change log level event will print in stdout and `core.log` file, but if the level is greater than `info`, stdout only.

## Download slower than without Dragonfly {#download-slower-than-without-dragonfly}

1. Confirm limit rate in [dfget.yaml](../reference/configuration/dfdaemon.md)

   ```yaml
   download:
     # total download limit per second
     totalRateLimit: 200Mi
     # per peer task download limit per second
     # default is 20Mi, this default is in consideration of extreme environments
     perPeerRateLimit: 100Mi
   upload:
     # upload limit per second
     rateLimit: 100Mi
   ```

2. Confirm source connection speed in CDN and dfdaemon

## 500 Internal Server Error {#500-internal-server-error}

1. Check error logs in /var/log/dragonfly/daemon/core.log
2. Check source connectivity(dns error or certificate error)

Example:

```shell
curl https://example.harbor.local/
```

When curl says error, please check the details in output.

## Scheduler log show "resources lacked for task" {#scheduler-log-show-resources-lacked-for-task}

The specific log in `/var/log/scheduler/core.log` is:

``` text
"msg":"trigger cdn download task failed: [1000]resources lacked for
task(1920b46813f800b443fb181228794be167fe252d282dc7a258a126a048daaacd): resources lacked"
```

It occurs when scheduler sends GRPC request `ObtainSeeds` to CDN and CDN node disk in bad status.

1. Confirm the baseDir dir in `cdn.conf`, by default it is `/tmp/cdn`
2. Check the disk usage of baseDir in CDN node with command `df -lh | grep cdn`
3. If dragonfly works in production, it is recommend to expand the disk size
4. If dragonfly works in develop, user can modify the options `fullGCThreshold` and
   `youngGCThreshold` in `cdn.conf` to avoid error.

```yaml
plugins:
 storageManager:
  - config:
      driverConfigs:
        disk:
          gcConfig:
            cleanRatio: 1
            # if freeSpace > GCThreshold, CDN will not run GC
            fullGCThreshold: 500M
            youngGCThreshold: 1G
```

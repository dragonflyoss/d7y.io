---
id: faqs
title: FAQs
---

## 修改日志级别

发送 `SIGUSR1` 信号给蜻蜓进程即可修改日志级别

```shell
kill -s SIGUSR1 <pid of dfdaemon, scheduler, cdn, or manager>
```

标准输出：

```text
change log level to debug
change log level to fatal
change log level to panic
change log level to dpanic
change log level to error
change log level to warn
change log level to info
```

> 修改日志级别的事件将记录在标准输出和 `core.log` 中，但是如果修改的级别高于 `info` 的话，则仅有标准输出

## 下载速度比不用蜻蜓的时候慢

1. 确认限速值是否合适 [dfget.yaml](../reference/configuration/dfdaemon.md)

   ```yaml
   download:
     # 总下载限速
     totalRateLimit: 200Mi
     # 单个任务下载限速
     perPeerRateLimit: 100Mi # 为了兼容极限环境下，默认值为 20Mi，可以按需调整
   upload:
     # 上传限速
     rateLimit: 100Mi
   ```

2. 确认回源速度是否正常

## 500 Internal Server Error

1. 检查日志 /var/log/dragonfly/daemon/core.log

2. 检查源站可连接行(DNS 错误 or 证书)

   示例:

   ```shell
   curl https://example.harbor.local/
   ```

   如果`curl`有报错，请查看具体错误

## Scheduler 日志报错 "resources lacked for task"

在 `/var/log/scheduler/core.log` 中看到的具体日志信息为:

```text
"msg":"trigger cdn download task failed: [1000]resources lacked for
task(1920b46813f800b443fb181228794be167fe252d282dc7a258a126a048daaacd): resources lacked"
```

通常这种情况出现在 scheduler 向 CDN 节点发送 GRPC 请求 `ObtainSeeds` 但 CDN 节点磁盘不足时。

1. 在 `cdn.conf` 中确认 CDN 节点使用的存储目录 baseDir, 默认设置为 `/tmp/cdn`
2. 在 CDN 节点使用命令 `df -lh | grep cdn` 检查 baseDir 的磁盘使用率
3. 如果是生产环境, 建议用户为磁盘扩容
4. 如果是测试环境, 用户可以在 `cdn.conf` 修改 `fullGCThreshold` 和 `youngGCThreshold` 来避免错误

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

---
id: faqs
title: FAQs
---

## 修改日志级别

发送 `SIGUSR1` 信号给蜻蜓进程即可修改日志级别

```shell
kill -s SIGUSR1 <pid of dfdaemon, scheduler or manager>
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
     totalRateLimit: 1024Mi
     # 单个任务下载限速
     perPeerRateLimit: 512Mi
   upload:
     # 上传限速
     rateLimit: 1024Mi
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

---
id: faq
title: FAQ
slug: /faq/
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

## 500 Internal Server Error

**1.** 检查日志 /var/log/dragonfly/dfdaemon/

**2.** 检查源站可连接行(DNS 错误 or 证书)。

示例:

```shell
   curl https://example.harbor.local/
```

如果 `curl` 有报错，请查看具体错误。

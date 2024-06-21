---
id: faq
title: FAQ
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

**1.** 确认限速值是否合适。

在 [dfdaemon.yaml](./reference/configuration/client/dfdaemon.md)
配置文件下设置`download.rateLimit`和`upload.rateLimit`。

**2.** 增加 Piece 并发数。

在 [dfdaemon.yaml](./reference/configuration/client/dfdaemon.md)
配置文件下设置`download.concurrentPieceCount`。

```yaml
download:
  server:
    # socketPath 是 dfdaemon GRPC 服务的 unix 套接字路径。
    socketPath: /var/run/dragonfly/dfdaemon.sock
  # 下载速度的默认速率限制，单位为 bps（字节每秒），默认为 20Gbps。
  rateLimit: 20000000000
  # 从源下载 piece 的超时时间。
  pieceTimeout: 30s
  # 下载 piece 的并发数量。
  concurrentPieceCount: 10
upload:
  server:
    # grpc 服务器的端口。
    port: 4000
    ## GRPC 服务器的监听 ip。
    # ip: ""
    # 上传速度的默认速率限制，单位为 bps（字节每秒），默认为 20Gbps。
  rateLimit: 20000000000
```

## 500 Internal Server Error

**1.** 检查日志 /var/log/dragonfly/dfdaemon/

**2.** 检查源站可连接行(DNS 错误 or 证书)

示例:

```shell
   curl https://example.harbor.local/
```

如果`curl`有报错，请查看具体错误

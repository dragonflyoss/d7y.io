---
id: dfcache
title: Dfcache
---

`dfcache` 是 dragonfly 的缓存客户端，它与 dfdaemon 通信并对 P2P 网络中的文件进
行操作，其中 P2P 网络充当缓存系统。

## 功能 {#features}

- `dfcache stat`检查文件是否在 P2P 缓存系统中
- `dfcache import`导入文件到 P2P 缓存系统中
- `dfcache export`从 P2P 缓存系统中导出文件
- `dfcache delete`删除 P2P 缓存系统中的文件

## 时序图 {#seqdiag}

- StatTask

![dfcache-stat](../../resource/concepts/dfcache-stat.jpg)

- ImportTask

![dfcache-import](../../resource/concepts/dfcache-import.jpg)

- ExportTask

![dfcache-export](../../resource/concepts/dfcache-export.jpg)

- DeleteTask

![dfcache-delete](../../resource/concepts/dfcache-delete.jpg)

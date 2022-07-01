---
id: dfcache
title: Dfcache
---

`dfcache` is the cache client of dragonfly that communicates with dfdaemon and
operates on files in P2P network, where the P2P network acts as a cache system.

## Features {#features}

- `dfcache stat` checks if a file exists in P2P cache system
- `dfcache import` import file into P2P cache system
- `dfcache export` export file from P2P cache system
- `dfcache delete` delete file from P2P cache system

## Sequence Diagram {#seqdiag}

- StatTask

![dfcache-stat](../../resource/concepts/dfcache-stat.jpg)

- ImportTask

![dfcache-import](../../resource/concepts/dfcache-import.jpg)

- ExportTask

![dfcache-export](../../resource/concepts/dfcache-export.jpg)

- DeleteTask

![dfcache-delete](../../resource/concepts/dfcache-delete.jpg)
